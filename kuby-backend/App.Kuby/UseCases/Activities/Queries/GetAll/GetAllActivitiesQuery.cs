using Mediator;

namespace App.Kuby.UseCases.Activities.Queries.GetAll;

public record GetAllActivitiesQuery(DateOnly DateFrom, DateOnly DateTo) : IRequest<IReadOnlyCollection<ActivityReadAllResult>>;
