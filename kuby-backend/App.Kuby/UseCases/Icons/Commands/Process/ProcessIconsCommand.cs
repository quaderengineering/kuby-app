using Mediator;

namespace App.Kuby.UseCases.Icons.Commands.Process;

public record ProcessIconsCommand(IReadOnlyCollection<IconFile> IconFiles) : IRequest<IReadOnlyCollection<string>>;
