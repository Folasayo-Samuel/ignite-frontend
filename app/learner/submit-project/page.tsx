"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Github, ExternalLink, Lock, Loader2, Calendar } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useStudents } from "@/api/student"
import { format, addDays, isAfter } from "date-fns"

export default function SubmitProjectPage() {
  const { getMyCohort } = useStudents();
  const { data: cohort, isLoading } = getMyCohort();

  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    techTrack: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    thumbnail: null as File | null,
  })

  // --- Logic: Check 30 Days Completion ---
  const startDate = cohort?.startDate ? new Date(cohort.startDate) : null;
  const completionDate = startDate ? addDays(startDate, 30) : null;
  const canSubmit = completionDate ? isAfter(new Date(), completionDate) : false;

  // If no cohort or invalid data, we treat as locked or loading
  // (Assuming active cohort is required to even be here, but robust handling is good)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Project submitted:", formData)
    // Handle project submission logic here
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, thumbnail: e.target.files[0] })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!canSubmit) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex flex-col items-center justify-center p-4 bg-muted/20">
          <div className="max-w-md text-center space-y-6">
            <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
              <Lock className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Project Submission Locked</h1>
            <p className="text-muted-foreground text-lg">
              You must complete your 30-day cohort journey before submitting your final project.
            </p>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 justify-center mb-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Unlock Date</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {completionDate ? format(completionDate, "MMMM do, yyyy") : "TBD"}
              </p>
            </div>

            <Button asChild className="w-full">
              <Link href="/learner/dashboard">Back to Learning</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="mb-8">
            <Link
              href="/learner/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">Submit Your Final Project</h1>
            <p className="text-lg text-muted-foreground">Showcase what you've built during your 30-day journey</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Share your project with the FolaIgnite community and potential employers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectTitle">Project Title</Label>
                  <Input
                    id="projectTitle"
                    placeholder="e.g., E-commerce Dashboard"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project, its features, and what you learned..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="techTrack">Tech Track</Label>
                    <Select
                      value={formData.techTrack}
                      onValueChange={(value) => setFormData({ ...formData, techTrack: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select track" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend</SelectItem>
                        <SelectItem value="backend">Backend</SelectItem>
                        <SelectItem value="fullstack">Full-Stack</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="data">Data Science</SelectItem>
                        <SelectItem value="design">UI/UX Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="techStack">Tech Stack</Label>
                    <Input
                      id="techStack"
                      placeholder="e.g., React, Node.js, MongoDB"
                      value={formData.techStack}
                      onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub Repository URL</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="githubUrl"
                      type="url"
                      placeholder="https://github.com/username/project"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live Demo URL (Optional)</Label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="liveUrl"
                      type="url"
                      placeholder="https://your-project.vercel.app"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Project Thumbnail</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <Label htmlFor="thumbnail" className="cursor-pointer">
                      <span className="text-sm text-primary hover:underline">Click to upload</span>
                      <span className="text-sm text-muted-foreground"> or drag and drop</span>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    </Label>
                    <Input id="thumbnail" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    {formData.thumbnail && (
                      <p className="text-sm text-foreground mt-2">Selected: {formData.thumbnail.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href="/learner/dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit Project
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
