using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OMDB.Data;
using System.Data;

namespace OMDB.Controllers
{
    [EnableCors("AllowAllHeaders")]
    [Route("api/[controller]")]
    [ApiController]
    public class MovieLinksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MovieLinksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // index
        [HttpGet]
        [Route("get-links")]
        public async Task<IActionResult> GetLinks()
        {
            var links = _context.Links;
            var movies = _context.Movies;
            var lastFewMovieLinks = await (from link in links
                                           join movie in movies
                                           on link.MovieId equals movie.MovieId
                                           orderby link.MovieId descending
                                           select new
                                           {
                                               link.TmdbId,
                                               link.MovieId,
                                               movie.Title
                                           })
                                           .Take(10)
                                           .ToListAsync();

            return Ok(lastFewMovieLinks);
        }
    }
}
