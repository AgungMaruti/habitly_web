# Fase 1 — Requirements Analysis

> Kumpulkan dan dokumentasikan semua kebutuhan sistem sebelum mulai desain apapun.
> Output utama: **Software Requirements Specification (SRS)**

---

## Tujuan Fase Ini

Menjawab pertanyaan: **"Apa saja yang harus bisa dilakukan Rutino?"**

---

## 1.1 Identifikasi Stakeholder

| Stakeholder | Peran |
|-------------|-------|
| Mahasiswa   | Pengguna utama aplikasi |
| Developer (kamu) | Pembangun sistem |
| Dosen Pembimbing | Validator requirement |

---

## 1.2 Functional Requirements

Fitur-fitur yang **wajib ada** di Rutino:

### Auth
- [ ] User bisa registrasi akun baru dengan email & password
- [ ] User bisa login ke akun yang sudah ada
- [ ] User bisa logout
- [ ] Halaman utama hanya bisa diakses setelah login (auth guard)

### Habit Management
- [ ] User bisa menambah habit baru
- [ ] Sistem otomatis menentukan kategori habit berdasarkan judul (rule-based)
- [ ] Sistem otomatis menyarankan waktu terbaik berdasarkan kategori (rule-based)
- [ ] User bisa mengedit habit yang sudah ada
- [ ] User bisa menghapus habit
- [ ] User bisa menandai habit sebagai selesai hari ini (toggle)
- [ ] Sistem menghitung dan menampilkan streak per habit
- [ ] User bisa memfilter habit berdasarkan kategori

### Task Management
- [ ] User bisa menambah task baru
- [ ] Sistem otomatis menentukan kategori task berdasarkan judul (rule-based)
- [ ] Sistem otomatis menentukan prioritas task berdasarkan deadline (rule-based)
- [ ] User bisa mengedit task yang sudah ada
- [ ] User bisa menghapus task
- [ ] User bisa menandai task sebagai selesai (toggle)
- [ ] User bisa memfilter task berdasarkan prioritas, kategori, dan status

### Dashboard
- [ ] Menampilkan insight/greeting harian otomatis (rule-based)
- [ ] Menampilkan ringkasan habit selesai hari ini
- [ ] Menampilkan jumlah task pending
- [ ] Menampilkan progress bar habit harian
- [ ] Menampilkan preview task dengan deadline terdekat

### Statistics
- [ ] Menampilkan bar chart habit mingguan
- [ ] Menampilkan streak terpanjang
- [ ] Menampilkan completion rate habit
- [ ] Menampilkan hari paling produktif
- [ ] Menampilkan kategori task terbanyak

---

## 1.3 Non-Functional Requirements

| Kategori    | Requirement |
|-------------|-------------|
| Performa    | Halaman load < 3 detik pada koneksi normal |
| Keamanan    | Data user terisolasi — user hanya bisa lihat data miliknya sendiri (RLS) |
| Usability   | Responsif di desktop dan mobile |
| Availability | Aplikasi bisa diakses 24/7 (Vercel + Supabase) |
| Compatibility | Berjalan di browser modern (Chrome, Firefox, Safari, Edge) |

---

## 1.4 Use Case

### Aktor: User (Mahasiswa)

```
UC-01  Register akun
UC-02  Login
UC-03  Logout
UC-04  Tambah habit (+ AI auto-fill kategori & waktu)
UC-05  Edit habit
UC-06  Hapus habit
UC-07  Toggle habit selesai hari ini
UC-08  Filter habit by kategori
UC-09  Tambah task (+ AI auto-fill kategori & prioritas)
UC-10  Edit task
UC-11  Hapus task
UC-12  Toggle task selesai
UC-13  Filter task by prioritas / kategori / status
UC-14  Lihat dashboard (insight + summary + progress)
UC-15  Lihat statistik (chart + insight performa)
```

---

## 1.5 Batasan Sistem (Scope)

Yang **termasuk** dalam scope Rutino:
- Aplikasi web (bukan mobile native)
- AI berbasis rule-based lokal (tanpa API berbayar)
- Autentikasi dan penyimpanan data via Supabase
- Visualisasi data dengan Recharts

Yang **tidak termasuk** dalam scope Rutino:
- Push notification / reminder
- Fitur social / berbagi dengan teman
- Machine learning atau AI generatif
- Aplikasi mobile (iOS/Android)
- Integrasi kalender eksternal (Google Calendar, dll)

---

## Output Fase Ini (untuk Skripsi)

- [ ] Dokumen SRS (bisa jadi sub-bab di BAB III)
- [ ] Tabel Functional Requirements
- [ ] Tabel Non-Functional Requirements
- [ ] Use Case Diagram
- [ ] Deskripsi Use Case per UC
