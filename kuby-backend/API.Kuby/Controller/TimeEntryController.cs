using API.Kuby.Mapping;
using API.Kuby.Models.Activity;
using App.Kuby.UseCases.Activities.Commands.Create;
using App.Kuby.UseCases.Activities.Commands.Import;
using App.Kuby.UseCases.Activities.Commands.Update;
using App.Kuby.UseCases.Activities.Queries.GetAll;
using App.Kuby.UseCases.Common;
using FluentValidation;
using Mediator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Swashbuckle.AspNetCore.Filters;

namespace API.Kuby.Controller;

[Route("api/timeEntries")]
[ApiController]
public class TimeEntryController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ActivityController> _logger;

    public TimeEntryController(IMediator mediator, ILogger<ActivityController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost("search")]
    [SwaggerResponseHeader(StatusCodes.Status201Created, "timeEntries succesfully retreived", nameof(List<ActivityViewModel>), "")]
    [SwaggerResponseHeader(StatusCodes.Status400BadRequest, "Validation errors occured", nameof(ValidationException), "")]
    public async Task<ActionResult<List<ActivityViewModel>>> GetAllAsync([FromBody] ActivityTimeEntrySearchModel searchModel, CancellationToken token)
    {
        var query = new GetAllTimeEntriesQuery(searchModel.DateFrom, searchModel.DateTo);
        var result = await _mediator.Send<IReadOnlyCollection<ActivityReadAllResult>>(query, token);
        var viewModels = result.Select(r => r.MapToViewModel()).ToList();
        return Ok(viewModels);
    }
}
