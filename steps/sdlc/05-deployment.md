# Fase 5 — Deployment

> Deploy aplikasi Rutino ke server production agar bisa diakses publik.
> Stack: Vercel (frontend) + Supabase (database & auth)

---

## Tujuan Fase Ini

Menghasilkan **URL live aplikasi** yang bisa diakses siapapun dan didemonstrasikan saat sidang.

---

## Platform yang Dipakai

| Bagian       | Platform | Kenapa                                      |
|--------------|----------|---------------------------------------------|
| Frontend     | Vercel   | Gratis, deploy otomatis dari GitHub, cocok untuk Next.js |
| Database     | Supabase | Sudah dipakai sejak awal, ada free tier yang memadai |

---

## 5.1 Persiapan Sebelum Deploy

```
□ Pastikan semua fitur sudah berjalan di localhost (lulus semua test case)
□ Pastikan tidak ada hardcoded credentials di kode
□ Buat file .env.local untuk referensi (jangan di-commit ke GitHub)
□ Push semua kode ke GitHub repository
□ Cek .gitignore — pastikan .env.local masuk di sana
```

---

## 5.2 Deploy ke Vercel

```
□ Buat akun Vercel di vercel.com (bisa login pakai GitHub)
□ Klik "Add New Project"
□ Import repository GitHub Rutino
□ Isi Environment Variables:
    NEXT_PUBLIC_SUPABASE_URL=<url dari Supabase dashboard>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key dari Supabase dashboard>
□ Klik "Deploy"
□ Tunggu build selesai (~2-3 menit)
□ Salin URL production (mis. rutino.vercel.app)
```

---

## 5.3 Konfigurasi Supabase untuk Production

```
□ Buka Supabase Dashboard → Authentication → URL Configuration
□ Tambahkan URL Vercel ke "Redirect URLs":
    https://rutino.vercel.app/**
□ Cek RLS (Row Level Security) sudah aktif di semua tabel
□ Test register & login dari URL production
```

---

## 5.4 Verifikasi Post-Deployment

Setelah deploy, tes semua alur ini dari URL production:

```
□ Register akun baru → berhasil
□ Login → berhasil, masuk ke dashboard
□ Tambah habit → tersimpan di database
□ Toggle habit selesai → update tampil
□ Tambah task → AI auto-fill berjalan
□ Lihat statistik → chart tampil
□ Logout → redirect ke login
□ Buka URL /dashboard tanpa login → redirect ke /login
```

---

## 5.5 Domain (Opsional)

Kalau ingin URL yang lebih rapi untuk sidang:

```
□ Beli domain murah (mis. rutino.my.id di niagahoster ~Rp 15rb/tahun)
□ Di Vercel: Settings → Domains → Add Domain
□ Ikuti instruksi DNS configuration
□ URL jadi: https://rutino.my.id
```

Tanpa domain custom, URL default Vercel sudah cukup untuk sidang.

---

## Output Fase Ini (untuk Skripsi)

- [ ] URL live aplikasi (cantumkan di skripsi)
- [ ] Screenshot halaman utama dari URL production
- [ ] Penjelasan singkat stack deployment (Vercel + Supabase)
- [ ] Link GitHub repository (jika repo publik)
