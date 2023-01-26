﻿using System;
using System.Collections.Generic;

namespace OMDB.Models.MovieDomain;

public class Rating
{
    public string UserId { get; set; } = null!;

    public int MovieId { get; set; }

    public double? Rating1 { get; set; }

    public long? Timestamp { get; set; }
}
