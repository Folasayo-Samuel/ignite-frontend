import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database.service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId } = body

    const event = await DatabaseService.registerForEvent(params.id, userId)
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found or already registered" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to register for event" }, { status: 500 })
  }
}
