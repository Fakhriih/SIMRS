# SIMRS (Sistem Informasi Manajemen Rumah Sakit)

Proyek ini adalah prototipe aplikasi web SIMRS sederhana untuk keperluan demo. 
Dibuat menggunakan Next.js (App Router), Tailwind CSS, Prisma ORM, dan database SQLite lokal.

## Persyaratan
- Node.js versi 18+ terinstall

## Cara Menjalankan Proyek Secara Lokal

1. **Install Dependencies**
   Jalankan perintah berikut di terminal (pastikan berada di folder `SIMRS`):
   ```bash
   npm install
   ```

2. **Sinkronisasi Database & Seed Data**
   Database SQLite sudah ada, tetapi jika ingin mereset atau menerapkan ulang:
   ```bash
   npx prisma db push
   npm run prisma seed
   ```
   *Catatan: Script seed dijalankan menggunakan `npm run prisma seed`.*

3. **Jalankan Server Development**
   ```bash
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Akses Akun Dummy
Gunakan salah satu kredensial berikut untuk login:

- **Admin**
  - Username: `admin`
  - Password: `password123`
- **Petugas Pendaftaran**
  - Username: `petugas`
  - Password: `password123`

## Struktur Halaman
- `/` - Halaman Login
- `/dashboard` - Dashboard Utama
- `/pendaftaran` - Modul Pendaftaran
- `/rawat-jalan` - Modul Rawat Jalan
- `/farmasi` - Modul Apotek/Farmasi
- `/kasir` - Modul Pembayaran

Selamat mengerjakan!
