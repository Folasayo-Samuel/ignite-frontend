import type {
  Student,
  Mentor,
  Partner,
  Cohort,
  Project,
  Resource,
  Discussion,
  Event,
  Notification,
} from "@/lib/types/database"

// Mock data store (in production, this would be a real database)
export const mockDatabase = {
  students: [] as Student[],
  mentors: [] as Mentor[],
  partners: [] as Partner[],
  cohorts: [] as Cohort[],
  projects: [] as Project[],
  resources: [] as Resource[],
  discussions: [] as Discussion[],
  events: [] as Event[],
  notifications: [] as Notification[],
  activities: [] as any[],
  sessions: [] as any[],
  certificates: [] as any[],
}

// Initialize with sample data
export function initializeMockData() {
  // Sample cohorts
  mockDatabase.cohorts = [
    {
      id: "cohort-1",
      name: "Frontend Masters Q1 2025",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-01-30"),
      techTrack: "frontend",
      studentIds: [],
      status: "active",
      country: "Nigeria",
    },
    {
      id: "cohort-2",
      name: "Backend Bootcamp Q1 2025",
      startDate: new Date("2025-01-15"),
      endDate: new Date("2025-02-13"),
      techTrack: "backend",
      studentIds: [],
      status: "active",
      country: "Kenya",
    },
  ]

  // Sample students
  mockDatabase.students = [
    {
      id: "student-1",
      email: "ada@example.com",
      name: "Ada Okafor",
      role: "student",
      avatar: "/african-woman-developer.jpg",
      country: "Nigeria",
      techTrack: "frontend",
      cohortId: "cohort-1",
      currentStreak: 15,
      totalDays: 15,
      points: 1500,
      achievements: ["first-week", "streak-7", "streak-14"],
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date(),
    },
  ]

  // Sample mentors
  mockDatabase.mentors = [
    {
      id: "mentor-1",
      email: "john@example.com",
      name: "John Doe",
      role: "mentor",
      avatar: "/placeholder.svg?height=100&width=100",
      country: "USA",
      expertise: ["React", "TypeScript", "Next.js"],
      bio: "Senior Frontend Engineer with 8+ years of experience",
      rating: 4.9,
      totalSessions: 45,
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
    },
  ]

  return mockDatabase
}

// Initialize on module load
initializeMockData()
