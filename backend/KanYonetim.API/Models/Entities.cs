namespace KanYonetim.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Tc { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty; // Erkek, Kadın
        public int BloodTypeId { get; set; }
        public BloodType? BloodType { get; set; }
        public int DistrictId { get; set; }
        public District? District { get; set; }
        public string Role { get; set; } = "Donor"; // Donor, Hospital, Admin
        public DateTime? LastDonationDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class BloodType
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ICollection<BloodStock> BloodStocks { get; set; } = new List<BloodStock>();
    }

    public class District
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class Hospital
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DistrictId { get; set; }
        public District? District { get; set; }
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int? UserId { get; set; }
        public User? User { get; set; }
        public ICollection<BloodStock> BloodStocks { get; set; } = new List<BloodStock>();
        public ICollection<DonationRequest> DonationRequests { get; set; } = new List<DonationRequest>();
    }

    public class BloodStock
    {
        public int Id { get; set; }
        public int HospitalId { get; set; }
        public Hospital? Hospital { get; set; }
        public int BloodTypeId { get; set; }
        public BloodType? BloodType { get; set; }
        public int Units { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }

    public class DonationRequest
    {
        public int Id { get; set; }
        public int HospitalId { get; set; }
        public Hospital? Hospital { get; set; }
        public int BloodTypeId { get; set; }
        public BloodType? BloodType { get; set; }
        public int UnitsNeeded { get; set; }
        public string UrgencyLevel { get; set; } = "Normal"; // Normal, Acil, Kritik
        public string Status { get; set; } = "Active"; // Active, Fulfilled, Cancelled
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<DonationApplication> Applications { get; set; } = new List<DonationApplication>();
    }

    public class DonationApplication
    {
        public int Id { get; set; }
        public int DonorId { get; set; }
        public User? Donor { get; set; }
        public int DonationRequestId { get; set; }
        public DonationRequest? DonationRequest { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;
    }
}
