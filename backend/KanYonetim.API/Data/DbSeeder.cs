using System;
using System.Collections.Generic;
using System.Linq;
using KanYonetim.API.Models;
using BCrypt.Net;

namespace KanYonetim.API.Data
{
    public static class DbSeeder
    {
        public static void SeedData(AppDbContext context)
        {
            // Seed Admin if not exists
            if (!context.Users.Any(u => u.Role == "Admin"))
            {
                var adminUser = new User
                {
                    FullName = "Sistem Yöneticisi",
                    Email = "admin@kanyonetim.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sifre123!"),
                    Tc = "10000000000",
                    Phone = "05000000000",
                    Gender = "Erkek",
                    BloodTypeId = 1,
                    DistrictId = 20, // Fatih
                    Role = "Admin",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                };
                context.Users.Add(adminUser);
                context.SaveChanges();
            }

            // Seed Donors if less than 10 users exist
            if (context.Users.Count(u => u.Role == "Donor") < 10)
            {
                var random = new Random(42); // deterministic random seed
                var firstNames = new[] { "Ahmet", "Mehmet", "Mustafa", "Yusuf", "Ali", "Ayşe", "Fatma", "Emine", "Hatice", "Zeynep", "Elif", "Ömer", "Halil", "İbrahim", "Hüseyin", "Hasan", "Murat", "Hakan", "Gökhan", "Serkan", "Yavuz", "Sinan", "Burak", "Can", "Kerem", "Cem", "Deniz", "Ege", "Emre", "Seda", "Merve", "Büşra", "Tuğçe", "Gizem", "Hilal", "Kübra", "Selin", "Yasemin", "Ebru", "Pelin", "Gamze", "Aslı", "Başak", "Ceyda", "Didem", "Ezgi", "İrem", "Melis", "Banu", "Cemre" };
                var lastNames = new[] { "Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara", "Köse", "Polat", "Özkan", "Erdem", "Aksoy", "Bulut", "Tekin", "Yalçın", "Avcı", "Ateş", "Koç", "Şen", "Sarı", "Kahraman", "Çakır", "Öz", "Güler", "Yaman", "Şimşek", "Güneş", "Kartal", "Kaplan", "Koca", "Karaca", "Coşkun", "Keskin", "Uysal", "Turan", "Aktaş", "Karataş", "Kılıçarslan", "Bozkurt", "Yavuz", "Uzun" };
                var emailDomains = new[] { "gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "yandex.com" };
                var genders = new[] { "Erkek", "Kadın" };

                var seededUsers = new List<User>();

                for (int i = 0; i < 50; i++)
                {
                    string firstName = firstNames[i % firstNames.Length];
                    string lastName = lastNames[i % lastNames.Length];
                    string fullName = $"{firstName} {lastName}";
                    
                    // Generate clean email without special Turkish characters
                    string cleanFirstName = ReplaceTurkishChars(firstName.ToLower());
                    string cleanLastName = ReplaceTurkishChars(lastName.ToLower());
                    string email = $"{cleanFirstName}.{cleanLastName}{i + 1}@{emailDomains[i % emailDomains.Length]}";
                    
                    string tc = (10000000000L + random.Next(10000000, 99999999) * 100 + i).ToString();
                    string phone = $"05{random.Next(30, 56)}{random.Next(100, 999)}{random.Next(10, 99)}{random.Next(10, 99)}";
                    string gender = genders[random.Next(genders.Length)];
                    int bloodTypeId = random.Next(1, 9); // 1-8
                    int districtId = random.Next(1, 40); // 1-39

                    var user = new User
                    {
                        FullName = fullName,
                        Email = email,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sifre123!"),
                        Tc = tc,
                        Phone = phone,
                        Gender = gender,
                        BloodTypeId = bloodTypeId,
                        DistrictId = districtId,
                        Role = "Donor",
                        IsEmailVerified = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-random.Next(5, 30)),
                        LastDonationDate = random.Next(2) == 0 ? DateTime.UtcNow.AddDays(-random.Next(40, 150)) : null
                    };

                    seededUsers.Add(user);
                }

                context.Users.AddRange(seededUsers);
                context.SaveChanges();

                // Seed Donation Requests and Applications
                var hospitals = context.Hospitals.ToList();
                if (hospitals.Any())
                {
                    var seededRequests = new List<DonationRequest>();
                    var urgencies = new[] { "Normal", "Acil", "Kritik" };
                    var statuses = new[] { "Active", "Fulfilled" };

                    // Seed 25 donation requests
                    for (int i = 0; i < 25; i++)
                    {
                        var request = new DonationRequest
                        {
                            HospitalId = hospitals[random.Next(hospitals.Count)].Id,
                            BloodTypeId = random.Next(1, 9),
                            UnitsNeeded = random.Next(2, 10),
                            UrgencyLevel = urgencies[random.Next(urgencies.Length)],
                            Status = statuses[random.Next(statuses.Length)],
                            CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 15))
                        };
                        seededRequests.Add(request);
                    }
                    context.DonationRequests.AddRange(seededRequests);
                    context.SaveChanges();

                    // Seed Donation Applications for the users
                    var donationRequests = context.DonationRequests.ToList();
                    var appStatuses = new[] { "Pending", "Approved", "Rejected" };
                    var seededApps = new List<DonationApplication>();

                    foreach (var request in donationRequests)
                    {
                        // Match 1-3 users to apply to this request
                        int appCount = random.Next(1, 4);
                        var eligibleDonors = seededUsers
                            .Where(u => u.BloodTypeId == request.BloodTypeId)
                            .OrderBy(x => Guid.NewGuid())
                            .Take(appCount)
                            .ToList();

                        foreach (var donor in eligibleDonors)
                        {
                            var appStatus = appStatuses[random.Next(appStatuses.Length)];
                            if (request.Status == "Fulfilled")
                            {
                                appStatus = "Approved"; // Completed requests should have approved applications
                            }

                            var app = new DonationApplication
                            {
                                DonorId = donor.Id,
                                DonationRequestId = request.Id,
                                Status = appStatus,
                                ApplicationDate = request.CreatedAt.AddHours(random.Next(2, 48))
                            };
                            seededApps.Add(app);

                            // Create an audit log for approved or pending donations
                            context.AuditLogs.Add(new AuditLog
                            {
                                UserId = donor.Id,
                                ActionType = "DonationApplication",
                                EntityName = "DonationApplication",
                                EntityId = app.Id.ToString(),
                                IpAddress = $"192.168.1.{random.Next(10, 200)}",
                                Description = $"{donor.FullName} isimli bağışçı {request.Id} nolu talebe başvurdu. Durum: {appStatus}",
                                CreatedAt = app.ApplicationDate
                            });
                        }
                    }
                    context.DonationApplications.AddRange(seededApps);
                    context.SaveChanges();
                }
            }
        }

        private static string ReplaceTurkishChars(string input)
        {
            var mapping = new Dictionary<char, char>
            {
                { 'ç', 'c' }, { 'ğ', 'g' }, { 'ı', 'i' }, { 'ö', 'o' }, { 'ş', 's' }, { 'ü', 'u' },
                { 'Ç', 'C' }, { 'Ğ', 'G' }, { 'İ', 'I' }, { 'Ö', 'O' }, { 'Ş', 'S' }, { 'Ü', 'U' }
            };

            foreach (var pair in mapping)
            {
                input = input.Replace(pair.Key, pair.Value);
            }

            return input;
        }
    }
}
