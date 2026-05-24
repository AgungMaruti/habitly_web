"use client"

import { useState } from "react"
import { useTasks } from "@/hooks/useTasks"
import { autoCategory, autoPriority } from "@/lib/ai-rules"
import { Navbar } from "@/components/layout/Navbar"
import { TaskCard } from "@/components/tasks/TaskCard"
import { DailyInsight } from "@/components/dashboard/DailyInsight"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, Clock, AlertTriangle, ListTodo, Loader2 } from "lucide-react"
import type { Priority } from "@/types"
import { useLanguage } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

type LowerPriority = "high" | "medium" | "low"

function toLower(p: Priority): LowerPriority {
  return p.toLowerCase() as LowerPriority
}

export default function TasksPage() {
  const { tasks, loading, addTask, updateTask, toggleTask, deleteTask } = useTasks()
  const { lang } = useLanguage()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [addError, setAddError] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<{
    id: string
    title: string
    description: string
    deadline: string
    priority: Priority
    time: string
  } | null>(null)
  const [editSaving, setEditSaving] = useState(false)
  const [newTask, setNewTask] = useState<{
    title: string
    description: string
    deadline: string
    priority: Priority
    time: string
  }>({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    time: "",
  })

  const pendingTasks = tasks.filter(t => !t.is_completed)
  const completedTasks = tasks.filter(t => t.is_completed)
  const highPriorityTasks = pendingTasks.filter(t => t.priority === "High")

  const getFilteredTasks = () => {
    const byTab = (() => {
      switch (activeTab) {
        case "pending": return pendingTasks
        case "completed": return completedTasks
        case "high": return highPriorityTasks
        default: return tasks
      }
    })()
    if (!searchQuery) return byTab
    return byTab.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const tabs = [
    { id: "all", name: "Semua", count: tasks.length, icon: ListTodo },
    { id: "pending", name: "Pending", count: pendingTasks.length, icon: Clock },
    { id: "high", name: "Prioritas Tinggi", count: highPriorityTasks.length, icon: AlertTriangle },
    { id: "completed", name: "Selesai", count: completedTasks.length, icon: CheckCircle2 },
  ]

  const handleSave = async () => {
    if (!newTask.title.trim()) return
    setSaving(true)
    setAddError(null)
    const category = autoCategory(newTask.title)
    const deadline = newTask.deadline || undefined
    const priority = newTask.deadline
      ? autoPriority(new Date(newTask.deadline))
      : newTask.priority
    const { error } = await addTask({
      title: newTask.title.trim(),
      description: newTask.description || undefined,
      category,
      priority,
      deadline,
      time: newTask.time || undefined,
      is_completed: false,
    })
    setSaving(false)
    if (error) {
      setAddError(error)
      return
    }
    setNewTask({ title: "", description: "", deadline: "", priority: "Medium", time: "" })
    setIsDialogOpen(false)
  }

  const handleEditOpen = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      setEditingTask({
        id: task.id,
        title: task.title,
        description: task.description ?? "",
        deadline: task.deadline ?? "",
        priority: task.priority,
        time: task.time ?? "",
      })
    }
  }

  const handleEditSave = async () => {
    if (!editingTask || !editingTask.title.trim()) return
    setEditSaving(true)
    const category = autoCategory(editingTask.title)
    await updateTask(editingTask.id, {
      title: editingTask.title.trim(),
      description: editingTask.description || undefined,
      deadline: editingTask.deadline || undefined,
      priority: editingTask.priority,
      time: editingTask.time || undefined,
      category,
    })
    setEditSaving(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar
        title={t('tasksTitle', lang)}
        subtitle={t('tasksSubtitle', lang)}
        onAddClick={() => setIsDialogOpen(true)}
        addButtonText={t('addTaskBtn', lang)}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        searchPlaceholder={lang === 'en' ? "Search tasks..." : "Cari task..."}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-muted p-3">
                <ListTodo className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
                <p className="text-sm text-muted-foreground">Total Task</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-warning/10 p-3">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingTasks.length}</p>
                <p className="text-sm text-muted-foreground">{t('pending', lang)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-destructive/10 p-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{highPriorityTasks.length}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-success/10 p-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedTasks.length}</p>
                <p className="text-sm text-muted-foreground">{t('done', lang)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insight */}
        {highPriorityTasks.length > 0 && (
          <DailyInsight
            type="warning"
            title="Fokus pada Prioritas Tinggi"
            description={`Ada ${highPriorityTasks.length} task dengan prioritas tinggi yang perlu perhatianmu. Selesaikan yang deadline-nya paling dekat terlebih dahulu.`}
          />
        )}

        {/* Task List Header + Filter */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {getFilteredTasks().length} task
          </p>
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-44 h-8 text-xs overflow-visible mt-2 *:data-[slot=select-value]:overflow-visible">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tabs.map((tab) => (
                <SelectItem key={tab.id} value={tab.id}>
                  <span className="relative pr-3">
                    {tab.name}
                    {tab.count > 0 && (
                      <span className="absolute -top-1 -right-0.5 text-[10px] font-bold text-primary leading-none">
                        {tab.count}
                      </span>
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : getFilteredTasks().length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium text-muted-foreground">{t('noTasksYet', lang)}</p>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  {activeTab === "completed"
                    ? t('noTasksYet', lang)
                    : t('noTasksDesc', lang)}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {getFilteredTasks().map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  deadline={task.deadline ?? ""}
                  priority={toLower(task.priority)}
                  time={task.time}
                  isCompleted={task.is_completed}
                  onToggle={toggleTask}
                  onEdit={handleEditOpen}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Task Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-title">{t('taskTitle', lang)}</Label>
              <Input
                id="task-title"
                placeholder={t('taskTitlePlaceholder', lang)}
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-desc">{t('description', lang)}</Label>
              <Textarea
                id="task-desc"
                placeholder={t('descriptionPlaceholder', lang)}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 min-w-0">
                <Label htmlFor="task-deadline">{t('deadline', lang)}</Label>
                <div className="h-9 overflow-hidden rounded-md border border-input bg-muted/40">
                  <input
                    id="task-deadline"
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    className="h-full w-full bg-transparent px-3 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5 min-w-0">
                <Label htmlFor="task-time">Jam Reminder</Label>
                <div className="h-9 overflow-hidden rounded-md border border-input bg-muted/40">
                  <input
                    id="task-time"
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    className="h-full w-full bg-transparent px-3 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-priority">{t('priority', lang)}</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value: Priority) => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              {t('cancel', lang)}
            </Button>
            <Button onClick={handleSave} disabled={saving || !newTask.title.trim()}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {saving ? t('saving', lang) : t('save', lang)}
            </Button>
          </DialogFooter>
          {addError && (
            <p className="text-sm text-destructive">{addError}</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Perbarui detail task yang ingin kamu ubah.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-task-title">{t('taskTitle', lang)}</Label>
              <Input
                id="edit-task-title"
                placeholder={t('taskTitlePlaceholder', lang)}
                value={editingTask?.title ?? ""}
                onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-task-desc">{t('description', lang)}</Label>
              <Textarea
                id="edit-task-desc"
                placeholder={t('descriptionPlaceholder', lang)}
                value={editingTask?.description ?? ""}
                onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-deadline">{t('deadline', lang)}</Label>
                <div className="h-9 overflow-hidden rounded-md border border-input bg-muted/40">
                  <input
                    id="edit-task-deadline"
                    type="date"
                    value={editingTask?.deadline ?? ""}
                    onChange={(e) => setEditingTask(prev => prev ? { ...prev, deadline: e.target.value } : null)}
                    className="h-full w-full bg-transparent px-3 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-task-time">Jam Reminder</Label>
                <div className="h-9 overflow-hidden rounded-md border border-input bg-muted/40">
                  <input
                    id="edit-task-time"
                    type="time"
                    value={editingTask?.time ?? ""}
                    onChange={(e) => setEditingTask(prev => prev ? { ...prev, time: e.target.value } : null)}
                    className="h-full w-full bg-transparent px-3 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-task-priority">{t('priority', lang)}</Label>
                <Select
                  value={editingTask?.priority ?? "Medium"}
                  onValueChange={(value: Priority) => setEditingTask(prev => prev ? { ...prev, priority: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)} disabled={editSaving}>
              {t('cancel', lang)}
            </Button>
            <Button onClick={handleEditSave} disabled={editSaving || !editingTask?.title.trim()}>
              {editSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editSaving ? t('saving', lang) : t('save', lang)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
