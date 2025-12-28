"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Award, Users, Heart } from "lucide-react"
import { toast } from "sonner"
import { useMentors } from "@/api/mentors"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

export function BecomeMentorForm() {
  const router = useRouter()
  const { currentUser } = useAuthStore()
  const { getMyProfile, updateProfile } = useMentors()

  // Conditionally fetch profile only if user is logged in
  const { data: profileResult, isLoading: isLoadingProfile } = getMyProfile()
  const { mutateAsync: saveProfile, isPending: isSaving } = updateProfile;

  const [formData, setFormData] = useState({
    fullName: "",
    email: currentUser?.email || "",
    title: "",
    company: "",
    experience: "",
    expertise: [] as string[],
    bio: "",
    linkedin: "",
    github: "",
    availability: "",
  })

  // Pre-fill form when profile data loads
  useEffect(() => {
    if (profileResult?.data) {
      const p = profileResult.data;
      setFormData(prev => ({
        ...prev,
        fullName: p.name || prev.fullName,
        email: p.email || currentUser?.email || prev.email,
        bio: p.bio && p.bio !== "Hi, I'm a mentor!" ? p.bio : prev.bio, // access default bio
        expertise: p.expertise || [],
        company: p.company || "",
        linkedin: p.linkedin || "",
        experience: p.yearsOfExperience ? p.yearsOfExperience.toString() : "",
        // Note: Some fields like title/availability might not map directly if backend schema differs
      }))
    }
  }, [profileResult, currentUser])

  const expertiseOptions = [
    "Product Management",
    "UI/UX Design",
    "Data Analysis/Science",
    "Software Engineering",
    "Growth Marketing",
    "Product Marketing",
    "DevOps/Cloud",
    "Cybersecurity",
    "QA/Testing",
    "Content/Technical Writing",
  ]

  const handleExpertiseToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(skill)
        ? prev.expertise.filter((s) => s !== skill)
        : [...prev.expertise, skill],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      toast.error("Please sign in to apply as a mentor");
      router.push("/auth/signup?role=mentor");
      return;
    }

    try {
      await saveProfile({
        name: formData.fullName,
        bio: formData.bio,
        expertise: formData.expertise,
        company: formData.company,
        linkedin: formData.linkedin,
        yearsOfExperience: parseInt(formData.experience) || 0,
        // Map other fields as needed
      });
      toast.success("Application submitted successfully!");
      router.push("/mentor/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit application");
    }
  }

  return (
    <div className="space-y-8">
      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Award className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Share Knowledge</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Help aspiring learners learn from your real-world experience
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Build Network</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with talented tech talent and expand your professional network
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Heart className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Give Back</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Make a meaningful impact on someone's career journey</p>
          </CardContent>
        </Card>
      </div>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Mentor Application</CardTitle>
          <CardDescription>Tell us about yourself and your expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled // Email shouldn't be changed if from auth
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., Senior Product Manager"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience *</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => setFormData({ ...formData, experience: value })}
              >
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3-5 years</SelectItem>
                  <SelectItem value="5">5-8 years</SelectItem>
                  <SelectItem value="8">8+ years</SelectItem>
                  <SelectItem value="10">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Areas of Expertise * (Select at least 2)</Label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {expertiseOptions.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={formData.expertise.includes(skill)}
                      onCheckedChange={() => handleExpertiseToggle(skill)}
                    />
                    <label
                      htmlFor={skill}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                required
                placeholder="Tell us about your experience and what you're passionate about teaching..."
                rows={5}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio / Project Link (Optional)</Label>
                <Input
                  id="portfolio"
                  placeholder="https://behance.net/profile or https://github.com/user"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability *</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) => setFormData({ ...formData, availability: value })}
              >
                <SelectTrigger id="availability">
                  <SelectValue placeholder="When are you available?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="evenings">Evenings</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={formData.expertise.length < 2 || isSaving}>
              {isSaving ? "Submitting..." : "Submit Application"}
            </Button>

            {!currentUser && (
              <p className="text-sm text-center text-muted-foreground mt-4">
                Note: You will be asked to sign in or create an account to save your application.
              </p>
            )}

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
