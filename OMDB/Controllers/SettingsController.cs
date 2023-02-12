using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OMDB.Data;
using OMDB.Models.MovieDomain;
using OMDB.Models.MovieDTO.Setting;

namespace OMDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("get-settings")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSettings()
        {
            var setting = await _context.Settings.FindAsync(1);

            return Ok(setting);
        }

        [HttpPut]
        [Route("update-settings")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSettings(UpdateSettingModel settingModel)
        {
            // select the only row of data for setting table
            var setting = await _context.Settings.FindAsync(1);

            if (setting != null)
            {
                setting.SimilarityAlgorithm = settingModel.SimilarityAlgorithm;
                setting.SampleNum = settingModel.SampleNum;

                await _context.SaveChangesAsync();

                return Ok(setting);
            }

            // return status code 404
            return NotFound();
        }

        //[HttpGet]
        //[Route("initialize-settings")]
        //public async Task<IActionResult> InitializeSettings()
        //{
        //    var setting = new SettingModel()
        //    {
        //        SimilarityAlgorithm = "Cosine Similarity Index",
        //        SampleNum = 20
        //    };

        //    await _context.Settings.AddAsync(setting);
        //    await _context.SaveChangesAsync();

        //    return Ok(setting);
        //}
    }
}
