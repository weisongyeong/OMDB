using System;
using System.Collections.Generic;

namespace OMDB.Models.MovieDomain;

public class Movie
{
    public int MovieId { get; set; }

    public string? Title { get; set; }

    public string? Genres { get; set; }
}
