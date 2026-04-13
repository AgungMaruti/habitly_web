# 02 — Tech Stack

## Stack yang Digunakan

| Bagian | Teknologi | Alasan |
|---|---|---|
| Framework | Next.js 14 (App Router) + TypeScript | Populer, SEO friendly, struktur rapi |
| Styling | Tailwind CSS | Cepat, tidak perlu file CSS terpisah |
| Auth & Database | Supabase | Free tier generous, SQL powerful, cocok Next.js |
| Chart | Recharts | Library chart React yang simpel |
| AI | Rule-based (lokal) | Gratis, tidak ada API eksternal, reliable |

---

## Next.js 14 (App Router)

```
Kenapa Next.js?
- File-based routing → struktur folder = struktur URL
- App Router → layout, loading, error per halaman
- TypeScript native → lebih aman dan readable
- Deploy mudah ke Vercel (gratis)
```

**Struktur routing yang dipakai:**
```
app/(auth)/login        → /login
app/(auth)/register     → /register
app/(main)/dashboard    → /dashboard
app/(main)/habits       → /habits
app/(main)/tasks        → /tasks
app/(main)/statistics   → /statistics
```

---

## Tailwind CSS

```
Kenapa Tailwind?
- Tidak perlu buat file CSS terpisah
- Class langsung di JSX → lebih cepat development
- Responsive utility bawaan (sm:, md:, lg:)
- Dark mode bawaan
```

**Contoh penggunaan:**
```tsx
<div className="bg-white rounded-xl p-4 shadow-sm">
  <h2 className="text-lg font-semibold text-gray-800">My Habits</h2>
</div>
```

---

## Supabase

```
Kenapa Supabase?
- Database PostgreSQL (SQL) → lebih cocok untuk data relasional
- Auth bawaan (email/password) → tidak perlu setup manual
- Free tier: 500MB database, unlimited API request
- Dashboard yang enak dipakai
- Tidak ada vendor lock-in (standar PostgreSQL)
```

**Yang dipakai dari Supabase:**
- `supabase.auth` → login, register, logout, session
- `supabase.from('habits')` → CRUD tabel habits
- `supabase.from('tasks')` → CRUD tabel tasks
- `supabase.from('habit_logs')` → logging untuk streak & statistik

---

## Recharts

```
Kenapa Recharts?
- Library chart khusus React
- Simpel dan mudah dikustomisasi
- Responsive out of the box
```

**Yang dipakai:**
- `BarChart` → habit completion mingguan di halaman Statistics

---

## AI Rule-based (Lokal)

```
Kenapa tidak OpenAI/Gemini?
- Berbayar → tidak cocok untuk project ini
- Kadang API down atau rate limit
- Untuk fitur yang kita butuhkan, rule-based sudah cukup akurat

Keuntungan rule-based:
- Gratis selamanya
- Tidak ada latency API
- Tidak ada dependency eksternal
- Bisa dikustomisasi sesuka hati
```

**Logic disimpan di:** `lib/ai-rules.ts`

---

## Dependencies yang Akan Diinstall

```bash
# Core
npx create-next-app@latest habitly_web --typescript --tailwind --app

# Supabase
npm install @supabase/supabase-js

# Chart
npm install recharts

# Utility
npm install date-fns        # format tanggal
npm install lucide-react    # icon
```
