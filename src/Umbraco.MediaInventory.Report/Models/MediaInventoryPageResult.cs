namespace Umbraco.MediaInventory.Report.Models;

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