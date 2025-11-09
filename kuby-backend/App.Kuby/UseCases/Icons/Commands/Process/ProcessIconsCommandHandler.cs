using App.Kuby.Interfaces.Services;
using Mediator;

namespace App.Kuby.UseCases.Icons.Commands.Process;

public class ProcessIconsCommandHandler : IRequestHandler<ProcessIconsCommand, IReadOnlyCollection<string>>
{
    private readonly IIconTransformationService _iconTransformationService;

    public ProcessIconsCommandHandler(IIconTransformationService iconTransformationService)
    {
        _iconTransformationService = iconTransformationService;
    }

    public ValueTask<IReadOnlyCollection<string>> Handle(ProcessIconsCommand request, CancellationToken cancellationToken)
    {
        return ValueTask.FromResult(_iconTransformationService.TransformIcons(request.IconFiles));
    }
}
