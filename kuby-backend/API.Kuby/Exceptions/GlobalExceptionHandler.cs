using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace API.Kuby.Exceptions;

internal sealed class GlobalExceptionHandler(
    ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, 
        Exception exception, 
        CancellationToken token)
    {
        logger.LogError(exception, "Unhandled exception occured");

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "An error occured",
            Type = exception.GetType().Name,
            Detail = exception.Message
        };

        await httpContext
            .Response
            .WriteAsJsonAsync(problemDetails, token);

        return true;
    }
}
