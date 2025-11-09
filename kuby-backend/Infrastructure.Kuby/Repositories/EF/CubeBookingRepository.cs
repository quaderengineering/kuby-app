using App.Kuby.Interfaces.Repositories;
using App.Kuby.UseCases.CubeBookings.Queries.GetById;
using Infrastructure.Kuby.Data.EntitiesConfig;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Kuby.Repositories.EF;

internal class CubeBookingRepository : ICubeBookingRepository
{

    private readonly DataContext _dbContext;

    public CubeBookingRepository(DataContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async ValueTask<CubeBookingReadResult> ReadCubeBookingById(int id, CancellationToken token)
    {
        var query = _dbContext.Display.Where(d => d.DisplayId == id);
        var result = await query.SingleOrDefaultAsync(token);
        return new CubeBookingReadResult() { CubeBookingId = 1 };
        //return ValueTask.FromResult(new CubeBookingReadResult() { CubeBookingId = 1 }); //FIXME: demo
    }
}
