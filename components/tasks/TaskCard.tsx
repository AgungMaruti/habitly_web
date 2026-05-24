"use client"

import { useState } from "react"
import { Calendar, Check, MoreVertical, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

type Priority = "high" | "medium" | "low"

interface TaskCardProps {
  id: string
  title: string
  description?: string
  deadline: string
  priority: Priority
  time?: string
  isCompleted?: boolean
  onToggle?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const priorityStyles: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  medium: {
    label: "Medium",
    className: "bg-warning/10 text-warning-foreground border-warning/20",
  },
  low: {
    label: "Low",
    className: "bg-muted text-muted-foreground border-muted",
  },
}

function getDaysRemaining(deadline: string): { days: number; isOverdue: boolean; valid: boolean } {
  if (!deadline) return { days: 0, isOverdue: false, valid: false }
  const deadlineDate = new Date(deadline)
  if (isNaN(deadlineDate.getTime())) return { days: 0, isOverdue: false, valid: false }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadlineDate.setHours(0, 0, 0, 0)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return { days: Math.abs(diffDays), isOverdue: diffDays < 0, valid: true }
}

export function TaskCard({
  id,
  title,
  description,
  deadline,
  priority,
  time,
  isCompleted = false,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [completed, setCompleted] = useState(isCompleted)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { days, isOverdue, valid: deadlineValid } = getDaysRemaining(deadline)
  const priorityStyle = priorityStyles[priority]

  const handleToggle = () => {
    setCompleted(!completed)
    onToggle?.(id)
  }

  const formatDeadline = (date: string) => {
    const d = new Date(date)
    if (isNaN(d.getTime())) return "-"
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <>
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md",
        completed && "bg-success/5 border-success/30",
        isOverdue && !completed && "border-destructive/30"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Checkbox */}
            <Button
              variant={completed ? "default" : "outline"}
              size="icon"
              className={cn(
                "mt-0.5 h-6 w-6 shrink-0 rounded-md transition-all",
                completed && "bg-success hover:bg-success/90"
              )}
              onClick={handleToggle}
            >
              {completed && <Check className="h-4 w-4" />}
            </Button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={cn(
                  "font-medium text-foreground",
                  completed && "line-through text-muted-foreground"
                )}>
                  {title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {description}
                </p>
              )}

              {/* Meta */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={priorityStyle.className}>
                  {priorityStyle.label}
                </Badge>

                {deadlineValid && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    isOverdue && !completed ? "text-destructive" : "text-muted-foreground"
                  )}>
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDeadline(deadline)}</span>
                  </div>
                )}

                {deadlineValid && !completed && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    isOverdue ? "text-destructive" : days <= 1 ? "text-warning" : "text-muted-foreground"
                  )}>
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {isOverdue
                        ? `${days} hari terlewat`
                        : days === 0
                          ? "Hari ini"
                          : days === 1
                            ? "Besok"
                            : `${days} hari lagi`
                      }
                    </span>
                  </div>
                )}

                {time && !completed && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{time}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Task?</AlertDialogTitle>
            <AlertDialogDescription>
              "{title}" akan dihapus permanen.
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
    </>
  )
}
