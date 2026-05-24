"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import type { Task } from "@/types"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    if (error) {
      toast.error("Gagal memuat tasks")
      return
    }
    setTasks(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchTasks() }, [])

  const addTask = async (task: Omit<Task, "id" | "created_at" | "user_id">): Promise<{ error: string | null }> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }
    const { error } = await supabase.from("tasks").insert({ ...task, user_id: user.id })
    if (error) return { error: error.message }
    fetchTasks()
    return { error: null }
  }

  const updateTask = async (id: string, updates: Partial<Task>): Promise<{ error: string | null }> => {
    const { error } = await supabase.from("tasks").update(updates).eq("id", id)
    if (error) {
      toast.error("Gagal mengupdate task")
      return { error: error.message }
    }
    fetchTasks()
    return { error: null }
  }

  const deleteTask = async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from("tasks").delete().eq("id", id)
    if (error) {
      toast.error("Gagal menghapus task")
      return { error: error.message }
    }
    fetchTasks()
    toast.success("Task berhasil dihapus")
    return { error: null }
  }

  const toggleTask = async (id: string): Promise<{ error: string | null }> => {
    const task = tasks.find(t => t.id === id)
    if (!task) return { error: "Task tidak ditemukan" }
    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: !task.is_completed })
      .eq("id", id)
    if (error) {
      toast.error("Gagal mengupdate task")
      return { error: error.message }
    }
    fetchTasks()
    return { error: null }
  }

  return { tasks, loading, addTask, updateTask, deleteTask, toggleTask, refetch: fetchTasks }
}
