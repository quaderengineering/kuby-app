using FluentValidation;

namespace App.Kuby.UseCases.Activities.Queries.GetAll;

internal class GetAllActivitiesQueryValidator : AbstractValidator<GetAllActivitiesQuery>
{
    public GetAllActivitiesQueryValidator()
    {
        RuleFor(q => q.DateFrom).LessThanOrEqualTo(q => q.DateTo);
    }
}
