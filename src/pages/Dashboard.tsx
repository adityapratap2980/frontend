"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Users,
  FileText,
  TrendingUp,
  Stethoscope,
  Brain,
  BarChart3,
  Calendar,
  Search,
  Plus,
  Settings,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { RecentCases, type RecentCaseItem } from "@/components/recent-cases"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
// import { PredictionChart } from "@/components/prediction-chart"
// import { AlertsPanel } from "@/components/alerts-panel"

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    totalCases: 0,
    predictionsToday: 0,
    activePatients: 0,
    accuracyRate: 0,
    changes: { totalCases: 0, predictionsToday: 0, accuracyRate: 0, activePatients: 0 },
  })
  const [recent, setRecent] = useState<RecentCaseItem[]>([])
  // const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    const headers = { 'Authorization': `Bearer ${token}` }
    const fetchSummary = fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/dashboard/summary/`, { headers })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
    const fetchRecent = fetch(`${import.meta.env.VITE_BACKEND_SERVER}/api/dashboard/recent/`, { headers })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
    Promise.all([fetchSummary, fetchRecent])
      .then(([s, r]) => {
        setSummary(s)
        setRecent(r.results || [])
      })
      .catch(() => { /* noop */ })
      .finally(() => {/* setLoading(false) */ })
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back. Here's your clinic overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Prediction
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Cases" value={summary.totalCases.toString()} change={`${Math.round(summary.changes.totalCases * 100)}%`} changeType="neutral" icon={FileText} />
          <StatsCard title="Predictions Today" value={summary.predictionsToday.toString()} change={`${Math.round(summary.changes.predictionsToday * 100)}%`} changeType="neutral" icon={Brain} />
          <StatsCard title="Accuracy Rate" value={`${Math.round(summary.accuracyRate * 1000) / 10}%`} change={`${Math.round(summary.changes.accuracyRate * 100)}%`} changeType="neutral" icon={TrendingUp} />
          <StatsCard title="Active Patients" value={summary.activePatients.toString()} change={`${Math.round(summary.changes.activePatients * 100)}%`} changeType="neutral" icon={Users} />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prediction Trends Chart */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Anemia Prediction Trends
                </CardTitle>
                <CardDescription>ML model predictions over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <PredictionChart />
              </CardContent>
            </Card> */}

            {/* Recent Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Cases
                </CardTitle>
                <CardDescription>Latest anemia predictions and diagnoses</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentCases items={recent} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Alerts and Quick Actions */}
          <div className="space-y-6">
            {/* AI Insights */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-accent-foreground">High Risk Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 patients showing early anemia indicators. Review recommended.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Model Performance</p>
                  <p className="text-xs text-muted-foreground mt-1">Current accuracy: 94.2% (+2.1% from last week)</p>
                </div>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  View All Insights
                </Button>
              </CardContent>
            </Card> */}

            {/* Alerts Panel */}
            {/* <AlertsPanel /> */}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex flex-col">
                <Link to="/dashboard/prediction">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    New Patient Assessment
                  </Button>
                </Link>
                <Link to="/dashboard/cases">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <Search className="mr-2 h-4 w-4" />
                    Search Case History
                  </Button>
                </Link>
                <Link to="/dashboard/reports">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </Link>
                <Link to="/dashboard/profile">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
