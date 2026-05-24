"use client"

import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyInsightProps {
  type: "motivation" | "warning" | "achievement" | "tip"
  title: string
  description: string
  className?: string
}

const insightStyles = {
  motivation: {
    icon: Sparkles,
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-warning/10",
    iconColor: "text-warning",
    borderColor: "border-warning/20",
  },
  achievement: {
    icon: CheckCircle2,
    bgColor: "bg-success/10",
    iconColor: "text-success",
    borderColor: "border-success/20",
  },
  tip: {
    icon: TrendingUp,
    bgColor: "bg-accent/20",
    iconColor: "text-accent-foreground",
    borderColor: "border-accent/30",
  },
}

export function DailyInsight({ type, title, description, className }: DailyInsightProps) {
  const style = insightStyles[type]
  const Icon = style.icon

  return (
    <div className={cn(
      "flex items-start gap-3 rounded-2xl border-2 px-4 py-3 w-full",
      style.borderColor, style.bgColor, className
    )}>
      <div className={cn("rounded-full p-2 shrink-0 mt-0.5", style.bgColor)}>
        <Icon className={cn("h-4 w-4", style.iconColor)} />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
