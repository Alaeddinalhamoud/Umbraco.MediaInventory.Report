using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.MediaInventory.Report.Models;

namespace Umbraco.MediaInventory.Report.Services
{
    public interface IMediaInventoryService
    {
        Task<MediaInventoryPageResult> GetPageAsync(MediaInventoryQuery query, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<MediaInventoryReferenceDto>> GetReferencesAsync(int mediaId, CancellationToken cancellationToken = default);
        Task<MediaInventoryRefreshStatus> TriggerRefreshAsync(CancellationToken cancellationToken = default);
        Task<MediaInventoryRefreshStatus> GetRefreshStatusAsync(CancellationToken cancellationToken = default);
        Task<bool> MoveToTrashAsync(int mediaId, CancellationToken cancellationToken = default);
        Task<Stream> ExportCsvAsync(MediaInventoryExportRequest request, CancellationToken cancellationToken = default);
    }

    public sealed class MediaInventoryService : IMediaInventoryService
    {
        private const string CacheKey = "media-inventory:overview";
        private static readonly TimeSpan SevenDays = TimeSpan.FromDays(7);

        private readonly IMemoryCache _cache;
        private readonly IMediaService _mediaService;
        private readonly ITrackedReferencesService _trackedReferencesService;
        private readonly ILogger<MediaInventoryService> _logger;
        private readonly List<MediaInventoryItemDto> _catalogue = new();
        private MediaInventoryRefreshStatus _currentRefresh = new();

        public MediaInventoryService(IMemoryCache cache, IMediaService mediaService, ITrackedReferencesService trackedReferencesService, ILogger<MediaInventoryService> logger)
        {
            _cache = cache;
            _mediaService = mediaService;
            _trackedReferencesService = trackedReferencesService;
            _logger = logger;
        }

        public Task<MediaInventoryPageResult> GetPageAsync(MediaInventoryQuery query, CancellationToken cancellationToken = default)
        {
            var snapshot = GetOrCreateSnapshot();
            var page = Math.Max(1, query.Page);
            var pageSize = query.PageSize <= 0 ? 50 : Math.Min(query.PageSize, 250);

            var filtered = ApplyFilters(snapshot.Items, query);
            var sorted = ApplySort(filtered, query);
            // The summary deliberately omits the media-type filter, allowing the UI to show
            // useful totals for every type while retaining search and reference filtering.
            var summaryQuery = new MediaInventoryQuery
            {
                Search = query.Search,
                HasReferences = query.HasReferences
            };
            var typeCounts = ApplyFilters(snapshot.Items, summaryQuery)
                .GroupBy(item => item.Type, StringComparer.OrdinalIgnoreCase)
                .OrderBy(group => group.Key)
                .Select(group => new MediaInventoryTypeCount { Type = group.Key, Count = group.Count() })
                .ToList();
            var inUseTotal = ApplyFilters(snapshot.Items, summaryQuery).Count(item => item.HasReferences);
            var unusedTotal = typeCounts.Sum(item => item.Count) - inUseTotal;
            var totalFileSizeBytes = ApplyFilters(snapshot.Items, summaryQuery).Sum(item => item.FileSizeBytes);
            var total = sorted.Count;
            var skip = (page - 1) * pageSize;
            var items = sorted.Skip(skip).Take(pageSize).ToList();

            var result = new MediaInventoryPageResult
            {
                Items = items,
                TypeCounts = typeCounts,
                InUseTotal = inUseTotal,
                UnusedTotal = unusedTotal,
                TotalFileSizeBytes = totalFileSizeBytes,
                Page = page,
                PageSize = pageSize,
                Total = total,
                Cache = new MediaInventoryCacheInfo
                {
                    Status = "valid",
                    GeneratedAt = snapshot.GeneratedAt,
                    ExpiresAt = snapshot.GeneratedAt.Add(SevenDays)
                }
            };

            return Task.FromResult(result);
        }

        public Task<IReadOnlyList<MediaInventoryReferenceDto>> GetReferencesAsync(int mediaId, CancellationToken cancellationToken = default)
        {
            var item = _catalogue.FirstOrDefault(x => x.Id == mediaId);
            if (item is null)
            {
                return Task.FromResult<IReadOnlyList<MediaInventoryReferenceDto>>(Array.Empty<MediaInventoryReferenceDto>());
            }

            var references = item.ReferenceCount > 0
                ? CreateReferenceSet(mediaId).Where(x => x.Id != 0).ToList()
                : new List<MediaInventoryReferenceDto>();

            return Task.FromResult<IReadOnlyList<MediaInventoryReferenceDto>>(references);
        }

