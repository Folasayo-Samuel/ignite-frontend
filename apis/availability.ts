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
    useApiQuery<AvailabilityData>(["mentor_availability"], {
      url: "/mentor/availability",
      method: "GET",
    });

  const toggleAvailability = useApiMutation<AvailabilityData, { isAcceptingRequests: boolean }>({
    url: "/mentor/availability",
    method: "PATCH",
  });

  const setWeeklySchedule = useApiMutation<AvailabilityData, { weeklySchedule: any[] }>({
    url: "/mentor/availability/weekly",
    method: "PUT",
  });

  const setCalendarSettings = useApiMutation<AvailabilityData, any>({
    url: "/mentor/availability/calendar",
    method: "PUT",
  });

  const setSlotTemplate = useApiMutation<AvailabilityData, { start: string; end: string; sessionDurationMin: number }>({
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
