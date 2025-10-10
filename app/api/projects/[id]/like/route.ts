import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database.service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId } = body

    const project = await DatabaseService.likeProject(params.id, userId)
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to like project" }, { status: 500 })
  }
}
