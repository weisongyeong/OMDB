using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OMDB.Data;
using OMDB.Models.Authentication;
using OMDB.Models.MovieDomain;
using OMDB.Models.MovieDTO;
using System.Data;

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
            var recentRatings = await (from rating in ratings
                                orderby rating.Id descending
                                select rating)
                                .Take(20)
                                .ToListAsync();

            return Ok(recentRatings);
        }

        // create
        [HttpPost]
        [Route("give-rating")]
        [Authorize]
        public async Task<IActionResult> GiveRating(RatingModel ratingModel)
        {
            var rating = new RatingModel()
            {
                UserId = ratingModel.UserId,
                MovieId = ratingModel.MovieId,
                Rating = ratingModel.Rating,
                Timestamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds()
            };

            await _context.Ratings.AddAsync(rating);
            await _context.SaveChangesAsync();

            return Ok(new Response { Status = "Success", Message = "Movie Rated Successfully" });
        }

        // retrieve movie rating from user
        [HttpGet]
        [Route("get-rating/{movieId}")]
        public async Task<IActionResult> GetRating([FromRoute] int movieId, GetRatingModel ratingModel)
        {
            var rating = await _context.Ratings.FirstOrDefaultAsync(r => r.MovieId == movieId && r.UserId == ratingModel.UserId);

            if (rating == null)
            {
                return NotFound();
            }

            return Ok(rating);
        }

        // update rating
        [HttpPut]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> ChangeRating([FromRoute] int id, ChangeRatingModel ratingModel)
        {
            var rating = await _context.Ratings.FindAsync(id);

            if (rating != null)
            {
                rating.Rating = ratingModel.Rating;

                await _context.SaveChangesAsync();

                return Ok(rating);
            }

            return NotFound();
        }

        // delete rating
        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRating([FromRoute] int id)
        {
            var rating = await _context.Ratings.FindAsync(id);

            if (rating != null)
            {
                _context.Remove(rating);
                await _context.SaveChangesAsync();
                return Ok(new Response { Status = "Success", Message = "Movie Rating Record Deleted Successfully" });
            }

            return NotFound();
        }
    }
}