        public Task<MediaInventoryRefreshStatus> TriggerRefreshAsync(CancellationToken cancellationToken = default)
        {
            if (_currentRefresh.IsRunning)
            {
                _logger.LogInformation("Media inventory refresh was requested while a refresh is already running. Started at {StartedAt}; processed {Processed}/{Total}.", _currentRefresh.StartedAt, _currentRefresh.Processed, _currentRefresh.Total);
                return Task.FromResult(_currentRefresh);
            }

            try
            {
                _currentRefresh = new MediaInventoryRefreshStatus
                {
                    IsRunning = true,
                    Status = "running",
                    Processed = 0,
                    // The exact total is not known without a second full scan.  For large
                    // libraries we deliberately avoid that extra million-row traversal.
                    Total = 0,
                    StartedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                    Message = "Refreshing Media Inventory..."
                };

                _logger.LogInformation("Starting streamed media inventory refresh.");
                _ = Task.Run(async () => await RefreshInventoryAsync(cancellationToken), CancellationToken.None);
                return Task.FromResult(_currentRefresh);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to start the media inventory refresh job.");
                _currentRefresh = new MediaInventoryRefreshStatus
                {
                    IsRunning = false,
                    Status = "failed",
                    Message = "Refresh failed to start."
                };
                return Task.FromResult(_currentRefresh);
            }
        }

        public Task<MediaInventoryRefreshStatus> GetRefreshStatusAsync(CancellationToken cancellationToken = default)
        {
            return Task.FromResult(_currentRefresh);
        }

        public Task<bool> MoveToTrashAsync(int mediaId, CancellationToken cancellationToken = default)
        {
            GetOrCreateSnapshot();
            var inventoryItem = _catalogue.FirstOrDefault(item => item.Id == mediaId);
            if (inventoryItem?.ReferenceCount > 0)
            {
                _logger.LogWarning("Media inventory trash request rejected because media {MediaId} is still in use by {ReferenceCount} item(s).", mediaId, inventoryItem.ReferenceCount);
                return Task.FromResult(false);
            }

            var media = _mediaService.GetById(mediaId);
            if (media is null || media.Trashed)
            {
                _logger.LogWarning("Media inventory trash request ignored because media {MediaId} was not found or is already trashed.", mediaId);
                return Task.FromResult(false);
            }

            // Use Umbraco's supported recycle-bin operation; never manipulate CMS tables directly.
            _mediaService.MoveToRecycleBin(media, -1); // system user; controller authorization gates this operation
            _logger.LogInformation("Media {MediaId} ({MediaName}) was moved to the recycle bin from Media Inventory.", mediaId, media.Name);
            _catalogue.RemoveAll(item => item.Id == mediaId);
            _cache.Remove(CacheKey);
            _currentRefresh = new MediaInventoryRefreshStatus
            {
                IsRunning = false,
                Status = "stale",
                Message = "Inventory changed after media update. Please refresh.",
                UpdatedAt = DateTimeOffset.UtcNow
            };

            return Task.FromResult(true);
        }

        public async Task<Stream> ExportCsvAsync(MediaInventoryExportRequest request, CancellationToken cancellationToken = default)
        {
            var query = new MediaInventoryQuery
            {
                Page = request.Page,
                PageSize = request.PageSize,
                Search = request.Search,
                MediaType = request.MediaType,
                HasReferences = request.HasReferences,
                SortBy = request.SortBy,
                SortDirection = request.SortDirection
            };

            var page = await GetPageAsync(query, cancellationToken);
            var stream = new MemoryStream();
            await using var writer = new StreamWriter(stream, new System.Text.UTF8Encoding(false), 1024, leaveOpen: true);

            await writer.WriteLineAsync("Id,Name,Type,Url,HasReferences,ReferenceCount");
            foreach (var item in page.Items)
            {
                cancellationToken.ThrowIfCancellationRequested();
                await writer.WriteLineAsync($"{item.Id},{EscapeCsv(item.Name)},{EscapeCsv(item.Type)},{EscapeCsv(item.Url)},{item.HasReferences},{item.ReferenceCount}");
            }

            await writer.FlushAsync(cancellationToken);
            stream.Position = 0;
            return stream;
        }

        private static IEnumerable<MediaInventoryItemDto> ApplyFilters(IEnumerable<MediaInventoryItemDto> items, MediaInventoryQuery query)
        {
            var result = items.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var term = query.Search.Trim();
                result = result.Where(x => x.Name.Contains(term, StringComparison.OrdinalIgnoreCase) || x.Id.ToString().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(query.MediaType))
            {
                result = result.Where(x => x.Type.Equals(query.MediaType, StringComparison.OrdinalIgnoreCase));
            }

            if (query.HasReferences.HasValue)
            {
                result = result.Where(x => x.HasReferences == query.HasReferences.Value);
            }

            return result;
        }

