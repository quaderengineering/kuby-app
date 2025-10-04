using FluentValidation;

namespace App.Kuby.UseCases.CubeBookings.Queries.GetById;

internal class GetCubeBookingQueryValidator : AbstractValidator<GetCubeBookingQuery>
{
    public GetCubeBookingQueryValidator()
    {
        RuleFor(q => q.Id).GreaterThan(0);
    }
}
