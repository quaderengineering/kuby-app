using App.Kuby.Interfaces.Repositories;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Update;

public class DeleteActivityCommandHandler : IRequestHandler<DeleteActivityCommand>
{
    private readonly IActivityRepository _activityRepository;

    public DeleteActivityCommandHandler(IActivityRepository activityRepository)
    {
        _activityRepository = activityRepository;
    }

    public async ValueTask<Unit> Handle(DeleteActivityCommand request, CancellationToken token)
    {
        await _activityRepository.DeleteActivityAsync(request.ActivityId, token).ConfigureAwait(false);
        return Unit.Value;
    }
}
