using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OMDB.Data;
using OMDB.Models.Authentication;
using OMDB.Models.MovieDomain;
using OMDB.Models.MovieDTO.Rating;
using System.Data;
using System.Net;
using System.Security.Policy;

namespace OMDB.Controllers
{
    [EnableCors("AllowAllHeaders")]
    [Route("api/[controller]")]
    [ApiController]
    public class MovieRatingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MovieRatingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // index
        [HttpGet]
        [Route("get-ratings")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRatings()
        {
            var ratings = _context.Ratings;
            var links = _context.Links;
            var movies = _context.Movies;
            var latestRatings = await (from r in ratings
                                       join l in links
                                       on r.MovieId equals l.MovieId
                                       join m in movies
                                       on r.MovieId equals m.MovieId
                                       orderby r.Id descending
                                       select new
                                       {
                                           r.Id,
                                           l.TmdbId,
                                           r.MovieId,
                                           m.Title,
                                           r.UserId,
                                           r.Rating,
                                           r.Timestamp
                                       })
                                       .Take(20)
                                       .ToListAsync();

            return Ok(latestRatings);
        }

        // create or update rating
        [HttpPost]
        [Route("give-rating")]
        [Authorize]
        public async Task<IActionResult> GiveRating(GiveRatingModel ratingModel)
        {
            var ratings = _context.Ratings;
            var links = _context.Links;
            var movies = _context.Movies;
            var movieExists = await (from m in movies
                                     join l in links
                                     on m.MovieId equals l.MovieId
                                     where l.TmdbId == ratingModel.TmdbId
                                     select new
                                     {
                                         l.TmdbId,
                                         m.MovieId,
                                         m.Title
                                     }).FirstOrDefaultAsync();

            // insert the movie if movie does not exists in the database
            // then insert the rating record
            if (movieExists == null)
            {
                // download the image file to wwwroot/posters
                WebClient client = new WebClient();
                string url = ratingModel.MoviePosterUrl;
                string posterPath = url.Split("/").Last();
                var fullPosterPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\public\\posters", posterPath);
                client.DownloadFileAsync(new Uri(url), fullPosterPath);

                var movie = new MovieModel()
                {
                    Title = ratingModel.MovieTitle,
                    Genres = ratingModel.MovieGenres,
                    PosterPath = posterPath,
                    Description = ratingModel.MovieDescription,
                    Link = new LinkModel()
                    {
                        ImdbId = null,
                        TmdbId = ratingModel.TmdbId
                    }
                };

                await _context.Movies.AddAsync(movie);
                await _context.SaveChangesAsync();

                var ratedMovie = await links.FirstOrDefaultAsync(l => l.TmdbId == ratingModel.TmdbId);
                var rating = new RatingModel()
                {
                    UserId = ratingModel.UserId,
                    MovieId = ratedMovie!.MovieId,
                    Rating = ratingModel.Rating,
                    Timestamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds()
                };

                await _context.Ratings.AddAsync(rating);
                await _context.SaveChangesAsync();

                return Ok(rating);
            }

            // if movie exists in the database, insert the rating record according to the movie id
            if (movieExists != null)
            {
                var userPrevRating = await ratings.FirstOrDefaultAsync(r => r.MovieId == movieExists.MovieId && r.UserId == ratingModel.UserId);

                // insert new rating record if user never rated the movie
                if (userPrevRating == null)
                {
                    var rating = new RatingModel()
                    {
                        UserId = ratingModel.UserId,
                        MovieId = movieExists.MovieId,
                        Rating = ratingModel.Rating,
                        Timestamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds()
                    };

                    await _context.Ratings.AddAsync(rating);
                    await _context.SaveChangesAsync();

                    return Ok(rating);
                }
                
                // update the rating record if user rated the movie before
                if (userPrevRating != null)
                {
                    var userCurrRating = userPrevRating;
                    userCurrRating.Rating = ratingModel.Rating;

                    await _context.SaveChangesAsync();

                    return Ok(userCurrRating);
                }
                
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Invalid operation" });
        }

        // get user's previous rating
        [HttpGet]
        [Route("get-rating/{tmdbId:int}/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetRating([FromRoute] int tmdbId, [FromRoute] string userId)
        {
            var ratings = _context.Ratings;
            var links = _context.Links;
            var movies = _context.Movies;
            var userPrevRating = await (from r in ratings
                                        join l in links
                                        on r.MovieId equals l.MovieId
                                        join m in movies
                                              on r.MovieId equals m.MovieId
                                        where l.TmdbId == tmdbId & r.UserId == userId
                                        select new
                                        {
                                            r.Id,
                                            l.TmdbId,
                                            r.MovieId,
                                            m.Title,
                                            r.UserId,
                                            r.Rating,
                                            r.Timestamp
                                        }).FirstOrDefaultAsync();

            if (userPrevRating == null)
            {
                return Ok(new Response { Status = "Success", Message = "User never rated this movie" });
            }

            return Ok(userPrevRating);
        }

        // get all ratings from specific user
        [HttpGet]
        [Route("get-user-ratings/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetUserRatings([FromRoute] string userId)
        {
            var ratings = _context.Ratings;
            var links = _context.Links;
            var movies = _context.Movies;
            var userRatings = await (from r in ratings
                                        join l in links
                                        on r.MovieId equals l.MovieId
                                        join m in movies
                                        on r.MovieId equals m.MovieId
                                        where r.UserId == userId
                                        select new
                                        {
                                            r.Id,
                                            l.TmdbId,
                                            r.MovieId,
                                            m.Title,
                                            r.UserId,
                                            r.Rating,
                                            r.Timestamp
                                        }).ToListAsync();

            if (userRatings == null)
            {
                return Ok(new Response { Status = "Success", Message = "User never rated any movies" });
            }

            return Ok(userRatings);
        }
    }
}
