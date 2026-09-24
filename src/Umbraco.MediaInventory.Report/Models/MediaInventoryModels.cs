using System.Text.Json.Serialization;

namespace Umbraco.MediaInventory.Report.Models
{
    public enum MediaInventorySortField
    {
        Name,
        Type,
        References
    }

    public sealed class MediaInventoryQuery
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
        public string? Search { get; set; }
        public string? MediaType { get; set; }
        public bool? HasReferences { get; set; }
        public string SortBy { get; set; } = "name";
        public string SortDirection { get; set; } = "asc";
    }

    public sealed class MediaInventoryCacheInfo
    {
        public string Status { get; set; } = "valid";
        public DateTimeOffset GeneratedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset ExpiresAt { get; set; } = DateTimeOffset.UtcNow.AddDays(7);
    }

    public sealed class MediaInventoryItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public bool HasReferences { get; set; }
        public int ReferenceCount { get; set; }
        public string? Path { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }

    public sealed class MediaInventoryReferenceDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string NodeType { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public sealed class MediaInventoryPageResult
    {
        public IEnumerable<MediaInventoryItemDto> Items { get; set; } = Array.Empty<MediaInventoryItemDto>();
        public IReadOnlyList<MediaInventoryTypeCount> TypeCounts { get; set; } = Array.Empty<MediaInventoryTypeCount>();
        public int InUseTotal { get; set; }
        public int UnusedTotal { get; set; }
        public long TotalFileSizeBytes { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int Total { get; set; }
        public MediaInventoryCacheInfo Cache { get; set; } = new();
    }

    public sealed class MediaInventoryTypeCount
    {
        public string Type { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public sealed class MediaInventoryRefreshStatus
    {
        public bool IsRunning { get; set; }
        public string Status { get; set; } = "idle";
        public int Processed { get; set; }
        public int Total { get; set; }
        public int Percentage { get; set; }
        public DateTimeOffset? StartedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public string Message { get; set; } = "Idle";
    }

    public sealed class MediaInventoryExportRequest
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 250;
        public string? Search { get; set; }
        public string? MediaType { get; set; }
        public bool? HasReferences { get; set; }
        public string SortBy { get; set; } = "name";
        public string SortDirection { get; set; } = "asc";
    }

    public sealed class MediaInventoryTrashResult
    {
        public bool Success { get; set; }
        public int MediaId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
