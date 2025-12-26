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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCohorts, type Cohort, type CreateCohortDto } from "@/api/cohorts"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Link from "next/link"

export function AdminCohortOverview() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CreateCohortDto>({
    name: "",
    description: "",
    techTrack: "fullstack",
    programType: "bootcamp",
    startDate: "",
    endDate: "",
    maxStudents: 50,
  })

  const { getCohorts, createCohort } = useCohorts()
  const { data: cohortsData, isLoading, refetch } = getCohorts()
  const { mutate: createNewCohort, isPending: isCreating } = createCohort()

  const cohorts = cohortsData?.data || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createNewCohort(formData, {
      onSuccess: () => {
        toast.success("Cohort created successfully!")
        setOpen(false)
        setFormData({
          name: "",
          description: "",
          techTrack: "fullstack",
          programType: "bootcamp",
          startDate: "",
          endDate: "",
          maxStudents: 50,
        })
        refetch()
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to create cohort")
      }
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const getStatusFromDates = (cohort: Cohort): string => {
    const now = new Date()
    const start = new Date(cohort.startDate)
    const end = new Date(cohort.endDate)

    if (cohort.status) {
      return cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1)
    }

    if (now < start) return "Upcoming"
    if (now > end) return "Completed"
    return "Active"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-56 mt-2" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-full" />
                      <Skeleton className="h-9 w-full" />
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
                    <Label htmlFor="admin-tech-track">Tech Track</Label>
                    <Select
                      value={formData.techTrack}
                      onValueChange={(value) => setFormData({ ...formData, techTrack: value })}
                    >
                      <SelectTrigger id="admin-tech-track">
                        <SelectValue placeholder="Select track" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend</SelectItem>
                        <SelectItem value="backend">Backend</SelectItem>
                        <SelectItem value="fullstack">Full Stack</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="data">Data Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-program-type">Program Type</Label>
                    <Select
                      value={formData.programType}
                      onValueChange={(value) => setFormData({ ...formData, programType: value })}
                    >
                      <SelectTrigger id="admin-program-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bootcamp">Bootcamp</SelectItem>
                        <SelectItem value="mentorship">Mentorship</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                  <Label htmlFor="admin-max-students">Max Students</Label>
                  <Input
                    id="admin-max-students"
                    type="number"
                    min={1}
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 50 })}
                    required
                  />
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
                  <Button type="submit" className="flex-1" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Cohort"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cohorts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No cohorts found. Create your first cohort to get started.</p>
            </div>
          ) : (
            cohorts.map((cohort) => {
              const status = getStatusFromDates(cohort)
              // Calculate a pseudo completion rate based on enrolled vs max
              const completionRate = cohort.maxStudents > 0
                ? Math.round((cohort.enrolledCount / cohort.maxStudents) * 100)
                : 0

              return (
                <Card key={cohort._id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{cohort.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {cohort.enrolledCount}/{cohort.maxStudents} students
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            status === "Active" ? "default" : status === "Completed" ? "secondary" : "outline"
                          }
                        >
                          {status}
                        </Badge>
                      </div>

                      {status !== "Upcoming" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Enrollment</span>
                            <span className="font-medium">{completionRate}%</span>
                          </div>
                          <Progress value={completionRate} className="h-2" />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                          <Link href={`/admin/cohorts/${cohort._id}`}>View Details</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                          <Link href={`/admin/cohorts/${cohort._id}/analytics`}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Analytics
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
