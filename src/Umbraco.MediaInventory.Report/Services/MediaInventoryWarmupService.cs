using Microsoft.Extensions.Hosting;

namespace Umbraco.MediaInventory.Report.Services;

/// <summary>Starts inventory generation without delaying Umbraco startup.</summary>
public sealed class MediaInventoryWarmupService(IMediaInventoryService inventory) : IHostedService
{
    public Task StartAsync(CancellationToken cancellationToken) => inventory.TriggerRefreshAsync(cancellationToken);

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