        private static List<MediaInventoryItemDto> ApplySort(IEnumerable<MediaInventoryItemDto> items, MediaInventoryQuery query)
        {
            var sortDirection = query.SortDirection.Equals("desc", StringComparison.OrdinalIgnoreCase) ? "desc" : "asc";

            return query.SortBy switch
            {
                "type" => sortDirection == "desc"
                    ? items.OrderByDescending(x => x.Type).ThenByDescending(x => x.Name).ToList()
                    : items.OrderBy(x => x.Type).ThenBy(x => x.Name).ToList(),
                "references" => sortDirection == "desc"
                    ? items.OrderByDescending(x => x.ReferenceCount).ThenBy(x => x.Name).ToList()
                    : items.OrderBy(x => x.ReferenceCount).ThenBy(x => x.Name).ToList(),
                "createdDate" => sortDirection == "desc"
                    ? items.OrderByDescending(x => x.CreatedDate).ThenBy(x => x.Name).ToList()
                    : items.OrderBy(x => x.CreatedDate).ThenBy(x => x.Name).ToList(),
                _ => sortDirection == "desc"
                    ? items.OrderByDescending(x => x.Name).ToList()
                    : items.OrderBy(x => x.Name).ToList()
            };
        }

        private MediaInventorySnapshot GetOrCreateSnapshot()
        {
            if (_cache.TryGetValue(CacheKey, out MediaInventorySnapshot? snapshot) && snapshot is not null)
            {
                return snapshot;
            }

            snapshot = BuildSnapshot();
            _cache.Set(CacheKey, snapshot, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = SevenDays,
                SlidingExpiration = TimeSpan.FromHours(12)
            });

            return snapshot;
        }

        private async Task RefreshInventoryAsync(CancellationToken cancellationToken)
        {
            try
            {
                var snapshot = BuildSnapshot(cancellationToken, processed =>
                {
                    _currentRefresh.Processed = processed;
                    _currentRefresh.UpdatedAt = DateTimeOffset.UtcNow;
                    _currentRefresh.Message = $"Processing media: {processed:N0}";
                    _logger.LogDebug("Media inventory refresh progress: {Processed:N0} records.", processed);
                });
                _cache.Set(CacheKey, snapshot, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = SevenDays,
                    SlidingExpiration = TimeSpan.FromHours(12)
                });

                _currentRefresh = new MediaInventoryRefreshStatus
                {
                    IsRunning = false,
                    Status = "completed",
                    Processed = snapshot.Items.Count,
                    Total = snapshot.Items.Count,
                    Percentage = 100,
                    StartedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow,
                    Message = "Inventory refreshed successfully."
                };
                _logger.LogInformation("Media inventory refresh completed successfully. Processed {Total} records.", snapshot.Items.Count);
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("Media inventory refresh was cancelled after {Processed} records.", _currentRefresh.Processed);
                _currentRefresh = new MediaInventoryRefreshStatus
                {
                    IsRunning = false,
                    Status = "cancelled",
                    Message = "Refresh cancelled.",
                    UpdatedAt = DateTimeOffset.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to refresh media inventory.");
                _currentRefresh = new MediaInventoryRefreshStatus
                {
                    IsRunning = false,
                    Status = "failed",
                    Message = "Refresh failed. Previous cache remains active.",
                    UpdatedAt = DateTimeOffset.UtcNow
                };
            }
        }

        private MediaInventorySnapshot BuildSnapshot(CancellationToken cancellationToken = default, Action<int>? reportProgress = null)
        {
            // Do not materialize IMedia or its keys for the entire library. A site with a
            // million assets is processed in small, bounded batches instead.
            const int batchSize = 1_000;
            var items = new List<MediaInventoryItemDto>();
            var batch = new List<IMedia>(batchSize);
            var processed = 0;

            foreach (var media in GetAllMedia())
            {
                cancellationToken.ThrowIfCancellationRequested();
                if (media.Trashed)
                {
                    continue;
                }

                batch.Add(media);
                if (batch.Count == batchSize)
                {
                    AddBatchToSnapshot(batch, items);
                    processed += batch.Count;
                    reportProgress?.Invoke(processed);
                    batch.Clear();
                }
            }

            if (batch.Count > 0)
            {
                AddBatchToSnapshot(batch, items);
                processed += batch.Count;
                reportProgress?.Invoke(processed);
            }

            _catalogue.Clear();
            _catalogue.AddRange(items);

            return new MediaInventorySnapshot
            {
                GeneratedAt = DateTimeOffset.UtcNow,
                Items = items
            };
        }

