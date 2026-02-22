using Domain.Kuby.Models;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Import;

public record ImportActivitiesCommand(IReadOnlyCollection<Activity> Activities) : IRequest<IReadOnlyCollection<int>>
{
    public IReadOnlyCollection<TimeEntry> TimeEntriesToCreate { get; set; } = new List<TimeEntry>();
}
