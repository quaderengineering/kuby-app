using API.Kuby.Models.Icon;
using App.Kuby.UseCases.Icons.Commands.Process;
using Mediator;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Filters;

namespace API.Kuby.Controller;

[Route("api/icons")]
[ApiController]
public class IconController : ControllerBase
{
    private readonly IMediator _mediator;

    public IconController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("process")]
    [SwaggerResponseHeader(StatusCodes.Status201Created, "icons transformed", nameof(List<string>), "")]
    public async Task<ActionResult<List<string>>> ProcessIconsAsync([FromForm] IFormFileCollection files)
    {
        var iconFiles = files.Select(f => new IconFile(f.FileName, f.OpenReadStream())).ToList();
        var command = new ProcessIconsCommand(iconFiles);

        var result = await _mediator.Send<IReadOnlyCollection<string>>(command);

        return Ok(result);
    }
}
