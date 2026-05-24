# Retino — Dokumentasi Lengkap Project

## 1. Tentang Project

**Retino** adalah aplikasi web untuk melacak kebiasaan harian (habit tracker) dan mengelola daftar tugas (task manager) berbasis browser. Pengguna bisa membuat habit, menandai selesai setiap hari, melihat streak, menambah task dengan deadline & prioritas, serta mendapat notifikasi pengingat di browser.

Dibangun sebagai **Single Page Application (SPA)** yang berjalan sepenuhnya di browser, dengan backend berupa database cloud Supabase (PostgreSQL). Tidak ada server Node.js yang perlu dijalankan sendiri — semua logika server ditangani oleh Supabase.

---

## 2. Tech Stack (Tumpukan Teknologi)

| Teknologi | Versi | Fungsi |
|---|---|---|
| **Next.js** | 15+ | Framework utama React — routing, rendering, build |
| **React** | 19 | Library UI — membuat komponen interaktif |
| **TypeScript** | 5 | JavaScript + tipe data statis, mencegah bug |
| **Tailwind CSS** | v4 | Utility-first CSS — styling langsung di className |
| **Supabase** | 2 | Backend as a Service — database PostgreSQL + auth |
| **shadcn/ui** | latest | Komponen UI siap pakai (Button, Card, Dialog, dll) |
| **Sonner** | latest | Library toast/notifikasi dalam aplikasi |
| **next-themes** | latest | Toggle dark/light mode |
| **Lucide React** | latest | Icon library |

---

## 3. Struktur Folder — Penjelasan Lengkap

