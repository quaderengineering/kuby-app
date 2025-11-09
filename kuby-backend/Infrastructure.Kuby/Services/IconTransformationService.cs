using App.Kuby.Interfaces.Services;
using App.Kuby.UseCases.Icons.Commands.Process;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace Infrastructure.Kuby.Services;

public class IconTransformationService : IIconTransformationService
{
    public IReadOnlyCollection<string> TransformIcons(IReadOnlyCollection<IconFile> iconFiles)
    {
        var base64Strings = new List<string>();
        foreach (var file in iconFiles)
        {
            using var img = Image.Load(file.Stream);

            img.Mutate(x => x.Resize(240, 240).Grayscale());

            // Convert to byte array (or 1-bit bitmap)
            using var output = new MemoryStream();
            img.SaveAsBmp(output);
            var bytes = output.ToArray();

            base64Strings.Add(Convert.ToBase64String(bytes));
        }

       return base64Strings;
    }
}
