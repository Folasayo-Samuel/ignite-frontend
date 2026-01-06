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
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Camera } from "lucide-react"
import api from "@/hooks/axiosInstance"
import { useRef } from "react"

export function BecomeMentorForm() {
  const router = useRouter()
  const { currentUser } = useAuthStore()
  const { getMyProfile, updateProfile } = useMentors()

  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Conditionally fetch profile ONLY if user is logged in to avoid 401 triggers
  const { data: profileResult, isLoading: isLoadingProfile } = getMyProfile(!!currentUser)
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
    avatar: "",
  })

  // Pre-fill form when profile data loads
  useEffect(() => {
    if (!currentUser) return;

    // API client unwraps data, so profileResult might be the object directly
    const p = (profileResult as any)?.data || profileResult;

    if (p) {
      setFormData(prev => ({
        ...prev,
        fullName: p.name || prev.fullName,
        email: p.email || currentUser?.email || prev.email,
        bio: p.bio && p.bio !== "Hi, I'm a mentor!" ? p.bio : prev.bio,
        expertise: p.expertise || [],
        company: p.company || "",
        title: p.title || "",
        linkedin: p.linkedin || "",
        experience: p.yearsOfExperience ? p.yearsOfExperience.toString() : "",
        availability: p.isAvailable ? "flexible" : prev.availability,
        avatar: p.avatar || "",
      }))
    }
  }, [profileResult, currentUser])

  const expertiseOptions = [
    "Product Management", "UI/UX Design", "Frontend Development",
    "Backend Development", "Full Stack Development", "Mobile Development",
    "Data Analysis/Science", "Machine Learning/AI", "DevOps/Cloud Strategy",
    "Cybersecurity", "Quality Assurance (QA)", "Technical Writing",
    "Growth Marketing", "Product Marketing", "Career Coaching",
    "Technical Interview Prep", "System Design", "Blockchain/Web3",
  ]

  const handleExpertiseToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(skill)
        ? prev.expertise.filter((s) => s !== skill)
        : [...prev.expertise, skill],
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, WebP, or GIF)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setIsUploadingImage(true);

    try {
      const signResponse = await api.post('/media/sign-upload', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        folder: 'avatars',
        resourceType: 'image',
        tags: ['avatar', 'profile']
      });

      const { uploadUrl, apiKey, signature, params } = signResponse.data;
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('api_key', apiKey);
      uploadData.append('signature', signature);
      if (params) {
        Object.keys(params).forEach(key => uploadData.append(key, params[key]));
      }

      const uploadResponse = await fetch(uploadUrl, { method: 'POST', body: uploadData });
      const result = await uploadResponse.json();

      if (result.secure_url) {
        setFormData(prev => ({ ...prev, avatar: result.secure_url }));
        toast.success("Image uploaded! Don't forget to submit the form.");
      } else {
        throw new Error(result.error?.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.title.trim() !== "" &&
    formData.company.trim() !== "" &&
    formData.experience !== "" &&
    formData.expertise.length > 0 &&
    formData.bio.trim() !== "" &&
    formData.availability !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      toast.error("Please sign in to apply as a mentor");
      router.push("/auth/signup?role=mentor");
      return;
    }

    if (!isFormValid) {
      toast.error("Please fill in all required fields");
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
        avatar: formData.avatar,
      });

      await queryClient.invalidateQueries({ queryKey: ["mentor-profile-me"] });

      toast.success("Application submitted successfully!");
      router.push("/mentor/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit application");
    }
  }

  // GUEST LANDING UI
  if (!currentUser) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        {/* Professional Header for Guests */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
            <CardHeader>
              <Award className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-xl">Share Mastery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Mentor the next generation of African tech leaders by sharing your unique industry experience.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-xl">Global Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join a world-class community of mentors from Top Tech companies and scale-ups.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
            <CardHeader>
              <Heart className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-xl">Legacy of Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Help close the talent gap and build a sustainable tech ecosystem for learners across the continent.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action for Guests */}
        <Card className="bg-primary/5 border-none">
          <CardContent className="py-10 text-center space-y-6">
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-2xl font-bold">Ready to make a difference?</h2>
              <p className="text-muted-foreground">
                Create an account to start your mentor application. It only takes 2 minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-10" asChild>
                <Link href="/auth/signup?role=mentor">Get Started Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-10" asChild>
                <Link href="/auth/login?role=mentor&redirect=/home/become-mentor">Log in to Continue</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expert FAQ Preview */}
        <div className="text-center">
          <p className="text-sm text-balance text-muted-foreground">
            Mentoring on FolaIgnite is flexible and designed to fit into your busy schedule.
            Typical engagement is 1-2 hours per week.
          </p>
        </div>
      </div>
    )
  }

  // LOGGED IN FORM UI
  return (
    <div className="space-y-8">
      {/* Shortened benefits for logged in users */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Award className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Share Knowledge</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Help aspiring learners learn from your real-world experience</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Build Network</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Connect with talented tech talent and expand your network</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Mentor Application</CardTitle>
          <CardDescription>Tell us about yourself and your expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={formData.avatar} alt={formData.fullName} />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">
                  {formData.fullName ? formData.fullName.substring(0, 2).toUpperCase() : "ME"}
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploadingImage ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Camera className="h-6 w-6 text-white" />}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Click to upload (Max 2MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
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
                  disabled
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
              <Label>Areas of Expertise * (Select at least 1)</Label>
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
                placeholder="Tell us about your experience..."
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
                  placeholder="https://github.com/user"
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

            <Button type="submit" className="w-full" size="lg" disabled={!isFormValid || isSaving}>
              {isSaving ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
