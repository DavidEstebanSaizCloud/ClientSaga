export interface UserSummary {
  id: string;
  name: string;
  email: string;
  title: string;
  avatarUrl?: string;
}

export interface DashboardMetrics {
  activeUsers: number;
  churnRate: number;
  netPromoterScore: number;
}
