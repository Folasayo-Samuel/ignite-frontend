import { mockDatabase } from "@/lib/db/mock-data"
import type { Student, Project, Discussion, Event, Notification } from "@/lib/types/database"

export class DatabaseService {
  // Students
  static async getStudents(filters?: { cohortId?: string; country?: string }) {
    let students = mockDatabase.students
    if (filters?.cohortId) {
      students = students.filter((s) => s.cohortId === filters.cohortId)
    }
    if (filters?.country) {
      students = students.filter((s) => s.country === filters.country)
    }
    return students
  }

  static async getStudentById(id: string) {
    return mockDatabase.students.find((s) => s.id === id)
  }

  static async createStudent(data: Omit<Student, "id" | "createdAt" | "updatedAt">) {
    const student: Student = {
      ...data,
      id: `student-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDatabase.students.push(student)
    return student
  }

  static async updateStudent(id: string, data: Partial<Student>) {
    const index = mockDatabase.students.findIndex((s) => s.id === id)
    if (index !== -1) {
      mockDatabase.students[index] = {
        ...mockDatabase.students[index],
        ...data,
        updatedAt: new Date(),
      }
      return mockDatabase.students[index]
    }
    return null
  }

  // Mentors
  static async getMentors(filters?: { expertise?: string; available?: boolean }) {
    let mentors = mockDatabase.mentors
    if (filters?.expertise) {
      mentors = mentors.filter((m) => m.expertise.includes(filters.expertise!))
    }
    return mentors
  }

  static async getMentorById(id: string) {
    return mockDatabase.mentors.find((m) => m.id === id)
  }

  // Projects
  static async getProjects(filters?: { studentId?: string; cohortId?: string; status?: string }) {
    let projects = mockDatabase.projects
    if (filters?.studentId) {
      projects = projects.filter((p) => p.studentId === filters.studentId)
    }
    if (filters?.cohortId) {
      projects = projects.filter((p) => p.cohortId === filters.cohortId)
    }
    if (filters?.status) {
      projects = projects.filter((p) => p.status === filters.status)
    }
    return projects
  }

  static async createProject(data: Omit<Project, "id" | "likes" | "comments" | "submittedAt">) {
    const project: Project = {
      ...data,
      id: `project-${Date.now()}`,
      likes: [],
      comments: [],
      submittedAt: new Date(),
    }
    mockDatabase.projects.push(project)
    return project
  }

  static async likeProject(projectId: string, userId: string) {
    const project = mockDatabase.projects.find((p) => p.id === projectId)
    if (project) {
      if (project.likes.includes(userId)) {
        project.likes = project.likes.filter((id) => id !== userId)
      } else {
        project.likes.push(userId)
      }
      return project
    }
    return null
  }

  static async addComment(projectId: string, comment: any) {
    const project = mockDatabase.projects.find((p) => p.id === projectId)
    if (project) {
      project.comments.push({
        ...comment,
        id: `comment-${Date.now()}`,
        createdAt: new Date(),
      })
      return project
    }
    return null
  }

  // Discussions
  static async getDiscussions(filters?: { category?: string; userId?: string }) {
    let discussions = mockDatabase.discussions
    if (filters?.category) {
      discussions = discussions.filter((d) => d.category === filters.category)
    }
    if (filters?.userId) {
      discussions = discussions.filter((d) => d.userId === filters.userId)
    }
    return discussions
  }

  static async createDiscussion(
    data: Omit<Discussion, "id" | "replies" | "likes" | "views" | "createdAt" | "updatedAt">,
  ) {
    const discussion: Discussion = {
      ...data,
      id: `discussion-${Date.now()}`,
      replies: [],
      likes: [],
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDatabase.discussions.push(discussion)
    return discussion
  }

  // Events
  static async getEvents(filters?: { type?: string; status?: string }) {
    let events = mockDatabase.events
    if (filters?.type) {
      events = events.filter((e) => e.type === filters.type)
    }
    if (filters?.status) {
      events = events.filter((e) => e.status === filters.status)
    }
    return events
  }

  static async createEvent(data: Omit<Event, "id" | "attendees">) {
    const event: Event = {
      ...data,
      id: `event-${Date.now()}`,
      attendees: [],
    }
    mockDatabase.events.push(event)
    return event
  }

  static async registerForEvent(eventId: string, userId: string) {
    const event = mockDatabase.events.find((e) => e.id === eventId)
    if (event && !event.attendees.includes(userId)) {
      event.attendees.push(userId)
      return event
    }
    return null
  }

  // Notifications
  static async getNotifications(userId: string) {
    return mockDatabase.notifications.filter((n) => n.userId === userId)
  }

  static async createNotification(data: Omit<Notification, "id" | "read" | "createdAt">) {
    const notification: Notification = {
      ...data,
      id: `notification-${Date.now()}`,
      read: false,
      createdAt: new Date(),
    }
    mockDatabase.notifications.push(notification)
    return notification
  }

  static async markNotificationAsRead(id: string) {
    const notification = mockDatabase.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      return notification
    }
    return null
  }

  // Analytics
  static async getAnalytics() {
    return {
      totalStudents: mockDatabase.students.length,
      activeStudents: mockDatabase.students.filter((s) => s.currentStreak > 0).length,
      totalProjects: mockDatabase.projects.length,
      totalMentors: mockDatabase.mentors.length,
      totalCohorts: mockDatabase.cohorts.length,
      completionRate: 85,
      averageStreak: 12,
      topCountries: [
        { country: "Nigeria", count: 450 },
        { country: "Kenya", count: 320 },
        { country: "Ghana", count: 280 },
      ],
      growthData: [
        { date: "2025-01", students: 100, projects: 50 },
        { date: "2025-02", students: 250, projects: 120 },
        { date: "2025-03", students: 450, projects: 280 },
      ],
    }
  }
}
