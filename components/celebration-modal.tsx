"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trophy, Download, Twitter, Facebook, Linkedin } from "lucide-react"

interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
}

export function CelebrationModal({ isOpen, onClose, studentName }: CelebrationModalProps) {
  const [badgeUrl, setBadgeUrl] = useState("")

  useEffect(() => {
    if (isOpen) {
      // Generate badge URL (in a real app, this would be generated server-side)
      const canvas = document.createElement("canvas")
      canvas.width = 800
      canvas.height = 600
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 800, 600)
        gradient.addColorStop(0, "#1e3a8a")
        gradient.addColorStop(1, "#f97316")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 800, 600)

        // Badge content
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 48px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("🏆 Challenge Complete! 🏆", 400, 150)

        ctx.font = "32px sans-serif"
        ctx.fillText(studentName, 400, 250)

        ctx.font = "24px sans-serif"
        ctx.fillText("Successfully completed the", 400, 320)
        ctx.fillText("FolaIgnite 30-Day Learning Challenge", 400, 360)

        ctx.font = "20px sans-serif"
        ctx.fillText("30 minutes × 30 days = Unstoppable Growth", 400, 450)

        ctx.font = "18px sans-serif"
        ctx.fillText("FolaIgnite.com", 400, 520)

        setBadgeUrl(canvas.toDataURL("image/png"))
      }
    }
  }, [isOpen, studentName])

  const handleDownload = () => {
    const link = document.createElement("a")
    link.download = "folaignite-completion-badge.png"
    link.href = badgeUrl
    link.click()
  }

  const shareText = `I just completed the FolaIgnite 30-Day Learning Challenge! 🏆 30 minutes a day for 30 days of consistent learning. #FolaIgnite #30DayChallenge #TechLearning`

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://folaignite.com")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://folaignite.com")}`,
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-primary" />
            Congratulations!
          </DialogTitle>
          <DialogDescription>You've completed the 30-Day Challenge!</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {badgeUrl && (
            <div className="rounded-lg overflow-hidden border-2 border-primary">
              <img src={badgeUrl || "/placeholder.svg"} alt="Completion Badge" className="w-full" />
            </div>
          )}

          <div className="space-y-3">
            <p className="text-center text-muted-foreground">
              Share your achievement with the world and inspire others!
            </p>

            <div className="flex flex-col gap-2">
              <Button onClick={handleDownload} variant="outline" className="w-full bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download Badge
              </Button>

              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
