using System;
using System.Collections.Generic;

namespace OMDB.Models.MovieDomain;

public partial class MovieModel
{
    public int MovieId { get; set; }

    public string Title { get; set; } = null!;

    public string Genres { get; set; } = null!;

    public string? PosterPath { get; set; }

    public string? Description { get; set; }

    public virtual LinkModel? Link { get; set; }

    public virtual ICollection<RatingModel> Ratings { get; } = new List<RatingModel>();
}
