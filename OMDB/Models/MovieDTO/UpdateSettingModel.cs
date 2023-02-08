namespace OMDB.Models.MovieDTO
{
    public class UpdateSettingModel
    {
        public string SimilarityAlgorithm { get; set; } = null!;

        public int SampleNum { get; set; }
    }
}
