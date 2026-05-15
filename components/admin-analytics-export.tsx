"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, FileText, Calendar, Loader2, Mail } from "lucide-react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import api from "@/hooks/axiosInstance"

export function AdminAnalyticsExport() {
  const [reportType, setReportType] = useState("student-progress")
  const [format, setFormat] = useState("csv")
  const [timeRange, setTimeRange] = useState("last-30-days")
  const [isExporting, setIsExporting] = useState(false)
  const [quickExporting, setQuickExporting] = useState<string | null>(null)

  const downloadCsv = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const downloadJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleExport = async () => {
    setIsExporting(true)
    const dateStr = new Date().toISOString().split('T')[0]

    try {
      if (reportType === "student-progress" || reportType === "platform-usage") {
        // Export users data
        const response = await api.get('/admin-core/users', { params: { page: 1, limit: 10000 } })
        const users = response.data?.data || []

        if (format === "csv") {
          const headers = ["Name", "Email", "Role", "Status", "Joined"]
          const rows = users.map((u: any) => [
            u.name, u.email, u.role,
            u.isSuspended ? "Suspended" : "Active",
            new Date(u.createdAt).toISOString().split('T')[0]
          ])
          const csv = [headers.join(','), ...rows.map((r: string[]) =>
            r.map(v => v?.includes(',') ? `"${v}"` : v).join(',')
          )].join('\n')
          downloadCsv(csv, `learners_${timeRange}_${dateStr}.csv`)
        } else if (format === "json") {
          downloadJson(users, `learners_${timeRange}_${dateStr}.json`)
        } else {
          // PDF - generate a text-based report
          const headers = ["Name", "Email", "Role", "Status", "Joined"]
          const rows = users.map((u: any) => [
            u.name, u.email, u.role,
            u.isSuspended ? "Suspended" : "Active",
            new Date(u.createdAt).toISOString().split('T')[0]
          ])
          const csv = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n')
          downloadCsv(csv, `learners_${timeRange}_${dateStr}.csv`)
        }
        toast.success(`Exported ${users.length} learner records`)
      } else if (reportType === "cohort-analytics") {
        const response = await api.get('/admin-core/cohorts', { params: { page: 1, limit: 10000 } })
        const cohorts = response.data?.data || []

        if (format === "json") {
          downloadJson(cohorts, `cohorts_${dateStr}.json`)
        } else {
          const headers = ["Name", "Code", "Status", "Start Date", "End Date", "Enrolled", "Max Learners"]
          const rows = cohorts.map((c: any) => [
            c.name, c.code || "", c.status || "",
            c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : "",
            c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : "",
            c.enrolledCount || 0, c.maxStudents || c.maxLearners || 0
          ])
          const csv = [headers.join(','), ...rows.map((r: any[]) =>
            r.map((v: any) => String(v)?.includes(',') ? `"${v}"` : v).join(',')
          )].join('\n')
          downloadCsv(csv, `cohorts_${dateStr}.csv`)
        }
        toast.success(`Exported ${cohorts.length} cohort records`)
      } else if (reportType === "project-submissions") {
        toast.info("Project submissions export coming soon")
      } else if (reportType === "partner-engagement") {
        const response = await api.get('/admin-core/growth-partners', { params: { page: 1, limit: 10000 } })
        const partners = response.data?.data || []

        if (format === "json") {
          downloadJson(partners, `partners_${dateStr}.json`)
        } else {
          const headers = ["Name", "Email", "Referral Code", "Status", "Tier", "Referrals", "NGN Earnings", "USD Earnings", "Country", "Joined"]
          const rows = partners.map((p: any) => [
            p.userId?.name || "", p.userId?.email || "", p.referralCode || "",
            p.status || "", p.partnershipTier || "",
            p.metrics?.totalReferrals || 0,
            ((p.balances?.NGN?.lifetime || 0) / 100).toFixed(2),
            (p.balances?.USD?.lifetime || 0).toFixed(2),
            p.country || "",
            p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : ""
          ])
          const csv = [headers.join(','), ...rows.map((r: any[]) =>
            r.map((v: any) => String(v)?.includes(',') ? `"${v}"` : v).join(',')
          )].join('\n')
          downloadCsv(csv, `partners_${dateStr}.csv`)
        }
        toast.success(`Exported ${partners.length} partner records`)
      }
    } catch (error: any) {
      console.error("Export error:", error)
      toast.error(error?.response?.data?.message || error?.message || "Export failed")
    } finally {
      setIsExporting(false)
    }
  }

  const handleQuickExport = async (type: string) => {
    setQuickExporting(type)
    const dateStr = new Date().toISOString().split('T')[0]

    try {
      if (type === "learner-list") {
        const response = await api.get('/admin-core/users', { params: { page: 1, limit: 10000 } })
        const users = response.data?.data || []
        const headers = ["Name", "Email", "Role", "Status", "Joined"]
        const rows = users.map((u: any) => [
          u.name, u.email, u.role,
          u.isSuspended ? "Suspended" : "Active",
          new Date(u.createdAt).toISOString().split('T')[0]
        ])
        const csv = [headers.join(','), ...rows.map((r: string[]) =>
          r.map(v => v?.includes(',') ? `"${v}"` : v).join(',')
        )].join('\n')
        downloadCsv(csv, `learner_list_${dateStr}.csv`)
        toast.success(`Exported ${users.length} learners`)
      } else if (type === "monthly-report") {
        const response = await api.get('/admin-core/subscriptions/individual/export')
        const { csv, count } = response.data
        if (count === 0) {
          toast.info("No subscriptions to export")
          return
        }
        downloadCsv(csv, `monthly_report_${dateStr}.csv`)
        toast.success(`Exported ${count} subscription records`)
      } else if (type === "cohort-schedule") {
        const response = await api.get('/admin-core/cohorts', { params: { page: 1, limit: 10000 } })
        const cohorts = response.data?.data || []
        const headers = ["Cohort Name", "Code", "Start Date", "End Date", "Status", "Enrolled"]
        const rows = cohorts.map((c: any) => [
          c.name, c.code || "",
          c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : "",
          c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : "",
          c.status || "", c.enrolledCount || 0
        ])
        const csv = [headers.join(','), ...rows.map((r: any[]) =>
          r.map((v: any) => String(v)?.includes(',') ? `"${v}"` : v).join(',')
        )].join('\n')
        downloadCsv(csv, `cohort_schedule_${dateStr}.csv`)
        toast.success(`Exported ${cohorts.length} cohorts`)
      } else if (type === "all-data") {
        const response = await api.get('/admin-core/subscriptions/individual/export')
        const { csv, count } = response.data
        if (count === 0) {
          toast.info("No data to export")
          return
        }
        downloadCsv(csv, `all_data_export_${dateStr}.csv`)
        toast.success(`Exported ${count} records`)
      }
    } catch (error: any) {
      console.error("Quick export error:", error)
      toast.error(error?.response?.data?.message || error?.message || "Export failed")
    } finally {
      setQuickExporting(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Analytics</CardTitle>
        <CardDescription>Download detailed reports and analytics data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="report-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student-progress">Learner Progress Report</SelectItem>
              <SelectItem value="cohort-analytics">Cohort Analytics</SelectItem>
              <SelectItem value="project-submissions">Project Submissions</SelectItem>
              <SelectItem value="partner-engagement">Partner Engagement</SelectItem>
              <SelectItem value="platform-usage">Platform Usage Statistics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time-range">Time Range</Label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger id="time-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-90-days">Last 90 Days</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Export Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV (Excel Compatible)</SelectItem>
              <SelectItem value="pdf">PDF Report</SelectItem>
              <SelectItem value="json">JSON Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExport} className="w-full gap-2" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export Report
        </Button>

        <div className="pt-4 border-t space-y-2">
          <p className="text-sm font-medium">Quick Exports</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline" size="sm" className="gap-2 bg-transparent"
              onClick={() => handleQuickExport("learner-list")}
              disabled={quickExporting === "learner-list"}
            >
              {quickExporting === "learner-list" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              Learner List
            </Button>
            <Button
              variant="outline" size="sm" className="gap-2 bg-transparent"
              onClick={() => handleQuickExport("monthly-report")}
              disabled={quickExporting === "monthly-report"}
            >
              {quickExporting === "monthly-report" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Monthly Report
            </Button>
            <Button
              variant="outline" size="sm" className="gap-2 bg-transparent"
              onClick={() => handleQuickExport("cohort-schedule")}
              disabled={quickExporting === "cohort-schedule"}
            >
              {quickExporting === "cohort-schedule" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              Cohort Schedule
            </Button>
            <Button
              variant="outline" size="sm" className="gap-2 bg-transparent"
              onClick={() => handleQuickExport("all-data")}
              disabled={quickExporting === "all-data"}
            >
              {quickExporting === "all-data" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              All Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
