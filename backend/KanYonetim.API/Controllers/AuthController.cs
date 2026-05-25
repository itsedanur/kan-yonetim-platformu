using KanYonetim.API.Data;
using KanYonetim.API.Models;
using KanYonetim.API.Models.DTOs;
using KanYonetim.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanYonetim.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(x => x.Email == registerDto.Email.ToLower()))
                return BadRequest("Bu e-posta adresi zaten kullanımda.");

            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email.ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Tc = registerDto.Tc,
                Phone = registerDto.Phone,
                Gender = registerDto.Gender,
                BloodTypeId = registerDto.BloodTypeId,
                DistrictId = registerDto.DistrictId,
                Role = "Donor"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Tc = user.Tc,
                Phone = user.Phone,
                Gender = user.Gender,
                Role = user.Role,
                BloodType = "", // Can't easily get name without DB query, frontend knows it
                District = "",
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .Include(u => u.BloodType)
                .Include(u => u.District)
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

            if (user == null) return Unauthorized("Geçersiz e-posta veya şifre.");

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return Unauthorized("Geçersiz e-posta veya şifre.");

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Tc = user.Tc,
                Phone = user.Phone,
                Gender = user.Gender,
                Role = user.Role,
                BloodType = user.BloodType?.Name ?? "",
                District = user.District?.Name ?? "",
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}
