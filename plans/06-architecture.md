# 06 — Architecture & Folder Structure

## Struktur Folder Lengkap

```
habitly_web/
│
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Route group: halaman tanpa navbar
│   │   ├── login/
│   │   │   └── page.tsx              # /login
│   │   └── register/
│   │       └── page.tsx              # /register
│   │
│   ├── (main)/                       # Route group: halaman dengan navbar
│   │   ├── layout.tsx                # Layout utama + auth guard + navbar
│   │   ├── dashboard/
│   │   │   └── page.tsx              # /dashboard
│   │   ├── habits/
│   │   │   └── page.tsx              # /habits
│   │   ├── tasks/
│   │   │   └── page.tsx              # /tasks
│   │   └── statistics/
│   │       └── page.tsx              # /statistics
│   │
│   ├── layout.tsx                    # Root layout (font, metadata global)
│   └── page.tsx                      # / → redirect ke /dashboard atau /login
│
├── components/                       # Semua UI component
│   ├── ui/                           # Component generik/reusable
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   └── ProgressBar.tsx
│   │
│   ├── layout/                       # Struktur halaman
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── BottomNav.tsx             # Mobile navigation
│   │
│   ├── dashboard/
│   │   ├── DailyInsight.tsx          # Greeting + AI teks dinamis
│   │   ├── SummaryCards.tsx          # Card habit selesai, task pending
│   │   ├── HabitProgress.tsx         # Progress bar harian
│   │   └── UpcomingTasks.tsx         # Preview task deadline dekat
│   │
│   ├── habits/
│   │   ├── HabitList.tsx             # List semua habit
│   │   ├── HabitCard.tsx             # Card 1 habit (toggle, streak label)
│   │   ├── HabitForm.tsx             # Form tambah/edit (AI auto-fill)
│   │   └── HabitFilter.tsx           # Filter by kategori
│   │
│   ├── tasks/
│   │   ├── TaskList.tsx              # List semua task
│   │   ├── TaskCard.tsx              # Card 1 task (prioritas badge, deadline)
│   │   ├── TaskForm.tsx              # Form tambah/edit (AI auto-fill)
│   │   └── TaskFilter.tsx            # Filter by prioritas/kategori/status
│   │
│   └── statistics/
│       ├── WeeklyChart.tsx           # Bar chart Recharts
│       ├── StatsCards.tsx            # Streak, completion rate
│       └── ProductivityInsight.tsx   # Hari produktif, kategori terbanyak
│
├── lib/                              # Logic & utility
│   ├── supabase.ts                   # Inisialisasi Supabase client
│   ├── ai-rules.ts                   # Semua rule-based AI logic
│   └── utils.ts                      # Helper (format tanggal, dll)
│
├── hooks/                            # Custom React hooks
│   ├── useAuth.ts                    # Session, user info
│   ├── useHabits.ts                  # CRUD habits + toggle + streak
│   ├── useTasks.ts                   # CRUD tasks + toggle
│   └── useStatistics.ts              # Data untuk chart & insight
│
├── types/                            # TypeScript definitions
│   └── index.ts
│
├── public/
│   ├── logo.png
│   └── favicon.ico
│
├── docs/                             # Dokumentasi project
│   ├── 01-overview.md
│   ├── 02-tech-stack.md
│   ├── 03-pages-features.md
│   ├── 04-ai-logic.md
│   ├── 05-database.md
│   ├── 06-architecture.md
│   ├── 07-data-flow.md
│   └── 08-build-order.md
│
├── workflow.md                       # Ringkasan workflow project
├── .env.local                        # API keys (tidak di-commit)
├── .env.example                      # Template env untuk tim
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Penjelasan Tiap Layer

### Layer 1 — `app/` (Halaman)

Berisi halaman-halaman Next.js. Setiap `page.tsx` adalah entry point satu URL.

```
Tanggung jawab:
- Render halaman utama
- Memanggil hooks untuk data
- Meneruskan data ke components
- Tidak mengandung logic bisnis
```

### Layer 2 — `components/` (UI)

Berisi semua tampilan yang bisa digunakan ulang.

```
Tanggung jawab:
- Menampilkan data yang diterima dari props
- Handle interaksi user (klik, input)
- Tidak langsung akses database
- Bisa dipakai di halaman manapun
```

### Layer 3 — `hooks/` (Data & Logic)

Custom React hooks yang menjadi penghubung antara UI dan database.

```
Tanggung jawab:
- Fetch data dari Supabase
- CRUD operations
- Manage loading & error state
- Dipanggil dari page.tsx atau components
```

### Layer 4 — `lib/` (Core)

Logic inti yang tidak bergantung pada UI.

```
supabase.ts  → inisialisasi koneksi database
ai-rules.ts  → semua AI rule-based logic (murni fungsi)
utils.ts     → helper functions umum
```

### Layer 5 — `types/` (TypeScript)

Definisi tipe data yang dipakai di seluruh project.

```ts
// types/index.ts

export type Category =
  | 'Health' | 'Education' | 'Finance'
  | 'Productivity' | 'Mindfulness'
  | 'Social' | 'Hobby' | 'Other'

export type Priority = 'High' | 'Medium' | 'Low'

export interface Habit {
  id: string
  user_id: string
  title: string
  category: Category
  time: string
  is_completed: boolean
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  category: Category
  priority: Priority
  deadline?: string
  is_completed: boolean
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  completed_at: string
}
```

---

## Alur Data (Ringkasan)

```
Browser (user interaksi)
  ↓
app/page.tsx (halaman)
  ↓
hooks/ (ambil & kelola data)
  ↓
lib/supabase.ts (koneksi DB)
  ↓
Supabase (PostgreSQL)

+ lib/ai-rules.ts (berjalan lokal, tidak ke server)
```

---

## Auth Guard

Halaman `(main)` dilindungi auth guard di `layout.tsx`:

```tsx
// app/(main)/layout.tsx

export default function MainLayout({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) redirect('/login')

  return (
    <div>
      <Navbar />
      <Sidebar />
      <main>{children}</main>
      <BottomNav />
    </div>
  )
}
```

Kalau user belum login dan coba akses `/dashboard`, otomatis diarahkan ke `/login`.
