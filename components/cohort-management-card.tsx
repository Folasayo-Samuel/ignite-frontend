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
import { useOrganizations, Cohort } from "@/api/organizations"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { format } from "date-fns"

interface CohortManagementCardProps {
  orgId?: string; // Should be passed from parent
}

export function CohortManagementCard({ orgId }: CohortManagementCardProps) {
  const { createCohort, getCohorts } = useOrganizations();
  // Call hooks unconditionally, handle absence of orgId in enabled/logic
  const { data: result, isLoading, refetch } = getCohorts(orgId || "");
  const { mutate: create } = createCohort(orgId || "");

  const cohorts = (result as any)?.data as Cohort[] || [];

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    maxLearners: "",
    techTrack: "general"
  })

  // Mock progress generator since backend might not return it yet
  const getProgress = (start: string, end: string) => {
    const now = new Date().getTime();
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (now < s) return 0;
    if (now > e) return 100;
    return Math.round(((now - s) / (e - s)) * 100);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgId) {
      toast.error("Organization ID missing");
      return;
    }

    create({
      name: formData.name,
      description: formData.description,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      maxStudents: parseInt(formData.maxLearners),
      techTrack: formData.techTrack,
      price: 0,
      currency: 'NGN',
      status: 'active', // Default to active for now
      // curriculum: []
    }, {
      onSuccess: () => {
        toast.success("Cohort created successfully");
        setOpen(false)
        setFormData({ name: "", startDate: "", endDate: "", description: "", maxLearners: "", techTrack: "general" })
        refetch();
      },
      onError: (err) => {
        toast.error("Failed to create cohort");
        console.error(err);
      }
    })
  }

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3 pb-6 border-b border-border">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
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
              <Button size="sm" className="gap-2" disabled={!orgId}>
                <PlusCircle className="h-4 w-4" />
                New Cohort
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Cohort</DialogTitle>
                <DialogDescription>Set up a new learning cohort for your sponsored learners</DialogDescription>
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

                {/* Hidden techTrack for now or defaulted */}

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
        {!orgId ? (
          <div className="text-center py-8 text-muted-foreground">
            Please select an organization to view cohorts.
          </div>
        ) : (
          <div className="space-y-6">
            {cohorts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No cohorts found. Create one to get started.</div>
            ) : (
              cohorts.map((cohort) => {
                const progress = (cohort as any).progress ?? getProgress(cohort.startDate, cohort.endDate);
                return (
                  <div key={cohort._id} className="space-y-3 pb-6 last:pb-0 border-b last:border-0 border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{cohort.name}</h4>
                          <Badge variant={cohort.status === "active" ? "default" : "secondary"}>
                            {cohort.status === "active" ? "Active" : cohort.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {(cohort as any).learnersCount || 0} / {cohort.maxStudents} learners
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(cohort.startDate), "MMM d, yyyy")} - {format(new Date(cohort.endDate), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress (Time)</span>
                        <span className="font-medium text-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                )
              }))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
