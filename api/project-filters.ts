import { useApiQuery } from "@/hooks/useApiQuery";

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface CohortFilterOption extends FilterOption {
  code?: string | null;
}

export interface ProjectFiltersData {
  tracks: FilterOption[];
  countries: FilterOption[];
  cohorts: CohortFilterOption[];
}

/**
 * Hook to fetch available filter options for the project showcase.
 * Returns tracks, countries, and cohorts that have approved projects.
 */
export const useProjectFilters = () => {
  return useApiQuery<ProjectFiltersData>(["projectFilters"], {
    url: "/projects/filters",
    method: "GET",
  });
};
