export type Category = 'Health' | 'Education' | 'Finance' | 'Productivity' | 'Mindfulness' | 'Social' | 'Other'
export type Priority = 'High' | 'Medium' | 'Low'

export interface Habit {
  id: string
  user_id: string
  title: string
  category: Category
  time?: string
  start_date?: string
  is_completed: boolean
  streak: number
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  category: Category
  priority: Priority
  deadline?: string
  time?: string
  is_completed: boolean
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  completed_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}
