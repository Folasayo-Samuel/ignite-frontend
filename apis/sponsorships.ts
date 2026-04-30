import api from "@/hooks/axiosInstance";

export interface CreatePledgeData {
  fullName: string;
  email: string;
  organization?: string;
  websiteUrl?: string;
  amount: number;
}

export interface SponsorShowcase {
  _id: string;
  fullName: string;
  organization: string;
  websiteUrl?: string;
  logoUrl?: string;
  amount: number;
  tier: string;
  createdAt: string;
}

export const createPledge = async (data: CreatePledgeData) => {
  const response = await api.post("/sponsorships/pledge", data);
  return response.data;
};

export const verifySponsorship = async (reference: string) => {
  const response = await api.get(`/sponsorships/verify/${reference}`);
  return response.data;
};

export const getShowcaseSponsors = async (): Promise<SponsorShowcase[]> => {
  const response = await api.get<SponsorShowcase[]>("/sponsorships/showcase");
  return response.data;
};
