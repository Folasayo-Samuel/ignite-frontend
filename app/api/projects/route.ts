import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database.service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get("studentId")
    const cohortId = searchParams.get("cohortId")
    const status = searchParams.get("status")

    const projects = await DatabaseService.getProjects({
      studentId: studentId || undefined,
      cohortId: cohortId || undefined,
      status: status || undefined,
    })

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const project = await DatabaseService.createProject(body)
    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 })
  }
}
