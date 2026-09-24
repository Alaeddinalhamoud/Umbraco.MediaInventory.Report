using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.MediaInventory.Report.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Umbraco.MediaInventory.Report.Composers
{
    public class UmbracoMediaInventoryReportApiComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.AddSingleton<IMediaInventoryService, MediaInventoryService>();
        }
    }
}
