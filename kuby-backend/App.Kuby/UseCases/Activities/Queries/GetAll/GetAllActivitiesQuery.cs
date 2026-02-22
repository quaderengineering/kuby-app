using App.Kuby.UseCases.Common;
using Mediator;

namespace App.Kuby.UseCases.Activities.Queries.GetAll;

public record GetAllActivitiesQuery(bool IsActive) : IRequest<IReadOnlyCollection<ActivityReadAllResult>>;
