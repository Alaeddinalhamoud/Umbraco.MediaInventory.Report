using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.MediaInventory.Report.Models;
using Umbraco.MediaInventory.Report.Services;

namespace Umbraco.MediaInventory.Report.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "Umbraco.MediaInventory.Report")]
    public class UmbracoMediaInventoryReportApiController : UmbracoMediaInventoryReportApiControllerBase
    {
        private readonly IMediaInventoryService _mediaInventoryService;

        public UmbracoMediaInventoryReportApiController(IMediaInventoryService mediaInventoryService)
        {
            _mediaInventoryService = mediaInventoryService;
        }

        [HttpGet("ping")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        public string Ping() => "Pong";

        [HttpGet("media-inventory")]
        [ProducesResponseType(typeof(MediaInventoryPageResult), StatusCodes.Status200OK)]
        public async Task<ActionResult<MediaInventoryPageResult>> GetInventory([FromQuery] MediaInventoryQuery query, CancellationToken cancellationToken)
        {
            if (query.Page <= 0) query.Page = 1;
            if (query.PageSize <= 0 || query.PageSize > 250) query.PageSize = 50;

            var result = await _mediaInventoryService.GetPageAsync(query, cancellationToken);
            return Ok(result);
        }

        [HttpGet("media-inventory/{mediaId:int}/references")]
        [ProducesResponseType(typeof(IReadOnlyList<MediaInventoryReferenceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IReadOnlyList<MediaInventoryReferenceDto>>> GetReferences(int mediaId, CancellationToken cancellationToken)
        {
            var result = await _mediaInventoryService.GetReferencesAsync(mediaId, cancellationToken);
            return Ok(result);
        }

        [HttpPost("media-inventory/refresh")]
        [ProducesResponseType(typeof(MediaInventoryRefreshStatus), StatusCodes.Status200OK)]
        public async Task<ActionResult<MediaInventoryRefreshStatus>> RefreshInventory(CancellationToken cancellationToken)
        {
            var result = await _mediaInventoryService.TriggerRefreshAsync(cancellationToken);
            return Ok(result);
        }

        [HttpGet("media-inventory/refresh/status")]
        [ProducesResponseType(typeof(MediaInventoryRefreshStatus), StatusCodes.Status200OK)]
        public async Task<ActionResult<MediaInventoryRefreshStatus>> GetRefreshStatus(CancellationToken cancellationToken)
        {
            var result = await _mediaInventoryService.GetRefreshStatusAsync(cancellationToken);
            return Ok(result);
        }

        [HttpPost("media-inventory/export")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ExportCsv([FromBody] MediaInventoryExportRequest request, CancellationToken cancellationToken)
        {
            var stream = await _mediaInventoryService.ExportCsvAsync(request, cancellationToken);
            return File(stream, "text/csv; charset=utf-8", $"media-inventory-{DateTime.UtcNow:yyyyMMddHHmmss}.csv");
        }

        [HttpPost("media-inventory/{mediaId:int}/trash")]
        [ProducesResponseType(typeof(MediaInventoryTrashResult), StatusCodes.Status200OK)]
        public async Task<ActionResult<MediaInventoryTrashResult>> MoveToTrash(int mediaId, CancellationToken cancellationToken)
        {
            var success = await _mediaInventoryService.MoveToTrashAsync(mediaId, cancellationToken);
            if (!success)
            {
                return NotFound(new MediaInventoryTrashResult { Success = false, MediaId = mediaId, Name = string.Empty });
            }

            return Ok(new MediaInventoryTrashResult { Success = true, MediaId = mediaId, Name = "media" });
        }
    }
}
