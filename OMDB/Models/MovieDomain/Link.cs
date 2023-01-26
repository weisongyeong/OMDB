using System;
using System.Collections.Generic;

namespace OMDB.Models.MovieDomain;

public class Link
{
    public int MovieId { get; set; }

    public string? ImdbId { get; set; }

    public string? Tmdbid { get; set; }
}
