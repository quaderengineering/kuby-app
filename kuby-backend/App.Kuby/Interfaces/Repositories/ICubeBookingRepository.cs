using App.Kuby.UseCases.CubeBookings.Queries.GetById;

namespace App.Kuby.Interfaces.Repositories;

public interface ICubeBookingRepository
{
    ValueTask<CubeBookingReadResult> ReadCubeBookingById(int id, CancellationToken token);
}
