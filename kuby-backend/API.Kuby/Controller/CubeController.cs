using API.Kuby.Mapping;
using API.Kuby.Models.Cube;
using App.Kuby.UseCases.CubeBookings.Queries.GetById;
using App.Kuby.UseCases.Cubes.Commands.Create;
using App.Kuby.UseCases.Cubes.Queries.GetAll;
using Mediator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Swashbuckle.AspNetCore.Filters;

namespace API.Kuby.Controller;

[Route("api/cubes")]
[ApiController]
public class CubeController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<CubeController> _logger;

    public CubeController(IMediator mediator, ILogger<CubeController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    //[HttpGet("search")]
    //public async Task<ActionResult<List<WeatherForecast>>> GetAllAsync(CancellationToken token)
    //{

    //}

    //FIXME: just test, delete later
    [HttpGet("{cubeBookingId:int}")]
    public async Task<ActionResult<int>> GetAsync([FromRoute, BindRequired] int cubeBookingId, CancellationToken token)
    {
        var query = new GetCubeBookingQuery(cubeBookingId);
        var result = await _mediator.Send<CubeBookingReadResult>(query);

        return Ok(result);
    }

    [HttpPost("times")]
    [SwaggerResponseHeader(StatusCodes.Status201Created, "times created", "ids", "")]
    public async Task<ActionResult<int>> PostAsync([FromBody] IReadOnlyCollection<TimeModel> timeModels, CancellationToken token)
    {
        try
        {
            var query = new CreateCubeTimesCommand([.. timeModels.Select(CubeTimeMapping.MapToDomainModel)]);
            var result = await _mediator.Send<IReadOnlyCollection<int>>(query, token);
            return Ok(result);
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPost("search")]
    [SwaggerResponseHeader(StatusCodes.Status201Created, "Times succesfully retreived", nameof(List<TimeViewModel>), "")]
    public async Task<ActionResult<int>> GetAllAsync([FromBody] CubeTimeSearchModel searchModel, CancellationToken token)
    {
        try
        {
            var query = new GetAllCubeTimesQuery(searchModel.DateFrom, searchModel.DateTo);
            var result = await _mediator.Send<IReadOnlyCollection<CubeTimeReadAllResult>>(query, token);
            var viewModels = result.Select(r => r.MapToViewModel()).ToList();
            return Ok(viewModels);
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