```
habitly_web/
├── app/                        → Semua halaman aplikasi (Next.js App Router)
│   ├── layout.tsx              → Root layout: wrapper HTML paling luar, load font, theme
│   ├── page.tsx                → Halaman "/" — redirect ke /dashboard jika sudah login
│   ├── globals.css             → CSS global: variabel warna, font, dark mode, reset
│   │
│   ├── (auth)/                 → Route group untuk halaman autentikasi (tanpa sidebar)
│   │   ├── login/
│   │   │   └── page.tsx        → Halaman login (email + password via Supabase Auth)
│   │   └── register/
│   │       └── page.tsx        → Halaman daftar akun baru
│   │
│   └── (main)/                 → Route group untuk halaman utama (dengan sidebar)
│       ├── layout.tsx          → Layout khusus (main): cek auth, render Sidebar + BottomNav, jalankan useReminders
│       ├── dashboard/
│       │   └── page.tsx        → Halaman utama: ringkasan habit, task, statistik, insight
│       ├── habits/
│       │   └── page.tsx        → Manajemen habit: tambah, edit, hapus, toggle selesai
│       ├── tasks/
│       │   └── page.tsx        → Manajemen task: tambah, edit, hapus, filter, toggle selesai
│       ├── statistics/
│       │   └── page.tsx        → Statistik: grafik habit per hari, completion rate
│       └── settings/
│           └── page.tsx        → Pengaturan: profil, tema, bahasa, notifikasi, ekspor data
│
├── components/                 → Komponen UI yang dipakai ulang di banyak halaman
│   ├── layout/
│   │   ├── Navbar.tsx          → Header halaman: judul, subjudul, search bar, tombol tambah
│   │   ├── Sidebar.tsx         → Navigasi kiri (desktop): logo + menu link
│   │   └── BottomNav.tsx       → Navigasi bawah (mobile): icon tab bar
│   │
│   ├── dashboard/
│   │   └── DailyInsight.tsx    → Kartu insight harian: motivasi / warning / achievement
│   │
│   ├── habits/
│   │   └── HabitCard.tsx       → Kartu satu habit: nama, streak, kategori, toggle, edit, hapus
│   │
│   ├── tasks/
│   │   └── TaskCard.tsx        → Kartu satu task: judul, deadline, prioritas, toggle, edit, hapus
│   │
│   ├── statistics/
│   │   └── StatsCards.tsx      → Kartu statistik kecil: ikon + nilai + label
│   │
│   ├── theme-provider.tsx      → Wrapper next-themes agar dark/light mode bisa dipakai di mana saja
│   │
│   └── ui/                     → Komponen shadcn/ui (UI primitif siap pakai)
│       ├── button.tsx          → Komponen Button dengan berbagai variant
│       ├── card.tsx            → Card, CardHeader, CardContent, CardTitle, dll
│       ├── dialog.tsx          → Modal dialog dengan overlay
│       ├── alert-dialog.tsx    → Dialog konfirmasi (hapus, dll)
│       ├── input.tsx           → Input teks
│       ├── textarea.tsx        → Input teks panjang
│       ├── select.tsx          → Dropdown pilihan
│       ├── badge.tsx           → Label kecil berwarna (prioritas, kategori)
│       ├── progress.tsx        → Progress bar horizontal
│       ├── switch.tsx          → Toggle on/off
│       ├── separator.tsx       → Garis pemisah
│       ├── avatar.tsx          → Foto/inisial profil pengguna
│       ├── label.tsx           → Label untuk form field
│       ├── sonner.tsx          → Wrapper Sonner toast
│       ├── dropdown-menu.tsx   → Menu konteks (titik tiga) dengan item
│       ├── tabs.tsx            → Tab navigasi horizontal
│       ├── calendar.tsx        → Komponen kalender
│       ├── chart.tsx           → Wrapper Recharts untuk grafik
│       └── ...                 → Puluhan komponen lain (accordion, tooltip, dll)
│
├── contexts/
│   └── LanguageContext.tsx     → React Context untuk menyimpan bahasa aktif (id/en)
│                                  Bisa diakses dari komponen manapun tanpa prop drilling
│
├── hooks/                      → Custom React Hooks — logika yang bisa dipakai ulang
│   ├── useAuth.ts              → Cek status login, fungsi signIn, signOut, register
│   ├── useHabits.ts            → CRUD habit + toggle + sync streak harian dari Supabase
│   ├── useTasks.ts             → CRUD task + toggle dari Supabase
│   ├── useReminders.ts         → Cek setiap menit: kirim notifikasi browser jika waktunya cocok
│   ├── useStatistics.ts        → Hitung data statistik: completion rate, streak, grafik
│   ├── use-mobile.ts           → Deteksi apakah layar mobile (< 768px)
│   └── use-toast.ts            → Hook untuk menampilkan toast (versi lama, shadcn)
│
├── lib/                        → Fungsi utilitas dan konfigurasi
│   ├── supabase.ts             → Inisialisasi Supabase client (connect ke database)
│   ├── ai-rules.ts             → Logika "AI" sederhana: autoCategory, autoPriority, getDailyInsight
│   ├── i18n.ts                 → Kamus terjemahan Bahasa Indonesia ↔ English
│   ├── constants.ts            → Konstanta global: mapping kategori → emoji
│   ├── utils.ts                → Fungsi cn() untuk menggabungkan className Tailwind
│   └── utils-date.ts           → Fungsi toLocalDateStr() untuk format tanggal lokal
│
├── types/
│   └── index.ts                → TypeScript type definitions: Habit, Task, HabitLog, User
│
├── styles/
│   └── globals.css             → CSS global tambahan (diimport di app/globals.css)
│
├── public/                     → File statis (langsung bisa diakses via URL)
│   ├── logo.png                → Logo ikon aplikasi
│   ├── logo-full.png           → Logo + nama aplikasi
│   └── logo-text.png           → Logo versi teks saja
│
├── plans/                      → Dokumentasi perencanaan project (tidak masuk ke build)
├── steps/                      → Dokumentasi teknis project (file ini ada di sini)
│
├── next.config.mjs             → Konfigurasi Next.js (setting build, env, dll)
├── tailwind.config.*           → Konfigurasi Tailwind CSS
├── tsconfig.json               → Konfigurasi TypeScript (path alias @/ dll)
├── components.json             → Konfigurasi shadcn/ui
├── package.json                → Daftar dependensi dan script (npm run dev, build, dll)
└── .env.local                  → Environment variable: URL & key Supabase (RAHASIA, tidak di-commit)
```

---

## 4. Konsep Next.js App Router

Next.js adalah framework yang dibangun di atas React. Versi terbaru menggunakan **App Router** — sistem routing berbasis folder.

### Cara Kerja Routing
Setiap folder di dalam `app/` yang berisi `page.tsx` otomatis menjadi route:
- `app/page.tsx` → URL `/`
- `app/(main)/dashboard/page.tsx` → URL `/dashboard`
- `app/(main)/habits/page.tsx` → URL `/habits`

