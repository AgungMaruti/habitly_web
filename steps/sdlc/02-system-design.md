# Fase 2 — System Design

> Terjemahkan requirements menjadi blueprint teknis sebelum mulai coding.
> Output utama: ERD, arsitektur sistem, wireframe, rule-based logic.

---

## Tujuan Fase Ini

Menjawab pertanyaan: **"Bagaimana Rutino akan dibangun?"**

---

## 2.1 Arsitektur Sistem

```
┌─────────────────────────────────────┐
│           USER (Browser)            │
└──────────────┬──────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────┐
│         NEXT.JS 14 (Vercel)         │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Pages   │  │   Components     │ │
│  │ (app/)   │  │  (components/)   │ │
│  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Hooks   │  │   AI Rule Engine │ │
│  │(hooks/)  │  │  (lib/ai-rules)  │ │
│  └──────────┘  └──────────────────┘ │
└──────────────┬──────────────────────┘
               │ Supabase JS Client
┌──────────────▼──────────────────────┐
│           SUPABASE                  │
│  ┌──────────┐  ┌──────────────────┐ │
│  │   Auth   │  │   PostgreSQL DB  │ │
│  │ (users)  │  │ (habits, tasks)  │ │
│  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────┘
```

---

## 2.2 Database Design (ERD)

### Tabel: habits

| Kolom        | Tipe      | Keterangan                        |
|--------------|-----------|-----------------------------------|
| id           | UUID (PK) | Primary key, auto-generate        |
| user_id      | UUID (FK) | Referensi ke auth.users           |
| title        | TEXT      | Nama habit                        |
| category     | TEXT      | Education, Health, Finance, dll   |
| time         | TEXT      | Saran waktu (mis. "06:00")        |
| is_completed | BOOLEAN   | Selesai hari ini? Default: false  |
| created_at   | TIMESTAMP | Waktu dibuat                      |

### Tabel: tasks

| Kolom        | Tipe      | Keterangan                        |
|--------------|-----------|-----------------------------------|
| id           | UUID (PK) | Primary key, auto-generate        |
| user_id      | UUID (FK) | Referensi ke auth.users           |
| title        | TEXT      | Nama task                         |
| category     | TEXT      | Education, Health, Finance, dll   |
| priority     | TEXT      | 'High' / 'Medium' / 'Low'         |
| deadline     | DATE      | Batas waktu task                  |
| is_completed | BOOLEAN   | Sudah selesai? Default: false     |
| created_at   | TIMESTAMP | Waktu dibuat                      |

### Tabel: habit_logs

| Kolom        | Tipe      | Keterangan                        |
|--------------|-----------|-----------------------------------|
| id           | UUID (PK) | Primary key, auto-generate        |
| habit_id     | UUID (FK) | Referensi ke habits.id            |
| user_id      | UUID (FK) | Referensi ke auth.users           |
| completed_at | DATE      | Tanggal habit diselesaikan        |

### Relasi Antar Tabel

```
auth.users (1) ──< habits (many)
auth.users (1) ──< tasks (many)
habits     (1) ──< habit_logs (many)
auth.users (1) ──< habit_logs (many)
```

---

## 2.3 Rule-Based AI Design

Semua logika AI berjalan **lokal** di `lib/ai-rules.ts` — tidak butuh API eksternal.

### Fungsi 1: autoCategory(title)

```
Input : judul habit/task (string)
Output: kategori (string)

Rules (keyword matching):
  "belajar" | "baca" | "kuliah" | "tugas" | "kursus"  → "Education"
  "olahraga" | "gym" | "lari" | "renang" | "fitness"  → "Health"
  "bayar" | "transfer" | "nabung" | "tagihan"         → "Finance"
  "meeting" | "kerja" | "deadline" | "project"        → "Productivity"
  "meditasi" | "yoga" | "journaling"                  → "Mindfulness"
  "teman" | "keluarga" | "hubungi"                    → "Social"
  (tidak cocok semua)                                  → "Other"
```

### Fungsi 2: autoPriority(deadline)

```
Input : tanggal deadline (Date)
Output: prioritas (string)

Rules:
  selisih ≤ 1 hari  → "High"   (merah)
  selisih ≤ 3 hari  → "Medium" (kuning)
  selisih > 3 hari  → "Low"    (hijau)
```

### Fungsi 3: suggestTime(category)

```
Input : kategori habit (string)
Output: saran waktu (string)

Rules:
  "Health"       → "06:00"
  "Education"    → "19:00"
  "Mindfulness"  → "05:00"
  "Productivity" → "08:00"
  "Social"       → "18:00"
  "Finance"      → "10:00"
  "Hobby"        → "20:00"
  "Other"        → "07:00"
```

### Fungsi 4: getDailyInsight(habits, tasks)

```
Input : array habits hari ini, array tasks
Output: teks insight (string)

Rules (urutan prioritas):
  1. Ada task deadline hari ini → "Ada X task yang harus selesai hari ini!"
  2. Habit selesai = 0          → "Yuk mulai hari ini, semangat!"
  3. Habit selesai = semua      → "Luar biasa! Semua habit selesai hari ini!"
  4. Habit selesai >= 50%       → "Bagus! Sudah X dari Y habit selesai."
  5. Habit selesai < 50%        → "Baru X habit selesai, masih ada Y lagi!"
```

### Fungsi 5: getStreakLabel(streak)

```
Input : jumlah streak (number)
Output: label teks (string)

Rules:
  streak >= 7  → "🔥 X Day Streak!"
  streak >= 3  → "✨ Konsisten X hari!"
  streak = 0   → "🆕 Habit baru"
  sering dilewat → "⚠️ Perlu perhatian"
```

---

## 2.4 Desain Halaman (Wireframe Description)

### Login & Register
- Form sederhana: email + password
- Link navigasi antar login/register
- Redirect ke dashboard setelah berhasil

### Dashboard
```
┌─────────────────────────────────┐
│  Navbar (logo + user info)      │
├──────────┬──────────────────────┤
│ Sidebar  │  DailyInsight        │
│          │  ─────────────────── │
│ Dashboard│  SummaryCards        │
│ Habits   │  [Habit ✓] [Task ⏳] │
│ Tasks    │  ─────────────────── │
│ Stats    │  HabitProgress       │
│          │  [====    ] 3/5      │
│          │  ─────────────────── │
│          │  UpcomingTasks       │
│          │  • Task A  (besok)   │
│          │  • Task B  (3 hari)  │
└──────────┴──────────────────────┘
│  BottomNav (mobile only)        │
└─────────────────────────────────┘
```

### My Habits
- Filter bar (All / Education / Health / dst)
- List HabitCard: nama, kategori, waktu, streak, toggle selesai
- Tombol "+ Tambah Habit"
- Modal HabitForm: judul → AI auto-fill kategori & waktu

### My Tasks
- Filter bar (Semua / Prioritas / Kategori / Status)
- List TaskCard: nama, kategori, prioritas badge, deadline, toggle selesai
- Tombol "+ Tambah Task"
- Modal TaskForm: judul + deadline → AI auto-fill kategori & prioritas

### Statistics
- WeeklyChart: bar chart 7 hari (Recharts)
- StatsCards: streak terpanjang, completion rate, total habit
- ProductivityInsight: hari paling produktif, kategori terbanyak

---

## Output Fase Ini (untuk Skripsi)

- [ ] Diagram arsitektur sistem
- [ ] ERD (Entity Relationship Diagram)
- [ ] Deskripsi rule-based logic (tabel IF-THEN)
- [ ] Wireframe / mockup semua halaman (Figma)
- [ ] Flowchart alur data per fitur utama
