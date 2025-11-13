import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../common/constants/queryKeys";
import type { DashboardMetrics } from "../common/types/user";
import { fetchDashboardMetrics } from "../services/userService";

const placeholderMetrics: DashboardMetrics = {
  activeUsers: 1280,
  churnRate: 2.3,
  netPromoterScore: 58,
};

export function useDashboard() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.dashboard],
    queryFn: fetchDashboardMetrics,
    placeholderData: placeholderMetrics,
  });

  const health = useMemo(() => {
    const metrics = query.data ?? placeholderMetrics;
    if (metrics.netPromoterScore > 50 && metrics.churnRate < 5) {
      return "excellent";
    }
    if (metrics.netPromoterScore > 20) {
      return "good";
    }
    return "warning";
  }, [query.data]);

  return {
    metrics: query.data ?? placeholderMetrics,
    health,
    isLoading: query.isLoading,
  };
}
