"use client"

import { useState, useRef, useEffect } from "react"
import { format, isSameDay } from "date-fns"
import { useStudents } from "@/apis/student"
import { useMedia } from "@/apis/media"
import { useFileUpload } from "@/hooks/useFileUpload"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, ImageIcon, Video, CalendarDays, Flame, CheckCircle2, Edit2, PlayCircle } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

export function TodayLogCard() {
  const queryClient = useQueryClient()
  const { getMyProgress, logLearningActivity, editLearningActivity } = useStudents()
  const { data, isLoading } = getMyProgress()
  const { signUpload } = useMedia()

  const [summary, setSummary] = useState("")
  const [whatIBuilt, setWhatIBuilt] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [videoUrl, setVideoUrl] = useState("") // simple URL input for video
  const [showVideoInput, setShowVideoInput] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Edit mode
  const [isEditing, setIsEditing] = useState(false)

  const imageUpload = useFileUpload(4)
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  // Upload file logic
  const uploadFileToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const signResult = await new Promise<any>((resolve, reject) => {
        signUpload.mutate(
          {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            folder: "ignite/logs",
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
      formData.append("folder", signResult?.folder || "ignite/logs")
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

  if (isLoading || !data) {
    return (
      <Card className="mb-6">
        <CardContent className="py-10 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const { progress, logs } = data
  const isTodayDone = progress?.isTodayDone
  const dayNumber = isTodayDone ? progress.totalDaysCompleted : progress.totalDaysCompleted + 1
  const todayLog = isTodayDone && logs && logs.length > 0 ? logs[logs.length - 1] : null

  const handleImagesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    imageUpload.addFiles(Array.from(e.target.files))
  }

  const handleSubmit = async () => {
    if (summary.trim().length < 50) {
      toast.error("Summary must be at least 50 characters.")
      return
    }

    try {
      setIsUploading(true)
      const imageUrls: string[] = []

      // If editing and no new images were added, we might keep existing, but for simplicity here we append new
      // In a real scenario, we'd handle existing images + new images. We'll just upload new ones.
      for (const file of imageUpload.files) {
        const url = await uploadFileToCloudinary(file)
        if (url) imageUrls.push(url)
      }

      setIsUploading(false)

      const finalVideoUrls = videoUrl.trim() ? [videoUrl.trim()] : []

      if (isEditing && todayLog) {
        await editLearningActivity.mutateAsync({
          logId: todayLog._id,
          summary,
          whatIBuilt,
          isPublic,
          mediaUrls: imageUrls.length > 0 ? [...(todayLog.mediaUrls || []), ...imageUrls] : todayLog.mediaUrls,
          videoUrls: finalVideoUrls.length > 0 ? finalVideoUrls : todayLog.videoUrls,
        })
        toast.success("Log updated successfully!")
        setIsEditing(false)
      } else {
        await logLearningActivity.mutateAsync({
          dayNumber,
          summary,
          whatIBuilt,
          isPublic,
          mediaUrls: imageUrls,
          videoUrls: finalVideoUrls,
        })
        toast.success("Great job! Day logged successfully.")
      }
      
      // Cleanup
      setSummary("")
      setWhatIBuilt("")
      setVideoUrl("")
      setShowVideoInput(false)
      imageUpload.clearFiles()
      
      queryClient.invalidateQueries({ queryKey: ["my_progress"] })
      queryClient.invalidateQueries({ queryKey: ["student_leaderboard"] })

    } catch (err: any) {
      setIsUploading(false)
      toast.error(err?.response?.data?.message || err?.message || "Failed to submit log")
    }
  }

  // View Mode
  if (isTodayDone && !isEditing && todayLog) {
    const isMilestone = [7, 14, 21, 30].includes(todayLog.dayNumber)
    return (
      <Card className="mb-6 overflow-hidden border-green-200 dark:border-green-900 bg-green-50/30 dark:bg-green-950/10">
        <div className="h-1 bg-green-500 w-full" />
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center text-green-700 dark:text-green-400">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Day {todayLog.dayNumber} of 30 Complete!
              </CardTitle>
              <CardDescription className="mt-1">
                You're on a <Flame className="inline h-4 w-4 text-orange-500 mb-1" /> {progress.currentStreak}-day streak.
              </CardDescription>
            </div>
            {isSameDay(new Date(todayLog.createdAt), new Date()) && (
              <Button variant="ghost" size="sm" onClick={() => {
                setSummary(todayLog.summary || "")
                setWhatIBuilt(todayLog.whatIBuilt || "")
                setIsPublic(todayLog.isPublic ?? true)
                setVideoUrl(todayLog.videoUrls?.[0] || "")
                setShowVideoInput(!!todayLog.videoUrls?.[0])
                setIsEditing(true)
              }}>
                <Edit2 className="h-4 w-4 mr-2" /> Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-background rounded-lg p-4 border text-sm space-y-4">
            <div>
              <h4 className="font-semibold text-muted-foreground mb-1 text-xs uppercase tracking-wider">What I learned</h4>
              <p className="whitespace-pre-wrap">{todayLog.summary}</p>
            </div>
            {todayLog.whatIBuilt && (
              <div className="pt-3 border-t">
                <h4 className="font-semibold text-muted-foreground mb-1 text-xs uppercase tracking-wider">What I built</h4>
                <p className="whitespace-pre-wrap">{todayLog.whatIBuilt}</p>
              </div>
            )}

            {(todayLog.mediaUrls?.length > 0 || todayLog.videoUrls?.length > 0) && (
              <div className="pt-3 border-t flex flex-wrap gap-3">
                {todayLog.mediaUrls?.map((url: string, i: number) => (
                  <div key={i} className="h-20 w-20 relative rounded-md overflow-hidden border">
                    <img src={url} alt="Log media" className="object-cover w-full h-full" />
                  </div>
                ))}
                {todayLog.videoUrls?.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md hover:bg-muted/80">
                    <PlayCircle className="h-5 w-5 text-blue-500" />
                    View Video
                  </a>
                ))}
              </div>
            )}
          </div>
          {isMilestone && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg text-sm font-medium text-center border border-yellow-200 dark:border-yellow-800">
              🎉 Congratulations! You reached a Day {todayLog.dayNumber} milestone! Keep it up!
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Edit / Form Mode
  return (
    <Card className="mb-6 shadow-md border-orange-200 dark:border-orange-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-orange-500" />
          {isEditing ? "Edit Today's Log" : `Day ${dayNumber} of 30`}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? "Make changes to your daily learning log."
            : `You're on a 🔥 ${progress?.currentStreak || 0}-day streak — don't break it!`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="summary">What did you learn today? <span className="text-red-500">*</span></Label>
          <Textarea 
            id="summary"
            placeholder="Write at least 50 characters explaining the concepts or skills you focused on..."
            className="min-h-[100px] resize-none"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <p className={`text-xs text-right ${summary.length < 50 ? 'text-red-500' : 'text-green-600'}`}>
            {summary.length}/50 min characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatIBuilt">What did you build? (Optional)</Label>
          <Textarea 
            id="whatIBuilt"
            placeholder="Did you write any code, create a design, or complete a project? Share it here."
            className="min-h-[80px] resize-none"
            value={whatIBuilt}
            onChange={(e) => setWhatIBuilt(e.target.value)}
          />
        </div>

        <div className="space-y-3 pt-2">
          <Label>Media (Optional)</Label>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              type="button"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4 mr-2" /> Add Image
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              type="button"
              onClick={() => setShowVideoInput(!showVideoInput)}
            >
              <Video className="h-4 w-4 mr-2" /> Add Video Link
            </Button>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImagesSelected}
          />

          {showVideoInput && (
            <div className="mt-2">
              <Label htmlFor="videoUrl" className="sr-only">Video URL</Label>
              <input 
                id="videoUrl"
                type="url"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Paste YouTube, Loom, or external video URL..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
          )}

          {/* Image Previews */}
          {imageUpload.files.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {imageUpload.files.map((file, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover rounded-md"
                    alt={`Preview ${index}`}
                  />
                  <button
                    type="button"
                    onClick={() => imageUpload.removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Switch 
              id="public-toggle" 
              checked={isPublic} 
              onCheckedChange={setIsPublic} 
            />
            <Label htmlFor="public-toggle" className="text-sm font-normal cursor-pointer">
              Make this log public
            </Label>
          </div>

          <div className="flex gap-2">
            {isEditing && (
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleSubmit} 
              disabled={isUploading || logLearningActivity.isPending || editLearningActivity.isPending || summary.trim().length < 50}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {(isUploading || logLearningActivity.isPending || editLearningActivity.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Save Changes" : `Log Day ${dayNumber}`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