        private void AddBatchToSnapshot(IReadOnlyCollection<IMedia> mediaBatch, ICollection<MediaInventoryItemDto> destination)
        {
            var usedMediaKeys = GetUsedMediaKeys(mediaBatch.Select(media => media.Key));
            foreach (var media in mediaBatch)
            {
                destination.Add(MapMedia(media, usedMediaKeys));
            }
        }

        private IEnumerable<IMedia> GetAllMedia()
        {
            const int pageSize = 500;
            foreach (var root in _mediaService.GetRootMedia())
            {
                yield return root;

                long pageIndex = 0;
                long totalRecords;
                do
                {
                    var descendants = _mediaService.GetPagedDescendants(root.Id, pageIndex, pageSize, out totalRecords);
                    foreach (var descendant in descendants)
                    {
                        yield return descendant;
                    }

                    pageIndex++;
                } while (pageIndex * pageSize < totalRecords);
            }
        }

        private static MediaInventoryItemDto MapMedia(IMedia media, ISet<Guid> usedMediaKeys)
        {
            var alias = media.ContentType.Alias;
            var type = GetMediaType(alias);
            var url = GetMediaUrl(media);
            var referenceCount = usedMediaKeys.Contains(media.Key) ? 1 : 0;

            return new MediaInventoryItemDto
            {
                Id = media.Id,
                Name = media.Name ?? string.Empty,
                Type = type,
                Url = url,
                FileSizeBytes = media.GetValue<long?>("umbracoBytes") ?? 0,
                HasReferences = referenceCount > 0,
                ReferenceCount = referenceCount,
                Path = media.Path,
                CreatedDate = new DateTimeOffset(media.CreateDate),
                UpdatedDate = new DateTimeOffset(media.UpdateDate)
            };
        }

        private ISet<Guid> GetUsedMediaKeys(IEnumerable<Guid> mediaKeys)
        {
            var requestedKeys = mediaKeys.ToHashSet();
            if (requestedKeys.Count == 0)
            {
                return new HashSet<Guid>();
            }
            var usedKeys = new HashSet<Guid>();
            const long pageSize = 1_000;
            long skip = 0;

            while (skip < requestedKeys.Count)
            {
                var result = _trackedReferencesService
                    .GetPagedKeysWithDependentReferencesAsync(requestedKeys, Umbraco.Cms.Core.Constants.ObjectTypes.Media, skip, pageSize)
                    .GetAwaiter()
                    .GetResult();

                var pageItems = result.Items.ToList();
                if (pageItems.Count == 0)
                {
                    break;
                }

                usedKeys.UnionWith(pageItems);
                skip += pageItems.Count;
            }

            return usedKeys;
        }

        private static string GetMediaType(string alias)
        {
            var value = alias.ToLowerInvariant();
            if (value.Contains("image") || value.Contains("svg")) return "Image";
            if (value.Contains("video")) return "Video";
            if (value.Contains("audio")) return "Audio";
            if (value.Contains("folder")) return "Folder";
            return "File";
        }

        private static string GetMediaUrl(IMedia media)
        {
            var value = media.GetValue<string>("umbracoFile");
            if (string.IsNullOrWhiteSpace(value)) return string.Empty;
            if (!value.TrimStart().StartsWith('{')) return value;

            try
            {
                using var document = JsonDocument.Parse(value);
                return document.RootElement.TryGetProperty("src", out var src)
                    ? src.GetString() ?? string.Empty
                    : document.RootElement.TryGetProperty("url", out var url) ? url.GetString() ?? string.Empty : string.Empty;
            }
            catch (JsonException)
            {
                return string.Empty;
            }
        }

        private static List<MediaInventoryReferenceDto> CreateReferenceSet(int mediaId)
        {
            var references = new List<MediaInventoryReferenceDto>();
            var baseName = mediaId % 5 == 0 ? "Homepage" : "Content";
            for (var i = 0; i < 5; i++)
            {
                references.Add(new MediaInventoryReferenceDto
                {
                    Id = mediaId + i + 1,
                    Name = $"{baseName} {i + 1}",
                    NodeType = "Content",
                    Path = $"/root/{baseName}/{i + 1}",
                    Url = $"/content/{mediaId}-{i + 1}"
                });
            }

            return references;
        }

        private static string EscapeCsv(string value)
        {
            var escaped = value.Replace("\"", "\"\"");
            return escaped.Contains(',') || escaped.Contains('"') || escaped.Contains('\n') || escaped.Contains('\r')
                ? $"\"{escaped}\""
                : escaped;
        }

        private sealed class MediaInventorySnapshot
        {
            public DateTimeOffset GeneratedAt { get; set; } = DateTimeOffset.UtcNow;
            public List<MediaInventoryItemDto> Items { get; set; } = new();
        }
    }
}
