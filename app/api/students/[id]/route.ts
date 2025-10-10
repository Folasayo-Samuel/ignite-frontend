import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database.service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const student = await DatabaseService.getStudentById(params.id)
    if (!student) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: student })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch student" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const student = await DatabaseService.updateStudent(params.id, body)
    if (!student) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: student })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update student" }, { status: 500 })
  }
}
