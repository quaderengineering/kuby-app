using App.Kuby.UseCases.Common;
using FluentValidation;
using Mediator;

namespace App.Kuby.UseCases.Activities.Queries.GetAll;

public class GetAllTimeEntriesPreProcessor<TMessage, TRespone> : IPipelineBehavior<TMessage, TRespone> where TMessage : GetAllTimeEntriesQuery where TRespone : IReadOnlyCollection<ActivityReadAllResult>
{
    private readonly GetAllTimeEntriesQueryValidator _validator = new();

    public async ValueTask<TRespone> Handle(TMessage message, MessageHandlerDelegate<TMessage, TRespone> next, CancellationToken token)
    {
        await _validator.ValidateAndThrowAsync(message, token).ConfigureAwait(false);
        return await next(message, token).ConfigureAwait(false);
    }
}
