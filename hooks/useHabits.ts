"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import type { Habit } from "@/types"
import { toLocalDateStr } from "@/lib/utils-date"

// Reset is_completed & streak untuk habits yang tidak dikerjakan kemarin/hari ini
const syncDailyStatus = async (userId: string) => {
  const today = toLocalDateStr(new Date())
  const yesterday = toLocalDateStr(new Date(Date.now() - 86_400_000))

  const { data: habits } = await supabase
    .from("habits")
    .select("id, streak, is_completed")
    .eq("user_id", userId)

  if (!habits?.length) return

  const { data: recentLogs } = await supabase
    .from("habit_logs")
    .select("habit_id, completed_at")
    .eq("user_id", userId)
    .in("habit_id", habits.map(h => h.id))
    .gte("completed_at", yesterday)

  const loggedToday = new Set(recentLogs?.filter(l => l.completed_at === today).map(l => l.habit_id) ?? [])
  const loggedYesterday = new Set(recentLogs?.filter(l => l.completed_at === yesterday).map(l => l.habit_id) ?? [])

  const toResetStreak = habits
    .filter(h => h.streak > 0 && !loggedToday.has(h.id) && !loggedYesterday.has(h.id))
    .map(h => h.id)

  const toUncomplete = habits
    .filter(h => h.is_completed && !loggedToday.has(h.id))
    .map(h => h.id)

  if (toResetStreak.length > 0)
    await supabase.from("habits").update({ streak: 0 }).in("id", toResetStreak)

  if (toUncomplete.length > 0)
    await supabase.from("habits").update({ is_completed: false }).in("id", toUncomplete)
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  const fetchHabits = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    if (error) {
      toast.error("Gagal memuat habits")
      return
    }
    setHabits(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await syncDailyStatus(user.id)
      await fetchHabits()
    }
    init()
  }, [])

  const addHabit = async (habit: Omit<Habit, "id" | "created_at" | "user_id">): Promise<{ error: string | null }> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }
    const { error } = await supabase.from("habits").insert({ ...habit, user_id: user.id })
    if (error) return { error: error.message }
    fetchHabits()
    return { error: null }
  }

  const updateHabit = async (id: string, updates: Partial<Habit>): Promise<{ error: string | null }> => {
    const { error } = await supabase.from("habits").update(updates).eq("id", id)
    if (error) {
      toast.error("Gagal mengupdate habit")
      return { error: error.message }
    }
    fetchHabits()
    return { error: null }
  }

  const deleteHabit = async (id: string): Promise<{ error: string | null }> => {
    // Cascade delete logs dulu baru habit-nya
    await supabase.from("habit_logs").delete().eq("habit_id", id)
    const { error } = await supabase.from("habits").delete().eq("id", id)
    if (error) {
      toast.error("Gagal menghapus habit")
      return { error: error.message }
    }
    fetchHabits()
    toast.success("Habit berhasil dihapus")
    return { error: null }
  }

  const toggleHabit = async (id: string): Promise<{ error: string | null }> => {
    const habit = habits.find(h => h.id === id)
    if (!habit) return { error: "Habit tidak ditemukan" }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const today = toLocalDateStr(new Date())
    const newCompleted = !habit.is_completed

    if (newCompleted) {
      // Cek apakah sudah pernah di-log hari ini (cegah double streak)
      const { data: existingLog } = await supabase
        .from("habit_logs")
        .select("id")
        .eq("habit_id", id)
        .eq("user_id", user.id)
        .eq("completed_at", today)
        .maybeSingle()

      const { error: updateError } = await supabase
        .from("habits")
        .update({
          is_completed: true,
          streak: existingLog ? habit.streak : habit.streak + 1,
        })
        .eq("id", id)
      if (updateError) {
        toast.error("Gagal mengupdate habit")
        return { error: updateError.message }
      }

      if (!existingLog) {
        const { error: logError } = await supabase.from("habit_logs").insert({
          habit_id: id,
          user_id: user.id,
          completed_at: today,
        })
        if (logError && logError.code !== "23505") {
          toast.error("Gagal mencatat log habit")
          return { error: logError.message }
        }
      }
    } else {
      // Uncomplete — hapus log hari ini, kurangi streak
      await supabase.from("habit_logs").delete()
        .eq("habit_id", id)
        .eq("user_id", user.id)
        .eq("completed_at", today)

      const { error: updateError } = await supabase
        .from("habits")
        .update({ is_completed: false, streak: Math.max(0, habit.streak - 1) })
        .eq("id", id)
      if (updateError) {
        toast.error("Gagal mengupdate habit")
        return { error: updateError.message }
      }
    }

    fetchHabits()
    return { error: null }
  }

  const logHabitForDate = async (id: string, date: string): Promise<{ error: string | null }> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }
    const { data: existing } = await supabase
      .from("habit_logs")
      .select("id")
      .eq("habit_id", id)
      .eq("user_id", user.id)
      .eq("completed_at", date)
      .maybeSingle()
    if (existing) return { error: "Habit sudah dicatat untuk tanggal ini" }
    const { error } = await supabase.from("habit_logs").insert({
      habit_id: id,
      user_id: user.id,
      completed_at: date,
    })
    if (error) return { error: error.message }
    return { error: null }
  }

  return { habits, loading, addHabit, updateHabit, deleteHabit, toggleHabit, logHabitForDate, refetch: fetchHabits }
}
