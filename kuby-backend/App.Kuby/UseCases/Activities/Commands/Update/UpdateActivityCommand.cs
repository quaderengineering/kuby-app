using Domain.Kuby.Models;
using Mediator;

namespace App.Kuby.UseCases.Activities.Commands.Update;

public record UpdateActivityCommand(Activity Activity) : IRequest;