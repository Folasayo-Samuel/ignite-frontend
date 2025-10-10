import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database.service"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const notification = await DatabaseService.markNotificationAsRead(params.id)
    if (!notification) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: notification })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to mark notification as read" }, { status: 500 })
  }
}
