"use client"

import { useState } from "react"
import { useHabits } from "@/hooks/useHabits"
import { autoCategory, suggestTime } from "@/lib/ai-rules"
import { Navbar } from "@/components/layout/Navbar"
import { HabitCard } from "@/components/habits/HabitCard"
import { DailyInsight } from "@/components/dashboard/DailyInsight"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Flame, TrendingUp, Calendar, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"
import { toast } from "sonner"
import { categoryEmoji } from "@/lib/constants"

const emojiOptions = ["🏃", "📚", "🧘", "💧", "✍️", "💪", "💻", "😴", "🎯", "🎨", "🎵", "🌱"]

export default function HabitsPage() {
  const { habits, loading, addHabit, updateHabit, toggleHabit, deleteHabit, logHabitForDate } = useHabits()
  const { lang } = useLanguage()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [newHabitName, setNewHabitName] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("🎯")
  const [saving, setSaving] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [editingHabit, setEditingHabit] = useState<{ id: string; title: string; time: string } | null>(null)
  const [editSaving, setEditSaving] = useState(false)
  const [logDateDialogOpen, setLogDateDialogOpen] = useState(false)
  const [logDateHabitId, setLogDateHabitId] = useState<string | null>(null)
  const [logDate, setLogDate] = useState("")
  const [logDateSaving, setLogDateSaving] = useState(false)
  const [newHabitStartDate, setNewHabitStartDate] = useState("")
  const [newHabitTime, setNewHabitTime] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const completedToday = habits.filter(h => h.is_completed).length
  const totalHabits = habits.length
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0

  const categories = [
    { id: "all", emoji: "", name: "Semua" },
    { id: "Health", emoji: "🏃", name: "Sehat" },
    { id: "Education", emoji: "📚", name: "Belajar" },
    { id: "Mindfulness", emoji: "🧘", name: "Mindful" },
    { id: "Finance", emoji: "💰", name: "Finansial" },
    { id: "Productivity", emoji: "💻", name: "Produktif" },
    { id: "Social", emoji: "👥", name: "Sosial" },
    { id: "Other", emoji: "🎯", name: "Lainnya" },
  ]

  const filteredHabits = habits.filter(h => {
    const matchCat = selectedCategory === "all" || h.category === selectedCategory
    const matchSearch = !searchQuery || h.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const handleSave = async () => {
    if (!newHabitName.trim()) return
    setSaving(true)  
    setAddError(null)
    const category = autoCategory(newHabitName)
    const time = newHabitTime.trim() || suggestTime(category)
    const { error } = await addHabit({
      title: newHabitName.trim(),
      category,
      time,
      is_completed: false,
      streak: 0,
      ...(newHabitStartDate ? { start_date: newHabitStartDate } : {}),
    })
    setSaving(false)
    if (error) {
      setAddError(error)
      return
    }
    setNewHabitName("")
    setSelectedEmoji("🎯")
    setNewHabitStartDate("")
    setNewHabitTime("")
    setIsDialogOpen(false)
  }

  const handleLogDate = (id: string) => {
    setLogDateHabitId(id)
    setLogDate(new Date().toISOString().slice(0, 10))
    setLogDateDialogOpen(true)
  }

  const handleLogDateSave = async () => {
    if (!logDateHabitId || !logDate) return
    setLogDateSaving(true)
    const { error } = await logHabitForDate(logDateHabitId, logDate)
    setLogDateSaving(false)
    if (error) {
      toast.error(error)
    } else {
      toast.success("Habit berhasil dicatat untuk tanggal tersebut")
      setLogDateDialogOpen(false)
      setLogDateHabitId(null)
    }
  }

  const handleEditOpen = (id: string) => {
    const habit = habits.find(h => h.id === id)
    if (habit) setEditingHabit({ id: habit.id, title: habit.title, time: habit.time ?? "" })
  }

  const handleEditSave = async () => {
    if (!editingHabit || !editingHabit.title.trim()) return
    setEditSaving(true)
    const category = autoCategory(editingHabit.title)
    const time = editingHabit.time.trim() || suggestTime(category)
    await updateHabit(editingHabit.id, { title: editingHabit.title.trim(), category, time })
    setEditSaving(false)
    setEditingHabit(null)
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar
        title={t('habitsTitle', lang)}
        subtitle={t('habitsSubtitle', lang)}
        onAddClick={() => setIsDialogOpen(true)}
        addButtonText={t('addHabit', lang)}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        searchPlaceholder={lang === 'en' ? "Search habits..." : "Cari habit..."}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-3 grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-1 p-3 text-center">
              <div className="rounded-lg bg-primary/10 p-2">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground leading-none">{completedToday}/{totalHabits}</p>
              <p className="text-xs text-muted-foreground">Selesai</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-1 p-3 text-center">
              <div className="rounded-lg bg-warning/10 p-2">
                <Flame className="h-4 w-4 text-warning" />
              </div>
              <p className="text-lg font-bold text-foreground leading-none">{longestStreak}</p>
              <p className="text-xs text-muted-foreground">Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-1 p-3 text-center">
              <div className="rounded-lg bg-success/10 p-2">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <p className="text-lg font-bold text-foreground leading-none">{completionRate}%</p>
              <p className="text-xs text-muted-foreground">Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Insight */}
        {totalHabits > 0 && (
          <DailyInsight
            type={completionRate === 100 ? "achievement" : completionRate >= 50 ? "motivation" : "tip"}
            title={completionRate === 100 ? "Semua habit selesai! 🎉" : completionRate >= 50 ? "Terus semangat! 💪" : "Yuk mulai hari ini!"}
            description={completionRate === 100
              ? `Luar biasa! Semua ${totalHabits} habit selesai. Streak terpanjang kamu ${longestStreak} hari!`
              : `${completedToday} dari ${totalHabits} habit selesai. Masih ada ${totalHabits - completedToday} lagi!`}
          />
        )}

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{t('progressToday', lang)}</span>
              <span className="text-sm font-semibold text-primary">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </CardContent>
        </Card>

        {/* Habit List Header + Filter */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {filteredHabits.length} habit
          </p>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Habit List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredHabits.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium text-muted-foreground">{t('noHabitsYet', lang)}</p>
              <p className="mt-1 text-sm text-muted-foreground/70">{t('noHabitsDesc', lang)}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.title}
                icon={categoryEmoji[habit.category] ?? "🎯"}
                streak={habit.streak}
                time={habit.time}
                startDate={habit.start_date}
                isCompleted={habit.is_completed}
                onToggle={toggleHabit}
                onEdit={handleEditOpen}
                onDelete={deleteHabit}
                onLogDate={handleLogDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Habit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('addHabit', lang)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="habit-name">{t('habitName', lang)}</Label>
              <Input
                id="habit-name"
                placeholder={t('habitNamePlaceholder', lang)}
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <div className="grid grid-cols-6 gap-2">
                {emojiOptions.map((emoji) => (
                  <Button
                    key={emoji}
                    variant={selectedEmoji === emoji ? "default" : "outline"}
                    size="icon"
                    className="h-10 w-10 text-lg"
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="start-date">Tanggal Mulai <span className="text-muted-foreground font-normal">(opsional)</span></Label>
              <div className="h-9 overflow-hidden rounded-md border border-input bg-muted/40">
                <input
                  id="start-date"
                  type="date"
                  value={newHabitStartDate}
                  onChange={(e) => setNewHabitStartDate(e.target.value)}
                  className="h-full w-full bg-transparent px-3 text-sm outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="habit-time">Jam Pengingat <span className="text-muted-foreground font-normal">(opsional)</span></Label>
              <div className="h-9 overflow-hidden rounded-md border border-input bg-muted/40">
                <input
                  id="habit-time"
                  type="time"
                  value={newHabitTime}
                  onChange={(e) => setNewHabitTime(e.target.value)}
                  className="h-full w-full bg-transparent px-3 text-sm outline-none"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              {t('cancel', lang)}
            </Button>
            <Button onClick={handleSave} disabled={saving || !newHabitName.trim()}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {saving ? t('saving', lang) : t('save', lang)}
            </Button>
          </DialogFooter>
          {addError && (
            <p className="text-sm text-destructive">{addError}</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Habit Dialog */}
      <Dialog open={!!editingHabit} onOpenChange={(open) => !open && setEditingHabit(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Perbarui nama habit yang ingin kamu ubah.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-habit-name">{t('habitName', lang)}</Label>
              <Input
                id="edit-habit-name"
                placeholder={t('habitNamePlaceholder', lang)}
                value={editingHabit?.title ?? ""}
                onChange={(e) => setEditingHabit(prev => prev ? { ...prev, title: e.target.value } : null)}
                onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-habit-time">Jam Pengingat</Label>
              <Input
                id="edit-habit-time"
                type="time"
                value={editingHabit?.time ?? ""}
                onChange={(e) => setEditingHabit(prev => prev ? { ...prev, time: e.target.value } : null)}
              />
              <p className="text-xs text-muted-foreground">Opsional — kosongkan agar jam diset otomatis oleh AI</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingHabit(null)} disabled={editSaving}>
              {t('cancel', lang)}
            </Button>
            <Button onClick={handleEditSave} disabled={editSaving || !editingHabit?.title.trim()}>
              {editSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editSaving ? t('saving', lang) : t('save', lang)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Past Date Dialog */}
      <Dialog open={logDateDialogOpen} onOpenChange={setLogDateDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Log Tanggal Lain</DialogTitle>
            <DialogDescription>
              Catat habit ini untuk tanggal yang berbeda.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="log-date">Tanggal</Label>
              <Input
                id="log-date"
                type="date"
                value={logDate}
                min="2000-01-01"
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setLogDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Gunakan tombol ↑ di kalender untuk ke bulan sebelumnya</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogDateDialogOpen(false)}>Batal</Button>
            <Button onClick={handleLogDateSave} disabled={logDateSaving || !logDate}>
              {logDateSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
