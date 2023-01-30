using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.EntityFrameworkCore;
using OMDB.Data;
using OMDB.Models.Authentication;
using OMDB.Models.MovieDomain;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using static System.Net.Mime.MediaTypeNames;

namespace OMDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MoviesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Route("insert-movie")]
        public async Task<IActionResult> InsertMovieRatings(CustomMovieRatingModel ratingModel)
        {
            var rating = new CustomMovieRatingModel()
            {
                Movie1Rating = ratingModel.Movie1Rating,
                Movie2Rating = ratingModel.Movie2Rating,
                Movie3Rating = ratingModel.Movie3Rating,
                Movie4Rating = ratingModel.Movie4Rating,
                Movie5Rating = ratingModel.Movie5Rating,
                Movie6Rating = ratingModel.Movie6Rating,
                Movie7Rating = ratingModel.Movie7Rating,
                Movie8Rating = ratingModel.Movie8Rating,
                Movie9Rating = ratingModel.Movie9Rating,
                Movie10Rating = ratingModel.Movie10Rating,
                Movie11Rating = ratingModel.Movie11Rating,
                Movie12Rating = ratingModel.Movie12Rating,
                Movie13Rating = ratingModel.Movie13Rating,
                Movie14Rating = ratingModel.Movie14Rating,
                Movie15Rating = ratingModel.Movie15Rating,
                Movie16Rating = ratingModel.Movie16Rating,
                Movie17Rating = ratingModel.Movie17Rating,
                Movie18Rating = ratingModel.Movie18Rating,
                Movie19Rating = ratingModel.Movie19Rating,
                Movie20Rating = ratingModel.Movie20Rating
            };

            await _context.CustomMovieRatings.AddAsync(rating);
            await _context.SaveChangesAsync();

            return Ok(rating);
        }

    }
}
