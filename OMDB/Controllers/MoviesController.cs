using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Hosting;
using OMDB.Data;
using OMDB.Models.Authentication;
using OMDB.Models.MovieDomain;
using OMDB.Models.MovieDTO.Movie;
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
            var links = _context.Links;
            var latestMovies = await (from movie in movies
                                   join link in links
                                   on movie.MovieId equals link.MovieId
                                   orderby movie.MovieId descending
                                   select new
                                   {
                                       link.TmdbId,
                                       movie.MovieId,
                                       movie.Title,
                                       movie.Genres,
                                       movie.PosterPath,
                                       movie.Description
                                   })
                                .Take(20)
                                .ToListAsync();

            return Ok(latestMovies);
        }

        // create
        [HttpPost]
        [Route("insert-movie")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> InsertMovie(InsertMovieModel movieModel)
        {
            try
            {
                // copy image file to wwwroot/posters
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + movieModel.Poster.FileName;
                var path = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\public\\posters", uniqueFileName);
                await movieModel.Poster.CopyToAsync(new FileStream(path, FileMode.Create));

                var movie = new MovieModel()
                {
                    Title = movieModel.Title,
                    Genres = movieModel.Genres,
                    PosterPath = uniqueFileName,
                    Description = movieModel.Description,
                    Link = new LinkModel()
                    {
                        ImdbId = null,
                        TmdbId = null
                    }
                };

                await _context.Movies.AddAsync(movie);
                await _context.SaveChangesAsync();


                return Ok(new Response { Status = "Success", Message = "Movie inserted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = ex.Message });
            }
        }

        // read
        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetMovie([FromRoute] int id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
            {
                return Ok(new Response { Status = "Success", Message = "Movie not found" });
            }

            return Ok(movie);
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

            return Ok(new Response { Status = "Success", Message = "Movie not found" });
        }

        [HttpGet]
        [Route("reco/{id:int}")]
        [Authorize]
        public async Task<IActionResult> GetMovieRecommendation([FromRoute] int id)
        {
            var ratings = _context.Ratings;
            var tmdbLinks = _context.Links;
            var movies = _context.Movies;
            var setting = await _context.Settings.FindAsync(1);
            int minSampleNum = setting.SampleNum;
            string algorithm = setting.SimilarityAlgorithm;
            
            // merge to rating table with movie table and link table to get the tmdb id and movie title
            // data cleaning for same users rated twice the same movies
            var cleanedDSet = await (from r in ratings
                                     join m in movies
                                     on r.MovieId equals m.MovieId
                                     join l in tmdbLinks
                                     on r.MovieId equals l.MovieId
                                     group r by new { r.UserId, l.TmdbId, m.Title}
                                     into movieGroup
                                     select new
                                     {
                                         movieGroup.Key.UserId,
                                         MovieId = movieGroup.Key.TmdbId,
                                         movieGroup.Key.Title,
                                         rating = (from r in movieGroup
                                                   select r.Rating).Average()
                                     }).ToArrayAsync();

            // find out all the users who rated the movie and also the other movies they rated
            var usersRatedTheMovie = (from user in cleanedDSet
                                      where user.MovieId == id
                                      select new
                                      {
                                          user.UserId,
                                          user.MovieId,
                                          user.Title,
                                          user.rating
                                      });

            // get only users who rated the other specific movies
            var otherMovieRatedBySelectedUsers = (from movie in cleanedDSet
                                                 join user in usersRatedTheMovie
                                                 on movie.UserId equals user.UserId
                                                 where movie.MovieId != id
                                                 group movie by new { movie.MovieId, movie.Title}
                                                 into movieTemp
                                                 select new
                                                 {
                                                     movieTemp.Key.MovieId,
                                                     movieTemp.Key.Title,
                                                     userIdWithRating = (from r in movieTemp
                                                                         select new
                                                                         {
                                                                             r.UserId,
                                                                             r.rating
                                                                         })
                                                 });

            // group the target movie id with each of the other movies on users who rated both
            var ratingGroups = new List<Tuple<int?, string, double[], double[]>>();
            foreach (var movie in otherMovieRatedBySelectedUsers)
            {
                var movieId = movie.MovieId;
                var title = movie.Title;
                var moviefilteredOnMovieId = (from m in usersRatedTheMovie
                                              join r in movie.userIdWithRating
                                              on m.UserId equals r.UserId
                                              select m.rating).ToArray();
                var filteredOnMovieId = (from m in usersRatedTheMovie
                                         join r in movie.userIdWithRating
                                         on m.UserId equals r.UserId
                                         select r.rating).ToArray();
                ratingGroups.Add(Tuple.Create(movieId, title, moviefilteredOnMovieId, filteredOnMovieId));
            }

            // calculate the 3 similarity indices for each of the group
            List<SimilarMovieModel> similar = new List<SimilarMovieModel>();
            foreach (var rating in ratingGroups)
            {
                if (rating.Item3.Length < minSampleNum)
                    continue;
                double cosSimIndex = CosSimilarity(rating.Item3, rating.Item4);
                double pearSimIndex = PearsCorrSimilarity(rating.Item3, rating.Item4);
                double jaccSimIndex = JaccSimilarity(rating.Item3, rating.Item4);
                similar.Add(
                    new SimilarMovieModel
                    {
                        movieId = rating.Item1,
                        title = rating.Item2,
                        cosSim = cosSimIndex,
                        pearSim = pearSimIndex,
                        jaccSim = jaccSimIndex
                    });
            }


            // based on the algorithm, find out the top 20 similar movies and push their respective titles and genres to the list
            List<SimilarMovieModel> topSimilar = new List<SimilarMovieModel>();
            if (algorithm == "Cosine Similarity Index")
            {
                topSimilar = (from s in similar
                                  orderby -s.cosSim
                                  select s).Take(20).ToList();
            }
            if (algorithm == "Jaccard Similarity Index")
            {
                topSimilar = (from s in similar
                                  orderby -s.jaccSim
                                  select s).Take(20).ToList();
            }
            if (algorithm == "Pearson Correlation Coefficient")
            {
                topSimilar = (from s in similar
                                  orderby -s.pearSim
                                  select s).Take(20).ToList();
            }

            return Ok(topSimilar);
        }


        // Jaccard Similarity Index
        public static double JaccSimilarity(double[] targetMovie, double[] comparedMovie)
        {
            int i = 0;
            int end = targetMovie.Length;
            double interceptCount = 0;

            do
            {
                if (targetMovie[i] == comparedMovie[i])
                    interceptCount++;
                i++;
            } while (i < end);

            double unionCount = targetMovie.Length + comparedMovie.Length - interceptCount;

            return interceptCount / unionCount;
        }

        // Pearson Correlation Coefficient
        public static double PearsCorrSimilarity(double[] targetMovie, double[] comparedMovie)
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
            int end = targetMovie.Length;
            do
            {
                sum3 += (targetMovie[i] - meanTargetMovie) * (comparedMovie[i] - meanComparedMovie);
                i++;
            } while (i < end);

            return sum3 / Math.Pow(sum1 * sum2, 0.5);
        }


        // Cosine Similarity Index
        public static double CosSimilarity(double[] targetMovie, double[] comparedMovie)
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
            int end = targetMovie.Length;
            do
            {
                sum3 += targetMovie[i] * comparedMovie[i];
                i++;
            } while (i < end);

            return sum3 / (Math.Pow(sum1, 0.5) * Math.Pow(sum2, 0.5));
        }

    }
}
