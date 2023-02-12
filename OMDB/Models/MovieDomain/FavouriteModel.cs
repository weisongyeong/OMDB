using System;
using System.Collections.Generic;

namespace OMDB.Models.MovieDomain;

public partial class FavouriteModel
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public int MovieId { get; set; }
}
