using System;
using System.Collections.Generic;

namespace OMDB.Models.MovieDomain;

public partial class LinkModel
{
    public int MovieId { get; set; }

    public int ImdbId { get; set; }

    public int? TmdbId { get; set; }
}