**Tanda kurung `(auth)` dan `(main)`** adalah **Route Group** — hanya untuk mengelompokkan folder, tidak masuk ke URL. Jadi `/dashboard` bukan `/main/dashboard`.

### Layout
`layout.tsx` adalah wrapper yang membungkus semua halaman di dalam folder-nya. Ada dua layout:
1. `app/layout.tsx` → membungkus seluruh app (HTML, body, ThemeProvider)
2. `app/(main)/layout.tsx` → membungkus semua halaman utama (cek auth, tampilkan Sidebar + BottomNav)

### "use client" vs Server Component
- Komponen di Next.js by default adalah **Server Component** (render di server, lebih cepat)
- Kalau pakai `useState`, `useEffect`, event handler → wajib tulis `"use client"` di baris pertama
- Di project ini hampir semua komponen pakai `"use client"` karena banyak interaksi user

---

## 5. Alur Data (Data Flow)

```
User klik tombol
        ↓
Komponen (page.tsx / HabitCard.tsx)
        ↓
Custom Hook (useHabits / useTasks)
        ↓
Supabase Client (lib/supabase.ts)
        ↓
Database PostgreSQL di cloud Supabase
        ↓
Response data kembali ke Hook
        ↓
setState() → React re-render → UI update otomatis
```

Contoh konkret — user toggle habit selesai:
1. User klik checkbox di `HabitCard.tsx`
2. Memanggil `onToggle(id)` → fungsi `toggleHabit` dari `useHabits`
3. `toggleHabit` panggil Supabase: update `is_completed = true`, tambah streak
4. Supabase simpan ke database, kirim response sukses
5. `fetchHabits()` dipanggil → ambil data terbaru
6. `setHabits(data)` → React re-render otomatis → UI langsung update

---

## 6. Database Supabase (PostgreSQL)

Supabase menyediakan database PostgreSQL + autentikasi + REST API secara otomatis. Kita cukup tulis query via Supabase JS Client tanpa perlu buat API endpoint sendiri.

### Tabel yang Digunakan

**`habits`**
```
id           UUID (primary key, auto-generate)
user_id      UUID (foreign key ke auth.users)
title        TEXT (nama habit)
category     TEXT (Health/Education/Finance/Productivity/Mindfulness/Social/Other)
time         TEXT (jam reminder, format HH:MM)
start_date   DATE (tanggal mulai habit)
is_completed BOOLEAN (sudah selesai hari ini?)
streak       INTEGER (berapa hari berturut-turut)
created_at   TIMESTAMP
```

**`tasks`**
```
id           UUID
user_id      UUID
title        TEXT
description  TEXT (opsional)
category     TEXT
priority     TEXT (High/Medium/Low)
deadline     DATE (opsional)
time         TEXT (jam reminder, format HH:MM)
is_completed BOOLEAN
created_at   TIMESTAMP
```

**`habit_logs`**
```
id           UUID
habit_id     UUID (foreign key ke habits)
user_id      UUID
completed_at DATE (tanggal habit dikerjakan)
```
> `habit_logs` menyimpan riwayat harian. Dipakai untuk hitung streak, cek apakah habit sudah dikerjakan hari ini, dan tampilkan grafik statistik.

### Row Level Security (RLS)
Supabase punya fitur RLS — setiap user hanya bisa membaca dan mengubah data miliknya sendiri, berdasarkan `user_id`. Ini otomatis diamankan di level database.

---

## 7. Autentikasi

Menggunakan **Supabase Auth** — sistem login built-in dari Supabase.

**Cara kerja:**
1. User isi email + password di halaman `/login`
2. Supabase Auth memverifikasi, mengembalikan **JWT token** (semacam "tiket masuk" digital)
3. Token disimpan otomatis di localStorage browser oleh Supabase SDK
4. Setiap request ke database otomatis membawa token → Supabase tahu siapa user-nya
5. `useAuth` hook memantau status login via `supabase.auth.getUser()`
6. Kalau tidak login, layout `(main)` redirect ke `/login`

---

## 8. Sistem Notifikasi Browser

Ini bagian yang paling sering ditanya karena terlihat "canggih". Penjelasan lengkapnya:

