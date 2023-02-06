namespace OMDB.Models.MovieDTO
{
    public class SimilarMovieModel
    {
        public int movieId { get; set; }
        public double cosSim { get; set; }
        public double pearSim { get; set; }
        public double jaccSim { get; set; }
    }
}
