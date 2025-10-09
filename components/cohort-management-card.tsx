"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, Users, Calendar } from "lucide-react"
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

const cohorts = [
  {
    name: "Web Development Bootcamp Q1 2025",
    learners: 85,
    startDate: "Jan 15, 2025",
    endDate: "Feb 14, 2025",
    progress: 60,
    status: "active",
  },
  {
    name: "Mobile App Development Track",
    learners: 62,
    startDate: "Jan 20, 2025",
    endDate: "Feb 19, 2025",
    progress: 50,
    status: "active",
  },
  {
    name: "Data Science Fundamentals",
    learners: 48,
    startDate: "Jan 10, 2025",
    endDate: "Feb 9, 2025",
    progress: 75,
    status: "active",
  },
  {
    name: "UI/UX Design Sprint",
    learners: 73,
    startDate: "Dec 15, 2024",
    endDate: "Jan 14, 2025",
    progress: 95,
    status: "ending",
  },
]

export function CohortManagementCard() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    maxLearners: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] New cohort created:", formData)
    setOpen(false)
    setFormData({ name: "", startDate: "", endDate: "", description: "", maxLearners: "" })
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cohort Management</CardTitle>
            <CardDescription>Manage your sponsored learning cohorts</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                New Cohort
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Cohort</DialogTitle>
                <DialogDescription>Set up a new learning cohort for your sponsored students</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cohort-name">Cohort Name</Label>
                  <Input
                    id="cohort-name"
                    placeholder="e.g., Web Development Bootcamp Q2 2025"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-learners">Maximum Learners</Label>
                  <Input
                    id="max-learners"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.maxLearners}
                    onChange={(e) => setFormData({ ...formData, maxLearners: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the cohort focus and goals..."
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
        <div className="space-y-6">
          {cohorts.map((cohort, index) => (
            <div key={index} className="space-y-3 pb-6 last:pb-0 border-b last:border-0 border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{cohort.name}</h4>
                    <Badge variant={cohort.status === "active" ? "default" : "secondary"}>
                      {cohort.status === "active" ? "Active" : "Ending Soon"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {cohort.learners} learners
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {cohort.startDate} - {cohort.endDate}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{cohort.progress}%</span>
                </div>
                <Progress value={cohort.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
