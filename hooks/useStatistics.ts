"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { toLocalDateStr } from "@/lib/utils-date"

export function useStatistics() {
  const [weeklyData, setWeeklyData] = useState<{ day: string; completed: number; total: number }[]>([])
  const [monthlyTrend, setMonthlyTrend] = useState<{ label: string; completed: number; rate: number }[]>([])
  const [totalStreak, setTotalStreak] = useState(0)
  const [avgCompletion, setAvgCompletion] = useState(0)
  const [taskStats, setTaskStats] = useState({
    total: 0, completed: 0, pending: 0,
    high: 0, medium: 0, low: 0, completionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: habits, error: habitsError } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", user.id)
        if (habitsError) throw habitsError

        if (habits) {
          const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak ?? 0)) : 0
          setTotalStreak(maxStreak)
          const completed = habits.filter(h => h.is_completed).length
          setAvgCompletion(habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0)

          const today = new Date()

          // --- Weekly data (current Mon–Sun) ---
          const dayOfWeek = today.getDay()
          const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
          const monday = new Date(today)
          monday.setDate(today.getDate() - mondayOffset)

          const { data: weekLogs, error: weekLogsError } = await supabase
            .from("habit_logs")
            .select("completed_at")
            .eq("user_id", user.id)
            .gte("completed_at", toLocalDateStr(monday))
          if (weekLogsError) throw weekLogsError

          const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
          const weekly = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday)
            d.setDate(monday.getDate() + i)
            const dateStr = toLocalDateStr(d)
            const dayCompleted = weekLogs?.filter(l => l.completed_at === dateStr).length ?? 0
            return { day: dayNames[d.getDay()], completed: dayCompleted, total: habits.length }
          })
          setWeeklyData(weekly)

          // --- Weekly trend (last 7 days) ---
          const sevenDaysAgo = new Date(today)
          sevenDaysAgo.setDate(today.getDate() - 6)

          const { data: monthLogs, error: monthLogsError } = await supabase
            .from("habit_logs")
            .select("completed_at")
            .eq("user_id", user.id)
            .gte("completed_at", toLocalDateStr(sevenDaysAgo))
          if (monthLogsError) throw monthLogsError

          const trend = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(sevenDaysAgo)
            d.setDate(sevenDaysAgo.getDate() + i)
            const dateStr = toLocalDateStr(d)
            const dayCompleted = monthLogs?.filter(l => l.completed_at === dateStr).length ?? 0
            const rate = habits.length > 0 ? Math.round((dayCompleted / habits.length) * 100) : 0
            const label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
            return { label, completed: dayCompleted, rate }
          })
          setMonthlyTrend(trend)
        }

        const { data: tasks, error: tasksError } = await supabase
          .from("tasks")
          .select("is_completed, priority")
          .eq("user_id", user.id)
        if (tasksError) throw tasksError

        if (tasks) {
          const total = tasks.length
          const completedTasks = tasks.filter(t => t.is_completed).length
          setTaskStats({
            total,
            completed: completedTasks,
            pending: total - completedTasks,
            high: tasks.filter(t => t.priority === "High").length,
            medium: tasks.filter(t => t.priority === "Medium").length,
            low: tasks.filter(t => t.priority === "Low").length,
            completionRate: total > 0 ? Math.round((completedTasks / total) * 100) : 0,
          })
        }
      } catch {
        toast.error("Gagal memuat statistik")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return { weeklyData, monthlyTrend, totalStreak, avgCompletion, taskStats, loading }
}
