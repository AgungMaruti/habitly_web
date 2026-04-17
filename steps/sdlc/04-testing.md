# Fase 4 — Testing (Pengujian)

> Verifikasi bahwa semua fitur berjalan sesuai requirements di Fase 1.
> Metode: Black-Box Testing.

---

## Tujuan Fase Ini

Menjawab pertanyaan: **"Apakah Rutino berfungsi sesuai yang diharapkan?"**

---

## Metode: Black-Box Testing

Black-box testing menguji aplikasi **dari perspektif user** tanpa melihat kode.
Hanya peduli: input → proses → output, apakah hasilnya sesuai?

Cocok untuk skripsi karena:
- Tidak perlu alat khusus
- Mudah didokumentasikan dalam tabel
- Cukup untuk membuktikan fungsionalitas

---

## Format Tabel Test Case

| ID Test | Fitur | Skenario | Input | Output yang Diharapkan | Hasil | Status |
|---------|-------|----------|-------|------------------------|-------|--------|
| TC-01   | ...   | ...      | ...   | ...                    | ...   | ✅/❌  |

---

## Test Cases per Modul

### Modul Auth

| ID    | Fitur    | Skenario                  | Input                          | Output yang Diharapkan                    |
|-------|----------|---------------------------|--------------------------------|-------------------------------------------|
| TC-01 | Register | Register akun baru valid  | Email baru + password ≥ 6 char | Akun terbuat, redirect ke dashboard       |
| TC-02 | Register | Register email duplikat   | Email yang sudah terdaftar     | Pesan error "Email sudah digunakan"       |
| TC-03 | Register | Password terlalu pendek   | Password < 6 karakter          | Pesan error validasi password             |
| TC-04 | Login    | Login valid               | Email & password benar         | Berhasil masuk, redirect ke dashboard     |
| TC-05 | Login    | Login password salah      | Email benar, password salah    | Pesan error "Email atau password salah"   |
| TC-06 | Login    | Login email tidak ada     | Email tidak terdaftar          | Pesan error "Email atau password salah"   |
| TC-07 | Logout   | Logout dari aplikasi      | Klik tombol logout             | Session dihapus, redirect ke /login       |
| TC-08 | Guard    | Akses dashboard tanpa login | Buka /dashboard langsung     | Redirect otomatis ke /login               |

---

### Modul Habit Management

| ID    | Fitur       | Skenario                          | Input                          | Output yang Diharapkan                        |
|-------|-------------|-----------------------------------|--------------------------------|-----------------------------------------------|
| TC-09 | Tambah Habit | Judul mengandung keyword health   | "lari pagi"                    | Kategori auto-fill "Health", waktu "06:00"    |
| TC-10 | Tambah Habit | Judul mengandung keyword education| "belajar TypeScript"           | Kategori auto-fill "Education", waktu "19:00" |
| TC-11 | Tambah Habit | Judul tidak cocok keyword manapun | "main gitar"                   | Kategori "Other", waktu "07:00"               |
| TC-12 | Tambah Habit | Override kategori & waktu         | Ganti kategori & waktu manual  | Nilai tersimpan sesuai input user             |
| TC-13 | Tambah Habit | Judul kosong                      | Form dikosongkan               | Validasi error, habit tidak tersimpan         |
| TC-14 | Edit Habit  | Ubah judul habit                  | Ganti judul                    | Data terupdate di list                        |
| TC-15 | Hapus Habit | Hapus habit yang ada              | Konfirmasi hapus               | Habit hilang dari list                        |
| TC-16 | Toggle Habit | Tandai selesai                   | Klik toggle                    | is_completed = true, habit_logs terupdate     |
| TC-17 | Toggle Habit | Untoggle (batalkan selesai)       | Klik toggle lagi               | is_completed = false                          |
| TC-18 | Streak      | Habit selesai 3 hari berturut     | Toggle 3 hari berturut         | Streak label "✨ Konsisten 3 hari!"           |
| TC-19 | Streak      | Habit selesai 7+ hari berturut    | Toggle 7 hari berturut         | Streak label "🔥 7 Day Streak!"               |
| TC-20 | Filter      | Filter by kategori "Health"       | Pilih filter "Health"          | Hanya habit kategori Health yang tampil       |

---

### Modul Task Management

