using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace Umbraco.MediaInventory.Report.Controllers
{
    [ApiController]
    [BackOfficeRoute("umbracomediainventoryreport/api/v{version:apiVersion}")]
    // The report is hosted in the Media section. SectionAccessContent rejects
    // otherwise valid Media-only backoffice users before the controller runs.
    // Authentication remains mandatory; media-operation permissions are enforced
    // by Umbraco's media service when executing the action.
    [Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
    [MapToApi(Constants.ApiName)]
    [JsonOptionsName(Umbraco.Cms.Core.Constants.JsonOptionsNames.BackOffice)]
    public class UmbracoMediaInventoryReportApiControllerBase : ControllerBase
    {
    }
}
