using API.Kuby.Mapping;
using API.Kuby.Models.Activity;
using App.Kuby.UseCases.Activities.Commands.Create;
using App.Kuby.UseCases.Activities.Commands.Import;
using App.Kuby.UseCases.Activities.Commands.Update;
using App.Kuby.UseCases.Activities.Queries.GetAll;
using FluentValidation;
using Mediator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Swashbuckle.AspNetCore.Filters;

namespace API.Kuby.Controller;

[Route("api/activities")]
[ApiController]
public class ActivityController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ActivityController> _logger;

    public ActivityController(IMediator mediator, ILogger<ActivityController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost]
    [SwaggerResponseHeader(StatusCodes.Status201Created, "activity created", "int", "")]
    [SwaggerResponseHeader(StatusCodes.Status400BadRequest, "Validation errors occured", nameof(ValidationException), "")]
    public async Task<ActionResult<int>> PostAsync([FromBody] IReadOnlyCollection<ActivityModel> activityModels, CancellationToken token)
    {
        var query = new CreateActivitiesCommand([.. activityModels.Select(ActivityMapping.MapToDomainModel)]);
        var result = await _mediator.Send<IReadOnlyCollection<Guid>>(query, token);
        return Ok(result);
    }

    [HttpPut("{activityId:guid}")]
    [SwaggerResponseHeader(StatusCodes.Status204NoContent, "activity updated", "", "")]
    [SwaggerResponseHeader(StatusCodes.Status400BadRequest, "Validation errors occured", nameof(ValidationException), "")]
    public async Task<ActionResult<int>> PutAsync([FromRoute] Guid activityId, [FromBody, BindRequired] ActivityModel activityModel, CancellationToken token)
    {
        if (activityModel.ActivityId != activityId)
            return BadRequest("The id in the route does not match the id in the body.");

        var query = new UpdateActivityCommand(activityModel.MapToDomainModel());
        var result = await _mediator.Send(query, token);
        return NoContent();
    }

    [HttpDelete("{activityId:guid}")]
    [SwaggerResponseHeader(StatusCodes.Status204NoContent, "activity deleted", "", "")]
    [SwaggerResponseHeader(StatusCodes.Status400BadRequest, "Validation errors occured", nameof(ValidationException), "")]
    public async Task<ActionResult<int>> DeleteAsync([FromRoute] Guid activityId, CancellationToken token)
    {
        var query = new DeleteActivityCommand(activityId);
        var result = await _mediator.Send(query, token);
        return NoContent();
    }

    [HttpPost("import-cube-data")]
    [SwaggerResponseHeader(StatusCodes.Status201Created, "activity created", nameof(CubeImportResult), "")]
    [SwaggerResponseHeader(StatusCodes.Status400BadRequest, "Validation errors occured", nameof(ValidationException), "")]
    public async Task<ActionResult<CubeImportResult>> ImportCubeDataAsync([FromBody] IReadOnlyCollection<ActivityModel> activityModels, CancellationToken token)
    {
        var query = new ImportActivitiesCommand(activityModels.Select(a => a.MapToDomainModel()).ToList());
        var result = await _mediator.Send<IReadOnlyCollection<int>>(query, token);
        return Ok(result);
    }

    [HttpPost("search")]
    [SwaggerResponseHeader(StatusCodes.Status201Created, "activities succesfully retreived", nameof(List<ActivityViewModel>), "")]
    [SwaggerResponseHeader(StatusCodes.Status400BadRequest, "Validation errors occured", nameof(ValidationException), "")]
    public async Task<ActionResult<List<ActivityViewModel>>> GetAllAsync([FromBody] ActivitySearchModel searchModel, CancellationToken token)
    {
        var query = new GetAllActivitiesQuery(searchModel.DateFrom, searchModel.DateTo);
        var result = await _mediator.Send<IReadOnlyCollection<ActivityReadAllResult>>(query, token);
        var viewModels = result.Select(r => r.MapToViewModel()).ToList();
        return Ok(viewModels);
    }
}
