using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OMDB.Data;
using OMDB.Models.Authentication;
using OMDB.Models.MovieDomain;
using OMDB.Models.MovieDTO.Favourite;
using OMDB.Models.MovieDTO.Rating;
using System.Data;
using System.Net;

namespace OMDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavouritesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FavouritesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // index
        [HttpGet]
        [Route("get-all-favourites")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetFavourites()
        {
            var favourites = _context.Favourites;
            var links = _context.Links;
            var movies = _context.Movies;
            var latestFavourites = await (from f in favourites
                                       join l in links
                                       on f.MovieId equals l.MovieId
                                       join m in movies
                                       on f.MovieId equals m.MovieId
                                       orderby f.Id descending
                                       select new
                                       {
                                           f.Id,
                                           l.TmdbId,
                                           f.MovieId,
                                           m.Title,
                                           f.UserId
                                       })
                                       .Take(20)
                                       .ToListAsync();

            return Ok(latestFavourites);
        }

        // update user favourites
        [HttpPost]
        [Route("update-user-favourites")]
        [Authorize]
        public async Task<IActionResult> UpdateFavourites(UpdateFavouritesModel favouriteModel)
        {
            var favourites = _context.Favourites;
            var links = _context.Links;
            var movies = _context.Movies;

            var movieExists = await (from m in movies
                                     join l in links
                                     on m.MovieId equals l.MovieId
                                     where l.TmdbId == favouriteModel.TmdbId
                                     select new
                                     {
                                         l.TmdbId,
                                         m.MovieId,
                                         m.Title
                                     }).FirstOrDefaultAsync();

            // insert the movie if movie does not exists in the database
            // then add it to new user's favourites
            if (movieExists == null)
            {
                // download the image file to wwwroot/posters
                WebClient client = new WebClient();
                string url = favouriteModel.MoviePosterUrl;
                string posterPath = url.Split("/").Last();
                var fullPosterPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\public\\posters", posterPath);
                client.DownloadFileAsync(new Uri(url), fullPosterPath);

                var movie = new MovieModel()
                {
                    Title = favouriteModel.MovieTitle,
                    Genres = favouriteModel.MovieGenres,
                    PosterPath = posterPath,
                    Description = favouriteModel.MovieDescription,
                    Link = new LinkModel()
                    {
                        ImdbId = null,
                        TmdbId = favouriteModel.TmdbId
                    }
                };

                await _context.Movies.AddAsync(movie);
                await _context.SaveChangesAsync();

                var favMovie = await links.FirstOrDefaultAsync(l => l.TmdbId == favouriteModel.TmdbId);
                var favourite = new FavouriteModel()
                {
                    UserId = favouriteModel.UserId,
                    MovieId = favMovie!.MovieId
                };

                await _context.Favourites.AddAsync(favourite);
                await _context.SaveChangesAsync();

                return Ok(favourite);
            }

            // if movie exists in the database, check user intention to add favourite or remove favourite
            if (movieExists != null)
            {
                var isUserFavourite = await favourites.FirstOrDefaultAsync(r => r.MovieId == movieExists.MovieId && r.UserId == favouriteModel.UserId);

                // add favourite if it's not user favourite
                if (isUserFavourite == null)
                {
                    var newFavourite = new FavouriteModel()
                    {
                        UserId = favouriteModel.UserId,
                        MovieId = movieExists.MovieId,
                    };

                    await _context.Favourites.AddAsync(newFavourite);
                    await _context.SaveChangesAsync();

                    return Ok(newFavourite);
                }

                // remove it from user's favourites if it used to be user's favourite movie
                if (isUserFavourite != null)
                {
                    var favourite = isUserFavourite;
                    _context.Remove(favourite);
                    await _context.SaveChangesAsync();
                    return Ok(favourite);
                }
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Invalid operation" });
        }

        // get user's favourites
        [HttpGet]
        [Route("get-user-favourites/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetUserFavourites([FromRoute] string userId)
        {
            var favourites = _context.Favourites;
            var links = _context.Links;
            var movies = _context.Movies;
            var latestfavourites = await (from f in favourites
                                          join l in links
                                          on f.MovieId equals l.MovieId
                                          join m in movies
                                          on f.MovieId equals m.MovieId
                                          where f.UserId == userId
                                          orderby f.Id descending
                                          select new
                                          {
                                              f.Id,
                                              l.TmdbId,
                                              f.MovieId,
                                              f.UserId,
                                              m.Title,
                                              m.Genres,
                                              m.PosterPath,
                                              m.Description
                                          })
                                       .Take(20)
                                       .ToListAsync();

            return Ok(latestfavourites);
        }

        // check if the specific movie is user's favourite movie
        [HttpGet]
        [Route("user-favourite/{tmdbId:int}/{userId}")]
        [Authorize]
        public async Task<IActionResult> IsUserFavourite([FromRoute] int tmdbId, [FromRoute] string userId)
        {
            var favourites = _context.Favourites;
            var links = _context.Links;
            var movies = _context.Movies;
            var isUserFavourite = await (from f in favourites
                                        join l in links
                                        on f.MovieId equals l.MovieId
                                        join m in movies
                                        on f.MovieId equals m.MovieId
                                        where l.TmdbId == tmdbId && f.UserId == userId
                                         select new
                                         {
                                             f.Id,
                                             l.TmdbId,
                                             f.MovieId,
                                             f.UserId,
                                             m.Title,
                                             m.Genres,
                                             m.PosterPath,
                                             m.Description
                                         }).FirstOrDefaultAsync();

            if (isUserFavourite == null)
            {
                return Ok(new Response { Status = "Success", Message = "This movie is not user's favourite" });
            }

            return Ok(isUserFavourite);
        }
    }
}
