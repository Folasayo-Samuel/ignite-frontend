export interface User {
  id: string
  email: string
  name: string
  role: "student" | "partner" | "mentor" | "admin"
  avatar?: string
  country: string
  createdAt: Date
  updatedAt: Date
}

export interface Student extends User {
  role: "student"
  techTrack: "frontend" | "backend" | "fullstack" | "mobile" | "devops" | "ai-ml"
  cohortId: string
  currentStreak: number
  totalDays: number
  points: number
  achievements: string[]
}

export interface Mentor extends User {
  role: "mentor"
  expertise: string[]
  bio: string
  rating: number
  totalSessions: number
  availability: {
    [key: string]: boolean // day of week
  }
  hourlyRate?: number
  linkedIn?: string
  github?: string
  website?: string
}

export interface Partner extends User {
  role: "partner"
  organization: string
  tier: "bronze" | "silver" | "gold" | "platinum"
  sponsoredCohorts: string[]
  totalStudents: number
}

export interface Cohort {
  id: string
  name: string
  startDate: Date
  endDate: Date
  techTrack: string
  partnerId?: string
  studentIds: string[]
  status: "upcoming" | "active" | "completed"
  country: string
}

export interface Activity {
  id: string
  studentId: string
  cohortId: string
  day: number
  date: Date
  topic: string
  duration: number
  notes?: string
  resourcesUsed: string[]
}

export interface Project {
  id: string
  studentId: string
  cohortId: string
  title: string
  description: string
  techStack: string[]
  githubUrl: string
  liveUrl?: string
  thumbnail?: string
  likes: string[] // user IDs who liked
  comments: Comment[]
  status: "draft" | "submitted" | "approved" | "featured"
  submittedAt: Date
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: Date
}

export interface Resource {
  id: string
  title: string
  description: string
  type: "article" | "video" | "documentation" | "code-sample" | "tutorial"
  category: "react" | "css" | "javascript" | "typescript" | "backend" | "tools"
  url: string
  thumbnail?: string
  duration?: number // for videos
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
  createdBy: string
  createdAt: Date
}

export interface Discussion {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  title: string
  content: string
  category: "general" | "technical" | "career" | "showcase" | "help"
  tags: string[]
  replies: Reply[]
  likes: string[]
  views: number
  solved: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Reply {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  likes: string[]
  createdAt: Date
}

export interface Event {
  id: string
  title: string
  description: string
  type: "workshop" | "webinar" | "session" | "showcase"
  date: Date
  duration: number
  host: string
  maxAttendees?: number
  attendees: string[]
  meetingUrl?: string
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
}

export interface MentorSession {
  id: string
  mentorId: string
  studentId: string
  scheduledAt: Date
  duration: number
  topic: string
  status: "scheduled" | "completed" | "cancelled"
  meetingUrl?: string
  notes?: string
}

export interface Notification {
  id: string
  userId: string
  type: "achievement" | "comment" | "like" | "cohort" | "reminder" | "session" | "system"
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: Date
}

export interface Certificate {
  id: string
  studentId: string
  cohortId: string
  issueDate: Date
  certificateUrl: string
  verificationCode: string
}

export interface Analytics {
  totalStudents: number
  activeStudents: number
  totalProjects: number
  totalMentors: number
  totalCohorts: number
  completionRate: number
  averageStreak: number
  topCountries: { country: string; count: number }[]
  growthData: { date: string; students: number; projects: number }[]
}
