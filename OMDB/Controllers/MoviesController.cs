using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OMDB.Data;
using OMDB.Models.MovieDomain;

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

        [HttpGet]
        [Route("GetMoviesRecommendation")]
        public async Task<IActionResult> GetMoviesRecommendation()
        {
            List<Rating> list = await _context.Ratings.ToListAsync();

            return StatusCode(StatusCodes.Status200OK, list);
        }
    }
}
