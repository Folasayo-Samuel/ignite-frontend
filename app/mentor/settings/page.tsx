"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MentorDashboardHeader } from "@/components/mentor-dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMentors } from "@/api/mentors"
import { useMentorSettings } from "@/apis/mentor-settings"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Loader2, Save, User, Link as LinkIcon, Settings as SettingsIcon, Landmark } from "lucide-react"

export default function MentorSettingsPage() {
  const { getMyProfile } = useMentors()
  const { updateSettings } = useMentorSettings()

  const { data: profileResult, isLoading, refetch } = getMyProfile()
  const { mutateAsync: doUpdate, isPending } = updateSettings

  const profile = (profileResult as any)?.data || profileResult

  const [formData, setFormData] = useState<any>({
    title: "",
    company: "",
    bio: "",
    expertise: "",
    github: "",
    twitter: "",
    linkedin: "",
    isAcceptingMentees: true,
    defaultCohortFeeNaira: "",
    bankName: "",
    accountNumber: "",
    accountName: ""
  })

  // Initialize form
  useEffect(() => {
    if (profile) {
      setFormData({
        title: profile.title || "",
        company: profile.company || "",
        bio: profile.bio || "",
        expertise: profile.expertise?.join(", ") || "",
        github: profile.github || "",
        twitter: profile.twitter || "",
        linkedin: profile.linkedin || "",
        isAcceptingMentees: profile.isAcceptingMentees !== false,
        defaultCohortFeeNaira: profile.defaultCohortFeeKobo ? (profile.defaultCohortFeeKobo / 100).toString() : "0",
        bankName: profile.bankAccount?.bankName || "",
        accountNumber: profile.bankAccount?.accountNumber || "",
        accountName: profile.bankAccount?.accountName || ""
      })
    }
  }, [profile])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const expertiseArray = formData.expertise
        .split(",")
        .map((e: string) => e.trim())
        .filter(Boolean)

      const payload: any = {
        title: formData.title,
        company: formData.company,
        bio: formData.bio,
        expertise: expertiseArray,
        github: formData.github,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        isAcceptingMentees: formData.isAcceptingMentees,
        defaultCohortFeeKobo: parseInt(formData.defaultCohortFeeNaira || "0") * 100
      }

      if (formData.bankName || formData.accountNumber || formData.accountName) {
        payload.bankAccount = {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountName: formData.accountName
        }
      }

      await doUpdate(payload)
      toast.success("Settings saved successfully")
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-1/4 mb-8" />
          <Skeleton className="h-[600px] w-full" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-5xl">
        <MentorDashboardHeader />

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Mentor Settings</h2>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" /> Profile</TabsTrigger>
              <TabsTrigger value="social"><LinkIcon className="mr-2 h-4 w-4" /> Links</TabsTrigger>
              <TabsTrigger value="bank"><Landmark className="mr-2 h-4 w-4" /> Bank Info</TabsTrigger>
              <TabsTrigger value="preferences"><SettingsIcon className="mr-2 h-4 w-4" /> Preferences</TabsTrigger>
            </TabsList>

            <Card className="border-orange-200/50">
              <TabsContent value="profile" className="m-0">
                <CardHeader>
                  <CardTitle>Public Profile</CardTitle>
                  <CardDescription>This is how you appear to learners in the mentor directory.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Headline *</Label>
                      <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Google" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expertise">Expertise & Skills *</Label>
                    <Input 
                      id="expertise" 
                      name="expertise" 
                      value={formData.expertise} 
                      onChange={handleChange} 
                      placeholder="e.g. React, Node.js, System Design (comma separated)" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio / About You *</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      rows={5} 
                      value={formData.bio} 
                      onChange={handleChange} 
                      placeholder="Share your journey and how you can help mentees..." 
                    />
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="social" className="m-0">
                <CardHeader>
                  <CardTitle>Social & Links</CardTitle>
                  <CardDescription>Connect your profiles so learners can verify your experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input id="github" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter / X URL</Label>
                    <Input id="twitter" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="https://twitter.com/..." />
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="bank" className="m-0">
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>Where your cohort earnings and tips will be sent.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. GTBank" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="0123456789" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input id="accountName" name="accountName" value={formData.accountName} onChange={handleChange} placeholder="Must match your bank records" />
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="preferences" className="m-0">
                <CardHeader>
                  <CardTitle>Cohort Preferences</CardTitle>
                  <CardDescription>Manage your availability and default pricing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base">Accepting New Mentees</Label>
                      <p className="text-sm text-muted-foreground">Turn this off if you are fully booked.</p>
                    </div>
                    <Switch 
                      checked={formData.isAcceptingMentees} 
                      onCheckedChange={(c) => setFormData((p: any) => ({ ...p, isAcceptingMentees: c }))} 
                    />
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <Label htmlFor="defaultCohortFeeNaira">Default Cohort Fee (₦)</Label>
                    <Input 
                      id="defaultCohortFeeNaira" 
                      name="defaultCohortFeeNaira" 
                      type="number" 
                      value={formData.defaultCohortFeeNaira} 
                      onChange={handleChange} 
                    />
                    <p className="text-xs text-muted-foreground">Used to auto-fill the creation form.</p>
                  </div>
                </CardContent>
              </TabsContent>

              <div className="p-6 pt-0 flex justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={isPending}
                  className="bg-orange-500 hover:bg-orange-600 text-white min-w-[120px]"
                >
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </Card>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
