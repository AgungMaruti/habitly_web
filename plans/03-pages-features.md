# 03 — Halaman & Fitur

## Halaman 1 — Dashboard

Halaman pertama yang dilihat user setelah login. Berisi ringkasan kondisi hari ini.

### Tampilan

```
┌─────────────────────────────────────┐
│  Selamat pagi, Agung!               │
│  Kamu sudah selesaikan 2 dari 5     │
│  habit hari ini. Ada 1 task         │
│  deadline besok, jangan lupa!       │
├─────────────────────────────────────┤
│  [Habit: 2/5]    [Task Pending: 3]  │
├─────────────────────────────────────┤
│  Progress Habit Hari Ini            │
│  ████░░░░░░  40%                    │
├─────────────────────────────────────┤
│  Task Mendesak                      │
│  • Kumpul laporan  → besok  🔴      │
│  • Beli suplemen   → 3 hari 🟡      │
└─────────────────────────────────────┘
```

### Komponen

| Komponen | Fungsi |
|---|---|
| DailyInsight | Greeting + teks AI dinamis berdasarkan data hari ini |
| SummaryCards | Card ringkasan: habit selesai, task pending |
| HabitProgress | Progress bar habit harian |
| UpcomingTasks | Preview 3 task dengan deadline terdekat |

---

## Halaman 2 — My Habits

Halaman untuk mengelola semua habit harian user.

### Tampilan

```
┌─────────────────────────────────────┐
│  My Habits            [+ Tambah]    │
│  Filter: [All] [Health] [Education] │
├─────────────────────────────────────┤
│  🏃 Lari pagi          🔥 5 Streak  │
│     Health • 06:00                  │
│     [✓ Selesai hari ini]            │
├─────────────────────────────────────┤
│  📚 Baca buku          ✨ 3 Hari    │
│     Education • 19:00               │
│     [○ Belum selesai]               │
└─────────────────────────────────────┘
```

### Fitur

| Fitur | Penjelasan |
|---|---|
| Tambah habit | Form dengan auto kategori & saran waktu |
| Edit habit | Ubah judul, kategori, atau waktu |
| Hapus habit | Hapus habit beserta semua log-nya |
| Toggle selesai | Tandai habit selesai/belum hari ini |
| Filter kategori | Filter tampilan by kategori |
| Streak label | Label otomatis berdasarkan performa |

### Form Tambah Habit

```
Judul    : [Meditasi pagi         ]
Kategori : [Mindfulness      ▾]   ← auto dari keyword, bisa diubah
Waktu    : [05:00            ]    ← auto suggest, bisa diubah

[Batal]  [Simpan]
```

---

## Halaman 3 — My Tasks

Halaman untuk mengelola semua task dengan deadline dan prioritas.

### Tampilan

```
┌─────────────────────────────────────┐
│  My Tasks             [+ Tambah]    │
│  Filter: [All] [High] [Medium] [Low]│
├─────────────────────────────────────┤
│  📚 Belajar untuk ujian    🔴 High  │
│     Education • Deadline: besok     │
│     [○ Tandai Selesai]              │
├─────────────────────────────────────┤
│  💰 Bayar tagihan listrik  🟡 Medium│
│     Finance • Deadline: 3 hari      │
│     [○ Tandai Selesai]              │
└─────────────────────────────────────┘
```

### Fitur

| Fitur | Penjelasan |
|---|---|
| Tambah task | Form dengan auto kategori & prioritas |
| Edit task | Ubah semua field termasuk override AI |
| Hapus task | Hapus task |
| Toggle selesai | Tandai task selesai/belum |
| Filter prioritas | Filter by High/Medium/Low |
| Filter kategori | Filter by kategori |
| Filter status | Filter All/Selesai/Belum |

### Form Tambah Task

```
Judul     : [Belajar untuk ujian    ]
Deadline  : [2026-04-14             ]
Kategori  : [Education         ▾]   ← auto dari keyword, bisa diubah
Prioritas : [High              ▾]   ← auto dari deadline, bisa diubah

[Batal]  [Simpan]
```

---

## Halaman 4 — Statistics

Halaman untuk melihat visualisasi progress habit dan task user.

### Tampilan

```
┌─────────────────────────────────────┐
│  Statistics                         │
├─────────────────────────────────────┤
│  Habit Completion — 7 Hari Terakhir │
│                                     │
│  8 ┤████                            │
│  6 ┤████ ████                       │
│  4 ┤████ ████ ████                  │
│  2 ┤████ ████ ████ ████             │
│    └Sen  Sel  Rab  Kam  Jum  Sab Sun│
├─────────────────────────────────────┤
│  [🔥 Streak: 12 hari]               │
│  [✅ Completion Rate: 80%]          │
│  [📅 Paling Produktif: Senin]       │
│  [📚 Kategori Terbanyak: Education] │
└─────────────────────────────────────┘
```

### Komponen

| Komponen | Fungsi |
|---|---|
| WeeklyChart | Bar chart completion habit 7 hari terakhir |
| StatsCards | Streak terpanjang, completion rate, total habit |
| ProductivityInsight | Hari paling produktif, kategori task terbanyak |

---

## Ringkasan Fitur AI Per Halaman

| Halaman | Fitur AI | Input | Output |
|---|---|---|---|
| Dashboard | Daily insight | Jumlah habit selesai, task deadline | Teks greeting dinamis |
| My Habits | Auto kategori | Keyword judul habit | Kategori (Health, Education, dll) |
| My Habits | Saran waktu | Kategori habit | Waktu default (06:00, 19:00, dll) |
| My Habits | Streak label | Jumlah hari berturut selesai | Label (🔥 Streak, ✨ Konsisten, dll) |
| My Tasks | Auto kategori | Keyword judul task | Kategori (Finance, Education, dll) |
| My Tasks | Auto prioritas | Deadline task | Prioritas (High/Medium/Low) |
| Statistics | Insight performa | Data habit_logs | Hari produktif, kategori terbanyak |
