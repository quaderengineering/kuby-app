using Domain.Kuby.Models;
using FluentValidation;

namespace Domain.Kuby.Validators.ActivityValidator.Rules;

internal class ActivityRules : AbstractValidator<Activity>
{
    public ActivityRules()
    {
        Include(new UniqueLabelValidator());
        RuleFor(activity => activity.Label).NotEmpty();
    }
}
