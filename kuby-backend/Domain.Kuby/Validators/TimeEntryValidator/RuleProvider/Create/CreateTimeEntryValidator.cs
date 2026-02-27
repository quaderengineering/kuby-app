using Domain.Kuby.Models;
using Domain.Kuby.Validators.TimeEntryValidator.Rules;
using FluentValidation;

namespace Domain.Kuby.Validators.TimeEntryValidator.RuleProvider.Create;

public class CreateTimeEntryValidator : AbstractValidator<TimeEntry>
{
    public CreateTimeEntryValidator()
    {
        Include(new TimeEntryRules());
        RuleFor(timeEntry => timeEntry.TimeEntryId).Equal(default(int));
    }
}
