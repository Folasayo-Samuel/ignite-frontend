import { type NextRequest, NextResponse } from "next/server"
import { AIRecommendationsService } from "@/lib/services/ai-recommendations.service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { techTrack, currentDay, completedTopics, strugglingAreas } = body

    const recommendations = await AIRecommendationsService.getPersonalizedRecommendations({
      techTrack,
      currentDay,
      completedTopics,
      strugglingAreas,
    })

    return NextResponse.json({ success: true, data: recommendations })
  } catch (error) {
    console.error("[v0] AI Recommendations API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate recommendations" }, { status: 500 })
  }
}
