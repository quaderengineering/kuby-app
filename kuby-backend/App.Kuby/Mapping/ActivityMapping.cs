using Domain.Kuby.Models;

namespace App.Kuby.Mapping;

internal static class ActivityMapping
{
    public static void MapToOriginal(this Activity destination, Activity source)
    {
        destination.Label = source.Label;
    }
}
