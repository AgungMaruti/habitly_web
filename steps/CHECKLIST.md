# Checklist — Apa yang Harus Aku Lakukan?

> File ini adalah panduan langkah konkret yang harus dikerjakan dari awal sampai sidang.
> Metodologi: **SDLC model Waterfall**
> Tandai `[x]` kalau sudah selesai. Update terus!

---

## FASE 1 — REQUIREMENTS ANALYSIS
> Tujuan: Kumpulkan dan dokumentasikan semua kebutuhan sistem sebelum mulai desain apapun.

### 1.1 Studi Literatur
- [ ] Cari minimal 5 jurnal/paper tentang **habit tracking & produktivitas**
- [ ] Cari minimal 3 jurnal/paper tentang **rule-based recommendation system**
- [ ] Cari minimal 2 jurnal/paper tentang **aplikasi manajemen kebiasaan/task**
- [ ] Simpan referensi dengan format: Penulis, Tahun, Judul, Sumber
- [ ] Catat poin penting dari tiap jurnal yang relevan dengan Rutino

> Sumber: Google Scholar (scholar.google.com), Semantic Scholar

---

### 1.2 Analisis Aplikasi Existing (Pembanding)
- [ ] Coba dan analisis **Habitica**
- [ ] Coba dan analisis **Streaks** atau **Loop Habit Tracker**
- [ ] Coba dan analisis **Todoist**
- [ ] Buat tabel perbandingan: fitur apa yang ada/tidak ada di tiap app
- [ ] Identifikasi **gap** — apa yang kurang dari semua app itu → itulah nilai lebih Rutino

---

### 1.3 Dokumen Requirements
- [ ] Buat daftar **Functional Requirements** (semua fitur yang wajib ada)
- [ ] Buat daftar **Non-Functional Requirements** (performa, keamanan, responsif)
- [ ] Buat **Use Case Diagram**
- [ ] Buat deskripsi per Use Case (UC-01 sampai UC-15)
- [ ] Tentukan **batasan sistem** (scope & out-of-scope)

> Detail lengkap: lihat `steps/sdlc/01-requirements.md`

---

## FASE 2 — SYSTEM DESIGN
> Tujuan: Terjemahkan requirements menjadi blueprint teknis sebelum coding.

### 2.1 Desain Sistem
- [ ] Buat **diagram arsitektur sistem** (Next.js → Supabase)
- [ ] Buat **ERD (Entity Relationship Diagram)** — tabel habits, tasks, habit_logs
- [ ] Buat **rule-based logic** — tabel IF-THEN untuk semua fungsi AI
- [ ] Buat **flowchart** alur data per fitur utama

### 2.2 Desain UI/UX
- [ ] Buat **wireframe** semua halaman (Dashboard, Habits, Tasks, Statistics)
- [ ] Buat **mockup / prototype UI** di Figma

> Detail lengkap: lihat `steps/sdlc/02-system-design.md`

---

## FASE 3 — PERSIAPAN SEMPRO
> Tujuan: Presentasi proposal yang solid dan bisa didefend ke dosen.

### 3.1 Dokumen Proposal
- [ ] Bab 1 — Pendahuluan
  - [ ] Latar belakang (pakai data dari studi literatur + analisis app existing)
  - [ ] Rumusan masalah
  - [ ] Tujuan penelitian
  - [ ] Manfaat penelitian
  - [ ] Batasan masalah
- [ ] Bab 2 — Tinjauan Pustaka
  - [ ] Landasan teori: habit, task management, rule-based system
  - [ ] Penelitian terdahulu (dari jurnal yang dikumpulkan)
  - [ ] Kerangka berpikir
- [ ] Bab 3 — Metode Penelitian
  - [ ] Jenis penelitian: Rancang Bangun (SDLC)
  - [ ] Model pengembangan: Waterfall
  - [ ] Penjelasan tiap fase Waterfall dipetakan ke Rutino
  - [ ] Instrumen pengujian: Black-box Testing (tabel test case)

