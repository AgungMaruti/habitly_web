# Fase 3 — Implementation (Coding)

> Bangun Rutino berdasarkan desain yang sudah dibuat di Fase 2.
> Urutan coding mengikuti build order yang sudah direncanakan.

---

## Tujuan Fase Ini

Menghasilkan **aplikasi Rutino yang berjalan** sesuai requirements.

---

## 3.1 Setup Awal (Fondasi)

```
□ Init project: npx create-next-app@latest rutino --typescript --tailwind --app
□ Install dependencies:
    npm install @supabase/supabase-js
    npm install recharts
    npm install date-fns
    npm install lucide-react
□ Setup Supabase project di supabase.com
□ Buat 3 tabel di Supabase (habits, tasks, habit_logs) — lihat ERD di Fase 2
□ Aktifkan Row Level Security (RLS) di semua tabel
□ Buat file .env.local:
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
□ Buat lib/supabase.ts
□ Buat types/index.ts (Habit, Task, HabitLog, Category, Priority)
□ Buat lib/ai-rules.ts (semua fungsi rule-based)
□ Buat lib/utils.ts (formatDate, dll)
```

---

## 3.2 Auth System

```
□ Buat hooks/useAuth.ts
    - getSession()
    - signIn(email, password)
    - signUp(email, password)
    - signOut()
□ Buat app/(auth)/login/page.tsx
□ Buat app/(auth)/register/page.tsx
□ Buat app/(main)/layout.tsx dengan auth guard
    - Cek session di sini
    - Redirect ke /login kalau belum login
□ Buat app/page.tsx
    - Redirect ke /dashboard kalau sudah login
    - Redirect ke /login kalau belum
```

---

## 3.3 UI Components (Generic)

```
□ components/ui/Button.tsx
□ components/ui/Card.tsx
□ components/ui/Input.tsx
□ components/ui/Modal.tsx
□ components/ui/Badge.tsx       ← label High/Medium/Low, kategori
□ components/ui/ProgressBar.tsx
```

---

## 3.4 Layout Components

```
□ components/layout/Navbar.tsx     ← logo, nama user, tombol logout
□ components/layout/Sidebar.tsx    ← navigasi desktop
□ components/layout/BottomNav.tsx  ← navigasi mobile
```

---

## 3.5 Dashboard

```
□ hooks/useHabits.ts  (versi awal — fetch habits hari ini)
□ hooks/useTasks.ts   (versi awal — fetch tasks deadline dekat)
□ components/dashboard/DailyInsight.tsx
    - Panggil getDailyInsight(habits, tasks) dari ai-rules.ts
□ components/dashboard/SummaryCards.tsx
    - Tampilkan jumlah habit selesai & task pending
□ components/dashboard/HabitProgress.tsx
    - Progress bar berapa habit selesai dari total
□ components/dashboard/UpcomingTasks.tsx
    - List task dengan deadline ≤ 3 hari ke depan
□ app/(main)/dashboard/page.tsx
    - Gabungkan semua component di atas
```

---

## 3.6 My Habits

```
□ Update hooks/useHabits.ts (tambah CRUD + toggle + streak):
    - fetchHabits()
    - addHabit(data)
    - updateHabit(id, data)
    - deleteHabit(id)
    - toggleHabit(id) → update is_completed + insert ke habit_logs
    - getStreak(habitId)
□ components/habits/HabitCard.tsx
    - Tampilkan: nama, kategori, waktu, streak label, toggle
□ components/habits/HabitList.tsx
    - Render list HabitCard
    - Handle state filter aktif
□ components/habits/HabitFilter.tsx
    - Tombol filter per kategori
□ components/habits/HabitForm.tsx
    - Input judul → onChange panggil autoCategory() & suggestTime()
    - Auto-fill field kategori & waktu
    - User bisa override
□ app/(main)/habits/page.tsx
```

---

## 3.7 My Tasks

```
□ Update hooks/useTasks.ts (tambah CRUD + toggle):
    - fetchTasks()
    - addTask(data)
    - updateTask(id, data)
    - deleteTask(id)
    - toggleTask(id) → update is_completed
□ components/tasks/TaskCard.tsx
    - Tampilkan: nama, kategori, prioritas badge, deadline, toggle
□ components/tasks/TaskList.tsx
    - Render list TaskCard
□ components/tasks/TaskFilter.tsx
    - Filter by prioritas, kategori, status
□ components/tasks/TaskForm.tsx
    - Input judul + deadline → onChange panggil autoCategory() & autoPriority()
    - Auto-fill kategori & prioritas
    - User bisa override
□ app/(main)/tasks/page.tsx
```

---

## 3.8 Statistics

```
□ hooks/useStatistics.ts
    - fetchWeeklyData()    → data habit per hari 7 hari terakhir
    - fetchStreakData()    → streak terpanjang
    - fetchCompletionRate()
    - fetchProductiveDay() → hari dengan habit selesai terbanyak
    - fetchTopCategory()   → kategori task terbanyak
□ components/statistics/WeeklyChart.tsx
    - BarChart dari Recharts
    - X axis: hari (Sen–Min), Y axis: jumlah habit selesai
□ components/statistics/StatsCards.tsx
    - Card: streak terpanjang, completion rate, total habit
□ components/statistics/ProductivityInsight.tsx
    - Tampilkan hari paling produktif & kategori terbanyak
□ app/(main)/statistics/page.tsx
```

---

## Output Fase Ini (untuk Skripsi)

- [ ] Source code aplikasi (GitHub repo)
- [ ] Screenshot implementasi tiap halaman
- [ ] Penjelasan singkat per modul (bisa jadi sub-bab di BAB IV)
