using App.Kuby.UseCases.Common;
using Mediator;

namespace App.Kuby.UseCases.Activities.Queries.GetAll;

public record GetAllTimeEntriesQuery(DateOnly DateFrom, DateOnly DateTo) : IRequest<IReadOnlyCollection<ActivityReadAllResult>>;
