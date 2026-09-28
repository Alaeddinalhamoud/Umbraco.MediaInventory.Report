namespace Umbraco.MediaInventory.Report.Models;

public sealed class MediaInventoryCacheInfo
{
    public string Status { get; set; } = "valid";
    public DateTimeOffset GeneratedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset ExpiresAt { get; set; } = DateTimeOffset.UtcNow.AddDays(7);
}
