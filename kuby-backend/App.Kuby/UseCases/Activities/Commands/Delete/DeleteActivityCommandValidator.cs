using App.Kuby.UseCases.Activities.Commands.Update;
using FluentValidation;

namespace App.Kuby.UseCases.Activities.Commands.Delete;

internal class DeleteActivityCommandValidator : AbstractValidator<DeleteActivityCommand>
{
    public DeleteActivityCommandValidator()
    {
        RuleFor(q => q.ActivityId).GreaterThan(default(Guid));
    }
}
