using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OMDB.Models.MovieDomain;

public partial class Link
{
    [Key]
    public int MovieId { get; set; }

    public string? ImdbId { get; set; }

    public string? Tmdbid { get; set; }

    public virtual Movie Movie { get; set; } = null!;

    [NotMapped]
    public virtual Movie? MovieNavigation { get; set; }
}
