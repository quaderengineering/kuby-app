using System.ComponentModel.DataAnnotations;

namespace Domain.Kuby.Models;

public class CubeBooking
{
    [Required]
    public int CubeBookingId { get; set; }
}
