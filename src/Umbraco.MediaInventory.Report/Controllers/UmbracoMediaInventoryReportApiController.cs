using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using Umbraco.MediaInventory.Report.Models;
using Umbraco.MediaInventory.Report.Services;

namespace Umbraco.MediaInventory.Report.Controllers;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "Umbraco.MediaInventory.Report")]
public class UmbracoMediaInventoryReportApiController(IMediaInventoryService mediaInventoryService) : UmbracoMediaInventoryReportApiControllerBase
{

    [HttpGet("ping")]
    [ProducesResponseType<string>(StatusCodes.Status200OK)]
    public string Ping() => "Pong";

    [HttpGet("package/version")]
    [AllowAnonymous]
    [ProducesResponseType<string>(StatusCodes.Status200OK)]
    public string GetPackageVersion()
    {
        var version = typeof(UmbracoMediaInventoryReportApiController).Assembly
            .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion
        ?? typeof(UmbracoMediaInventoryReportApiController).Assembly.GetName().Version?.ToString()
        ?? "unknown";

        return version.Split('+', 2)[0];
    }

    [HttpGet("media-inventory")]
    [ProducesResponseType(typeof(MediaInventoryPageResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<MediaInventoryPageResult>> GetInventory([FromQuery] MediaInventoryQuery query, CancellationToken cancellationToken)
    {
        if (query.Page <= 0) query.Page = 1;
        if (query.PageSize <= 0 || query.PageSize > 250) query.PageSize = 50;

        var result = await mediaInventoryService.GetPageAsync(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("media-inventory/{mediaId:int}/references")]
    [ProducesResponseType(typeof(IReadOnlyList<MediaInventoryReferenceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<MediaInventoryReferenceDto>>> GetReferences(int mediaId, CancellationToken cancellationToken) =>
        Ok(await mediaInventoryService.GetReferencesAsync(mediaId, cancellationToken));

    [HttpPost("media-inventory/refresh")]
    [ProducesResponseType(typeof(MediaInventoryRefreshStatus), StatusCodes.Status200OK)]
    public async Task<ActionResult<MediaInventoryRefreshStatus>> RefreshInventory(CancellationToken cancellationToken) =>
        Ok(await mediaInventoryService.TriggerRefreshAsync(cancellationToken));

    [HttpGet("media-inventory/refresh/status")]
    [ProducesResponseType(typeof(MediaInventoryRefreshStatus), StatusCodes.Status200OK)]
    public async Task<ActionResult<MediaInventoryRefreshStatus>> GetRefreshStatus(CancellationToken cancellationToken) =>
         Ok(await mediaInventoryService.GetRefreshStatusAsync(cancellationToken));

    [HttpPost("media-inventory/export")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ExportCsv([FromBody] MediaInventoryExportRequest request, CancellationToken cancellationToken)
    {
        var stream = await mediaInventoryService.ExportCsvAsync(request, cancellationToken);

        return File(stream, "text/csv; charset=utf-8", $"media-inventory-{DateTime.UtcNow:yyyyMMddHHmmss}.csv");
    }

    [HttpPost("media-inventory/{mediaId:int}/trash")]
    [ProducesResponseType(typeof(MediaInventoryTrashResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<MediaInventoryTrashResult>> MoveToTrash(int mediaId, CancellationToken cancellationToken)
    {
        var success = await mediaInventoryService.MoveToTrashAsync(mediaId, cancellationToken);

        if (!success)
            return NotFound(new MediaInventoryTrashResult { Success = false, MediaId = mediaId, Name = string.Empty });

        return Ok(new MediaInventoryTrashResult { Success = true, MediaId = mediaId, Name = "media" });
    }
}
