using Mediator;

namespace App.Kuby.UseCases.CubeBookings.Queries.GetById;

public record GetCubeBookingQuery(int Id) : IRequest<CubeBookingReadResult>
{
    public string test {  get; set; } = string.Empty;
}