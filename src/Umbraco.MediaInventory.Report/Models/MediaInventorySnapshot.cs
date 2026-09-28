namespace Umbraco.MediaInventory.Report.Models;

public sealed class MediaInventorySnapshot
{
    public DateTimeOffset GeneratedAt { get; set; } = DateTimeOffset.UtcNow;
    public List<MediaInventoryItemDto> Items { get; set; } = new();
}
