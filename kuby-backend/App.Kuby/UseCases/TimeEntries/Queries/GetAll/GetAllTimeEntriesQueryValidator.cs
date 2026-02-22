using FluentValidation;

namespace App.Kuby.UseCases.Activities.Queries.GetAll;

internal class GetAllTimeEntriesQueryValidator : AbstractValidator<GetAllTimeEntriesQuery>
{
    public GetAllTimeEntriesQueryValidator()
    {
        RuleFor(q => q.DateFrom).LessThanOrEqualTo(q => q.DateTo);
    }
}
