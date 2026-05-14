"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useStudents } from "@/apis/student"
import { useProjects } from "@/apis/projects"
import { useMedia } from "@/apis/media"
import { RoleGuard } from "@/components/shared/RoleGuard"
import { StudentDashboardHeader } from "@/components/students/student-dashboard-header"
import { LoadingScreen } from "@/components/shared/LoadingScreen"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Image as ImageIcon, X } from "lucide-react"
import { toast } from "sonner"

export default function NewProjectPage() {
  return (
    <RoleGuard allowedRoles={["student"]}>
      <NewProjectContent />
    </RoleGuard>
  )
}

function NewProjectContent() {
  const router = useRouter()
  const { getMyDetails } = useStudents()
  const { createProject } = useProjects()
  const { signUpload } = useMedia()

  const { data: userDetails, isLoading: userLoading } = getMyDetails()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [techTrack, setTechTrack] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  
  // Tech Stack (tags)
  const [techStackInput, setTechStackInput] = useState("")
  const [techStack, setTechStack] = useState<string[]>([])

  // Image Upload
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-fill track and cohort if possible
  useEffect(() => {
    if (userDetails?.data) {
      if (!techTrack && (userDetails.data as any).techTrack) {
        setTechTrack((userDetails.data as any).techTrack)
      }
    }
  }, [userDetails, techTrack])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = techStackInput.trim()
      if (tag && !techStack.includes(tag)) {
        setTechStack([...techStack, tag])
      }
      setTechStackInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTechStack(techStack.filter(t => t !== tagToRemove))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadFileToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const signResult = await new Promise<any>((resolve, reject) => {
        signUpload.mutate(
          {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            folder: "ignite/projects",
            resourceType: "image",
          },
          {
            onSuccess: (res) => resolve(res),
            onError: (err) => reject(err),
          }
        )
      })

      const params = signResult?.params || signResult
      const uploadUrl = signResult?.uploadUrl || `https://api.cloudinary.com/v1_1/${signResult?.cloudName}/image/upload`

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", signResult?.apiKey)
      formData.append("signature", signResult?.signature)
      formData.append("timestamp", String(signResult?.timestamp))
      formData.append("folder", signResult?.folder || "ignite/projects")
      if (params?.allowed_formats) formData.append("allowed_formats", params.allowed_formats)

      const uploadResponse = await fetch(uploadUrl, { method: "POST", body: formData })
      if (!uploadResponse.ok) throw new Error("Upload failed")

      const uploadData = await uploadResponse.json()
      return uploadData.secure_url || uploadData.url
    } catch (error) {
      console.error("File upload error:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return toast.error("Title is required")
    if (description.trim().length < 100) return toast.error("Description must be at least 100 characters")
    if (!techTrack) return toast.error("Please select a tech track")
    if (techStack.length === 0) return toast.error("Please add at least one technology to your tech stack")

    try {
      setIsSubmitting(true)
      
      let thumbnailUrl = ""
      if (imageFile) {
        const uploadedUrl = await uploadFileToCloudinary(imageFile)
        if (uploadedUrl) thumbnailUrl = uploadedUrl
      }

      await createProject.mutateAsync({
        title,
        description,
        liveUrl: liveUrl.trim(),
        githubUrl: repoUrl.trim(),
        track: techTrack as any,
        techStack: techStack.join(', ') as any,
        thumbnailUrl: thumbnailUrl as any,
        isPublished,
      })

      toast.success("Project saved successfully!")
      router.push("/learner/dashboard/projects")
    } catch (err: any) {
      setIsSubmitting(false)
      toast.error(err?.response?.data?.message || err?.message || "Failed to save project")
    }
  }

  if (userLoading) return <LoadingScreen />

  return (
    <div>
      <StudentDashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/learner/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Project</CardTitle>
            <CardDescription>
              Share what you've built. Projects can be published to the public showcase to attract opportunities.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title <span className="text-destructive">*</span></Label>
                <Input 
                  id="title" 
                  placeholder="e.g. FolaIgnite Learning Platform" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={140}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="description" 
                  placeholder="Explain what your project does, the problem it solves, and your role..." 
                  className="min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={2000}
                  required
                />
                <p className={`text-xs text-right ${description.length < 100 ? 'text-destructive' : 'text-green-600'}`}>
                  {description.length}/100 min characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live URL (Optional)</Label>
                  <Input 
                    id="liveUrl" 
                    type="url"
                    placeholder="https://my-project.com" 
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repoUrl">Repository URL (Optional)</Label>
                  <Input 
                    id="repoUrl" 
                    type="url"
                    placeholder="https://github.com/username/repo" 
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="track">Tech Track <span className="text-destructive">*</span></Label>
                  <Select value={techTrack} onValueChange={setTechTrack} required>
                    <SelectTrigger id="track">
                      <SelectValue placeholder="Select primary track" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend Development</SelectItem>
                      <SelectItem value="backend">Backend Development</SelectItem>
                      <SelectItem value="fullstack">Full Stack Development</SelectItem>
                      <SelectItem value="mobile">Mobile Development</SelectItem>
                      <SelectItem value="ux-ui">UI/UX Design</SelectItem>
                      <SelectItem value="data">Data Science</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="techStack">Tech Stack Tags <span className="text-destructive">*</span></Label>
                  <div className="flex flex-col gap-2">
                    <Input 
                      id="techStack"
                      placeholder="e.g. React, Node.js (Press Enter)" 
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {techStack.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-foreground">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Thumbnail Image (Optional)</Label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative h-24 w-40 rounded-md overflow-hidden border">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => { setImageFile(null); setImagePreview(null) }}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => imageInputRef.current?.click()}
                      className="h-24 w-40 border-dashed flex flex-col gap-2"
                    >
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload Image</span>
                    </Button>
                  )}
                  <input 
                    ref={imageInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Recommended: 1200x630px JPG or PNG. Will be displayed on the public showcase.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t">
                <Switch 
                  id="published" 
                  checked={isPublished} 
                  onCheckedChange={setIsPublished} 
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="published" className="font-medium cursor-pointer">
                    Publish immediately
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Your project will be visible on the public showcase (pending moderation).
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted/30 px-6 py-4 flex justify-end gap-2 border-t">
              <Button type="button" variant="outline" asChild disabled={isSubmitting}>
                <Link href="/learner/dashboard/projects">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || description.length < 100} className="bg-orange-500 hover:bg-orange-600 text-white">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Project
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
