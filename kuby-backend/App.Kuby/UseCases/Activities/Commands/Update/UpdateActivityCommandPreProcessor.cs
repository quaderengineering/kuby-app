using App.Kuby.Interfaces.Repositories;
using App.Kuby.Mapping;
using Domain.Kuby.Models;
using Domain.Kuby.Validators.ActivityValidator.RuleProvider.Update;
using FluentValidation;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Update;

public class UpdateActivityCommandPreProcessor<TMessage, TResponse> : IPipelineBehavior<TMessage, TResponse> where TMessage : UpdateActivityCommand
{
    private readonly UpdateActivityValidator _validator = new();
    private readonly IActivityRepository _activityRepository;

    public UpdateActivityCommandPreProcessor(IActivityRepository activityRepository)
    {
        _activityRepository = activityRepository;
    }

    public async ValueTask<TResponse> Handle(TMessage message, MessageHandlerDelegate<TMessage, TResponse> next, CancellationToken token)
    {
        await ValidateLabel(message.Activity, token).ConfigureAwait(false);

        await _validator.ValidateAndThrowAsync(message.Activity, token).ConfigureAwait(false);

        var originalActivity = await _activityRepository.GetActivityAsync(message.Activity.ActivityId, token).ConfigureAwait(false);

        if (originalActivity == null)
            // FIXME: notfound exc 404
            throw new ValidationException("Activity not found");

        originalActivity.MapToOriginal(message.Activity);

        return await next(message, token).ConfigureAwait(false);
    }

    private async Task ValidateLabel(Activity activity, CancellationToken token)
    {
        var isLabelTaken = await _activityRepository.IsLabelTaken(activity, token).ConfigureAwait(false);

        activity.SetLabelTakenFlag(isLabelTaken);
    }
}
