"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/layout/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  User,
  Moon,
  Globe,
  Shield,
  Download,
  Trash2,
  LogOut,
  Bell,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"
import type { Lang } from "@/lib/i18n"

export default function SettingsPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const { lang, setLang } = useLanguage()

  const [name, setName] = useState("")
  const [savingName, setSavingName] = useState(false)
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    if (user) setName(user.user_metadata?.full_name ?? "")
    if ("Notification" in window) setNotifPermission(Notification.permission)
  }, [user])

  const handleRequestNotification = async () => {
    if (!("Notification" in window)) {
      toast.error("Browser kamu tidak mendukung notifikasi")
      return
    }
    const permission = await Notification.requestPermission()
    setNotifPermission(permission)
    if (permission === "granted") {
      toast.success("Notifikasi diaktifkan! Kamu akan mendapat reminder sesuai waktu habit.")
    } else {
      toast.error("Izin notifikasi ditolak")
    }
  }

  const displayName = name || user?.email || "Pengguna"
  const displayEmail = user?.email ?? ""
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const handleSaveName = async () => {
    setSavingName(true)
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } })
    setSavingName(false)
    if (error) {
      toast.error("Gagal menyimpan nama")
    } else {
      toast.success("Profil berhasil disimpan")
    }
  }

  const handleExportData = async () => {
    const { data: habits } = await supabase.from("habits").select("*").eq("user_id", user!.id)
    const { data: tasks } = await supabase.from("tasks").select("*").eq("user_id", user!.id)
    
    const habitsCsv = [
      ["ID", "Title", "Category", "Streak", "Completed", "Created At"].join(","),
      ...(habits ?? []).map(h => [h.id, `"${h.title}"`, h.category, h.streak, h.is_completed, h.created_at].join(","))
    ].join("\n")
    
    const tasksCsv = [
      ["ID", "Title", "Description", "Priority", "Deadline", "Completed", "Created At"].join(","),
      ...(tasks ?? []).map(t => [t.id, `"${t.title}"`, `"${t.description ?? ""}"`, t.priority, t.deadline ?? "", t.is_completed, t.created_at].join(","))
    ].join("\n")
    
    const combined = `HABITS\n${habitsCsv}\n\nTASKS\n${tasksCsv}`
    const blob = new Blob([combined], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `retino-data-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(lang === "en" ? "Data exported successfully" : "Data berhasil diexport")
  }

  const handleDeleteData = async () => {
    await supabase.from("habit_logs").delete().eq("user_id", user!.id)
    await supabase.from("habits").delete().eq("user_id", user!.id)
    await supabase.from("tasks").delete().eq("user_id", user!.id)
    toast.success("Semua data berhasil dihapus")
  }

  const handleDeleteAccount = async () => {
    await supabase.from("habit_logs").delete().eq("user_id", user!.id)
    await supabase.from("habits").delete().eq("user_id", user!.id)
    await supabase.from("tasks").delete().eq("user_id", user!.id)
    await signOut()
    router.push("/login")
    toast.success("Akun berhasil dihapus")
  }


  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar 
        title={t('settingsTitle', lang)}
        subtitle={t('settingsSubtitle', lang)}
        hideSearch
      />

      <div className="p-6 space-y-6 max-w-3xl">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('profile', lang)}
            </CardTitle>
            <CardDescription>
              {t('profileDesc', lang)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fullName', lang)}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('email', lang)}</Label>
                <Input id="email" type="email" value={displayEmail} readOnly className="opacity-60" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleSaveName} disabled={savingName}>
                {savingName ? t('saving2', lang) : t('saveChanges', lang)}
              </Button>
              <Button variant="outline" className="gap-2 text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                {t('logout', lang)}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              {t('appearance', lang)}
            </CardTitle>
            <CardDescription>
              {t('appearanceDesc', lang)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('theme', lang)}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('themeDesc', lang)}
                </p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t('themeLight', lang)}</SelectItem>
                  <SelectItem value="dark">{t('themeDark', lang)}</SelectItem>
                  <SelectItem value="system">{t('themeSystem', lang)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifikasi & Reminder
            </CardTitle>
            <CardDescription>
              Aktifkan notifikasi browser untuk mendapat reminder habit sesuai waktu yang kamu set.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reminder Habit & Task</Label>
                <p className="text-sm text-muted-foreground">
                  {notifPermission === "granted"
                    ? "Aktif — untuk menonaktifkan, ubah izin di pengaturan browser"
                    : notifPermission === "denied"
                    ? "Diblokir — ubah izin di pengaturan browser"
                    : "Aktifkan untuk mendapat reminder sesuai waktu habit & task"}
                </p>
              </div>
              <Switch
                checked={notifPermission === "granted"}
                disabled={notifPermission === "granted" || notifPermission === "denied"}
                onCheckedChange={(checked) => {
                  if (checked) handleRequestNotification()
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('languageRegion', lang)}
            </CardTitle>
            <CardDescription>
              {t('languageRegionDesc', lang)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('language', lang)}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('languageDesc', lang)}
                </p>
              </div>
              <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('privacySecurity', lang)}
            </CardTitle>
            <CardDescription>
              {t('privacySecurityDesc', lang)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="gap-2" onClick={handleExportData}>
              <Download className="h-4 w-4" />
              {t('exportData', lang)}
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              {t('dangerZone', lang)}
            </CardTitle>
            <CardDescription>
              {t('dangerZoneDesc', lang)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('deleteAllData', lang)}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('deleteAllDataDesc', lang)}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    {t('deleteDataBtn', lang)}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('deleteAllData', lang)}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {lang === "en"
                        ? "Are you sure you want to delete all habits and tasks? This action cannot be undone."
                        : "Yakin ingin menghapus semua habit dan task? Tindakan ini tidak dapat dibatalkan."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{lang === "en" ? "Cancel" : "Batal"}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDeleteData}
                    >
                      {t('deleteDataBtn', lang)}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('deleteAccount', lang)}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('deleteAccountDesc', lang)}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    {t('deleteAccountBtn', lang)}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('deleteAccount', lang)}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {lang === "en"
                        ? "Are you sure you want to permanently delete your account? All data will be lost and cannot be recovered."
                        : "Yakin ingin menghapus akun secara permanen? Semua data akan hilang dan tidak dapat dikembalikan."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{lang === "en" ? "Cancel" : "Batal"}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDeleteAccount}
                    >
                      {t('deleteAccountBtn', lang)}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