| ID    | Fitur      | Skenario                          | Input                          | Output yang Diharapkan                         |
|-------|------------|-----------------------------------|--------------------------------|------------------------------------------------|
| TC-21 | Tambah Task | Deadline hari ini                 | Deadline = hari ini            | Prioritas auto-fill "High"                     |
| TC-22 | Tambah Task | Deadline 2 hari lagi              | Deadline = +2 hari             | Prioritas auto-fill "Medium"                   |
| TC-23 | Tambah Task | Deadline 1 minggu lagi            | Deadline = +7 hari             | Prioritas auto-fill "Low"                      |
| TC-24 | Tambah Task | Judul mengandung keyword          | "kerjakan tugas kuliah"        | Kategori auto-fill "Education"                 |
| TC-25 | Tambah Task | Override prioritas                | Ganti prioritas manual         | Nilai tersimpan sesuai input user              |
| TC-26 | Tambah Task | Tanpa deadline                    | Deadline dikosongkan           | Task tersimpan, prioritas default "Low"        |
| TC-27 | Edit Task  | Ubah deadline                     | Ganti deadline                 | Prioritas recalculate sesuai deadline baru     |
| TC-28 | Hapus Task | Hapus task yang ada               | Konfirmasi hapus               | Task hilang dari list                          |
| TC-29 | Toggle Task | Tandai selesai                   | Klik toggle                    | is_completed = true, tampil di filter "Selesai"|
| TC-30 | Filter     | Filter by prioritas "High"        | Pilih filter "High"            | Hanya task High yang tampil                    |
| TC-31 | Filter     | Filter by status "Selesai"        | Pilih filter "Selesai"         | Hanya task selesai yang tampil                 |

---

### Modul Dashboard

| ID    | Fitur          | Skenario                         | Kondisi                        | Output yang Diharapkan                        |
|-------|----------------|----------------------------------|--------------------------------|-----------------------------------------------|
| TC-32 | DailyInsight   | Ada task deadline hari ini       | Task dengan deadline = hari ini| Insight: "Ada X task yang harus selesai hari ini!" |
| TC-33 | DailyInsight   | Semua habit selesai              | is_completed semua = true      | Insight: "Luar biasa! Semua habit selesai!"   |
| TC-34 | DailyInsight   | Belum ada habit selesai          | is_completed semua = false     | Insight: "Yuk mulai hari ini, semangat!"      |
| TC-35 | SummaryCards   | Ada 3 habit, 2 selesai           | 2 habit toggle selesai         | Card tampil "2/3 habit selesai"               |
| TC-36 | HabitProgress  | Progress bar                     | 2 dari 5 habit selesai         | Progress bar 40% terisi                       |
| TC-37 | UpcomingTasks  | Task deadline ≤ 3 hari           | Task deadline besok            | Task muncul di UpcomingTasks                  |
| TC-38 | UpcomingTasks  | Task deadline > 3 hari           | Task deadline minggu depan     | Task tidak muncul di UpcomingTasks            |

---

### Modul Statistics

| ID    | Fitur              | Skenario                     | Output yang Diharapkan                    |
|-------|--------------------|------------------------------|-------------------------------------------|
| TC-39 | WeeklyChart        | Ada data 7 hari terakhir     | Bar chart tampil dengan data akurat       |
| TC-40 | WeeklyChart        | Belum ada data               | Chart kosong / empty state tampil         |
| TC-41 | StatsCards         | Hitung streak terpanjang     | Angka streak terpanjang akurat            |
| TC-42 | StatsCards         | Hitung completion rate       | Persentase sesuai jumlah habit selesai    |
| TC-43 | ProductivityInsight | Hari paling produktif       | Nama hari dengan habit selesai terbanyak  |
| TC-44 | ProductivityInsight | Kategori task terbanyak     | Nama kategori yang paling banyak task-nya |

---

## Cara Menjalankan Testing

1. Buka aplikasi di browser (localhost atau vercel)
2. Lakukan skenario sesuai tabel satu per satu
3. Catat hasil aktual
4. Bandingkan dengan output yang diharapkan
5. Tandai Status: ✅ Berhasil / ❌ Gagal
6. Kalau ada yang ❌, perbaiki dulu sebelum lanjut

---

## Output Fase Ini (untuk Skripsi)

- [ ] Tabel test case lengkap (semua TC di atas)
- [ ] Kolom "Hasil Aktual" diisi setelah testing
- [ ] Kolom "Status" ditandai ✅ atau ❌
- [ ] Screenshot bukti testing per skenario kritis
- [ ] Kesimpulan: berapa persen test case berhasil?
