using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Kuby.Models;

public class Display
{
    [Required]
    public int DisplayId { get; set; }

    [Required]
    public int ModeId { get; set; }

    [AllowNull]
    public TimeOnly? Time {  get; set; }

    [Required]
    public string Icon { get; set; } = string.Empty;
}
