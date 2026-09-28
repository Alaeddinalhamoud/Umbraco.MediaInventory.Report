namespace Umbraco.MediaInventory.Report.Models;

public sealed class MediaInventoryTrashResult
{
    public bool Success { get; set; }
    public int MediaId { get; set; }
    public string Name { get; set; } = string.Empty;
}
