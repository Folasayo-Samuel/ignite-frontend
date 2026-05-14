import { useApiMutation } from "@/hooks/useApiMutation";

export const useEnrollments = () => {
  const initiateEnrollment = useApiMutation<{ authorizationUrl: string; reference: string }, { cohortId: string }>({
    url: "/cohorts/enrollment/initiate",
    method: "POST",
  });

  return {
    initiateEnrollment,
  };
};
