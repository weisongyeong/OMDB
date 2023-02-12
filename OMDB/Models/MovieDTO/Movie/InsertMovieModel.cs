namespace OMDB.Models.MovieDTO.Movie
{
    public class InsertMovieModel
    {
        public string Title { get; set; } = null!;

        public string Genres { get; set; } = null!;

        public IFormFile Poster { get; set; } = null!;

        public string? Description { get; set; }
    }
}
