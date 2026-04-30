import { ID } from "@/components/apis/type";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface Partner {
  _id: ID;
  companyName: string;
  website?: string;
  contactEmail?: string;
  logo?: string;
  description?: string;
  createdAt: string;
}

export interface CreatePartnerDto {
  companyName: string;
  website?: string;
  contactEmail?: string;
}

export const usePartners = () => {
  const getPartners = () =>
    useApiQuery<{ success: boolean; data: Partner[] }>(["partners"], {
      url: "/partners",
      method: "GET",
    });

  const createPartner = useApiMutation<
    { success: boolean; data: Partner },
    CreatePartnerDto
  >({
    url: "/partners",
    method: "POST",
  });

  return {
    getPartners,
    createPartner,
  };
};