### Apa itu Web Notifications API?
Browser modern (Chrome, Firefox, Safari) punya API bawaan namanya **Web Notifications API**. Ini adalah fitur JavaScript standar — bukan library tambahan, sudah built-in di browser.

```js
// Contoh paling sederhana
new Notification("Judul notifikasi", {
  body: "Isi pesan",
  icon: "/logo.png"
})
```

Notifikasi ini muncul di pojok layar, persis seperti notifikasi dari aplikasi desktop lainnya.

### Alur Kerja Notifikasi di Retino

**Langkah 1 — Minta Izin**
Sebelum bisa kirim notifikasi, browser harus minta izin ke user. Dilakukan di halaman Settings:
```ts
const permission = await Notification.requestPermission()
// permission bisa: "granted", "denied", "default"
```
Kalau user klik "Allow" → permission = `"granted"` → boleh kirim notifikasi.

**Langkah 2 — Simpan Jam Reminder**
Saat tambah habit atau task, user bisa isi "Jam Reminder" (input `type="time"`). Nilai ini disimpan ke kolom `time` di database Supabase dalam format `HH:MM`.

**Langkah 3 — Polling Setiap Menit**
Di `hooks/useReminders.ts`, ada fungsi yang berjalan otomatis setiap 60 detik:

```ts
// Jalankan sekali saat app pertama dibuka
checkReminders()

// Ulangi setiap 60 detik
const interval = setInterval(checkReminders, 60_000)
```

**Langkah 4 — Pencocokan Waktu**
Setiap kali `checkReminders` jalan:
1. Ambil waktu sekarang dalam format `HH:MM` (contoh: `"08:30"`)
2. Query ke Supabase: ambil semua habit/task yang punya `time` dan belum selesai
3. Bandingkan: kalau `time` dari database === waktu sekarang → kirim notifikasi

```ts
const currentTime = "08:30"  // waktu sekarang
// task.time dari DB bisa "08:30:00" (format PostgreSQL)
// toHHMM() ambil 5 karakter pertama → "08:30"
if (toHHMM(task.time) === currentTime) {
  new Notification(`📋 Reminder: ${task.title}`, { ... })
}
```

**Langkah 5 — Tag Notifikasi**
Setiap notifikasi punya `tag` unik berformat `habit-{id}-{tanggal}`. Kalau notifikasi dengan tag yang sama dikirim dua kali, browser hanya tampilkan satu (mencegah spam).

### Kenapa Butuh Izin di Dua Tempat?
- **Browser (Chrome)**: Izin di level aplikasi browser — muncul popup "Allow/Block" dari Chrome
- **OS (macOS System Preferences)**: Izin di level sistem operasi — Chrome harus diizinkan tampilkan notifikasi di macOS

Kalau salah satu diblokir, notifikasi tidak akan muncul meski kode sudah benar.

### Keterbatasan
| Platform | Status |
|---|---|
| Chrome/Firefox/Edge (desktop) | ✅ Berfungsi penuh |
| Safari macOS 13+ | ✅ Berfungsi |
| iOS Safari (browser biasa) | ❌ Tidak didukung — `Notification` tidak ada di window |
| iOS PWA (install ke homescreen, iOS 16.4+) | ✅ Berfungsi |

---

## 9. Logika "AI" (ai-rules.ts)

Disebut "AI" tapi sebenarnya adalah **rule-based logic** — aturan yang ditulis manual, bukan machine learning. Ini cukup untuk keperluan thesis.

### autoCategory (Kategorisasi Otomatis)
Saat user tambah habit/task, sistem otomatis menentukan kategori berdasarkan kata kunci di judul:

```ts
// User ketik: "Lari pagi 30 menit"
// Kata "lari" ada di keyword Health → kategori = "Health"

// User ketik: "Belajar TypeScript"
// Kata "belajar" ada di keyword Education → kategori = "Education"
```

Ada 7 kategori dengan ratusan kata kunci dalam Bahasa Indonesia dan Inggris.

### autoPriority (Prioritas Otomatis)
Kalau task punya deadline, prioritas ditentukan otomatis berdasarkan jarak hari:
- Deadline ≤ 1 hari → **High**
- Deadline 2-3 hari → **Medium**
- Deadline > 3 hari → **Low**