### 3.2 Materi Presentasi
- [ ] Buat slide presentasi Sempro
  - [ ] Slide: Latar belakang & masalah
  - [ ] Slide: Solusi → Rutino itu apa
  - [ ] Slide: Metode penelitian (SDLC + Waterfall)
  - [ ] Slide: Metode dalam app (Rule-Based AI)
  - [ ] Slide: Fitur utama (4 halaman)
  - [ ] Slide: Rencana pengembangan & timeline
- [ ] Latihan presentasi & siapkan jawaban untuk pertanyaan umum dosen

---

## FASE 4 — IMPLEMENTATION (CODING)
> Tujuan: Bangun Rutino sesuai desain di Fase 2.

### 4.1 Setup Awal
- [ ] Init project Next.js 14 + TypeScript + Tailwind
- [ ] Setup Supabase (buat tabel, aktifkan RLS)
- [ ] Buat `lib/supabase.ts`, `types/index.ts`, `lib/ai-rules.ts`, `lib/utils.ts`

### 4.2 Coding per Modul
- [ ] Auth (login, register, logout, auth guard)
- [ ] UI Components generic (Button, Card, Input, Modal, Badge, ProgressBar)
- [ ] Layout (Navbar, Sidebar, BottomNav)
- [ ] Dashboard (DailyInsight, SummaryCards, HabitProgress, UpcomingTasks)
- [ ] My Habits (HabitCard, HabitList, HabitFilter, HabitForm + AI)
- [ ] My Tasks (TaskCard, TaskList, TaskFilter, TaskForm + AI)
- [ ] Statistics (WeeklyChart, StatsCards, ProductivityInsight)

> Detail lengkap: lihat `steps/sdlc/03-implementation.md`

---

## FASE 5 — TESTING
> Tujuan: Verifikasi semua fitur berjalan sesuai requirements. Metode: Black-box Testing.

- [ ] Jalankan semua test case modul Auth (TC-01 s/d TC-08)
- [ ] Jalankan semua test case modul Habit (TC-09 s/d TC-20)
- [ ] Jalankan semua test case modul Task (TC-21 s/d TC-31)
- [ ] Jalankan semua test case modul Dashboard (TC-32 s/d TC-38)
- [ ] Jalankan semua test case modul Statistics (TC-39 s/d TC-44)
- [ ] Catat hasil aktual & tandai ✅/❌ per test case
- [ ] Screenshot bukti testing per skenario kritis
- [ ] Perbaiki semua test case yang ❌

> Detail lengkap (44 test case): lihat `steps/sdlc/04-testing.md`

---

## FASE 6 — DEPLOYMENT
> Tujuan: Deploy Rutino ke production agar bisa diakses publik & didemonstrasikan saat sidang.

- [ ] Push semua kode ke GitHub
- [ ] Deploy frontend ke **Vercel**
- [ ] Konfigurasi environment variables di Vercel
- [ ] Konfigurasi Redirect URLs di Supabase untuk domain production
- [ ] Verifikasi semua fitur berjalan dari URL production
- [ ] Catat URL live aplikasi (cantumkan di skripsi)

> Detail lengkap: lihat `steps/sdlc/05-deployment.md`

---

## FASE 7 — SIDANG SKRIPSI
- [ ] Lengkapi semua bab skripsi (Bab 1–5)
- [ ] Bab 5 berisi kesimpulan + saran maintenance & pengembangan lanjutan
- [ ] Buat dokumentasi teknis aplikasi
- [ ] Siapkan demo live untuk sidang
- [ ] Latihan presentasi sidang

---

## Prioritas Sekarang (April 2026)

```
Yang harus dikerjakan SEKARANG:
  ✦ Studi literatur (sambil jalan)
  ✦ Analisis aplikasi existing (Habitica, Todoist, dll)
  ✦ Mulai draft Bab 1 Pendahuluan
  ✦ Buat Use Case Diagram & ERD

Target sebelum Sempro:
  ✦ Bab 1, 2, 3 selesai
  ✦ Slide presentasi siap
  ✦ Wireframe/mockup UI sudah ada
  ✦ Dokumen Requirements (SRS) lengkap
```
