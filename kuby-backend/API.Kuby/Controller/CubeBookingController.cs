using App.Kuby.UseCases.CubeBookings.Queries.GetById;
using Mediator;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace API.Kuby.Controller;

[Route("api/cubes")]
[ApiController]
public class CubeBookingController : ControllerBase
{
    private readonly IMediator _mediator;

    public CubeBookingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    //[HttpGet("search")]
    //public async Task<ActionResult<List<WeatherForecast>>> GetAllAsync(CancellationToken token)
    //{

    //}

    [HttpGet("{cubeBookingId:int}")]
    public async Task<ActionResult> GetAsync([FromRoute, BindRequired] int cubeBookingId, CancellationToken token)
    {
        var query = new GetCubeBookingQuery(cubeBookingId);
        var result = await _mediator.Send<CubeBookingReadResult>(query);

        return Ok(result);
    }
}
