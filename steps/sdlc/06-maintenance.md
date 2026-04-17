# Fase 6 — Maintenance

> Fase terakhir Waterfall. Untuk skripsi, fase ini biasanya hanya
> disebutkan sebagai rencana — tidak wajib dieksekusi penuh.

---

## Tujuan Fase Ini

Menjelaskan **rencana pemeliharaan sistem** setelah deployment sebagai
bagian dari metodologi yang lengkap.

---

## Di Skripsi, Maintenance Biasanya Berisi

Cukup tulis di BAB V (Penutup) bagian **Saran**, seperti:

> "Untuk pengembangan selanjutnya, disarankan untuk menambahkan fitur
> notifikasi pengingat harian, mengintegrasikan kalender eksternal,
> serta menambahkan dukungan untuk platform mobile (iOS/Android)."

---

## Jenis Maintenance yang Relevan untuk Rutino

### Corrective Maintenance (Perbaikan Bug)
Memperbaiki error atau bug yang ditemukan setelah deployment.

Contoh yang mungkin terjadi:
- Bug kalkulasi streak saat pergantian bulan
- Edge case deadline = hari ini tapi jam sudah lewat
- Filter tidak reset setelah navigasi antar halaman

### Adaptive Maintenance (Penyesuaian)
Menyesuaikan sistem dengan perubahan lingkungan eksternal.

Contoh:
- Update dependency jika ada breaking change dari Supabase/Next.js
- Penyesuaian jika Vercel mengubah konfigurasi deployment

### Perfective Maintenance (Peningkatan)
Penambahan fitur baru berdasarkan feedback user.

Ide pengembangan lanjutan Rutino:
- Push notification / reminder harian
- Integrasi Google Calendar
- Mode gelap (dark mode)
- Export data ke PDF/CSV
- Fitur goal setting jangka panjang
- Dukungan aplikasi mobile (React Native)

---

## Output Fase Ini (untuk Skripsi)

Cukup sertakan di BAB V — Penutup:

- [ ] Paragraf singkat tentang rencana maintenance
- [ ] Daftar saran pengembangan (3–5 poin cukup)
- [ ] Tidak perlu data atau screenshot tambahan
