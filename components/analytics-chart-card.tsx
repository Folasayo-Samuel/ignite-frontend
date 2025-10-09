"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Aug", learners: 45, projects: 98 },
  { month: "Sep", learners: 68, projects: 156 },
  { month: "Oct", learners: 89, projects: 203 },
  { month: "Nov", learners: 112, projects: 267 },
  { month: "Dec", learners: 156, projects: 342 },
  { month: "Jan", learners: 189, projects: 423 },
]

export function AnalyticsChartCard() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Growth Analytics</CardTitle>
        <CardDescription>Learner enrollment and project submissions over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Bar dataKey="learners" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="projects" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
