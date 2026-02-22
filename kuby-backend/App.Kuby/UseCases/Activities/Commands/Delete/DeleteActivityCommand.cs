using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Update;

public record DeleteActivityCommand(Guid ActivityId) : IRequest;