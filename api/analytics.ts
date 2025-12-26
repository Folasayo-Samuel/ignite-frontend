import { useApiQuery, useApiMutation } from "@/hooks/useApiQuery";

export interface MetricsData {
  range: string;
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  retentionRate: number;
}

export interface SignupData {
  date: string;
  count: number;
}

export interface TrackData {
  trackId: string;
  trackName: string;
  totalUsers?: number;
  activityVolume?: number;
}

export const useAnalytics = (range?: string) => {
  const getMetrics = () =>
    useApiQuery<{ success: boolean; data: MetricsData }>(["analytics_metrics", range], {
      url: `/analytics/metrics`,
      method: "GET",
      params: { range },
      skipAuthRedirect: true,
    });

  const getSignups = () =>
    useApiQuery<{ success: boolean; data: SignupData[] }>(["analytics_signups", range], {
      url: `/analytics/signups`,
      method: "GET",
      params: { range },
    });

  const getTopTracks = () =>
    useApiQuery<{ success: boolean; data: TrackData[] }>(["analytics_top_tracks"], {
      url: `/analytics/top-tracks`,
      method: "GET",
    });

  const getActiveTracks = () =>
    useApiQuery<{ success: boolean; data: TrackData[] }>(["analytics_active_tracks", range], {
      url: `/analytics/active-tracks`,
      method: "GET",
      params: { range },
    });

  // Organization Analytics (org-scoped)
  const getOrgDashboard = (orgId: string) =>
    useApiQuery<{ success: boolean; data: OrgDashboardMetrics }>(
      ["org_analytics_dashboard", orgId],
      {
        url: `/organizations/${orgId}/analytics/dashboard`,
        method: "GET",
      }
    );

  const getOrgActivityTrend = (orgId: string) =>
    useApiQuery<{ success: boolean; data: { date: string; count: number }[] }>(
      ["org_analytics_trend", orgId],
      {
        url: `/organizations/${orgId}/analytics/activity-trend`,
        method: "GET",
      }
    );

  const getGeographicDistribution = () =>
    useApiQuery<{ success: boolean; data: { items: Array<{ country: string; count: number; percentage: number }>; total: number } }>(
      ["analytics_geographic"],
      {
        url: `/analytics/geographic-distribution`,
        method: "GET",
        skipAuthRedirect: true,
      }
    );
  
  return {
    getMetrics,
    getSignups,
    getTopTracks,
    getActiveTracks,
    getOrgDashboard,
    getOrgActivityTrend,
    getGeographicDistribution,
    getTestimonials: () =>
      useApiQuery<{ success: boolean; data: Testimonial[] }>(["analytics_testimonials"], {
        url: `/analytics/testimonials`,
        method: "GET",
        skipAuthRedirect: true,
      }),
    createTestimonial: useApiMutation<Testimonial, Omit<Testimonial, "id">>({
      url: `/analytics/testimonials`,
      method: "POST",
      invalidateTags: [["analytics_testimonials"]],
    }),
    getImpactStats: () =>
      useApiQuery<{ success: boolean; data: ImpactStats }>(["analytics_impact"], {
        url: `/analytics/impact`,
        method: "GET",
        skipAuthRedirect: true,
      }),
  };
};

// Organization Dashboard Metrics interface
export interface OrgDashboardMetrics {
  totalLearners: number;
  activeLearners: number;
  totalCohorts: number;
  completionRate: number;
  averageProgress: number;
}


 // Geographic Distribution
export interface GeographicItem {
  country: string;
  count: number;
  percentage: number;
}

export interface GeographicDistribution {
  items: GeographicItem[];
  total: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  country: string;
  image: string;
  content: string;
  rating: number;
  company?: string;
}

export interface ImpactStats {
  activeLearners: number;
  projectsCompleted: number;
  completionRate: number;
  partnerOrganizations: number;
  countriesReached: number;
}

