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

                entity.Property(e => e.MovieId).ValueGeneratedNever().HasColumnName("movieId");

                entity.Property(e => e.ImdbId).HasColumnName("imdbId");
                entity.Property(e => e.TmdbId).HasColumnName("tmdbId");
                entity.HasOne(d => d.Movie).WithOne(p => p.Link)
                    .HasForeignKey<LinkModel>(d => d.MovieId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Links_Movies");
            });

            builder.Entity<MovieModel>(entity =>
            {
                entity.HasKey(e => e.MovieId).HasName("PK_Movies");

                entity.Property(e => e.MovieId).HasColumnName("movieId");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Genres).HasColumnName("genres");
                entity.Property(e => e.PosterPath).HasColumnName("posterPath");
                entity.Property(e => e.Title).HasColumnName("title");
            });

            builder.Entity<RatingModel>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("pk_Ratings_Id");

                entity.Property(e => e.MovieId).HasColumnName("movieId");
                entity.Property(e => e.Rating).HasColumnName("rating");
                entity.Property(e => e.Timestamp).HasColumnName("timestamp");
                entity.Property(e => e.UserId).HasMaxLength(450).HasColumnName("userId");
                entity.HasOne(d => d.Movie).WithMany(p => p.Ratings)
                    .HasForeignKey(d => d.MovieId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Ratings_Movies");
            });

            builder.Entity<SettingModel>(entity =>
            {
                entity.Property(e => e.SimilarityAlgorithm).HasMaxLength(450);
            });

            builder.Entity<FavouriteModel>(entity =>
            {
                entity.Property(e => e.MovieId).HasColumnName("movieId");
                entity.Property(e => e.UserId)
                    .HasMaxLength(450)
                    .HasColumnName("userId");
            });


            base.OnModelCreating(builder);
        }

        public virtual DbSet<LinkModel> Links { get; set; }

        public virtual DbSet<MovieModel> Movies { get; set; }

        public virtual DbSet<RatingModel> Ratings { get; set; }

        public virtual DbSet<SettingModel> Settings { get; set; }

        public virtual DbSet<FavouriteModel> Favourites { get; set; }
    }
}