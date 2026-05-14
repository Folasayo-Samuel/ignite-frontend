import { useApiMutation } from "@/hooks/useApiMutation";

export interface UpdateMentorSettingsDto {
  title?: string;
  company?: string;
  bio?: string;
  expertise?: string[];
  avatar?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  isAcceptingMentees?: boolean;
  defaultCohortFeeKobo?: number;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export const useMentorSettings = () => {
  const updateSettings = useApiMutation<any, UpdateMentorSettingsDto>({
    url: "/mentor/settings",
    method: "PATCH",
  });

  return {
    updateSettings,
  };
};
