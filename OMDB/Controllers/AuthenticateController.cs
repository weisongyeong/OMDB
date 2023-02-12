using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using OMDB.Models.Authentication;
using OMDB.Data;
using Microsoft.EntityFrameworkCore;
using OMDB.Models.MovieDTO;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace OMDB.Controllers
{
    [EnableCors("AllowAllHeaders")]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthenticateController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, ApplicationDbContext context)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await userManager.FindByNameAsync(model.Username);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                var userId = await userManager.GetUserIdAsync(user);
                var userRoles = await userManager.GetRolesAsync(user);

                // write claims for the user
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                // include user role to the claim
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                // define security key
                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                // generate Jwt web token
                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    );

                // return status code 200 with token, token's expired date, user id and user role
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token), // serializes a JwtSecurityToken into a JWT
                    expiration = token.ValidTo,
                    id = userId,
                    role = userRoles
                });
            }

            // login failure
            return Ok(new Response { Status = "Error", Message = "Invalid Username or Password!" });
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

            // create user account
            ApplicationUser user = new ApplicationUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };
            var result = await userManager.CreateAsync(user, model.Password);

            // return status code 500 if error occurs
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

            // status code 200
            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }

        [HttpPost]
        [Route("register-admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

            // create user account
            ApplicationUser user = new ApplicationUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };
            var result = await userManager.CreateAsync(user, model.Password);

            // return status code 500 if error occurs
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

            // create roles
            if (!await roleManager.RoleExistsAsync(UserRoles.User))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.User));
            if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));

            // add admin role to the user
            if (await roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await userManager.AddToRoleAsync(user, UserRoles.Admin);
            }

            // status code 200
            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }

        [HttpGet]
        [Route("get-users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            // get all users
            var newUsers = await userManager.Users.ToListAsync();

            // return status code 200
            return Ok(newUsers);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> ChangeUserPassword([FromRoute] string id, ChangePasswordModel passwordModel)
        {
            var user = await userManager.FindByIdAsync(id);

            // return error message if user does not exist
            if (user == null)
            {
                return Ok(new Response { Status = "Error", Message = "User does not exists" });
            }

            // change password
            var result = await userManager.ChangePasswordAsync(user, passwordModel.CurrentPassword, passwordModel.NewPassword);

            // return error message if password updated unsuccessfully
            if (!result.Succeeded)
                return Ok(new Response { Status = "Error", Message = "Password updated unsuccessfully! Please check user details and try again." });

            // return status code 200 for success
            return Ok(new Response { Status = "Success", Message = "Password updated successfully!" });
        }


        //[HttpGet]
        //[Route("register-first-admin")]
        //public async Task<IActionResult> RegisterFirstAdmin()
        //{
        //    ApplicationUser user = new ApplicationUser()
        //    {
        //        Email = "admin01@omdb.com",
        //        SecurityStamp = Guid.NewGuid().ToString(),
        //        UserName = "Admin01"
        //    };
        //    var result = await userManager.CreateAsync(user, "Admin01@omdb";
        //    if (!result.Succeeded)
        //        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

        //    if (!await roleManager.RoleExistsAsync(UserRoles.User))
        //        await roleManager.CreateAsync(new IdentityRole(UserRoles.User));
        //    if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
        //        await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));

        //    if (await roleManager.RoleExistsAsync(UserRoles.Admin))
        //    {
        //        await userManager.AddToRoleAsync(user, UserRoles.Admin);
        //    }

        //    return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        //}

    }
}
