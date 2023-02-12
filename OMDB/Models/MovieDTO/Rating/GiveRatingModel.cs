namespace OMDB.Models.MovieDTO.Rating
{
    public class GiveRatingModel
    {
        public int TmdbId { get; set; }
        public string UserId { get; set; } = null!;
        public string MovieTitle { get; set; } = null!;
        public string MovieGenres { get; set; } = null!;
        public string MoviePosterUrl { get; set; } = null!;
        public string MovieDescription { get; set; } = null!;
        public double Rating { get; set; }
    }
}
