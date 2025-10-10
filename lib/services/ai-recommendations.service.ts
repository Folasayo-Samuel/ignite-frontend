import { generateText } from "ai"

export class AIRecommendationsService {
  static async getPersonalizedRecommendations(studentData: {
    techTrack: string
    currentDay: number
    completedTopics: string[]
    strugglingAreas?: string[]
  }) {
    try {
      const prompt = `You are an AI learning advisor for FolaIgnite, a 30-day coding challenge platform.

Student Profile:
- Tech Track: ${studentData.techTrack}
- Current Day: ${studentData.currentDay}/30
- Completed Topics: ${studentData.completedTopics.join(", ")}
${studentData.strugglingAreas ? `- Struggling Areas: ${studentData.strugglingAreas.join(", ")}` : ""}

Based on this profile, recommend 3-5 specific learning resources, topics, or projects that would help this student progress. Consider:
1. Their current progress and what comes next in their learning journey
2. Any areas where they're struggling
3. Resources that build on what they've already learned
4. Practical projects they could build

Format your response as a JSON array of recommendations, each with:
- title: string
- description: string (2-3 sentences)
- type: "article" | "video" | "project" | "tutorial"
- difficulty: "beginner" | "intermediate" | "advanced"
- estimatedTime: string (e.g., "30 mins", "2 hours")
- url: string (use placeholder URLs like "https://example.com/resource")

Return only the JSON array, no additional text.`

      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt,
      })

      // Parse the AI response
      const recommendations = JSON.parse(text)
      return recommendations
    } catch (error) {
      console.error("[v0] AI Recommendations Error:", error)
      // Return fallback recommendations
      return this.getFallbackRecommendations(studentData.techTrack)
    }
  }

  static getFallbackRecommendations(techTrack: string) {
    const recommendations: Record<string, any[]> = {
      frontend: [
        {
          title: "Advanced React Patterns",
          description:
            "Learn compound components, render props, and custom hooks to write more maintainable React code.",
          type: "tutorial",
          difficulty: "intermediate",
          estimatedTime: "2 hours",
          url: "https://react.dev/learn",
        },
        {
          title: "CSS Grid Mastery",
          description: "Master CSS Grid layout system to create complex, responsive layouts with ease.",
          type: "article",
          difficulty: "intermediate",
          estimatedTime: "45 mins",
          url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
        },
      ],
      backend: [
        {
          title: "RESTful API Design Best Practices",
          description: "Learn how to design scalable and maintainable REST APIs following industry standards.",
          type: "article",
          difficulty: "intermediate",
          estimatedTime: "1 hour",
          url: "https://restfulapi.net/",
        },
        {
          title: "Database Optimization Techniques",
          description:
            "Understand indexing, query optimization, and caching strategies for better database performance.",
          type: "tutorial",
          difficulty: "advanced",
          estimatedTime: "3 hours",
          url: "https://example.com/db-optimization",
        },
      ],
      fullstack: [
        {
          title: "Build a Full-Stack E-commerce App",
          description: "Create a complete e-commerce application with authentication, payments, and admin dashboard.",
          type: "project",
          difficulty: "advanced",
          estimatedTime: "10 hours",
          url: "https://example.com/ecommerce-project",
        },
      ],
    }

    return recommendations[techTrack] || recommendations.frontend
  }

  static async generateLearningPath(studentData: {
    techTrack: string
    currentLevel: string
    goals: string[]
  }) {
    try {
      const prompt = `Create a personalized 30-day learning path for a ${studentData.currentLevel} ${studentData.techTrack} developer.

Goals: ${studentData.goals.join(", ")}

Provide a day-by-day breakdown with:
- Day number
- Topic to learn
- Key concepts
- Recommended time (30 mins)
- Practice exercise idea

Format as JSON array with 30 entries.`

      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt,
      })

      return JSON.parse(text)
    } catch (error) {
      console.error("[v0] Learning Path Generation Error:", error)
      return []
    }
  }
}
