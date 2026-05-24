import type { Category, Priority } from "@/types"

const categoryKeywords: Record<Category, string[]> = {
  Health: [
    // Olahraga
    "olahraga", "gym", "lari", "renang", "fitness", "exercise", "workout",
    "push up", "pushup", "sit up", "situp", "pull up", "squat", "plank",
    "jalan", "jalan kaki", "jogging", "bersepeda", "sepeda", "berenang",
    "angkat beban", "kardio", "cardio", "zumba", "aerobik",
    // Kesehatan umum
    "minum air", "minum", "air putih", "vitamin", "suplemen", "obat",
    "tidur", "tidur cukup", "istirahat cukup", "sleep",
    "makan", "sarapan", "makan sehat", "diet", "kalori",
    "peregangan", "stretching", "yoga", "meditasi tubuh",
    "cek kesehatan", "dokter", "timbang berat",
  ],
  Education: [
    "belajar", "baca", "membaca", "kuliah", "tugas", "kursus",
    "study", "read", "buku", "materi", "latihan soal", "ujian",
    "les", "nonton tutorial", "tutorial", "coding", "ngoding", "code",
    "skripsi", "tesis", "penelitian", "riset", "nulis", "menulis",
    "catatan", "rangkuman", "review materi", "hafalan", "menghafal",
    "bahasa", "english", "vocab", "kosakata",
  ],
  Finance: [
    "bayar", "transfer", "nabung", "menabung", "tabungan", "tagihan",
    "finance", "budget", "anggaran", "keuangan", "investasi",
    "jajan", "belanja", "catat pengeluaran", "pengeluaran", "pemasukan",
    "rekening", "cicilan", "asuransi", "saham", "reksadana",
    "catat keuangan", "laporan keuangan",
  ],
  Productivity: [
    "meeting", "kerja", "deadline", "project", "work", "kerjaan",
    "bangun pagi", "bangun", "pagi", "jadwal", "planning", "rencana",
    "review", "rapiin", "beres", "bersih", "to do", "todo",
    "fokus", "target", "goals", "produktif", "selesaikan",
    "email", "laporan", "presentasi", "rapat",
  ],
  Mindfulness: [
    "meditasi", "yoga", "journaling", "mindfulness", "journal",
    "napas", "breathing", "relaksasi", "tenang",
    "refleksi", "syukur", "bersyukur", "gratitude",
    "doa", "ibadah", "sholat", "solat", "dzikir", "ngaji", "quran",
    "sembahyang", "meditasi pagi", "visualisasi",
  ],
  Social: [
    "teman", "keluarga", "hubungi", "social", "friend", "family",
    "ortu", "orang tua", "ayah", "ibu", "adik", "kakak",
    "pacar", "gebetan", "chat", "telepon", "video call",
    "kumpul", "hangout", "quality time", "silaturahmi",
    "balas pesan", "balas chat",
  ],
  Other: [],
}

export function autoCategory(title: string): Category {
  const lower = title.toLowerCase()
  for (const [category, keywords] of Object.entries(categoryKeywords) as [Category, string[]][]) {
    if (category === "Other") continue
    if (keywords.some((kw) => lower.includes(kw))) return category
  }
  return "Other"
}

export function autoPriority(deadline: Date | null): Priority {
  if (!deadline) return "Medium"
  const diffDays = (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  if (diffDays <= 1) return "High"
  if (diffDays <= 3) return "Medium"
  return "Low"
}

export function suggestTime(category: Category): string {
  const timeMap: Record<Category, string> = {
    Health: "06:00",
    Education: "19:00",
    Mindfulness: "05:00",
    Productivity: "08:00",
    Social: "18:00",
    Finance: "10:00",
    Other: "07:00",
  }
  return timeMap[category]
}

interface HabitLike {
  is_completed?: boolean
  isCompleted?: boolean
}

interface TaskLike {
  deadline?: string
}

export function getDailyInsight(habits: HabitLike[], tasks: TaskLike[]): string {
  const today = new Date().toISOString().slice(0, 10)
  const todayTasks = tasks.filter((t) => t.deadline?.slice(0, 10) === today)
  if (todayTasks.length > 0) return `Ada ${todayTasks.length} task yang harus selesai hari ini!`
  if (habits.length === 0) return "Tambahkan habit pertamamu dan mulai perjalananmu!"
  const total = habits.length
  const completed = habits.filter((h) => h.is_completed ?? h.isCompleted).length
  if (completed === 0) return "Yuk mulai hari ini, semangat!"
  if (completed === total) return "Luar biasa! Semua habit selesai hari ini! 🎉"
  if (completed / total >= 0.5) return `Bagus! Sudah ${completed} dari ${total} habit selesai.`
  return `Baru ${completed} habit selesai, masih ada ${total - completed} lagi!`
}

export function getStreakLabel(streak: number): string {
  if (streak >= 7) return `🔥 ${streak} Day Streak!`
  if (streak >= 3) return `Konsisten ${streak} hari!`
  if (streak >= 1) return "Habit baru"
  return "Perlu perhatian"
}
