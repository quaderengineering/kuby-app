using App.Kuby.UseCases.CubeBookings.Queries.GetById;
using Domain.Kuby.Models;

namespace App.Kuby.Interfaces.Repositories;

public interface ICubeBookingRepository
{
    ValueTask<CubeBookingReadResult> ReadCubeBookingById(int id, CancellationToken token);
}
