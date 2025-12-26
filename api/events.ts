import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string; // or meetingLink
  type: 'workshop' | 'webinar' | 'hackathon' | 'meetup';
  attendees: number; // count
  isRegistered?: boolean;
}

export const useEvents = () => {
  const getEvents = (filters?: {
    type?: string;
    upcoming?: boolean;
  }) =>
    useApiQuery<{ success: boolean; data: Event[] }>(["events", filters], {
      url: "/events",
      method: "GET",
      params: filters,
    });

  const registerForEvent = useApiMutation<{ success: boolean }, { eventId: string }>({
    url: "/events/register",
    method: "POST",
  });

  const createEvent = useApiMutation<{ success: boolean; data: Event }, Partial<Event>>({
    url: "/events",
    method: "POST",
  });

  return {
    getEvents,
    registerForEvent,
    createEvent,
    unregisterForEvent: useApiMutation<{ success: boolean }, { eventId: string }>({
      url: "/events/unregister",
      method: "POST",
    }),
  };
};
