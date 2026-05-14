// [log-admin-action] 2026-05-13 — Helper to log admin actions via the existing backend audit-logs API
import axiosInstance from "@/hooks/axiosInstance"

interface LogAdminActionParams {
  /** The action performed, e.g. "APPROVE_MENTOR", "BAN_USER", "PROCESS_WITHDRAWAL" */
  action: string
  /** The Mongoose model affected, e.g. "MentorProfile", "User", "Cohort" */
  resourceType: string
  /** The _id of the affected document */
  resourceId?: string
  /** Human-readable description of what happened */
  description?: string
  /** Optional extra context (e.g. rejection reason, before/after values) */
  metadata?: Record<string, any>
}

/**
 * logAdminAction — Fire-and-forget POST to the backend audit-logs endpoint.
 *
 * Call this in every admin page or API hook that mutates data.
 * Uses the existing backend AuditLog schema (audit-logs module).
 *
 * Example:
 * ```ts
 * await logAdminAction({
 *   action: "APPROVE_MENTOR",
 *   resourceType: "mentor",
 *   resourceId: mentorId,
 *   description: "Approved mentor application",
 * })
 * ```
 */
export async function logAdminAction({
  action,
  resourceType,
  resourceId,
  description,
  metadata,
}: LogAdminActionParams): Promise<void> {
  try {
    await axiosInstance.post("/audit-logs", {
      action,
      actionType: "other",
      resourceType: resourceType.toLowerCase().includes("user") ? "user" : "other",
      resourceId,
      description: description || action,
      metadata,
    })
  } catch (error) {
    // Log but never throw — audit logging should never break the main flow
    console.error("[AdminLog] Failed to log admin action:", error)
  }
}
