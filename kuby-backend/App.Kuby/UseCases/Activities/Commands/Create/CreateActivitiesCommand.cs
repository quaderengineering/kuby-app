using Domain.Kuby.Models;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Create;

public record CreateActivitiesCommand(IReadOnlyCollection<Activity> Times) : IRequest<IReadOnlyCollection<int>>
{
    public IReadOnlyCollection<Activity> UniqueTimes { get; set; } = new List<Activity>();
}