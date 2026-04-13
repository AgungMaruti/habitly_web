# 09 — UI/UX Plan

## Referensi & Inspirasi

Desain mengacu pada style **playful modern** — warna solid vibrant, tipografi bold, card-based layout, dan nuansa yang energik tapi tetap clean.

---

## Design Principles

```
1. Playful tapi tetap fungsional
2. Warna vibrant sebagai identitas
3. Typography bold & readable
4. Card-based layout
5. Fully responsive (mobile-first)
```

---

## Design System

### Typography

```
Font: Plus Jakarta Sans (Google Fonts)
  → Modern, rounded, cocok dengan vibe playful

Heading 1  : 32px / Bold    → Judul halaman
Heading 2  : 24px / Bold    → Section title
Heading 3  : 18px / SemiBold → Card title
Body       : 14px / Regular  → Konten umum
Caption    : 12px / Regular  → Label kecil, waktu, kategori
```

### Spacing & Radius

```
Border radius:
  Card       : 20px  → rounded-2xl
  Button     : 14px  → rounded-xl
  Badge/chip : 99px  → rounded-full
  Input      : 12px  → rounded-xl

Padding:
  Page       : 16px (mobile) / 24px (desktop)
  Card       : 16px
  Button     : 14px 20px

Gap antar card: 12px
```

### Elevation (Shadow)

```
Card default : shadow-sm  (subtle)
Card hover   : shadow-md  (sedikit naik)
Modal        : shadow-xl
```

---

## Tema Warna

### Tema 1 — Violet (Default)

Terinspirasi dari warna purple di referensi.

```
Primary     : #7C3AED  (violet-600)
Primary bg  : #EDE9FE  (violet-100)
Accent      : #F59E0B  (amber)

Light mode bg   : #F5F3FF
Dark mode bg    : #1E1B2E
Card light      : #FFFFFF
Card dark       : #2D2A3E
```

### Tema 2 — Teal

Terinspirasi dari warna teal/cyan di referensi.

```
Primary     : #0D9488  (teal-600)
Primary bg  : #CCFBF1  (teal-100)
Accent      : #F59E0B

Light mode bg   : #F0FDFA
Dark mode bg    : #0F2027
Card light      : #FFFFFF
Card dark       : #1A2F2D
```

### Tema 3 — Green (Habitly Classic)

Konsisten dengan Flutter app sebelumnya.

```
Primary     : #16A34A  (green-600)
Primary bg  : #DCFCE7  (green-100)
Accent      : #F59E0B

Light mode bg   : #F0FDF4
Dark mode bg    : #0A1F0F
Card light      : #FFFFFF
Card dark       : #1A2E1D
```

### Tema 4 — Coral

```
Primary     : #EF4444  (red-500)
Primary bg  : #FEE2E2  (red-100)
Accent      : #3B82F6

Light mode bg   : #FFF5F5
Dark mode bg    : #1F0A0A
Card light      : #FFFFFF
Card dark       : #2E1A1A
```

---

## Warna Fungsional (Semua Tema)

```
Priority High    : #EF4444  (red)
Priority Medium  : #F59E0B  (amber)
Priority Low     : #22C55E  (green)

Streak fire      : #F97316  (orange)
Success          : #22C55E  (green)
Warning          : #F59E0B  (amber)
Error            : #EF4444  (red)
Text primary     : #111827  (gray-900) / light
Text secondary   : #6B7280  (gray-500) / light
Text primary dk  : #F9FAFB  (gray-50)  / dark
Text secondary dk: #9CA3AF  (gray-400) / dark
```

---

## Layout & Responsive

### Breakpoints

```
Mobile   : < 768px   → 1 kolom, bottom navigation
Tablet   : 768-1024px → 2 kolom, sidebar collapsed
Desktop  : > 1024px  → 2-3 kolom, sidebar expanded
```

### Mobile Layout

```
┌─────────────────┐
│   Top Bar       │  ← nama user + tema toggle + notif
├─────────────────┤
│                 │
│   Content       │  ← full width, 1 kolom
│                 │
│                 │
├─────────────────┤
│  Bottom Nav     │  ← Dashboard | Habits | Tasks | Stats
└─────────────────┘
```

### Desktop Layout

```
┌──────────┬──────────────────────────┐
│          │   Top Bar                │
│ Sidebar  ├──────────────────────────┤
│          │                          │
│ Dashboard│   Content                │
│ Habits   │   (2-3 kolom grid)       │
│ Tasks    │                          │
│ Stats    │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

---

## Component Style

### Navbar / Top Bar

```
Mobile:
  - Kiri  : Greeting "Good morning, Agung 👋"
  - Kanan : icon tema toggle + icon notif (future)

Desktop:
  - Sama, tapi lebih lebar dengan padding lebih besar
```

### Bottom Navigation (Mobile)

```
┌────────────────────────────────┐
│  🏠      🔥      ✅      📊   │
│ Home   Habits  Tasks   Stats  │
└────────────────────────────────┘

Active item: warna primary + bold label
Inactive   : gray-400
Center (+) button: optional untuk quick-add
```

### Sidebar (Desktop)

```
┌──────────────┐
│  🌱 Habitly  │  ← logo + nama app
├──────────────┤
│  🏠 Dashboard│
│  🔥 Habits   │
│  ✅ Tasks    │
│  📊 Stats    │
├──────────────┤
│  🎨 Tema     │  ← tema switcher
│  🌙 Dark     │  ← dark/light toggle
│  👤 Profil   │
│  🚪 Logout   │
└──────────────┘
```

### Card

```
Background : white (light) / card-dark (dark)
Radius     : rounded-2xl
Padding    : p-4
Shadow     : shadow-sm
Hover      : shadow-md + scale-[1.01] (subtle)
Border     : none (light) / border border-white/5 (dark)
```

### Habit Card

```
┌────────────────────────────────┐
│  🏃  Lari pagi      🔥 5 days  │
│      Health • 06:00            │
│                    [✓ Selesai] │
└────────────────────────────────┘

