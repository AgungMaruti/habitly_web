# 05 — Database (Supabase)

## Struktur Tabel

Habitly Web menggunakan **3 tabel utama** di Supabase (PostgreSQL).

```
auth.users          ← dikelola Supabase Auth (tidak dibuat manual)
  └── habits        ← semua habit milik user
  └── tasks         ← semua task milik user
  └── habit_logs    ← log harian habit (untuk streak & statistik)
```

---

## Tabel 1 — habits

Menyimpan semua habit yang dibuat user.

```sql
CREATE TABLE habits (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  category     TEXT NOT NULL,
  time         TEXT,                        -- format "HH:mm", contoh "06:00"
  is_completed BOOLEAN DEFAULT FALSE,       -- status hari ini
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Contoh Data

| id | user_id | title | category | time | is_completed | created_at |
|---|---|---|---|---|---|---|
| abc-123 | usr-456 | Lari pagi | Health | 06:00 | true | 2026-04-13 |
| abc-124 | usr-456 | Baca buku | Education | 19:00 | false | 2026-04-12 |

### Catatan
- `is_completed` direset setiap hari (dikontrol dari aplikasi)
- `time` adalah waktu pengingat, bukan deadline

---

## Tabel 2 — tasks

Menyimpan semua task yang dibuat user.

```sql
CREATE TABLE tasks (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  category     TEXT NOT NULL,
  priority     TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  deadline     DATE,                        -- bisa null jika tidak ada deadline
  is_completed BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Contoh Data

| id | user_id | title | category | priority | deadline | is_completed |
|---|---|---|---|---|---|---|
| tsk-001 | usr-456 | Kumpul laporan | Productivity | High | 2026-04-14 | false |
| tsk-002 | usr-456 | Bayar tagihan | Finance | Medium | 2026-04-16 | false |

---

## Tabel 3 — habit_logs

Menyimpan log setiap kali habit diselesaikan. Digunakan untuk **streak** dan **statistik mingguan**.

```sql
CREATE TABLE habit_logs (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id     UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at DATE DEFAULT CURRENT_DATE    -- tanggal habit diselesaikan
);

-- Pastikan tidak ada duplikat (1 habit, 1 hari, 1 log)
CREATE UNIQUE INDEX habit_logs_unique
  ON habit_logs (habit_id, completed_at);
```

### Contoh Data

| id | habit_id | user_id | completed_at |
|---|---|---|---|
| log-001 | abc-123 | usr-456 | 2026-04-13 |
| log-002 | abc-123 | usr-456 | 2026-04-12 |
| log-003 | abc-123 | usr-456 | 2026-04-11 |

### Cara Hitung Streak dari habit_logs

```
Cek hari ini → ada log? → cek kemarin → ada log? → cek 2 hari lalu → ...
Streak = jumlah hari berturut-turut yang ada log-nya
```

---

## Row Level Security (RLS)

Supaya user hanya bisa akses data miliknya sendiri.

```sql
-- Aktifkan RLS
ALTER TABLE habits     ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: user hanya bisa akses data miliknya
CREATE POLICY "user_habits" ON habits
  USING (auth.uid() = user_id);

CREATE POLICY "user_tasks" ON tasks
  USING (auth.uid() = user_id);

CREATE POLICY "user_habit_logs" ON habit_logs
  USING (auth.uid() = user_id);
```

---

## Query yang Sering Dipakai

### Ambil semua habit user hari ini

```ts
const { data } = await supabase
  .from('habits')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

### Ambil task dengan deadline dekat

```ts
const today = new Date().toISOString().split('T')[0]

const { data } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId)
  .eq('is_completed', false)
  .gte('deadline', today)
  .order('deadline', { ascending: true })
  .limit(3)
```

### Ambil habit_logs 7 hari terakhir (untuk chart)

```ts
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

const { data } = await supabase
  .from('habit_logs')
  .select('completed_at')
  .eq('user_id', userId)
  .gte('completed_at', sevenDaysAgo.toISOString().split('T')[0])
```

### Insert log saat habit diselesaikan

```ts
await supabase
  .from('habit_logs')
  .upsert({
    habit_id: habitId,
    user_id: userId,
    completed_at: new Date().toISOString().split('T')[0]
  })
```

### Reset is_completed habit (tiap hari baru)

```ts
// Cek apakah is_completed perlu direset
// Dibandingkan dengan tanggal terakhir selesai di habit_logs
const lastLog = await supabase
  .from('habit_logs')
  .select('completed_at')
  .eq('habit_id', habitId)
  .order('completed_at', { ascending: false })
  .limit(1)

// Jika lastLog bukan hari ini → reset is_completed ke false
```

---

## Relasi Antar Tabel

```
auth.users
  │
  ├── habits (user_id → auth.users.id)
  │     └── habit_logs (habit_id → habits.id)
  │
  └── tasks (user_id → auth.users.id)
```

Semua relasi pakai `ON DELETE CASCADE` — kalau user dihapus, semua data miliknya ikut terhapus otomatis.
