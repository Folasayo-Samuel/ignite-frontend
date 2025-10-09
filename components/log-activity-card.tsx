"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle, ImageIcon, Video } from "lucide-react"

export function LogActivityCard() {
  const [activity, setActivity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setActivity("")
    alert("Activity logged successfully!")
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-primary" />
          Log Today's Activity
        </CardTitle>
        <CardDescription>Share what you learned or built today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity">What did you work on today?</Label>
            <Textarea
              id="activity"
              placeholder="Describe your learning activity, challenges faced, or progress made..."
              rows={4}
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm">
              <ImageIcon className="mr-2 h-4 w-4" />
              Add Image
            </Button>
            <Button type="button" variant="outline" size="sm">
              <Video className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging..." : "Log Activity"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
