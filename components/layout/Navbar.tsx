"use client"

import { useState } from "react"
import { Search, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

interface NavbarProps {
  title: string
  subtitle?: string
  onAddClick?: () => void
  addButtonText?: string
  searchQuery?: string
  onSearch?: (q: string) => void
  searchPlaceholder?: string
  hideSearch?: boolean
}

export function Navbar({ title, subtitle, onAddClick, addButtonText, searchQuery, onSearch, searchPlaceholder, hideSearch }: NavbarProps) {
  const { lang } = useLanguage()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const showSearch = !hideSearch && !!onSearch

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: logo (mobile only) + title */}
        <div className="flex items-center gap-3 min-w-0">
          <img src="/logo.png?v=1777016752" alt="Retino" className="h-8 w-8 object-contain lg:hidden shrink-0" />
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-semibold text-foreground leading-tight truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-muted-foreground leading-tight truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: search + add */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Desktop search */}
          {showSearch && (
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder ?? t('searchPlaceholder', lang)}
                className="w-64 bg-muted/50 pl-9 focus:bg-background"
                value={searchQuery ?? ""}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}

          {/* Mobile search toggle */}
          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileSearchOpen(v => !v)}
              aria-label="Cari"
            >
              {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
          )}

          {onAddClick && (
            <Button onClick={onAddClick} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{addButtonText || t('add', lang)}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile search bar — full width below header */}
      {showSearch && mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder={searchPlaceholder ?? t('searchPlaceholder', lang)}
              className="w-full bg-muted/50 pl-9 focus:bg-background"
              value={searchQuery ?? ""}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      )}
    </header>
  )
}
