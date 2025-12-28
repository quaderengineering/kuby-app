using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace API.Kuby.Exceptions;

internal sealed class ValidationExceptionHandler(
    ILogger<ValidationExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, 
        Exception exception, 
        CancellationToken token)
    {
        return false;
        if (exception is not ValidationException validationException)
            return false;

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

        var problemDetails = new ProblemDetails
        {
            Detail = "One or more validation errors occured",
            Type = exception.GetType().Name,
            Status = StatusCodes.Status400BadRequest,
        };

        var errors = validationException.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(
                g => g.Key.ToLowerInvariant(),
                g => g.Select(e => e.ErrorMessage).ToArray()
            );

        problemDetails.Extensions.Add("errors", errors);

        await httpContext
            .Response
            .WriteAsJsonAsync(problemDetails, token);
        return false;
    }
}
