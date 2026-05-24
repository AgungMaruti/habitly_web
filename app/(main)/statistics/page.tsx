"use client"

import { useStatistics } from "@/hooks/useStatistics"
import { Navbar } from "@/components/layout/Navbar"
import { StatsCards } from "@/components/statistics/StatsCards"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Target, TrendingUp, Calendar, CheckSquare, Clock, AlertTriangle, Loader2 } from "lucide-react"
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList,
} from "recharts"
import { useLanguage } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"

const TICK = { fontSize: 11, fill: '#888' }

const TrendTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const value = payload[0].value
  return (
    <div
      className="rounded-lg border px-3 py-2 text-center shadow-lg text-sm"
      style={{
        backgroundColor: 'hsl(var(--card))',
        borderColor: 'hsl(var(--border))',
        color: 'hsl(var(--foreground))',
      }}
    >
      <div className="font-medium mb-1" style={{ fontWeight: 500 }}>{label}</div>
      <div>{value}%</div>
    </div>
  )
}
const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    textAlign: "center" as const,
    color: "hsl(var(--foreground))",
  },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 500 },
  itemStyle: { textAlign: "center" as const, color: "hsl(var(--foreground))" },
  position: { y: 80 } as { x?: number; y?: number },
}

const CenterLabel = (props: any) => {
  const { x, y, width, height, value } = props
  if (!value || height < 24) return null
  const cx = x + width / 2
  const cy = y + height / 2
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      fill="#000"
      fontSize={11}
      fontWeight={600}
      pointerEvents="none"
    >
      {value}
    </text>
  )
}

export default function StatisticsPage() {
  const { weeklyData, monthlyTrend, totalStreak, avgCompletion, taskStats, loading } = useStatistics()
  const { lang } = useLanguage()

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar
        title={t('statisticsTitle', lang)}
        subtitle={t('statisticsSubtitle', lang)}
        hideSearch
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Overview — Habits */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Habit</h2>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <StatsCards
              title={t('longestStreak', lang)}
              value={totalStreak}
              subtitle={t('daysInRow', lang)}
              icon={Flame}
            />
            <StatsCards
              title={t('completionRate', lang)}
              value={`${avgCompletion}%`}
              subtitle={t('completed', lang)}
              icon={Target}
            />
            <StatsCards
              title={t('habitsCompleted', lang)}
              value={weeklyData.reduce((acc, d) => acc + d.completed, 0)}
              subtitle="7 hari terakhir"
              icon={TrendingUp}
            />
            <StatsCards
              title="Hari Aktif"
              value={weeklyData.filter(d => d.completed > 0).length}
              subtitle="dari 7 hari"
              icon={Calendar}
            />
          </div>
        </div>

        {/* Stats Overview — Tasks */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Task</h2>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <StatsCards
              title="Total Task"
              value={taskStats.total}
              subtitle="semua task"
              icon={CheckSquare}
            />
            <StatsCards
              title="Task Selesai"
              value={taskStats.completed}
              subtitle={`${taskStats.completionRate}% completion`}
              icon={Target}
            />
            <StatsCards
              title="Task Pending"
              value={taskStats.pending}
              subtitle="belum selesai"
              icon={Clock}
            />
            <StatsCards
              title="Prioritas Tinggi"
              value={taskStats.high}
              subtitle="task high priority"
              icon={AlertTriangle}
            />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Habit</TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">Task</TabsTrigger>
            <TabsTrigger value="weekly" className="flex-1">Trend</TabsTrigger>
          </TabsList>

          {/* Habit Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Habit Mingguan</CardTitle>
                <CardDescription>Jumlah habit yang diselesaikan per hari (7 hari terakhir)</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : weeklyData.every(d => d.completed === 0) ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground text-sm">Belum ada data minggu ini</p>
                    <p className="text-muted-foreground/60 text-xs mt-1">Selesaikan habit untuk melihat grafik</p>
                  </div>
                ) : (
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                        <XAxis dataKey="day" tick={TICK} />
                        <YAxis tick={TICK} allowDecimals={false} />
                        <Tooltip {...TOOLTIP_STYLE} cursor={false} />
                        <Bar dataKey="completed" fill="#1af9169a" radius={[4, 4, 0, 0]} name="Habit Selesai" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribusi Task per Prioritas</CardTitle>
                <CardDescription>Jumlah task berdasarkan tingkat prioritas</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : taskStats.total === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground text-sm">Belum ada task</p>
                    <p className="text-muted-foreground/60 text-xs mt-1">Tambahkan task untuk melihat grafik</p>
                  </div>
                ) : (
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { label: "High", count: taskStats.high },
                          { label: "Medium", count: taskStats.medium },
                          { label: "Low", count: taskStats.low },
                        ]}
                        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                        <XAxis dataKey="label" tick={TICK} />
                        <YAxis tick={TICK} allowDecimals={false} />
                        <Bar dataKey="count" fill="#1af9169a" radius={[4, 4, 0, 0]} name="Jumlah Task">
                          <LabelList dataKey="count" content={<CenterLabel />} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Task</CardTitle>
                <CardDescription>Perbandingan task selesai vs pending</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { label: "Selesai", count: taskStats.completed },
                          { label: "Pending", count: taskStats.pending },
                        ]}
                        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                        <XAxis dataKey="label" tick={TICK} />
                        <YAxis tick={TICK} allowDecimals={false} />
                        <Bar dataKey="count" fill="#1af9169a" radius={[4, 4, 0, 0]} name="Jumlah">
                          <LabelList dataKey="count" content={<CenterLabel />} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trend Tab */}
          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trend Completion Rate</CardTitle>
                <CardDescription>Persentase habit selesai per hari (7 hari terakhir)</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="relative h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#888' }} interval={0} />
                        <YAxis tick={TICK} domain={[0, 100]} unit="%" />
                        <Tooltip
                          content={<TrendTooltip />}
                          wrapperStyle={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }}
                          cursor={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          stroke="#1af9169a"
                          strokeWidth={2}
                          dot={false}
                          name="Completion %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
