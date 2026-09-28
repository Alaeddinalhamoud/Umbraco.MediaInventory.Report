namespace Umbraco.MediaInventory.Report.Models;

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
