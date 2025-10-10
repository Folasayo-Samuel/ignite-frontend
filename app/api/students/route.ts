import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database.service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cohortId = searchParams.get("cohortId")
    const country = searchParams.get("country")

    const students = await DatabaseService.getStudents({
      cohortId: cohortId || undefined,
      country: country || undefined,
    })

    return NextResponse.json({ success: true, data: students })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const student = await DatabaseService.createStudent(body)
    return NextResponse.json({ success: true, data: student }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create student" }, { status: 500 })
  }
}
