using App.Kuby.UseCases.Icons.Commands.Process;

namespace App.Kuby.Interfaces.Services;

public interface IIconTransformationService
{
    IReadOnlyCollection<string> TransformIcons(IReadOnlyCollection<IconFile> iconFiles);
}
