using System;
using System.Collections.Generic;

namespace OMDB.Models.MovieDomain;

public partial class SettingModel
{
    public int Id { get; set; }

    public string SimilarityAlgorithm { get; set; } = null!;

    public int SampleNum { get; set; }
}
