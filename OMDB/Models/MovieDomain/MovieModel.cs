using System;
using System.Collections.Generic;

namespace OMDB.Models.MovieDomain;

public partial class MovieModel
{
    public int MovieId { get; set; }

    public string Title { get; set; } = null!;

    public string Genres { get; set; } = null!;
}
