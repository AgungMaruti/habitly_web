"use client"

import { useState } from "react"
import { useHabits } from "@/hooks/useHabits"
import { useTasks } from "@/hooks/useTasks"
import { getDailyInsight } from "@/lib/ai-rules"
import { Navbar } from "@/components/layout/Navbar"
import { DailyInsight } from "@/components/dashboard/DailyInsight"
import { HabitCard } from "@/components/habits/HabitCard"
import { TaskCard } from "@/components/tasks/TaskCard"
import { StatsCards } from "@/components/statistics/StatsCards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Repeat,
  CheckSquare,
  Flame,
  Target,
  ArrowRight,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"
import { Sparkles } from "lucide-react"
import { categoryEmoji } from "@/lib/constants"

type LowerPriority = "high" | "medium" | "low"
function toLower(p: string): LowerPriority {
  return p.toLowerCase() as LowerPriority
}

export default function DashboardPage() {
  const { habits, loading: habitsLoading, toggleHabit } = useHabits()
  const { tasks, loading: tasksLoading, toggleTask } = useTasks()
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  const completedHabits = habits.filter(h => h.is_completed).length
  const totalHabits = habits.length
  const progressPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0
  const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 }
  const pendingTasks = tasks
    .filter(t => !t.is_completed)
    .sort((a, b) => {
      const pDiff = (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1)
      if (pDiff !== 0) return pDiff
      if (!a.deadline && !b.deadline) return 0
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return a.deadline.localeCompare(b.deadline)
    })
  const upcomingTasks = pendingTasks.slice(0, 3)

  const filteredHabits = searchQuery
    ? habits.filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : habits.slice(0, 3)

  const filteredTasks = searchQuery
    ? pendingTasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : upcomingTasks

  const insight = getDailyInsight(habits, tasks)

  const todayStr = new Date().toISOString().slice(0, 10)
  const hasOverdue = tasks.some(t => !t.is_completed && t.deadline && t.deadline < todayStr)
  const hasTodayDeadline = tasks.some(t => !t.is_completed && t.deadline?.slice(0, 10) === todayStr)
  const allDone = totalHabits > 0 && completedHabits === totalHabits

  const insightType = allDone
    ? "achievement"
    : hasOverdue || hasTodayDeadline
    ? "warning"
    : totalHabits === 0
    ? "tip"
    : "motivation"

  const today = new Date().toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar
        title={t('dashboard', lang)}
        subtitle={today}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      <div className="p-4 md:p-6 space-y-4">
        {/* Onboarding Banner */}
        {!habitsLoading && !tasksLoading && totalHabits === 0 && tasks.length === 0 && (
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Selamat datang! 👋</h3>
                <p className="text-xs text-muted-foreground">Mulai perjalananmu sekarang</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tambahkan habit pertamamu untuk mulai melacak kebiasaan harian, atau buat task untuk mengelola to-do list kamu.
            </p>
            <div className="flex gap-2">
              <Link href="/habits" className="flex-1">
                <Button size="sm" className="w-full">+ Tambah Habit</Button>
              </Link>
              <Link href="/tasks" className="flex-1">
                <Button size="sm" variant="outline" className="w-full">+ Tambah Task</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Insight Card */}
        <DailyInsight
          type={insightType}
          title={t('todayInsight', lang)}
          description={insight}
        />

        {/* Stats Grid */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatsCards
            title={t('habitToday', lang)}
            value={`${completedHabits}/${totalHabits}`}
            subtitle={t('completed', lang)}
            icon={Repeat}
          />
          <StatsCards
            title={t('taskPending', lang)}
            value={pendingTasks.length}
            subtitle={t('needAttention', lang)}
            icon={CheckSquare}
          />
          <StatsCards
            title={t('longestStreak', lang)}
            value={longestStreak}
            subtitle={t('daysInRow', lang)}
            icon={Flame}
          />
          <StatsCards
            title={t('completionRate', lang)}
            value={`${Math.round(progressPercentage)}%`}
            subtitle={t('completed', lang)}
            icon={Target}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 min-w-0">
          {/* Today's Habits */}
          <Card className="min-w-0 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">{t('todayHabits', lang)}</CardTitle>
              <Link href="/habits">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  {t('viewAll', lang)}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('progressToday', lang)}</span>
                  <span className="font-medium text-primary">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {habitsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : habits.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-4">
                  {t('noHabits', lang)}{" "}
                  <Link href="/habits" className="text-primary underline">{t('addNow', lang)}</Link>
                </p>
              ) : (
                <div className="space-y-3">
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
                      compact
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="min-w-0 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">{t('upcomingTasks', lang)}</CardTitle>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  {t('viewAll', lang)}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : filteredTasks.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-4">
                  {t('noPendingTasks', lang)}{" "}
                  <Link href="/tasks" className="text-primary underline">{t('addTask', lang)}</Link>
                </p>
              ) : (
                filteredTasks.map((task) => (
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
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
