using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OMDB.Models.MovieDomain;

public partial class Rating
{
    public string UserId { get; set; } = null!;

    public int MovieId { get; set; }

    public double? Rating1 { get; set; }

    public long? Timestamp { get; set; }

    [Key]
    public int Id { get; set; }
}
