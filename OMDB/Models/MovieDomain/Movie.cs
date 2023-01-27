using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OMDB.Models.MovieDomain;

public partial class Movie
{
    [Key]
    public int MovieId { get; set; }

    public string? Title { get; set; }

    public string? Genres { get; set; }

    public virtual Link? Link { get; set; }

    [NotMapped]
    public virtual Link MovieNavigation { get; set; } = null!;
}
