using System.Reflection;
using System.Text;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using Umbraco.MediaInventory.Report.Models;
using Umbraco.MediaInventory.Report.Services;
using Xunit;

namespace Umbraco.MediaInventory.Report.Tests.Services;

public sealed class MediaInventoryServiceTests
{
    [Fact]
    public async Task GetPageAsync_FiltersSortsAndPaginatesItems()
    {
        using MemoryCache cache = new(new MemoryCacheOptions());
        MediaInventoryService service = CreateService(cache, CreateItems());

        MediaInventoryPageResult result = await service.GetPageAsync(new MediaInventoryQuery
        {
            Search = "photo",
            MediaType = "image",
            SortBy = "references",
            SortDirection = "desc",
            Page = 2,
            PageSize = 1
        });

        MediaInventoryItemDto item = Assert.Single(result.Items);
        Assert.Equal(1, item.Id);
        Assert.Equal(2, result.Total);
        Assert.Equal(2, result.Page);
        Assert.Equal(1, result.PageSize);
    }

    [Fact]
    public async Task GetPageAsync_SummaryIgnoresMediaTypeButHonoursReferenceFilter()
    {
        using MemoryCache cache = new(new MemoryCacheOptions());
        MediaInventoryService service = CreateService(cache, CreateItems());

        MediaInventoryPageResult result = await service.GetPageAsync(new MediaInventoryQuery
        {
            MediaType = "Image",
            HasReferences = false
        });

        Assert.Single(result.Items);
        Assert.Equal(2, result.UnusedTotal);
        Assert.Equal(2, result.TypeCounts.Sum(count => count.Count));
        Assert.Contains(result.TypeCounts, count => count.Type == "Image" && count.Count == 1);
        Assert.Contains(result.TypeCounts, count => count.Type == "Video" && count.Count == 1);
    }

    [Fact]
    public async Task GetPageAsync_NormalizesInvalidPagingValues()
    {
        using MemoryCache cache = new(new MemoryCacheOptions());
        MediaInventoryService service = CreateService(cache, CreateItems());

        MediaInventoryPageResult result = await service.GetPageAsync(new MediaInventoryQuery { Page = 0, PageSize = 999 });

        Assert.Equal(1, result.Page);
        Assert.Equal(250, result.PageSize);
        Assert.Equal(3, result.Total);
    }

    [Fact]
    public async Task ExportCsvAsync_EscapesQuotesAndCommas()
    {
        using MemoryCache cache = new(new MemoryCacheOptions());
        MediaInventoryService service = CreateService(cache,
        [
            new() { Id = 7, Name = "Hero, \"desktop\"", Type = "Image", Url = "/media/hero,image.jpg", HasReferences = true, ReferenceCount = 1 }
        ]);

        await using Stream stream = await service.ExportCsvAsync(new MediaInventoryExportRequest());
        using StreamReader reader = new(stream, Encoding.UTF8, leaveOpen: true);
        string csv = await reader.ReadToEndAsync();

        Assert.Equal(
            "Id,Name,Type,Url,HasReferences,ReferenceCount\n7,\"Hero, \"\"desktop\"\"\",Image,\"/media/hero,image.jpg\",True,1\n",
            csv.Replace("\r\n", "\n"));
    }

    [Fact]
    public async Task GetReferencesAsync_ReturnsEmptyForAnUnknownMediaItem()
    {
        using MemoryCache cache = new(new MemoryCacheOptions());
        MediaInventoryService service = CreateService(cache, []);

        IReadOnlyList<MediaInventoryReferenceDto> result = await service.GetReferencesAsync(42);

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetRefreshStatusAsync_StartsIdle()
    {
        using MemoryCache cache = new(new MemoryCacheOptions());
        MediaInventoryService service = CreateService(cache, []);

        MediaInventoryRefreshStatus result = await service.GetRefreshStatusAsync();

        Assert.False(result.IsRunning);
        Assert.Equal("idle", result.Status);
        Assert.Equal("Idle", result.Message);
    }

    private static MediaInventoryService CreateService(IMemoryCache cache, List<MediaInventoryItemDto> items)
    {
        Type snapshotType = typeof(MediaInventoryService).GetNestedType("MediaInventorySnapshot", BindingFlags.NonPublic)!;
        object snapshot = Activator.CreateInstance(snapshotType)!;
        snapshotType.GetProperty("Items")!.SetValue(snapshot, items);
        cache.Set("media-inventory:overview", snapshot);

        return new MediaInventoryService(cache, null!, null!, NullLogger<MediaInventoryService>.Instance);
    }

    private static List<MediaInventoryItemDto> CreateItems() =>
    [
        new() { Id = 1, Name = "Photo alpha", Type = "Image", FileSizeBytes = 10, HasReferences = false, ReferenceCount = 0 },
        new() { Id = 2, Name = "Photo beta", Type = "Image", FileSizeBytes = 20, HasReferences = true, ReferenceCount = 2 },
        new() { Id = 3, Name = "Clip", Type = "Video", FileSizeBytes = 30, HasReferences = false, ReferenceCount = 0 }
    ];
}
