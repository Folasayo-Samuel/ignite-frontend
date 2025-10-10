import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database.service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    const discussions = await DatabaseService.getDiscussions({
      category: category || undefined,
    })

    return NextResponse.json({ success: true, data: discussions })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch discussions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const discussion = await DatabaseService.createDiscussion(body)
    return NextResponse.json({ success: true, data: discussion }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create discussion" }, { status: 500 })
  }
}
