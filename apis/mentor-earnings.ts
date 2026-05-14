import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";

export interface MentorWithdrawal {
  _id: string;
  amountKobo: number;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'REJECTED';
  bankAccountSnapshot: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  note?: string;
  createdAt: string;
}

export const useMentorEarnings = () => {
  const getWithdrawalHistory = () =>
    useApiQuery<MentorWithdrawal[]>(["mentor-withdrawals"], {
      url: `/mentor/withdrawals`,
      method: "GET",
    });

  const requestWithdrawal = useApiMutation<{ success: boolean; data: MentorWithdrawal }, void>({
    url: "/mentor/withdrawals",
    method: "POST",
  });

  return {
    getWithdrawalHistory,
    requestWithdrawal,
  };
};
