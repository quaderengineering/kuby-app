using Domain.Kuby.Models;
using FluentValidation;

namespace Domain.Kuby.Validators.ActivityValidator;

public class UniqueLabelValidator : AbstractValidator<Activity>
{
    public UniqueLabelValidator()
    {
        RuleFor(activity => activity.IsLabelTaken).Equal(false).WithName("label").WithMessage("Dieser Aktivitätsname ist schon vergeben.");
    }
}
