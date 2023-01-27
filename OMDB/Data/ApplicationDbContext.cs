using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OMDB.Models.Authentication;
using OMDB.Models.MovieDomain;
using System.Reflection.Emit;

namespace OMDB.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

        public DbSet<Link> Links { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Rating> Ratings { get; set; }
    }
}