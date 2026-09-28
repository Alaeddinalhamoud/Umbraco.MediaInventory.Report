namespace Umbraco.MediaInventory.Report.Models;

public sealed class MediaInventoryReferenceDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NodeType { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}