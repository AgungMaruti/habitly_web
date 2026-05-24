"use client"

import { useState } from "react"
import { Flame, Check, MoreVertical, CalendarPlus, Clock, Calendar } from "lucide-react"
import { getStreakLabel } from "@/lib/ai-rules"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface HabitCardProps {
  id: string
  name: string
  icon: string
  streak: number
  time?: string
  startDate?: string
  isCompleted?: boolean
  compact?: boolean
  onToggle?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onLogDate?: (id: string) => void
}

export function HabitCard({
  id,
  name,
  icon,
  streak,
  time,
  startDate,
  isCompleted = false,
  compact = false,
  onToggle,
  onEdit,
  onDelete,
  onLogDate,
}: HabitCardProps) {
  const [completed, setCompleted] = useState(isCompleted)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleToggle = () => {
    setCompleted(!completed)
    onToggle?.(id)
  }

  if (compact) {
    return (
      <Card className={cn(
        "transition-all duration-200",
        completed && "bg-success/5 border-success/30"
      )}>
        <CardContent className="flex items-center gap-3 p-3">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-lg shrink-0",
            completed ? "bg-success/10" : "bg-muted"
          )}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm font-medium truncate",
              completed && "line-through text-muted-foreground"
            )}>
              {name}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {streak > 0 && (
                <span className="flex items-center gap-0.5 text-warning">
                  <Flame className="h-3 w-3" />{streak}d
                </span>
              )}
              {time && <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{time}</span>}
              {startDate && (
                <span className="flex items-center gap-0.5">
                  <Calendar className="h-3 w-3" />
                  {new Date(startDate + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleToggle}
            className={cn(
              "h-8 w-8 rounded-full shrink-0 flex items-center justify-center border-2 transition-all",
              completed
                ? "bg-success border-success text-white"
                : "border-muted-foreground/40 text-muted-foreground hover:border-success hover:text-success"
            )}
          >
            <Check className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      completed && "bg-success/5 border-success/30"
    )}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl text-2xl shrink-0",
          completed ? "bg-success/10" : "bg-muted"
        )}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-foreground",
            completed && "line-through text-muted-foreground"
          )}>
            {name}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-sm flex-wrap">
            <span className="flex items-center gap-1">
              <Flame className={cn("h-4 w-4", streak > 0 ? "text-warning" : "text-muted-foreground")} />
              <span className={cn(streak > 0 ? "text-warning font-medium" : "text-muted-foreground")}>
                {getStreakLabel(streak)}
              </span>
            </span>
            {time && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /><span>{time}</span>
              </span>
            )}
            {startDate && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Mulai {new Date(startDate + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={completed ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full transition-all",
              completed && "bg-success hover:bg-success/90"
            )}
            onClick={handleToggle}
          >
            <Check className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onLogDate?.(id)} className="gap-2">
                <CalendarPlus className="h-4 w-4" />
                Log Tanggal Lain
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit?.(id)}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Habit?</AlertDialogTitle>
            <AlertDialogDescription>
              "{name}" akan dihapus permanen beserta semua log-nya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDelete?.(id)}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
