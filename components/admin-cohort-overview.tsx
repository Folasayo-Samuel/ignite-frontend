"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, TrendingUp, Plus } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function AdminCohortOverview() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Admin creating new cohort:", formData)
    setOpen(false)
    setFormData({ name: "", startDate: "", endDate: "", description: "" })
  }

  const cohorts = [
    {
      id: "1",
      name: "Cohort 2024-Q1",
      startDate: "Jan 1, 2024",
      endDate: "Jan 30, 2024",
      students: 245,
      completionRate: 82,
      status: "Completed",
    },
    {
      id: "2",
      name: "Cohort 2024-Q2",
      startDate: "Apr 1, 2024",
      endDate: "Apr 30, 2024",
      students: 312,
      completionRate: 78,
      status: "Active",
    },
    {
      id: "3",
      name: "Cohort 2024-Q3",
      startDate: "Jul 1, 2024",
      endDate: "Jul 30, 2024",
      students: 0,
      completionRate: 0,
      status: "Upcoming",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cohort Management</CardTitle>
            <CardDescription>Manage learning cohorts and track progress</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Cohort
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Cohort</DialogTitle>
                <DialogDescription>Set up a new learning cohort for the platform</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-cohort-name">Cohort Name</Label>
                  <Input
                    id="admin-cohort-name"
                    placeholder="e.g., Cohort 2025-Q1"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-start-date">Start Date</Label>
                    <Input
                      id="admin-start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-end-date">End Date</Label>
                    <Input
                      id="admin-end-date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-description">Description</Label>
                  <Textarea
                    id="admin-description"
                    placeholder="Describe the cohort..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Cohort
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cohorts.map((cohort) => (
            <Card key={cohort.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{cohort.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {cohort.startDate} - {cohort.endDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {cohort.students} students
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        cohort.status === "Active" ? "default" : cohort.status === "Completed" ? "secondary" : "outline"
                      }
                    >
                      {cohort.status}
                    </Badge>
                  </div>

                  {cohort.status !== "Upcoming" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Completion Rate</span>
                        <span className="font-medium">{cohort.completionRate}%</span>
                      </div>
                      <Progress value={cohort.completionRate} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
