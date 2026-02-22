using App.Kuby.Interfaces.Repositories;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Update;

public class UpdateActivityCommandHandler : IRequestHandler<UpdateActivityCommand>
{
    private readonly IActivityRepository _activityRepository;

    public UpdateActivityCommandHandler(IActivityRepository activityRepository)
    {
        _activityRepository = activityRepository;
    }

    public async ValueTask<Unit> Handle(UpdateActivityCommand request, CancellationToken token)
    {
        await _activityRepository.UpdateActivityAsync(token).ConfigureAwait(false);
        return Unit.Value;
    }
}
