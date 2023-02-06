using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.EntityFrameworkCore;
using OMDB.Data;
using OMDB.Models.Authentication;
using OMDB.Models.MovieDomain;
using OMDB.Models.MovieDTO;
using System.Data;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using static System.Net.Mime.MediaTypeNames;

namespace OMDB.Controllers
{
    [EnableCors("AllowAllHeaders")]
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MoviesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // index
        [HttpGet]
        [Route("get-movies")]
        [Authorize]
        public async Task<IActionResult> GetMovies()
        {
            var movies = _context.Movies;
            var newMovies = await (from movie in movies
                                   orderby movie.MovieId descending
                                   select movie)
                                .Take(10)
                                .ToListAsync();

            return Ok(newMovies);
        }

        // create
        [HttpPost]
        [Route("insert-movie")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> InsertMovie(MovieModel movieModel)
        {
            var movie = new MovieModel()
            {
                Title = movieModel.Title,
                Genres = movieModel.Genres
            };

            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();

            return Ok(new Response { Status = "Success", Message = "Movie inserted Successfully" });
        }

        // update
        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMovie([FromRoute] int id, UpdateMovieModel movieModel)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie != null)
            {
                movie.Title = movieModel.Title;
                movie.Genres = movieModel.Genres;

                await _context.SaveChangesAsync();

                return Ok(movie);
            }

            // return status code 404
            return NotFound();
        }

        // delete
        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMovie([FromRoute] int id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie != null)
            {
                _context.Remove(movie);
                await _context.SaveChangesAsync();
                return Ok(new Response { Status = "Success", Message = "Movie Deleted Successfully" });
            }

            // return status code 404
            return NotFound();
        }

        [HttpGet]
        [Route("{tmdbId:int}")]
        [Authorize]
        public async Task<IActionResult> GetMovieRecommendation([FromRoute] int tmdbId)
        {
            // data cleaning for same movie rated twice by same user
            var ratings = _context.Ratings;
            var cleanedDSet = await (from r in ratings
                               group r by new { r.UserId, r.MovieId }
                               into movieGroup
                               select new
                               {
                                   movieGroup.Key.UserId,
                                   movieGroup.Key.MovieId,
                                   rating = (from r in movieGroup
                                             select r.Rating).Average()
                               }).ToListAsync();


            // convert tmdb id to the corresding movie id in the database
            var tmdbLinks = _context.Links;
            var selectedMovieId = await (from l in tmdbLinks
                                         where l.TmdbId == tmdbId 
                                         select l.MovieId).FirstOrDefaultAsync();

            // return status code 500 if corresponding movie does not exist
            if(selectedMovieId == null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "The corresponding movie id does not exists" });

            // find out all the users who rated the movie and also other movies they rated
            var usersRatedTheMovie = (from user in cleanedDSet
                                      where user.MovieId == selectedMovieId
                                      select new
                                      {
                                          user.UserId,
                                          user.MovieId,
                                          user.rating
                                      });

            // get only users who rated the other specific movies
            var otherMovieRatedBySelectedUsers = (from movie in cleanedDSet
                                                 join user in usersRatedTheMovie
                                                 on movie.UserId equals user.UserId
                                                 where movie.MovieId != selectedMovieId
                                                 group movie by movie.MovieId
                                                 into movieTemp
                                                 select new
                                                 {
                                                     movieId = movieTemp.Key,
                                                     userIdWithRating = (from r in movieTemp
                                                                         select new
                                                                         {
                                                                             r.UserId,
                                                                             r.rating
                                                                         })
                                                 });

            // group the target movie id with each of the other movies on users who rated both
            var ratingGroups = new List<Tuple<int, List<double>, List<double>>>();
            foreach (var movie in otherMovieRatedBySelectedUsers)
            {
                var mId = movie.movieId;
                var moviefilteredOnMovieId = (from m in usersRatedTheMovie
                                              join r in movie.userIdWithRating
                                              on m.UserId equals r.UserId
                                              select m.rating).ToList();
                var filteredOnMovieId = (from m in usersRatedTheMovie
                                         join r in movie.userIdWithRating
                                         on m.UserId equals r.UserId
                                         select r.rating).ToList();
                ratingGroups.Add(Tuple.Create(mId, moviefilteredOnMovieId, filteredOnMovieId));
            }

            // Calculate the 3 similarity indices for each of the group
            List<SimilarMovieModel> similar = new List<SimilarMovieModel>();
            foreach (var rating in ratingGroups)
            {
                if (rating.Item3.Count < 20)
                    continue;
                double cosSimIndex = CosSimilarity(rating.Item2, rating.Item3);
                double pearSimIndex = PearsCorrSimilarity(rating.Item2, rating.Item3);
                double jaccSimIndex = JaccSimilarity(rating.Item2, rating.Item3);
                similar.Add(
                    new SimilarMovieModel
                    {
                        movieId = rating.Item1,
                        cosSim = cosSimIndex,
                        pearSim = pearSimIndex,
                        jaccSim = jaccSimIndex
                    });
            }

            // find out the top 20 similar movies and push their respective titles and genres to the list
            var topSimilar = (from s in similar
                              orderby -s.pearSim
                              select s.movieId).Take(20).ToList();
            var foundTopSimilar = new List<MovieModel>();
            foreach (var simId in topSimilar)
            {
                var movie = await _context.Movies.FindAsync(simId);
                if (movie != null)
                    foundTopSimilar.Add(movie);
            }

            return Ok(foundTopSimilar);
        }


        // Jaccard Similarity index
        public static double JaccSimilarity(List<double> targetMovie, List<double> comparedMovie)
        {
            int i = 0;
            int end = targetMovie.Count;
            double interceptCount = 0;

            do
            {
                if (targetMovie[i] == comparedMovie[i])
                    interceptCount++;
                i++;
            } while (i < end);

            double unionCount = targetMovie.Count + comparedMovie.Count - interceptCount;

            return interceptCount / unionCount;
        }

        // Pearson Correlation Coefficient
        public static double PearsCorrSimilarity(List<double> targetMovie, List<double> comparedMovie)
        {
            double meanTargetMovie = targetMovie.Average();
            double meanComparedMovie = comparedMovie.Average();
            double sum1 = 0;
            double sum2 = 0;
            double sum3 = 0;

            foreach (double rating in targetMovie)
            {
                sum1 += Math.Pow(rating - meanTargetMovie, 2);
            }
            foreach (double rating in comparedMovie)
            {
                sum2 += Math.Pow(rating - meanComparedMovie, 2);
            }

            int i = 0;
            int end = targetMovie.Count;
            do
            {
                sum3 += (targetMovie[i] - meanTargetMovie) * (comparedMovie[i] - meanComparedMovie);
                i++;
            } while (i < end);

            return sum3 / Math.Pow(sum1 * sum2, 0.5);
        }


        // Cosine Similarity Index
        public static double CosSimilarity(List<double> targetMovie, List<double> comparedMovie)
        {
            double sum1 = 0;
            double sum2 = 0;
            double sum3 = 0;

            foreach (double rating in targetMovie)
            {
                sum1 += Math.Pow(rating, 2);
            }

            foreach (double rating in comparedMovie)
            {
                sum2 += Math.Pow(rating, 2);
            }

            int i = 0;
            int end = targetMovie.Count;
            do
            {
                sum3 += targetMovie[i] * comparedMovie[i];
                i++;
            } while (i < end);

            return sum3 / (Math.Pow(sum1, 0.5) * Math.Pow(sum2, 0.5));
        }

    }
}
