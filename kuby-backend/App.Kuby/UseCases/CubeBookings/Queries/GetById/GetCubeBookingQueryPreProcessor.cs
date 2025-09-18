using App.Kuby.Interfaces.Repositories;
using Mediator;

namespace App.Kuby.UseCases.CubeBookings.Queries.GetById;
/// <summary>
/// THIS IS SIMPLY A DEMO to test if and how the pre processor pipeline can be done with this Mediator package
/// </summary>
/// <typeparam name="TMessage"></typeparam>
/// <typeparam name="TResponse"></typeparam>
public class GetCubeBookingQueryPreProcessor<TMessage, TResponse> : IPipelineBehavior<TMessage, TResponse> where TMessage : GetCubeBookingQuery where TResponse : CubeBookingReadResult
{
    //public ValueTask<CubeBookingReadResult> Handle(
    //    GetCubeBookingQuery message, 
    //    MessageHandlerDelegate<GetCubeBookingQuery, CubeBookingReadResult> next, 
    //    CancellationToken token)
    //{
    //    message.test = "testetstetste";

    //    return next(message, token);
    //}

    public ValueTask<TResponse> Handle(
        TMessage message, 
        MessageHandlerDelegate<TMessage, TResponse> next, 
        CancellationToken token)
    {
        message.test = "testetstetste";

        return next(message, token);
    }
}
