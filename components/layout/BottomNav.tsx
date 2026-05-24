"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Repeat, 
  CheckSquare, 
  BarChart3,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

export function BottomNav() {
  const pathname = usePathname()
  const { lang } = useLanguage()

  const navigation = [
    { name: t('dashboard', lang), href: "/dashboard", icon: LayoutDashboard },
    { name: t('myHabits', lang), href: "/habits", icon: Repeat },
    { name: t('myTasks', lang), href: "/tasks", icon: CheckSquare },
    { name: t('statistics', lang), href: "/statistics", icon: BarChart3 },
    { name: t('settings', lang), href: "/settings", icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
      <div className="flex items-center justify-around px-1 py-1.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors min-w-0",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              <span className="text-[10px] font-medium truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
