using System;
using System.Collections.Generic;

namespace OMDB.Models.MovieDomain;

public partial class RatingModel
{
    public int Id { get; set; }

    public string UserId { get; set; }

    public int MovieId { get; set; }

    public double Rating { get; set; }

    public long? Timestamp { get; set; }
}
