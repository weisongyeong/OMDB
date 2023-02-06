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
            builder.Entity<LinkModel>(entity =>
            {
                entity.HasKey(e => e.MovieId).HasName("PK_Links");

                entity.Property(e => e.MovieId)
                    .HasColumnName("movieId");
                entity.Property(e => e.ImdbId).HasColumnName("imdbId");
                entity.Property(e => e.TmdbId).HasColumnName("tmdbId");
            });

            builder.Entity<MovieModel>(entity =>
            {
                entity.HasKey(e => e.MovieId).HasName("PK_Movies");

                entity.Property(e => e.MovieId)
                    .HasColumnName("movieId");
                entity.Property(e => e.Genres).HasColumnName("genres");
                entity.Property(e => e.Title).HasColumnName("title");
            });

            builder.Entity<RatingModel>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("pk_Ratings_Id");

                entity.Property(e => e.MovieId).HasColumnName("movieId");
                entity.Property(e => e.Rating).HasColumnName("rating");
                entity.Property(e => e.Timestamp).HasColumnName("timestamp");
                entity.Property(e => e.UserId).HasColumnName("userId");
            });

            base.OnModelCreating(builder);
        }

        public virtual DbSet<LinkModel> Links { get; set; }

        public virtual DbSet<MovieModel> Movies { get; set; }

        public virtual DbSet<RatingModel> Ratings { get; set; }


    }
}