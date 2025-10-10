import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database.service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    const events = await DatabaseService.getEvents({
      type: type || undefined,
      status: status || undefined,
    })

    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = await DatabaseService.createEvent(body)
    return NextResponse.json({ success: true, data: event }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 })
  }
}
