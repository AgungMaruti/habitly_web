# 08 — Build Order

Urutan pengerjaan project Habitly Web dari awal sampai selesai.

---

## Phase 1 — Fondasi

Setup semua yang dibutuhkan sebelum mulai coding fitur.

```
□ Init project Next.js 14 + TypeScript + Tailwind
□ Setup Supabase project (buat akun, buat project)
□ Buat tabel di Supabase (habits, tasks, habit_logs)
□ Aktifkan Row Level Security (RLS)
□ Buat file .env.local (isi URL & anon key Supabase)
□ Buat lib/supabase.ts
□ Buat types/index.ts
□ Buat lib/ai-rules.ts (semua fungsi rule-based)
□ Buat lib/utils.ts (format tanggal, dll)
□ Install dependencies: recharts, date-fns, lucide-react
```

**Hasil:** Project bisa dijalankan, koneksi ke Supabase siap.

---

## Phase 2 — Auth

Sistem login dan register.

```
□ Buat hooks/useAuth.ts
□ Buat app/(auth)/login/page.tsx
□ Buat app/(auth)/register/page.tsx
□ Buat app/(main)/layout.tsx dengan auth guard
□ Buat app/page.tsx (redirect logic)
□ Test: register akun baru, login, logout
```

**Hasil:** User bisa register, login, logout. Halaman protected bisa diakses setelah login.

---

## Phase 3 — Layout & Dashboard

Struktur halaman utama dan dashboard.

```
□ Buat components/ui/ (Button, Card, Input, Modal, Badge, ProgressBar)
□ Buat components/layout/Navbar.tsx
□ Buat components/layout/Sidebar.tsx
□ Buat components/layout/BottomNav.tsx (mobile)
□ Buat hooks/useHabits.ts (fetch saja dulu)
□ Buat hooks/useTasks.ts (fetch saja dulu)
□ Buat components/dashboard/SummaryCards.tsx
□ Buat components/dashboard/HabitProgress.tsx
□ Buat components/dashboard/UpcomingTasks.tsx
□ Buat components/dashboard/DailyInsight.tsx
□ Buat app/(main)/dashboard/page.tsx
□ Test: dashboard load dengan data kosong, insight tampil
```

**Hasil:** Dashboard tampil dengan layout lengkap, siap menerima data.

---

## Phase 4 — My Habits

Fitur kelola habit lengkap dengan AI.

```
□ Update hooks/useHabits.ts (tambah CRUD + toggle + streak)
□ Buat components/habits/HabitCard.tsx
□ Buat components/habits/HabitList.tsx
□ Buat components/habits/HabitFilter.tsx
□ Buat components/habits/HabitForm.tsx (dengan AI auto-fill)
□ Buat app/(main)/habits/page.tsx
□ Test:
    - Tambah habit → auto kategori & saran waktu muncul
    - Override kategori & waktu
    - Toggle selesai → streak update
    - Edit & hapus habit
    - Filter by kategori
□ Pastikan DailyInsight di dashboard update saat habit selesai
```

**Hasil:** My Habits fully functional dengan AI assist.

---

## Phase 5 — My Tasks

Fitur kelola task lengkap dengan AI.

```
□ Update hooks/useTasks.ts (tambah CRUD + toggle)
□ Buat components/tasks/TaskCard.tsx
□ Buat components/tasks/TaskList.tsx
□ Buat components/tasks/TaskFilter.tsx
□ Buat components/tasks/TaskForm.tsx (dengan AI auto-fill)
□ Buat app/(main)/tasks/page.tsx
□ Test:
    - Tambah task → auto kategori & prioritas muncul
    - Override kategori & prioritas
    - Toggle selesai
    - Edit & hapus task
    - Filter by prioritas, kategori, status
□ Pastikan UpcomingTasks di dashboard update
```

**Hasil:** My Tasks fully functional dengan AI assist.

---

## Phase 6 — Statistics

Visualisasi data dan insight performa.

```
□ Buat hooks/useStatistics.ts
□ Buat components/statistics/WeeklyChart.tsx (Recharts)
□ Buat components/statistics/StatsCards.tsx
□ Buat components/statistics/ProductivityInsight.tsx
□ Buat app/(main)/statistics/page.tsx
□ Test:
    - Chart tampil dengan data habit_logs
    - Streak terpanjang terhitung benar
    - Completion rate akurat
    - Hari paling produktif benar
    - Kategori terbanyak benar
```

**Hasil:** Statistics page fully functional.

---

## Phase 7 — Polish & Testing

Finishing touch sebelum dianggap selesai.

```
□ Responsif mobile (cek semua halaman di layar kecil)
□ Loading state di semua halaman (skeleton/spinner)
□ Error handling (koneksi gagal, data kosong)
□ Empty state (pesan ketika belum ada habit/task)
□ Animasi transisi ringan
□ Cek semua edge case:
    - User baru (belum ada data)
    - Semua habit selesai
    - Tidak ada task deadline dekat
    - Habit dengan streak panjang
```

---

## Urutan Prioritas

Jika ingin build bertahap dan deploy lebih cepat:

```
Harus ada dulu (MVP):
  Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

Bisa ditambah setelah MVP:
  Phase 6 (Statistics)
  Phase 7 (Polish)
```

---

## Checklist Per Fitur (Quick Reference)

### Habit
- [ ] Tambah habit (+ AI auto kategori & saran waktu)
- [ ] Edit habit
- [ ] Hapus habit
- [ ] Toggle selesai hari ini
- [ ] Filter by kategori
- [ ] Streak label otomatis

### Task
- [ ] Tambah task (+ AI auto kategori & prioritas)
- [ ] Edit task
- [ ] Hapus task
- [ ] Toggle selesai
- [ ] Filter by prioritas / kategori / status

### Dashboard
- [ ] Daily insight dinamis
- [ ] Summary cards (habit selesai, task pending)
- [ ] Progress bar habit harian
- [ ] Preview task deadline dekat

### Statistics
- [ ] Weekly bar chart
- [ ] Streak terpanjang
- [ ] Completion rate
- [ ] Hari paling produktif
- [ ] Kategori task terbanyak

### Auth
- [ ] Register
- [ ] Login
- [ ] Logout
- [ ] Auth guard (redirect jika belum login)
