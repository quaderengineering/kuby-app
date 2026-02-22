using Mediator;

namespace App.Kuby.UseCases.Activities.Queries.GetById;

public record GetActivityByIdQuery(Guid ActivityId) : IRequest<ActivityReadResult>;
