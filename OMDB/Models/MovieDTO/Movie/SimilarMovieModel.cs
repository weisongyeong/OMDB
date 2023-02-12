namespace OMDB.Models.MovieDTO.Movie
{
    public class SimilarMovieModel
    {
        public int? movieId { get; set; }
        public string title { get; set; }
        public double cosSim { get; set; }
        public double pearSim { get; set; }
        public double jaccSim { get; set; }
    }
}
