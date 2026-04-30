import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ID } from "@/components/apis/type";

export interface Event {
  _id: ID;
  title: string;
  description: string;
  type: "workshop" | "webinar" | "meetup" | "competition" | "conference";
  status: "upcoming" | "live" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  location?: {
    type: "physical" | "virtual" | "hybrid";
    address?: string;
    meetingLink?: string;
  };
  organizer: {
    name: string;
    email: string;
    avatar?: string;
  };
  maxAttendees?: number;
  currentAttendees: number;
  tags: string[];
  requirements?: string[];
  agenda?: {
    time: string;
    title: string;
    description?: string;
  }[];
  resources?: {
    name: string;
    url: string;
    type: "document" | "video" | "link";
  }[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  type: "workshop" | "webinar" | "meetup" | "competition" | "conference";
  startDate: string;
  endDate: string;
  location?: {
    type: "physical" | "virtual" | "hybrid";
    address?: string;
    meetingLink?: string;
  };
  maxAttendees?: number;
  tags: string[];
  requirements?: string[];
  agenda?: {
    time: string;
    title: string;
    description?: string;
  }[];
  resources?: {
    name: string;
    url: string;
    type: "document" | "video" | "link";
  }[];
  isPublic?: boolean;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  status?: "upcoming" | "live" | "completed" | "cancelled";
  startDate?: string;
  endDate?: string;
  location?: {
    type: "physical" | "virtual" | "hybrid";
    address?: string;
    meetingLink?: string;
  };
  maxAttendees?: number;
  tags?: string[];
  requirements?: string[];
  agenda?: {
    time: string;
    title: string;
    description?: string;
  }[];
  resources?: {
    name: string;
    url: string;
    type: "document" | "video" | "link";
  }[];
  isPublic?: boolean;
}

export interface EventRegistration {
  _id: ID;
  eventId: ID;
  userId: ID;
  registeredAt: string;
  status: "registered" | "attended" | "cancelled" | "no_show";
  notes?: string;
}

export const useEvents = () => {
  // Get all events (public)
  const getEvents = (filters?: {
    type?: string;
    status?: string;
    tags?: string[];
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.type) params.append("type", filters.type);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.tags) params.append("tags", filters.tags.join(","));
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.search) params.append("search", filters.search);

    return useApiQuery<{ success: boolean; data: Event[]; pagination: any }>(
      ["events", filters],
      {
        url: `/events${params.toString() ? `?${params.toString()}` : ""}`,
        method: "GET",
      },
    );
  };

  // Get specific event
  const getEvent = (id: string) =>
    useApiQuery<{ success: boolean; data: Event }>(["event", id], {
      url: `/events/${id}`,
      method: "GET",
    });

  // Create event (admin/organizer)
  const createEvent = useApiMutation<
    { success: boolean; data: Event },
    CreateEventDto
  >({
    url: "/events",
    method: "POST",
  });

  // Update event
  const updateEvent = (id: string) =>
    useApiMutation<{ success: boolean; data: Event }, UpdateEventDto>({
      url: `/events/${id}`,
      method: "PATCH",
    });

  // Delete event
  const deleteEvent = (id: string) =>
    useApiMutation<{ success: boolean }, void>({
      url: `/events/${id}`,
      method: "DELETE",
    });

  // Event registration
  const registerForEvent = (eventId: string) =>
    useApiMutation<
      { success: boolean; data: EventRegistration },
      { notes?: string }
    >({
      url: `/events/${eventId}/register`,
      method: "POST",
    });

  const cancelRegistration = (eventId: string) =>
    useApiMutation<{ success: boolean }, { reason?: string }>({
      url: `/events/${eventId}/cancel-registration`,
      method: "POST",
    });

  // Get user's event registrations
  const getMyRegistrations = (status?: string) =>
    useApiQuery<{ success: boolean; data: EventRegistration[] }>(
      ["my-event-registrations", status],
      {
        url: `/events/my-registrations${status ? `?status=${status}` : ""}`,
        method: "GET",
      },
    );

  // Get event attendees (organizer only)
  const getEventAttendees = (eventId: string) =>
    useApiQuery<{ success: boolean; data: any[] }>(
      ["event-attendees", eventId],
      {
        url: `/events/${eventId}/attendees`,
        method: "GET",
      },
    );

  // Mark attendance
  const markAttendance = (eventId: string) =>
    useApiMutation<{ success: boolean }, { userId?: string }>({
      url: `/events/${eventId}/mark-attendance`,
      method: "POST",
    });

  return {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    getMyRegistrations,
    getEventAttendees,
    markAttendance,
  };
};
