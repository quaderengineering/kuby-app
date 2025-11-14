using App.Kuby.UseCases.Icons.Commands.Process;

namespace App.Kuby.Interfaces.Services;

public interface IIconTransformationService
{
    string TransformIcons(IReadOnlyCollection<IconFile> iconFiles);
}
