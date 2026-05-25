# Kan Yönetim Platformu

İstanbul genelinde kan bağışı süreçlerini merkezileştirmeyi amaçlayan dijital platform.

## Teknolojiler
- **Backend:** C# - ASP.NET Core Web API
- **Frontend:** React (Vite)
- **Veritabanı:** SQLite + EF Core
- **Kimlik Doğrulama:** JWT (JSON Web Token)

## Proje Yapısı
- `/backend`: Web API projesi, modeller ve servisler.
- `/frontend`: React arayüzü, modern glassmorphic tasarım.

## Nasıl Çalıştırılır?

### 1. Backend'i Başlatın
```bash
cd backend/KanYonetim.API
dotnet run
```
API otomatik olarak `http://localhost:5090` adresinde çalışacaktır. İlk çalışmada veritabanı (SQLite) otomatik oluşturulur ve İstanbul ilçeleri seed data olarak eklenir.

### 2. Frontend'i Başlatın
```bash
cd frontend
npm install
npm run dev
```
Uygulama `http://localhost:3000` adresinde açılacaktır.

## Özellikler
- **Cinsiyet Bazlı Uygunluk:** Erkekler için 3 ay (90 gün), Kadınlar için 4 ay (120 gün) kuralı.
- **Mesafe Sıralaması:** Bağışçıların konumuna (ilçe merkezi) göre en yakın hastane taleplerini sıralama (Haversine formülü).
- **Modern Tasarım:** Koyu tema, glassmorphism bileşenleri ve kullanıcı dostu arayüz.
