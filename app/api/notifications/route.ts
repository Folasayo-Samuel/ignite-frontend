import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database.service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    const notifications = await DatabaseService.getNotifications(userId)
    return NextResponse.json({ success: true, data: notifications })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const notification = await DatabaseService.createNotification(body)
    return NextResponse.json({ success: true, data: notification }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create notification" }, { status: 500 })
  }
}
