import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database.service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const expertise = searchParams.get("expertise")

    const mentors = await DatabaseService.getMentors({
      expertise: expertise || undefined,
    })

    return NextResponse.json({ success: true, data: mentors })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch mentors" }, { status: 500 })
  }
}
