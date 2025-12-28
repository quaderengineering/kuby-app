using FluentValidation;
using Mediator;

namespace App.Kuby.UseCases.Cubes.Queries.GetAll;

public class GetAllCubeTimesPreProcessor<TMessage, TRespone> : IPipelineBehavior<TMessage, TRespone> where TMessage : GetAllCubeTimesQuery where TRespone : IReadOnlyCollection<CubeTimeReadAllResult>
{
    private readonly GetAllCubeTimesQueryValidator _validator = new();

    public async ValueTask<TRespone> Handle(TMessage message, MessageHandlerDelegate<TMessage, TRespone> next, CancellationToken token)
    {
        await _validator.ValidateAndThrowAsync(message, token).ConfigureAwait(false);
        return await next(message, token).ConfigureAwait(false);
    }
}
