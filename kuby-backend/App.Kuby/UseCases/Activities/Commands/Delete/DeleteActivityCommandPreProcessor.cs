using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Activities.Commands.Delete;
using FluentValidation;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Update;

public class DeleteActivityCommandPreProcessor<TMessage, TResponse> : IPipelineBehavior<TMessage, TResponse> where TMessage : DeleteActivityCommand
{
    private readonly DeleteActivityCommandValidator _validator = new();
    private readonly IActivityRepository _activityRepository;

    public DeleteActivityCommandPreProcessor(IActivityRepository activityRepository)
    {
        _activityRepository = activityRepository;
    }

    public async ValueTask<TResponse> Handle(TMessage message, MessageHandlerDelegate<TMessage, TResponse> next, CancellationToken token)
    {
        await _validator.ValidateAndThrowAsync(message, token).ConfigureAwait(false);

        var originalActivity = await _activityRepository.GetActivityAsync(message.ActivityId, token).ConfigureAwait(false);

        if (originalActivity == null)
            // FIXME: notfound exc 404
            throw new ValidationException("Activity not found");

        return await next(message, token).ConfigureAwait(false);
    }
}
