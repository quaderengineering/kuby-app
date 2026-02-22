using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.Activities.Commands.Create;
using Domain.Kuby.Models;
using Domain.Kuby.Validators.ActivityValidator.RuleProvider.Create;
using FluentValidation;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Update;

public class CreateActivitiesCommandPreProcessor<TMessage, TResponse> : IPipelineBehavior<TMessage, TResponse> where TMessage : CreateActivitiesCommand where TResponse : IReadOnlyCollection<Guid>
{
    private readonly CreateActivityValidator _validator = new();
    private readonly IActivityRepository _activityRepository;

    public CreateActivitiesCommandPreProcessor(IActivityRepository activityRepository)
    {
        _activityRepository = activityRepository;
    }

    public async ValueTask<TResponse> Handle(TMessage message, MessageHandlerDelegate<TMessage, TResponse> next, CancellationToken token)
    {
        foreach (var activity in message.Activities)
        {
            await ValidateLabel(activity, token).ConfigureAwait(false);
            await _validator.ValidateAndThrowAsync(activity, token).ConfigureAwait(false);
        }

        return await next(message, token).ConfigureAwait(false);
    }

    private async Task ValidateLabel(Activity activity, CancellationToken token)
    {
        var isLabelTaken = await _activityRepository.IsLabelTaken(activity, token).ConfigureAwait(false);

        activity.SetLabelTakenFlag(isLabelTaken);
    }
}
