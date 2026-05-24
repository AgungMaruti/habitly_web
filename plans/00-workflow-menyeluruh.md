# Habitly Web — Directory & Workflow Documentation

## Tech Stack

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 14 + TypeScript |
| Styling | Tailwind CSS |
| Auth & Database | Supabase |
| Chart | Recharts |
| AI | Rule-based (lokal, gratis) |

---

## Directory Structure

```
habitly_web/
│
├── app/                          # Next.js App Router (semua halaman)
│   ├── (auth)/                   # Group route khusus auth (tidak ada navbar)
│   │   ├── login/
│   │   │   └── page.tsx          # Halaman login
│   │   └── register/
│   │       └── page.tsx          # Halaman register
│   │
│   ├── (main)/                   # Group route utama (ada navbar/sidebar)
│   │   ├── layout.tsx            # Layout dengan navbar, dibungkus auth guard
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Halaman dashboard
│   │   ├── habits/
│   │   │   └── page.tsx          # Halaman my habits
│   │   ├── tasks/
│   │   │   └── page.tsx          # Halaman my tasks
│   │   └── statistics/
│   │       └── page.tsx          # Halaman statistics
│   │
│   ├── layout.tsx                # Root layout (font, metadata)
│   └── page.tsx                  # Root page (redirect ke dashboard/login)
│
├── components/                   # Semua UI component
│   ├── ui/                       # Component generik/reusable
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx             # Label High/Medium/Low, streak
│   │   └── ProgressBar.tsx
│   │
│   ├── layout/                   # Component struktur halaman
│   │   ├── Navbar.tsx            # Navigasi atas
│   │   ├── Sidebar.tsx           # Navigasi samping (desktop)
│   │   └── BottomNav.tsx         # Navigasi bawah (mobile)
│   │
│   ├── dashboard/                # Component khusus dashboard
│   │   ├── DailyInsight.tsx      # Greeting + teks AI dinamis
│   │   ├── SummaryCards.tsx      # Card habit selesai, task pending
│   │   ├── HabitProgress.tsx     # Progress bar habit harian
│   │   └── UpcomingTasks.tsx     # Preview task deadline dekat
│   │
│   ├── habits/                   # Component khusus habits
│   │   ├── HabitList.tsx         # List semua habit
│   │   ├── HabitCard.tsx         # Card satu habit (streak, toggle)
│   │   ├── HabitForm.tsx         # Form tambah/edit habit (auto kategori)
│   │   └── HabitFilter.tsx       # Filter by kategori
│   │
│   ├── tasks/                    # Component khusus tasks
│   │   ├── TaskList.tsx          # List semua task
│   │   ├── TaskCard.tsx          # Card satu task (prioritas, deadline)
│   │   ├── TaskForm.tsx          # Form tambah/edit task (auto AI)
│   │   └── TaskFilter.tsx        # Filter by prioritas, kategori, status
│   │
│   └── statistics/               # Component khusus statistics
│       ├── WeeklyChart.tsx        # Bar chart habit mingguan (Recharts)
│       ├── StatsCards.tsx         # Streak, completion rate, dll
│       └── ProductivityInsight.tsx # Insight hari produktif, kategori terbanyak
│
├── lib/                          # Logic utama & utility
│   ├── supabase.ts               # Inisialisasi Supabase client
│   ├── ai-rules.ts               # Semua rule-based AI logic
│   │                             #   autoCategory(title)
│   │                             #   autoPriority(deadline)
│   │                             #   suggestTime(category)
│   │                             #   getDailyInsight(habits, tasks)
│   │                             #   getStreakLabel(streak)
│   └── utils.ts                  # Helper umum (format tanggal, dll)
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Cek session, user login
│   ├── useHabits.ts              # Fetch, tambah, edit, hapus habit
│   ├── useTasks.ts               # Fetch, tambah, edit, hapus task
│   └── useStatistics.ts          # Fetch data untuk chart & insight
│
├── types/                        # TypeScript type definitions
│   └── index.ts
│                                 # Habit, Task, HabitLog, Category, Priority
│
├── public/                       # Asset statis
│   ├── logo.png
│   └── favicon.ico
│
└── .env.local                    # API keys (tidak di-commit ke git)
                                  # NEXT_PUBLIC_SUPABASE_URL=
                                  # NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Database Schema (Supabase)

```sql
-- Tabel habits
CREATE TABLE habits (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  category     TEXT NOT NULL,
  time         TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Tabel tasks
CREATE TABLE tasks (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  category     TEXT NOT NULL,
  priority     TEXT NOT NULL,        -- 'High' | 'Medium' | 'Low'
  deadline     DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Tabel habit_logs (untuk streak & statistik)
CREATE TABLE habit_logs (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id     UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at DATE DEFAULT CURRENT_DATE
);
```

---

## AI Rule-based Logic

### Auto Kategori (dari judul)

```
keyword: belajar, baca, kuliah, tugas, kursus  → Education
keyword: olahraga, gym, lari, renang, fitness   → Health
keyword: bayar, transfer, nabung, tagihan       → Finance
keyword: meeting, kerja, deadline, project      → Productivity
keyword: meditasi, yoga, journaling             → Mindfulness
keyword: teman, keluarga, hubungi               → Social
keyword: (tidak cocok semua)                    → Other
```

### Auto Prioritas (dari deadline)

```
deadline ≤ 1 hari  → High   🔴
deadline ≤ 3 hari  → Medium 🟡
deadline >  3 hari → Low    🟢
```

### Saran Waktu Habit (dari kategori)

```
Health      → 06:00
Education   → 19:00
Mindfulness → 05:00
Productivity → 08:00
Social      → 18:00
Finance     → 10:00
Hobby       → 20:00
Other       → 07:00
```

### Daily Insight (Dashboard)

```
task deadline hari ini  → "Ada X task yang harus selesai hari ini!"
habit selesai = 0       → "Yuk mulai hari ini, semangat!"
habit selesai = semua   → "Luar biasa! Semua habit selesai hari ini!"
habit selesai >= 50%    → "Bagus! Sudah X dari Y habit selesai."
habit selesai < 50%     → "Baru X habit selesai, masih ada Y lagi!"
```

### Streak Label (Habit Card)

```
streak >= 7 hari  → "X Day Streak!"
streak >= 3 hari  → "Konsisten X hari!"
habit baru        → "Habit baru"
sering dilewat    → "Perlu perhatian"
```

---

## Alur Data (Data Flow)

```
User interaksi di halaman (app/)
  → Component di components/ handle tampilan
  → Hooks di hooks/ dipanggil untuk data
  → Hooks panggil Supabase via lib/supabase.ts
  → AI logic dari lib/ai-rules.ts dijalankan lokal
  → Hasilnya ditampilkan balik ke user
```

---

## Alur Spesifik Per Fitur

### Tambah Task (dengan AI)

```
1. User buka TaskForm.tsx
2. User ketik judul + pilih deadline
3. ai-rules.ts → autoCategory(title)  → "Education"
4. ai-rules.ts → autoPriority(deadline) → "High"
5. Form auto-fill kategori & prioritas (user bisa override)
6. User klik Simpan
7. useTasks.ts → supabase INSERT ke tabel tasks
8. TaskList.tsx update otomatis
```

### Tambah Habit (dengan AI)

```
1. User buka HabitForm.tsx
2. User ketik judul
3. ai-rules.ts → autoCategory(title)  → "Health"
4. ai-rules.ts → suggestTime(category) → "06:00"
5. Form auto-fill kategori & waktu (user bisa override)
6. User klik Simpan
7. useHabits.ts → supabase INSERT ke tabel habits
8. HabitList.tsx update otomatis
```

### Dashboard Load

```
1. dashboard/page.tsx mount
2. useHabits.ts  → fetch habits hari ini dari Supabase
3. useTasks.ts   → fetch tasks deadline dekat dari Supabase
4. ai-rules.ts   → getDailyInsight(habits, tasks) → teks greeting
5. Semua ditampilkan di component dashboard/
```

### Toggle Habit Selesai

```
1. User klik toggle di HabitCard.tsx
2. useHabits.ts → supabase UPDATE is_completed = true
3. useHabits.ts → supabase INSERT ke habit_logs (untuk streak)
4. HabitCard.tsx update tampilan otomatis
5. DailyInsight.tsx recalculate insight otomatis
```

---

## Urutan Build

```
Phase 1 — Fondasi
  ✅ Setup Next.js + TypeScript + Tailwind
  ✅ Setup Supabase (buat tabel, auth)
  ✅ Buat types/index.ts
  ✅ Buat lib/supabase.ts
  ✅ Buat lib/ai-rules.ts
  ✅ Buat lib/utils.ts

Phase 2 — Auth
  ✅ Register page
  ✅ Login page
  ✅ useAuth hook
  ✅ Auth guard di layout (main)

Phase 3 — Dashboard
  ✅ Layout + Navbar + Sidebar
  ✅ SummaryCards
  ✅ HabitProgress
  ✅ UpcomingTasks
  ✅ DailyInsight (AI template)

Phase 4 — My Habits
  ✅ HabitList + HabitCard
  ✅ HabitForm (+ AI auto kategori & saran waktu)
  ✅ HabitFilter
  ✅ Toggle selesai + habit_logs
  ✅ Streak label

Phase 5 — My Tasks
  ✅ TaskList + TaskCard
  ✅ TaskForm (+ AI auto kategori & prioritas)
  ✅ TaskFilter
  ✅ Toggle selesai

Phase 6 — Statistics
  ✅ WeeklyChart (Recharts)
  ✅ StatsCards (streak, completion rate)
  ✅ ProductivityInsight
```

---

## Peran AI Per Halaman (Ringkasan)

| Halaman | Fitur AI | Cara Kerja |
|---|---|---|
| Dashboard | Greeting dinamis | Cek data habit & task hari ini |
| My Habits | Auto kategori, saran waktu, streak label | Keyword matching + kalkulasi lokal |
| My Tasks | Auto kategori, auto prioritas | Keyword matching + hitung hari ke deadline |
| Statistics | Insight performa, hari produktif | Kalkulasi dari semua data user |
