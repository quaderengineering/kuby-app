using Domain.Kuby.Models;
using Domain.Kuby.Validators.ActivityValidator.Rules;
using FluentValidation;

namespace Domain.Kuby.Validators.ActivityValidator.RuleProvider.Create;

public class CreateActivityValidator : AbstractValidator<Activity>
{
    public CreateActivityValidator()
    {
        Include(new ActivityRules());
        RuleFor(activity => activity.ActivityId).Equal(default(Guid));
    }
}
