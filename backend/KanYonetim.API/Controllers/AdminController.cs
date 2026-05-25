using KanYonetim.API.Data;
using KanYonetim.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanYonetim.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserListDto>>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.BloodType)
                .Include(u => u.District)
                .Select(u => new UserListDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Role = u.Role,
                    BloodTypeName = u.BloodType != null ? u.BloodType.Name : "",
                    DistrictName = u.District != null ? u.District.Name : "",
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return users;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<StatsDto>> GetStats()
        {
            var stats = new StatsDto
            {
                TotalDonors = await _context.Users.CountAsync(u => u.Role == "Donor"),
                TotalHospitals = await _context.Hospitals.CountAsync(),
                ActiveRequests = await _context.DonationRequests.CountAsync(r => r.Status == "Active"),
                TotalApplications = await _context.DonationApplications.CountAsync(),
                TotalDonationsCompleted = await _context.DonationApplications.CountAsync(a => a.Status == "Approved")
            };

            return stats;
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
