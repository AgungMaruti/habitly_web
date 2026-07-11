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
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  LabelList,
  Tooltip,
} from "recharts"
import { useLanguage } from "@/contexts/LanguageContext"
import { t } from "@/lib/i18n"
import { useTheme } from "next-themes"

const BASE_COLORS = {
  success: "#22c55e",
  warning: "#f59e0b",
  destructive: "#ef4444",
}

function getChartColors(isDark: boolean) {
  return {
    ...BASE_COLORS,
    primary: "hsl(var(--primary))",
    muted: isDark ? "#475569" : "#d4d4d4",          // dark: slate-600, light: gray-300
    tick: isDark ? "#a8a8a8" : "#525252",             // dark: terang, light: gelap
    grid: isDark ? "#404040" : "#e5e5e5",             // dark: subtle, light: subtle
    label: isDark ? "#a8a8a8" : "#525252",
  }
}

function ChartLegend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5 text-xs text-foreground/60">
          <span 
            className="inline-block w-3 h-3 rounded-sm shrink-0" 
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </div>
      ))}
    </div>
  )
}

export default function StatisticsPage() {
  const { weeklyData, monthlyTrend, totalStreak, avgCompletion, taskStats, loading } = useStatistics()
  const { lang } = useLanguage()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const C = getChartColors(isDark)

  const chartConfig = {
    tick: { fontSize: 11, fill: C.tick },
    grid: { stroke: C.grid, strokeDasharray: "3 3" },
    radius: [4, 4, 0, 0] as [number, number, number, number],
  }

  const labelProps = {
    position: "top" as const,
    fill: C.label,
    fontSize: 12,
    fontWeight: 600,
  }

function ChartLegend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5 text-xs text-foreground/60">
          <span 
            className="inline-block w-3 h-3 rounded-sm shrink-0" 
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </div>
      ))}
    </div>
  )
  }

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
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t('habit', lang)}</h2>
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
              subtitle={t('last7Days', lang)}
              icon={TrendingUp}
            />
            <StatsCards
              title={t('activeDays', lang)}
              value={weeklyData.filter(d => d.completed > 0).length}
              subtitle={t('outOf7Days', lang)}
              icon={Calendar}
            />
          </div>
        </div>

        {/* Stats Overview — Tasks */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t('task', lang)}</h2>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <StatsCards
              title={t('totalTask', lang)}
              value={taskStats.total}
              subtitle={t('allTasks', lang)}
              icon={CheckSquare}
            />
            <StatsCards
              title={t('taskCompleted', lang)}
              value={taskStats.completed}
              subtitle={`${taskStats.completionRate}% completion`}
              icon={Target}
            />
            <StatsCards
              title={t('taskPending', lang)}
              value={taskStats.pending}
              subtitle={t('notCompleted', lang)}
              icon={Clock}
            />
            <StatsCards
              title={t('highPriority', lang)}
              value={taskStats.high}
              subtitle={t('highPrioritySubtitle', lang)}
              icon={AlertTriangle}
            />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">{t('habit', lang)}</TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">{t('task', lang)}</TabsTrigger>
            <TabsTrigger value="weekly" className="flex-1">{t('trend', lang)}</TabsTrigger>
          </TabsList>

          {/* Habit Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('habitWeeklyTitle', lang)}</CardTitle>
                <CardDescription>{t('habitWeeklySubtitle', lang)}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : weeklyData.every(d => d.completed === 0) ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground text-sm">{t('noHabitsYet', lang)}</p>
                    <p className="text-muted-foreground/60 text-xs mt-1">{t('noHabitsDesc', lang)}</p>
                  </div>
                ) : (
                  <>
                    <div className="h-[220px] sm:h-[240px] md:h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={weeklyData} margin={{ top: 20, right: 8, left: -20, bottom: 0 }}>
                          <CartesianGrid {...chartConfig.grid} />
                          <XAxis dataKey="day" tick={chartConfig.tick} />
                          <YAxis tick={chartConfig.tick} allowDecimals={false} />
                          <Bar dataKey="completed" radius={chartConfig.radius}>
                            {weeklyData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.completed > 0 ? C.success : C.muted}
                              />
                            ))}
                            <LabelList dataKey="completed" {...labelProps} />
                          </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <ChartLegend items={[
                      { color: C.success, label: t('done', lang) },
                      { color: C.muted, label: t('noData', lang) },
                    ]} />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('taskDistTitle', lang)}</CardTitle>
                <CardDescription>{t('taskDistSubtitle', lang)}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : taskStats.total === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground text-sm">{t('noTasksYet', lang)}</p>
                    <p className="text-muted-foreground/60 text-xs mt-1">{t('noTasksDesc', lang)}</p>
                  </div>
                ) : (
                  <>
                    <div className="h-[220px] sm:h-[240px] md:h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { label: t('high', lang), count: taskStats.high },
                            { label: t('medium', lang), count: taskStats.medium },
                            { label: t('low', lang), count: taskStats.low },
                          ]}
                          margin={{ top: 20, right: 8, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid {...chartConfig.grid} />
                          <XAxis dataKey="label" tick={chartConfig.tick} />
                          <YAxis tick={chartConfig.tick} allowDecimals={false} />
                          <Bar dataKey="count" radius={chartConfig.radius}>
                            {[
                              C.destructive,
                              C.warning,
                              C.muted,
                            ].map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                            <LabelList dataKey="count" {...labelProps} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <ChartLegend items={[
                      { color: C.destructive, label: t('high', lang) },
                      { color: C.warning, label: t('medium', lang) },
                      { color: C.muted, label: t('low', lang) },
                    ]} />
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('taskStatusTitle', lang)}</CardTitle>
                <CardDescription>{t('taskStatusSubtitle', lang)}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="h-[220px] sm:h-[240px] md:h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { label: t('done', lang), count: taskStats.completed },
                            { label: t('pending', lang), count: taskStats.pending },
                          ]}
                          margin={{ top: 20, right: 8, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid {...chartConfig.grid} />
                          <XAxis dataKey="label" tick={chartConfig.tick} />
                          <YAxis tick={chartConfig.tick} allowDecimals={false} />
                          <Bar dataKey="count" radius={chartConfig.radius}>
                            {[
                              C.success,
                              C.warning,
                            ].map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                            <LabelList dataKey="count" {...labelProps} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <ChartLegend items={[
                      { color: C.success, label: t('done', lang) },
                      { color: C.warning, label: t('pending', lang) },
                    ]} />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trend Tab */}
          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('trendCompletionTitle', lang)}</CardTitle>
                <CardDescription>{t('trendCompletionSubtitle', lang)}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="h-[220px] sm:h-[240px] md:h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={monthlyTrend} margin={{ top: 8, right: 8, left: -20, bottom: 35 }}>
                        <defs>
                          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={C.success} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={C.success} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid {...chartConfig.grid} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px",
                            fontSize: "12px",
                            padding: "4px 8px",
                          }}
                          formatter={(value: number) => [`${value}%`, "Completion"]}
                        />
                        <XAxis 
                          dataKey="label" 
                          tick={{ fontSize: 10, fill: "#a8a8a8" }} 
                          interval={0}
                          angle={-35}
                          textAnchor="end"
                          height={40}
                        />
                        <YAxis tick={chartConfig.tick} domain={[0, 100]} unit="%" />
                        <Area 
                          type="monotone" 
                          dataKey="rate" 
                          stroke={C.success} 
                          fill="url(#trendGradient)" 
                          strokeWidth={2} 
                          dot={false} 
                        />
                      </AreaChart>
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
