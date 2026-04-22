export interface StatsData {
  leadsPerMonth: Record<string, number>;
  jobsPerMonth: Record<string, number>;
  visitsPerMonth: Record<string, number>;
  leadsBySource: Record<string, Record<string, number>>;
}
