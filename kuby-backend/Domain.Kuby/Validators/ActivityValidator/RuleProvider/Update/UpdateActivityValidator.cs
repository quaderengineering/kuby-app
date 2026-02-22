using Domain.Kuby.Models;
using Domain.Kuby.Validators.ActivityValidator.Rules;
using FluentValidation;

namespace Domain.Kuby.Validators.ActivityValidator.RuleProvider.Update;

public class UpdateActivityValidator : AbstractValidator<Activity>
{
    public UpdateActivityValidator()
    {
        Include(new ActivityRules());
        RuleFor(activity => activity.ActivityId).GreaterThan(default(Guid));
    }
}
