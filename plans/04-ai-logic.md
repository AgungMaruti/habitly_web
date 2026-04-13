# 04 — AI Logic (Rule-based)

## Kenapa Rule-based?

Semua fitur "AI" di Habitly Web menggunakan pendekatan **rule-based** — artinya logikanya ditulis manual berdasarkan aturan yang jelas, bukan model machine learning atau API eksternal.

**Keuntungan:**
- Gratis selamanya
- Tidak ada latency (dijalankan lokal di browser)
- Tidak ada dependency API eksternal yang bisa down
- Akurat untuk use case yang kita punya
- Bisa dikustomisasi kapan saja

Semua logic disimpan di satu file: `lib/ai-rules.ts`

---

## 1. Auto Kategori Habit & Task

Menentukan kategori otomatis berdasarkan **keyword dalam judul**.

### Keyword Mapping

| Kategori | Keyword |
|---|---|
| Health | olahraga, gym, lari, renang, fitness, jalan, yoga, sehat |
| Education | belajar, baca, kuliah, tugas, kursus, latihan, studi |
| Finance | bayar, transfer, nabung, tagihan, investasi, budget |
| Productivity | meeting, kerja, deadline, project, laporan, presentasi |
| Mindfulness | meditasi, journaling, refleksi, bersyukur, doa |
| Social | teman, keluarga, hubungi, kunjungi, chat |
| Hobby | masak, gambar, musik, nulis, foto, game |
| Other | (tidak cocok semua keyword di atas) |

### Implementasi

```ts
// lib/ai-rules.ts

export function autoCategory(title: string): string {
  const t = title.toLowerCase()

  if (/olahraga|gym|lari|renang|fitness|jalan|yoga|sehat/.test(t))
    return 'Health'
  if (/belajar|baca|kuliah|tugas|kursus|latihan|studi/.test(t))
    return 'Education'
  if (/bayar|transfer|nabung|tagihan|investasi|budget/.test(t))
    return 'Finance'
  if (/meeting|kerja|deadline|project|laporan|presentasi/.test(t))
    return 'Productivity'
  if (/meditasi|journaling|refleksi|bersyukur|doa/.test(t))
    return 'Mindfulness'
  if (/teman|keluarga|hubungi|kunjungi|chat/.test(t))
    return 'Social'
  if (/masak|gambar|musik|nulis|foto|game/.test(t))
    return 'Hobby'

  return 'Other'
}
```

### Contoh

```
"Lari pagi 30 menit"   → Health
"Belajar untuk ujian"  → Education
"Bayar tagihan listrik" → Finance
"Meeting dengan tim"   → Productivity
"Ngobrol sama keluarga" → Social
```

---

## 2. Auto Prioritas Task

Menentukan prioritas task berdasarkan **jarak hari ke deadline**.

### Aturan

```
deadline ≤ 1 hari  → High   🔴  (mendesak, harus segera)
deadline ≤ 3 hari  → Medium 🟡  (perlu diperhatikan)
deadline >  3 hari → Low    🟢  (masih ada waktu)
deadline tidak ada → Low    🟢  (default)
```

### Implementasi

```ts
export function autoPriority(deadline?: string): string {
  if (!deadline) return 'Low'

  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  if (diff <= 1) return 'High'
  if (diff <= 3) return 'Medium'
  return 'Low'
}
```

### Contoh

```
Deadline besok (1 hari)   → High
Deadline 3 hari lagi      → Medium
Deadline minggu depan     → Low
Tidak ada deadline        → Low
```

---

## 3. Saran Waktu Habit

Memberikan **default waktu** saat user tambah habit, berdasarkan kategori.

### Mapping Waktu

| Kategori | Saran Waktu | Alasan |
|---|---|---|
| Health | 06:00 | Olahraga pagi lebih efektif |
| Education | 19:00 | Belajar malam setelah aktivitas |
| Mindfulness | 05:00 | Meditasi sebelum hari dimulai |
| Productivity | 08:00 | Jam kerja produktif pagi |
| Social | 18:00 | Setelah jam kerja/kuliah |
| Finance | 10:00 | Jam kerja, bayar tagihan |
| Hobby | 20:00 | Waktu santai malam |
| Other | 07:00 | Default pagi |

