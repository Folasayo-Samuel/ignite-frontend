import { ID } from "@/components/apis/type";
import { useApiMutation } from "@/hooks/useApiMutation";

export interface Certificate {
  _id: ID;
  studentId: string;
  cohortId: string;
  pdfUrl?: string; // Derived from download endpoint usually
  createdAt: string;
}

export const useCertificates = () => {
  const issueCertificate = useApiMutation<
    { success: boolean; data: Certificate },
    { studentId?: string; cohortId: string }
  >({
    url: "/certificates/issue",
    method: "POST",
  });

  return {
    issueCertificate,
  };
};
