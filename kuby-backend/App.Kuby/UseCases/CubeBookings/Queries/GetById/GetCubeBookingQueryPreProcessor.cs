using FluentValidation;
using Mediator;

namespace App.Kuby.UseCases.CubeBookings.Queries.GetById;
/// <summary>
/// THIS IS SIMPLY A DEMO to test if and how the pre processor pipeline can be done with this Mediator package
/// </summary>
/// <typeparam name="TMessage"></typeparam>
/// <typeparam name="TResponse"></typeparam>
public class GetCubeBookingQueryPreProcessor<TMessage, TResponse> : IPipelineBehavior<TMessage, TResponse> where TMessage : GetCubeBookingQuery where TResponse : CubeBookingReadResult
{
    private readonly GetCubeBookingQueryValidator validator = new();

    public async ValueTask<TResponse> Handle(
        TMessage message, 
        MessageHandlerDelegate<TMessage, TResponse> next, 
        CancellationToken token)
    {
        message.test = "testetstetste";

        await validator.ValidateAndThrowAsync(message, token).ConfigureAwait(false); // FIXME: just for testing purposes, might not need validation here

        return await next(message, token).ConfigureAwait(false);
    }
}
