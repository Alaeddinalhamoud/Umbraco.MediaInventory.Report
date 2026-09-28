using Umbraco.MediaInventory.Report.Models;

namespace Umbraco.MediaInventory.Report.Services;

public interface IMediaInventoryService
{
    Task<MediaInventoryPageResult> GetPageAsync(MediaInventoryQuery query, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<MediaInventoryReferenceDto>> GetReferencesAsync(int mediaId, CancellationToken cancellationToken = default);
    Task<MediaInventoryRefreshStatus> TriggerRefreshAsync(CancellationToken cancellationToken = default);
    Task<MediaInventoryRefreshStatus> GetRefreshStatusAsync(CancellationToken cancellationToken = default);
    Task<bool> MoveToTrashAsync(int mediaId, CancellationToken cancellationToken = default);
    Task<Stream> ExportCsvAsync(MediaInventoryExportRequest request, CancellationToken cancellationToken = default);
}
