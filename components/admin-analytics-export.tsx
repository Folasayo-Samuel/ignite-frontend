"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, FileText, Calendar } from "lucide-react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export function AdminAnalyticsExport() {
  const [reportType, setReportType] = useState("student-progress")
  const [format, setFormat] = useState("csv")
  const [timeRange, setTimeRange] = useState("last-30-days")

  const handleExport = () => {
    toast.success(`Exporting ${reportType} report as ${format.toUpperCase()} for ${timeRange}`)
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

        <Button onClick={handleExport} className="w-full gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>

        <div className="pt-4 border-t space-y-2">
          <p className="text-sm font-medium">Quick Exports</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <FileSpreadsheet className="h-4 w-4" />
              Learner List
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Monthly Report
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              Cohort Schedule
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              All Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
