using FluentValidation;

namespace App.Kuby.UseCases.Cubes.Queries.GetAll;

internal class GetAllCubeTimesQueryValidator : AbstractValidator<GetAllCubeTimesQuery>
{
    public GetAllCubeTimesQueryValidator()
    {
        RuleFor(q => q.DateFrom).LessThanOrEqualTo(q => q.DateTo);
    }
}