### Implementasi

```ts
export function suggestTime(category: string): string {
  const map: Record<string, string> = {
    Health: '06:00',
    Education: '19:00',
    Mindfulness: '05:00',
    Productivity: '08:00',
    Social: '18:00',
    Finance: '10:00',
    Hobby: '20:00',
    Other: '07:00',
  }
  return map[category] ?? '07:00'
}
```

> User tetap bisa mengubah waktu ini di form.

---

## 4. Daily Insight (Dashboard)

Menampilkan **teks greeting dinamis** di dashboard berdasarkan kondisi user hari ini.

### Aturan Prioritas (urutan dicek dari atas)

```
1. Ada task deadline HARI INI     → Warning deadline
2. Habit selesai = 0              → Motivasi untuk mulai
3. Habit selesai = semua          → Apresiasi
4. Habit selesai >= 50%           → Semangat lanjut
5. Habit selesai < 50%            → Dorongan untuk terus
```

### Implementasi

```ts
export function getDailyInsight(
  totalHabits: number,
  completedHabits: number,
  tasksDueToday: number
): string {
  if (tasksDueToday > 0)
    return `Ada ${tasksDueToday} task yang harus selesai hari ini, jangan sampai terlewat!`

  if (totalHabits === 0)
    return 'Mulai tambahkan habit pertamamu hari ini!'

  if (completedHabits === 0)
    return 'Yuk mulai hari ini dengan menyelesaikan habit pertamamu!'

  if (completedHabits === totalHabits)
    return 'Luar biasa! Semua habit sudah selesai hari ini!'

  const ratio = completedHabits / totalHabits
  const remaining = totalHabits - completedHabits

  if (ratio >= 0.5)
    return `Bagus! Sudah ${completedHabits} dari ${totalHabits} habit selesai. Tinggal ${remaining} lagi!`

  return `Baru ${completedHabits} habit selesai, masih ada ${remaining} lagi. Semangat!`
}
```

### Contoh Output

```
Belum ada habit selesai     → "Yuk mulai hari ini!"
3 dari 5 selesai            → "Bagus! Sudah 3 dari 5 habit selesai. Tinggal 2 lagi!"
5 dari 5 selesai            → "Luar biasa! Semua habit sudah selesai!"
Ada task deadline hari ini  → "Ada 2 task yang harus selesai hari ini!"
```

---

## 5. Streak Label (Habit Card)

Memberikan **label visual** di setiap habit card berdasarkan performa streak.

### Aturan

```
streak >= 7 hari  → 🔥 "X Day Streak!"
streak >= 3 hari  → ✨ "Konsisten X hari!"
streak = 1-2 hari → 🌱 "Baru mulai"
habit baru        → 🆕 "Habit baru"
sering dilewat    → ⚠️  "Perlu perhatian"
```

### Implementasi

```ts
export function getStreakLabel(streak: number, isNew: boolean): string {
  if (isNew) return '🆕 Habit baru'
  if (streak === 0) return '⚠️ Perlu perhatian'
  if (streak >= 7) return `🔥 ${streak} Day Streak!`
  if (streak >= 3) return `✨ Konsisten ${streak} hari!`
  return '🌱 Baru mulai'
}
```

---

## Ringkasan Semua Fungsi di `lib/ai-rules.ts`

```ts
autoCategory(title: string): string
  → Kategori dari keyword judul

autoPriority(deadline?: string): string
  → Prioritas dari jarak hari ke deadline

suggestTime(category: string): string
  → Saran waktu dari kategori

getDailyInsight(total, completed, dueToday): string
  → Teks greeting dinamis untuk dashboard

getStreakLabel(streak: number, isNew: boolean): string
  → Label visual untuk habit card
```
