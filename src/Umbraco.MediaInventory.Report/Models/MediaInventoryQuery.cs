namespace Umbraco.MediaInventory.Report.Models;

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
