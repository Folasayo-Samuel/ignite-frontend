"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, Calculator, Lock } from "lucide-react"
import { useMentorCohorts } from "@/apis/mentor-cohorts"
import { useMentors } from "@/apis/mentors"
import { toast } from "sonner"
import { format, addWeeks } from "date-fns"

const PLATFORM_FEE_KOBO = 500000; // 5000 NGN

export default function NewMentorCohortPage() {
  const router = useRouter()
  const { createCohort } = useMentorCohorts()
  const { mutateAsync: saveCohort, isPending } = createCohort

  const { getMyProfile } = useMentors()
  const { data: profileData } = getMyProfile()
  
  // Unlock custom durations if mentor has completed at least 1 session or had students
  const isEligibleForCustomDuration = profileData && (profileData.sessionsCompleted > 0 || profileData.studentsCount > 0);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    curriculumOutline: "",
    startDate: "",
    maxLearners: "",
    mentorFeeNaira: "",
    techTrack: "",
    durationWeeks: "4", // Default 4 weeks
  })

  // Calculate fees
  const mentorFeeKobo = (parseInt(formData.mentorFeeNaira) || 0) * 100
  const learnerPaysKobo = mentorFeeKobo + PLATFORM_FEE_KOBO
  const potentialLearners = parseInt(formData.maxLearners) || 10
  const potentialEarnings = mentorFeeKobo * potentialLearners

  // End date logic
  const minStartDate = new Date()
  minStartDate.setDate(minStartDate.getDate() + 7) // Min 7 days from now
  const minStartDateStr = minStartDate.toISOString().split('T')[0]
  
  const durationWeeksNum = parseInt(formData.durationWeeks) || 4
  const endDate = formData.startDate ? format(addWeeks(new Date(formData.startDate), durationWeeksNum), 'MMM d, yyyy') : '...'

  const isFormValid = 
    formData.name.trim().length >= 3 &&
    formData.description.trim().length >= 100 &&
    formData.startDate &&
    new Date(formData.startDate) >= new Date(minStartDateStr) &&
    formData.techTrack

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) {
      toast.error("Please fill all required fields correctly.")
      return
    }

    try {
      const response = await saveCohort({
        name: formData.name,
        description: formData.description,
        curriculumOutline: formData.curriculumOutline,
        startDate: new Date(formData.startDate).toISOString(),
        maxLearners: formData.maxLearners ? parseInt(formData.maxLearners) : undefined,
        mentorFeeKobo,
        techTrack: formData.techTrack,
        durationWeeks: durationWeeksNum,
      });

      toast.success("Cohort created successfully!")
      router.push(`/mentor/cohorts/${(response as any)._id || (response as any).id}`)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to create cohort")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-4 text-muted-foreground">
          <Link href="/mentor/cohorts">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Cohorts
          </Link>
        </Button>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create a New Cohort</h1>
            <p className="text-muted-foreground">Launch a 30-day challenge and mentor a group of students.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Cohort Details</CardTitle>
                <CardDescription>Give your cohort a clear focus and compelling description.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Cohort Title *</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Master React Hooks in 30 Days" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="techTrack">Tech Track / Stack *</Label>
                    <Input 
                      id="techTrack"
                      placeholder="e.g. React & Node.js, Python Data Science..." 
                      value={formData.techTrack}
                      onChange={e => setFormData({...formData, techTrack: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxLearners">Max Learners (Optional)</Label>
                    <Input 
                      id="maxLearners" 
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Leave blank for unlimited" 
                      value={formData.maxLearners}
                      onChange={e => setFormData({...formData, maxLearners: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Min 100 characters) *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="What will learners build? What are the prerequisites? Why should they join?" 
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.description.length} / 100 chars
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="curriculumOutline">Curriculum Outline (Optional)</Label>
                  <Textarea 
                    id="curriculumOutline" 
                    placeholder="Week 1: Fundamentals... Week 2: First Project..." 
                    rows={4}
                    value={formData.curriculumOutline}
                    onChange={e => setFormData({...formData, curriculumOutline: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Schedule & Pricing</CardTitle>
                <CardDescription>Set when it happens and how much you earn.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input 
                      id="startDate" 
                      type="date"
                      min={minStartDateStr}
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Must be at least 7 days from today</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    {isEligibleForCustomDuration ? (
                      <Select 
                        value={formData.durationWeeks} 
                        onValueChange={v => setFormData({...formData, durationWeeks: v})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 Weeks</SelectItem>
                          <SelectItem value="4">4 Weeks (Standard)</SelectItem>
                          <SelectItem value="8">8 Weeks</SelectItem>
                          <SelectItem value="12">12 Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center justify-between text-sm text-muted-foreground">
                        <span>4 Weeks (30 Days)</span>
                        <div className="flex items-center text-xs text-orange-600 dark:text-orange-400 gap-1" title="Complete your first 30-day cohort to unlock custom durations">
                          <Lock className="h-3 w-3" />
                          <span>Locked</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>End Date (Auto-calculated)</Label>
                    <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center text-sm font-medium">
                      {endDate}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="mentorFeeNaira">Your Fee per Learner (₦) *</Label>
                    <Input 
                      id="mentorFeeNaira" 
                      type="number"
                      min="0"
                      placeholder="e.g. 5000" 
                      value={formData.mentorFeeNaira}
                      onChange={e => setFormData({...formData, mentorFeeNaira: e.target.value})}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Enter 0 to run a free cohort.</p>
                  </div>

                  {formData.mentorFeeNaira && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-orange-800 dark:text-orange-300">
                        <Calculator className="h-4 w-4" /> Live Calculation
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform Fee:</span>
                          <span>₦{(PLATFORM_FEE_KOBO / 100).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Your Fee:</span>
                          <span>₦{((mentorFeeKobo) / 100).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t border-orange-200/50 dark:border-orange-800/50">
                          <span>Total Learner Pays:</span>
                          <span>₦{(learnerPaysKobo / 100).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {mentorFeeKobo > 0 && (
                        <div className="mt-4 pt-3 border-t border-orange-200/50 dark:border-orange-800/50 flex justify-between font-bold text-green-600 dark:text-green-400">
                          <span>Est. Earnings ({potentialLearners} learners):</span>
                          <span>₦{(potentialEarnings / 100).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-6 flex justify-end gap-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/mentor/cohorts">Cancel</Link>
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!isFormValid || isPending}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    {isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                      "Create Cohort"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