Jika selesai: background tint primary ringan + checkmark
Jika belum  : background white/dark card biasa
```

### Task Card

```
┌────────────────────────────────┐
│  📚  Belajar ujian    🔴 High  │
│      Education • Besok         │
│                  [Tandai Selesai]│
└────────────────────────────────┘

Priority badge:
  High   → bg-red-100   text-red-600   rounded-full
  Medium → bg-amber-100 text-amber-600 rounded-full
  Low    → bg-green-100 text-green-600 rounded-full
```

### Button

```
Primary   : bg-primary text-white rounded-xl px-5 py-3 font-semibold
Secondary : bg-primary/10 text-primary rounded-xl
Danger    : bg-red-500 text-white rounded-xl
Ghost     : bg-transparent text-primary hover:bg-primary/5
```

### Badge / Chip

```
Kategori  : bg-gray-100 text-gray-600 rounded-full text-xs px-3 py-1
Prioritas : warna sesuai (red/amber/green)
Streak    : bg-orange-100 text-orange-600 rounded-full
```

### Input & Form

```
Background  : bg-gray-50 (light) / bg-white/5 (dark)
Border      : border border-gray-200 (light) / border-white/10 (dark)
Focus       : ring-2 ring-primary/30
Radius      : rounded-xl
Padding     : px-4 py-3
Label       : text-sm font-medium text-gray-700 mb-1
```

### Modal

```
Overlay     : bg-black/40 backdrop-blur-sm
Container   : bg-white dark:bg-card-dark rounded-2xl p-6 shadow-xl
Width       : max-w-md w-full mx-4
Animation   : fade + scale up (framer-motion atau CSS)
```

---

## Halaman per Halaman

### Dashboard

```
Mobile:
  ┌─────────────────────┐
  │ Good morning, Agung │  ← greeting
  │ Senin, 13 Apr 2026  │  ← tanggal hari ini
  ├─────────────────────┤
  │ 📅 Date Strip       │  ← scroll horizontal (hari ini highlight)
  ├─────────────────────┤
  │ ✨ Daily Insight    │  ← card dengan teks AI
  ├─────────────────────┤
  │ [3/5 Habits] [2 Tasks]│ ← summary cards 2 kolom
  ├─────────────────────┤
  │ Progress Bar Habits │
  ├─────────────────────┤
  │ Task Mendesak       │  ← list task deadline dekat
  └─────────────────────┘
```

### My Habits

```
Mobile:
  ┌─────────────────────┐
  │ My Habits    [+ Add]│
  ├─────────────────────┤
  │ [All][Health][Edu..]│  ← filter chips scroll horizontal
  ├─────────────────────┤
  │ HabitCard           │
  │ HabitCard           │
  │ HabitCard           │
  └─────────────────────┘
```

### My Tasks

```
Mobile:
  ┌─────────────────────┐
  │ My Tasks     [+ Add]│
  ├─────────────────────┤
  │ [All][High][Med][Low]│ ← filter chips
  ├─────────────────────┤
  │ TaskCard (High)      │
  │ TaskCard (Medium)    │
  │ TaskCard (Low)       │
  └─────────────────────┘
```

### Statistics

```
Mobile:
  ┌─────────────────────┐
  │ Statistics          │
  ├─────────────────────┤
  │ Bar Chart (7 hari)  │
  ├─────────────────────┤
  │ [🔥 12 days][80%]  │  ← stat cards 2 kolom
  │ [Senin][Education] │
  └─────────────────────┘
```

---

## Dark / Light Mode

```
Toggle di: Sidebar (desktop) + Settings icon (mobile)
Simpan di: localStorage → key "habitly-theme-mode"

Tailwind config:
  darkMode: 'class'  → tambah class 'dark' di <html>

Transisi: transition-colors duration-200
```

---

## Tema Switcher

```
Simpan di: localStorage → key "habitly-theme-color"
Pilihan  : violet | teal | green | coral
Default  : violet

UI: 4 lingkaran warna di settings/sidebar
Klik → ganti CSS variable → semua komponen update otomatis
```

---

## Animasi & Transisi

```
Page transition    : fade (opacity 0→1, 150ms)
Card hover         : scale-[1.01] shadow-md (100ms)
Toggle habit       : checkmark scale + warna bg (200ms)
Modal open/close   : fade + scale (150ms)
Bottom nav active  : warna + slight bounce (100ms)

Library: Tailwind transitions (cukup, tidak perlu framer-motion)
```

---

## Empty State

```
Belum ada habit:
  Ilustrasi kecil + "Belum ada habit. Yuk tambah sekarang!"
  + Button "Tambah Habit"

Belum ada task:
  Ilustrasi kecil + "Tidak ada task. Santai dulu!"
  + Button "Tambah Task"
```

---

## Loading State

```
Card skeleton: bg-gray-200 animate-pulse rounded-2xl
  → tampil saat data sedang di-fetch dari Supabase

Spinner: hanya untuk aksi (submit form, toggle)
  → kecil, inline di dalam button
```
