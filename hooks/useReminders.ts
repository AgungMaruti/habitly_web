"use client"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toLocalDateStr } from "@/lib/utils-date"

export function useReminders() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("Notification" in window)) return

    const toHHMM = (t: string) => t.slice(0, 5)

    const checkReminders = async () => {
      if (Notification.permission !== "granted") return

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      const todayStr = toLocalDateStr(now)

      // Habit reminders
      const { data: habits } = await supabase
        .from("habits")
        .select("id, title, time, is_completed")
        .eq("user_id", user.id)
        .eq("is_completed", false)
        .not("time", "is", null)

      if (habits?.length) {
        const { data: logs } = await supabase
          .from("habit_logs")
          .select("habit_id")
          .eq("user_id", user.id)
          .eq("completed_at", todayStr)

        const completedTodayIds = new Set(logs?.map(l => l.habit_id) ?? [])

        habits.forEach(habit => {
          if (toHHMM(habit.time) === currentTime && !completedTodayIds.has(habit.id)) {
            new Notification(`⏰ Waktunya: ${habit.title}`, {
              body: "Jangan lupa selesaikan habitmu hari ini!",
              icon: "/logo.png",
              tag: `habit-${habit.id}-${todayStr}`,
            })
          }
        })
      }

      // Task reminders
      const { data: tasks } = await supabase
        .from("tasks")
        .select("id, title, time")
        .eq("user_id", user.id)
        .eq("is_completed", false)
        .not("time", "is", null)

      tasks?.forEach(task => {
        if (toHHMM(task.time) === currentTime) {
          new Notification(`📋 Reminder: ${task.title}`, {
            body: "Jangan lupa selesaikan task ini!",
            icon: "/logo.png",
            tag: `task-${task.id}-${todayStr}`,
          })
        }
      })
    }

    checkReminders()
    const interval = setInterval(checkReminders, 60_000)
    return () => clearInterval(interval)
  }, [])
}
