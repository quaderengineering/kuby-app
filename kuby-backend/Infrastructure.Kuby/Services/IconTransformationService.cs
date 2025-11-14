using App.Kuby.Interfaces.Services;
using App.Kuby.UseCases.Icons.Commands.Process;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Infrastructure.Kuby.Services;

public class IconTransformationService : IIconTransformationService
{
    public string TransformIcons(IReadOnlyCollection<IconFile> iconFiles) //FIXME
    {
        using var img = Image.Load<Rgba32>(iconFiles.First().Stream); //FIXME

        // Resize to 240x240
        img.Mutate(x => x.Resize(240, 240));

        // Remove alpha by converting to RGB24 (drops the A channel)
        using var rgbImage = img.CloneAs<Rgb24>();

        // Save as 24-bit BMP
        using var output = new MemoryStream();
        rgbImage.SaveAsBmp(output);
        var bytes = output.ToArray();

        return Convert.ToBase64String(bytes);
    }
}
