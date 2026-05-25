namespace KanYonetim.API.Models.DTOs
{
    // Auth DTOs
    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Tc { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public int BloodTypeId { get; set; }
        public int DistrictId { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class GoogleLoginDto
    {
        public string Token { get; set; } = string.Empty;
    }

    public class VerifyEmailDto
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Tc { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string BloodType { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public int UserId { get; set; }
        public bool RequiresEmailVerification { get; set; } = false;
    }

    // Blood Stock DTOs
    public class UpdateStockDto
    {
        public int HospitalId { get; set; }
        public int BloodTypeId { get; set; }
        public int Units { get; set; }
    }

    // Donation Request DTOs
    public class CreateDonationRequestDto
    {
        public int HospitalId { get; set; }
        public int BloodTypeId { get; set; }
        public int UnitsNeeded { get; set; }
        public string UrgencyLevel { get; set; } = "Normal";
    }

    // Eligibility DTO
    public class EligibilityDto
    {
        public bool IsEligible { get; set; }
        public DateTime? NextEligibleDate { get; set; }
        public int? DaysRemaining { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    // Nearby Request DTO
    public class NearbyRequestDto
    {
        public int Id { get; set; }
        public string HospitalName { get; set; } = string.Empty;
        public string DistrictName { get; set; } = string.Empty;
        public string BloodTypeName { get; set; } = string.Empty;
        public int UnitsNeeded { get; set; }
        public string UrgencyLevel { get; set; } = string.Empty;
        public double DistanceKm { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // Stats DTO
    public class StatsDto
    {
        public int TotalDonors { get; set; }
        public int TotalHospitals { get; set; }
        public int ActiveRequests { get; set; }
        public int TotalApplications { get; set; }
        public int TotalDonationsCompleted { get; set; }
    }

    // User List DTO
    public class UserListDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Tc { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string BloodTypeName { get; set; } = string.Empty;
        public string DistrictName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
