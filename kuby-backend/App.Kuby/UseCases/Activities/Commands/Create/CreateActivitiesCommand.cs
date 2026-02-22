using Domain.Kuby.Models;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Create;

public record CreateActivitiesCommand(IReadOnlyCollection<Activity> Activities) : IRequest<IReadOnlyCollection<Guid>>;