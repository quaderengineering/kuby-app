using Domain.Kuby.Models;
using FluentValidation;

namespace Domain.Kuby.Validators.TimeEntryValidator.Rules;

public class TimeEntryRules : AbstractValidator<TimeEntry>
{
    public TimeEntryRules()
    {
        RuleFor(timeEntry => timeEntry.Start).LessThan(timeEntry => timeEntry.End);
    }
}
