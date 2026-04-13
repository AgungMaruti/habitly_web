# 07 — Data Flow

Dokumen ini menjelaskan bagaimana data bergerak dari database ke tampilan user, untuk setiap skenario utama di Habitly Web.

---

## Alur Umum

```
User interaksi di UI
  → Component handle event
  → Hook dipanggil
  → Hook akses Supabase
  → Data kembali ke Hook
  → Hook update state
  → Component re-render dengan data baru
```

---

## 1. Login

```
User isi form login → klik Simpan
  → LoginPage memanggil useAuth().signIn(email, password)
  → useAuth → supabase.auth.signInWithPassword()
  → Supabase validasi kredensial
  → Jika berhasil: session tersimpan di browser
  → useAuth update state user
  → layout.tsx deteksi user sudah login
  → Redirect ke /dashboard
```

---

## 2. Dashboard Load

```
User buka /dashboard
  → dashboard/page.tsx mount
  → Panggil useHabits() → fetch habits hari ini dari Supabase
  → Panggil useTasks()  → fetch tasks deadline dekat dari Supabase
  → Hitung completedHabits, totalHabits, tasksDueToday
  → Panggil getDailyInsight() dari ai-rules.ts (lokal)
  → Semua data diteruskan ke:
      DailyInsight.tsx  → tampilkan teks insight
      SummaryCards.tsx  → tampilkan angka habit & task
      HabitProgress.tsx → tampilkan progress bar
      UpcomingTasks.tsx → tampilkan task deadline dekat
```

---

## 3. Tambah Habit (dengan AI)

```
User buka form tambah habit
  → HabitForm.tsx render dengan field kosong

User ketik judul "Lari pagi 30 menit"
  → onChange trigger autoCategory(title) dari ai-rules.ts
  → Return "Health"
  → Form auto-fill kategori = "Health"
  → suggestTime("Health") → "06:00"
  → Form auto-fill waktu = "06:00"

User bisa override kategori & waktu jika mau

User klik Simpan
  → useHabits().addHabit({ title, category, time })
  → supabase INSERT ke tabel habits
  → State habits di-refresh
  → HabitList.tsx tampilkan habit baru
```

---

## 4. Toggle Habit Selesai

```
User klik toggle di HabitCard.tsx
  → useHabits().toggleHabit(habitId, true)
  → supabase UPDATE habits SET is_completed = true WHERE id = habitId
  → supabase UPSERT habit_logs { habit_id, completed_at: hari ini }
  → State habits di-refresh
  → HabitCard.tsx update tampilan (checked)
  → DailyInsight.tsx recalculate otomatis (karena state berubah)
  → SummaryCards.tsx update angka habit selesai
```

---

## 5. Tambah Task (dengan AI)

```
User buka form tambah task
  → TaskForm.tsx render dengan field kosong

User ketik judul "Belajar untuk ujian"
  → onChange trigger autoCategory(title) → "Education"
  → Form auto-fill kategori = "Education"

User pilih deadline "2026-04-14" (besok)
  → onChange trigger autoPriority(deadline) → "High"
  → Form auto-fill prioritas = "High"

User bisa override kategori & prioritas jika mau

User klik Simpan
  → useTasks().addTask({ title, category, priority, deadline })
  → supabase INSERT ke tabel tasks
  → State tasks di-refresh
  → TaskList.tsx tampilkan task baru
```

---

## 6. Statistics Load

```
User buka /statistics
  → statistics/page.tsx mount
  → Panggil useStatistics()
  → useStatistics fetch habit_logs 7 hari terakhir dari Supabase
  → useStatistics fetch semua habits dari Supabase
  → useStatistics fetch semua tasks dari Supabase
  → Hitung:
      - completionPerDay[]     → untuk WeeklyChart
      - longestStreak          → untuk StatsCards
      - completionRate         → untuk StatsCards
      - mostProductiveDay      → untuk ProductivityInsight
      - mostCommonCategory     → untuk ProductivityInsight
  → Data diteruskan ke components:
      WeeklyChart.tsx         → render bar chart
      StatsCards.tsx          → render angka statistik
      ProductivityInsight.tsx → render insight teks
```

---

## 7. Reset Habit Harian

Habit `is_completed` perlu direset setiap hari baru. Ini dilakukan di sisi client saat app dibuka.

```
User buka app (hari baru)
  → useHabits() dipanggil
  → Cek tanggal hari ini vs tanggal terakhir di habit_logs
  → Jika beda hari:
      supabase UPDATE habits SET is_completed = false
      WHERE user_id = userId
  → Habits di-refresh
  → Semua habit tampil sebagai belum selesai
```

---

## 8. Logout

```
User klik Logout
  → useAuth().signOut()
  → supabase.auth.signOut()
  → Session dihapus dari browser
  → layout.tsx deteksi user = null
  → Redirect ke /login
```

---

## Ringkasan Alur Data Per File

| File | Tanggung Jawab |
|---|---|
| `app/*/page.tsx` | Mount halaman, koordinasi hooks & components |
| `hooks/useAuth.ts` | Session management, login, logout |
| `hooks/useHabits.ts` | CRUD habits, toggle, streak kalkulasi |
| `hooks/useTasks.ts` | CRUD tasks, toggle |
| `hooks/useStatistics.ts` | Fetch & kalkulasi data statistik |
| `lib/supabase.ts` | Koneksi ke Supabase |
| `lib/ai-rules.ts` | Semua kalkulasi AI (lokal, tanpa server) |
| `components/**` | Render UI, kirim event ke hooks |
