using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KanYonetim.API.Data;
using Microsoft.AspNetCore.Authorization;

namespace KanYonetim.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class PublicController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PublicController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("home-stats")]
        public async Task<IActionResult> GetHomeStats()
        {
            // 1. Total Active Requests
            var activeRequestsCount = await _context.DonationRequests
                .Where(r => r.Status == "Active" || r.Status == "Approved")
                .CountAsync();

            // 2. Total Donors
            var totalDonorsCount = await _context.Users
                .Where(u => u.Role == "Donor")
                .CountAsync();

            // 3. Blood Types count
            var bloodTypesCount = await _context.BloodTypes.CountAsync();

            // 4. Lives Saved (Using the formula: Completed Requests * 3)
            var completedRequestsCount = await _context.DonationRequests
                .Where(r => r.Status == "Fulfilled")
                .CountAsync();
            var livesSaved = completedRequestsCount * 3;

            // 5. Blood Group Need Distribution (For Donut Chart)
            var bloodGroupStats = (await _context.DonationRequests
                .Where(r => r.Status == "Active" || r.Status == "Approved")
                .Include(r => r.BloodType)
                .GroupBy(r => r.BloodType!.Name)
                .Select(g => new
                {
                    Name = g.Key,
                    Value = g.Sum(r => r.UnitsNeeded)
                })
                .OrderByDescending(x => x.Value)
                .Take(5)
                .ToListAsync()).Cast<dynamic>().ToList();

            // Ensure we return some default chart data if db is empty
            if (bloodGroupStats.Count == 0)
            {
                bloodGroupStats = new List<dynamic>
                {
                    new { Name = "O Rh(-)", Value = 5 },
                    new { Name = "A+", Value = 3 },
                    new { Name = "B+", Value = 2 },
                    new { Name = "AB+", Value = 1 },
                    new { Name = "Diğer", Value = 1 }
                };
            }

            return Ok(new
            {
                activeRequestsCount,
                totalDonorsCount,
                bloodTypesCount,
                livesSaved,
                bloodGroupStats
            });
        }

        [HttpGet("urgent-requests")]
        public async Task<IActionResult> GetUrgentRequests()
        {
            var urgentRequests = (await _context.DonationRequests
                .Where(r => r.Status == "Active" || r.Status == "Approved")
                .Include(r => r.BloodType)
                .Include(r => r.Hospital)
                .OrderByDescending(r => r.UrgencyLevel == "Acil" ? 2 : (r.UrgencyLevel == "Kritik" ? 3 : 1)) // Kritik > Acil > Normal
                .ThenByDescending(r => r.CreatedAt)
                .Take(5)
                .Select(r => new
                {
                    BloodType = r.BloodType!.Name,
                    Hospital = r.Hospital!.Name,
                    Urgency = r.UrgencyLevel,
                    Distance = "Bilinmiyor", // Since we are not asking for user location on public page
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync()).Cast<dynamic>().ToList();

            // If empty, return some dummy data just so UI doesn't look completely empty for testing
            if (urgentRequests.Count == 0)
            {
                 urgentRequests = new List<dynamic>
                 {
                     new { BloodType = "O Rh(-)", Hospital = "Test Hastanesi", Urgency = "Acil", Distance = "2.4 km", CreatedAt = DateTime.UtcNow },
                     new { BloodType = "A+", Hospital = "Örnek Hastane", Urgency = "Orta", Distance = "4.1 km", CreatedAt = DateTime.UtcNow.AddMinutes(-30) }
                 };
            }

            return Ok(urgentRequests);
        }
    }
}
