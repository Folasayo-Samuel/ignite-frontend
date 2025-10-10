import { type NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/services/email.service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    let result

    switch (type) {
      case "welcome":
        result = await EmailService.sendWelcomeEmail(data.email, data.name)
        break
      case "daily-reminder":
        result = await EmailService.sendDailyReminder(data.email, data.name, data.currentDay)
        break
      case "certificate":
        result = await EmailService.sendCertificateEmail(data.email, data.name, data.certificateUrl)
        break
      case "mentor-request":
        result = await EmailService.sendMentorRequestNotification(data.mentorEmail, data.mentorName, data.studentName)
        break
      default:
        return NextResponse.json({ success: false, error: "Invalid email type" }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("[v0] Email API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
