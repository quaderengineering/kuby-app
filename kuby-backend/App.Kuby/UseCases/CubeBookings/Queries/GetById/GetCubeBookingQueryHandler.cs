using App.Kuby.Interfaces.Repositories;
using Mediator;

namespace App.Kuby.UseCases.CubeBookings.Queries.GetById;

public class GetCubeBookingQueryHandler : IRequestHandler<GetCubeBookingQuery, CubeBookingReadResult>
{
    private readonly ICubeBookingRepository _cubeBookingRepository;

    public GetCubeBookingQueryHandler(ICubeBookingRepository cubeBookingRepository)
    {
        _cubeBookingRepository = cubeBookingRepository;
    }

    public ValueTask<CubeBookingReadResult> Handle(GetCubeBookingQuery request, CancellationToken token)
    {
        return _cubeBookingRepository.ReadCubeBookingById(request.Id, token);
    }
}
