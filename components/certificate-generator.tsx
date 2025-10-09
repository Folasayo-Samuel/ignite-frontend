"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, Share2, CheckCircle } from "lucide-react"
import { useState } from "react"

interface CertificateGeneratorProps {
  studentName: string
  cohortName: string
  completionDate: string
  techTrack: string
}

export function CertificateGenerator({
  studentName,
  cohortName,
  completionDate,
  techTrack,
}: CertificateGeneratorProps) {
  const [generating, setGenerating] = useState(false)

  const generateCertificate = () => {
    setGenerating(true)
    // Simulate certificate generation
    setTimeout(() => {
      // Create certificate canvas
      const canvas = document.createElement("canvas")
      canvas.width = 1200
      canvas.height = 800
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Background
        ctx.fillStyle = "#0A1628"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Border
        ctx.strokeStyle = "#FF6B35"
        ctx.lineWidth = 10
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)

        // Title
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "bold 60px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Certificate of Completion", canvas.width / 2, 150)

        // FolaIgnite Logo Text
        ctx.font = "bold 40px Arial"
        ctx.fillStyle = "#FF6B35"
        ctx.fillText("FolaIgnite", canvas.width / 2, 220)

        // Student Name
        ctx.font = "bold 48px Arial"
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(studentName, canvas.width / 2, 350)

        // Description
        ctx.font = "24px Arial"
        ctx.fillStyle = "#94A3B8"
        ctx.fillText("has successfully completed the 30-day learning challenge", canvas.width / 2, 420)

        // Cohort and Track
        ctx.font = "bold 32px Arial"
        ctx.fillStyle = "#FF6B35"
        ctx.fillText(`${cohortName} - ${techTrack}`, canvas.width / 2, 500)

        // Date
        ctx.font = "20px Arial"
        ctx.fillStyle = "#94A3B8"
        ctx.fillText(`Completed on ${completionDate}`, canvas.width / 2, 580)

        // Signature line
        ctx.strokeStyle = "#94A3B8"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(canvas.width / 2 - 150, 680)
        ctx.lineTo(canvas.width / 2 + 150, 680)
        ctx.stroke()

        ctx.font = "18px Arial"
        ctx.fillStyle = "#94A3B8"
        ctx.fillText("FolaIgnite Team", canvas.width / 2, 710)

        // Download
        const link = document.createElement("a")
        link.download = `folaignite-certificate-${studentName.replace(/\s+/g, "-").toLowerCase()}.png`
        link.href = canvas.toDataURL()
        link.click()
      }

      setGenerating(false)
    }, 2000)
  }

  const shareCertificate = () => {
    const text = `I just completed the 30-day learning challenge with FolaIgnite! 🎉 #FolaIgnite #30DaysOfCode #${techTrack}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          <CardTitle>Your Certificate</CardTitle>
        </div>
        <CardDescription>Download and share your achievement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-6 text-center">
          <Award className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-xl mb-2">{studentName}</h3>
          <p className="text-sm text-muted-foreground mb-1">
            {cohortName} - {techTrack}
          </p>
          <p className="text-xs text-muted-foreground">Completed: {completionDate}</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-500">Verified Completion</span>
          </div>
        </div>

        <div className="grid gap-3">
          <Button onClick={generateCertificate} disabled={generating} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {generating ? "Generating..." : "Download Certificate"}
          </Button>
          <Button onClick={shareCertificate} variant="outline" className="w-full bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Share on Social Media
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
