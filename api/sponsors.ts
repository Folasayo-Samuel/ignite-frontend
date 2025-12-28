import { useApiQuery } from "@/hooks/useApiQuery";

export interface Sponsor {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  website: string | null;
  country: string;
  tier: string; // Display tier: Platinum, Gold, Silver
  planTier: string; // Backend tier: scale, growth, launch
  students: number;
  cohorts: number;
}

/**
 * Hook to fetch public sponsors/partners list
 * Returns active organizations sorted by plan tier
 */
export const useSponsors = () => {
  return useApiQuery<Sponsor[]>(["sponsors"], {
    url: "/sponsors",
    method: "GET",
    skipAuthRedirect: true, // Public endpoint, no auth required
  });
};