### getDailyInsight (Pesan Motivasi)
Menghasilkan pesan insight berdasarkan kondisi saat ini:
- Ada task deadline hari ini → "Ada X task yang harus selesai hari ini!"
- Semua habit selesai → "Luar biasa! Semua habit selesai hari ini! 🎉"
- Belum ada habit → "Tambahkan habit pertamamu!"
- Progress > 50% → "Bagus! Sudah X dari Y habit selesai."

---

## 10. Internasionalisasi (i18n)

Aplikasi mendukung dua bahasa: **Bahasa Indonesia** dan **English**.

**Cara kerja:**
1. `lib/i18n.ts` menyimpan kamus terjemahan — objek berisi pasangan key → teks Indonesia/Inggris
2. `contexts/LanguageContext.tsx` menyimpan bahasa aktif (`"id"` atau `"en"`) menggunakan React Context + localStorage (tersimpan walau refresh)
3. Di setiap komponen, panggil `const { lang } = useLanguage()` lalu `t('keyNama', lang)` untuk mendapat teks sesuai bahasa

```ts
// Contoh pemanggilan
t('dashboard', 'id')  // → "Dasbor"
t('dashboard', 'en')  // → "Dashboard"
```

User bisa ganti bahasa di halaman Settings → langsung berlaku ke seluruh aplikasi tanpa reload.

---

## 11. Streak System

Streak = jumlah hari berturut-turut user menyelesaikan habit.

**Logika di `useHabits.ts`:**

Setiap kali halaman dibuka, fungsi `syncDailyStatus` berjalan:
1. Ambil semua habit milik user
2. Cek `habit_logs`: habit mana yang sudah dikerjakan hari ini / kemarin
3. Kalau habit tidak dikerjakan kemarin DAN tidak dikerjakan hari ini → **streak di-reset ke 0**
4. Kalau habit sudah dikerjakan hari ini → status `is_completed = true` dipertahankan
5. Kalau hari sudah berganti (kemarin sudah selesai, tapi hari ini belum) → `is_completed = false` agar bisa diceklis lagi

**Saat toggle selesai:**
- Cek apakah sudah ada log hari ini (mencegah streak bertambah dua kali kalau di-uncomplete lalu complete lagi)
- Kalau belum ada log → tambah streak + 1, simpan log ke `habit_logs`
- Kalau uncomplete → hapus log hari ini, kurangi streak - 1

---

## 12. Cara Menjalankan Project

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Jalankan production build
npm start
```

Buka di browser: `http://localhost:3000`

**Env yang dibutuhkan (`.env.local`):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 13. Pertanyaan yang Sering Ditanya Dosen

**Q: Mengapa memilih Next.js, bukan React biasa?**
A: Next.js memberikan fitur routing otomatis berbasis folder, optimasi performa (code splitting), dan dukungan SEO. Untuk skala project thesis, Next.js lebih terstruktur dibanding React biasa yang perlu setup routing manual.

**Q: Apa bedanya Supabase dengan Firebase?**
A: Supabase menggunakan PostgreSQL (relasional, SQL standar) sementara Firebase menggunakan NoSQL. PostgreSQL lebih tepat untuk data terstruktur seperti habit dan task yang punya relasi. Supabase juga open-source.

**Q: Apakah sistem notifikasi ini real-time?**
A: Bukan real-time, melainkan polling — dicek setiap 60 detik. Real-time sejati membutuhkan push notification via Service Worker dan server-side subscription, yang lebih kompleks. Polling 60 detik sudah cukup akurat untuk reminder berbasis jam.

**Q: Apa itu TypeScript dan kenapa digunakan?**
A: TypeScript adalah JavaScript dengan sistem tipe data. Dengan TypeScript, kita mendefinisikan struktur data (seperti `interface Habit`) sehingga IDE bisa mendeteksi kesalahan sebelum kode dijalankan. Ini mengurangi bug dan membuat kode lebih mudah dipelihara.

**Q: Bagaimana keamanan data pengguna dijamin?**
A: Supabase menggunakan Row Level Security (RLS) — setiap user hanya bisa mengakses data miliknya sendiri di level database. Autentikasi menggunakan JWT token yang expire otomatis. Password tidak pernah disimpan langsung — Supabase Auth menggunakan bcrypt hashing.
