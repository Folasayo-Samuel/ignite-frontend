import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database.service"

export async function GET(request: NextRequest) {
  try {
    const analytics = await DatabaseService.getAnalytics()
    return NextResponse.json({ success: true, data: analytics })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
