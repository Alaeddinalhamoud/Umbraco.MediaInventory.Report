namespace Umbraco.MediaInventory.Report.Models;

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
