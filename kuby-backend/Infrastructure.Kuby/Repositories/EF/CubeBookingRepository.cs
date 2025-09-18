using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.CubeBookings.Queries.GetById;

namespace Infrastructure.Kuby.Repositories.EF;

internal class CubeBookingRepository : ICubeBookingRepository
{
    public ValueTask<CubeBookingReadResult> ReadCubeBookingById(int id, CancellationToken token)
    {
        return ValueTask.FromResult(new CubeBookingReadResult() { CubeBookingId = 1 }); //FIXME: demo
    }
}
