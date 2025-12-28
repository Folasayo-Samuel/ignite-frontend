import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface AvailabilityData {
  isAcceptingRequests: boolean;
  weeklySchedule: any[];
  calendarSettings: any;
  slotTemplate: any;
}

export const useAvailability = () => {
  const getAvailability = () =>
    useApiQuery<{ success: boolean; data: AvailabilityData }>(["mentor_availability"], {
      url: "/mentor/availability",
      method: "GET",
    });

  const toggleAvailability = useApiMutation<{ success: boolean; data: AvailabilityData }, { isAcceptingRequests: boolean }>({
    url: "/mentor/availability",
    method: "PATCH",
  });

  const setWeeklySchedule = useApiMutation<{ success: boolean; data: AvailabilityData }, { weeklySchedule: any[] }>({
    url: "/mentor/availability/weekly",
    method: "PUT",
  });

  const setCalendarSettings = useApiMutation<{ success: boolean; data: AvailabilityData }, any>({
    url: "/mentor/availability/calendar",
    method: "PUT",
  });

  const setSlotTemplate = useApiMutation<{ success: boolean; data: AvailabilityData }, { start: string; end: string; sessionDurationMin: number }>({
    url: "/mentor/availability/slot-template",
    method: "PUT",
  });

  return {
    getAvailability,
    toggleAvailability,
    setWeeklySchedule,
    setCalendarSettings,
    setSlotTemplate,
  };
};
