import api from "./api";
import type { DashboardMetrics, UserSummary } from "../common/types/user";

export async function fetchUsers() {
  const { data } = await api.get<UserSummary[]>("/users");
  return data;
}

export async function fetchDashboardMetrics() {
  const { data } = await api.get<DashboardMetrics>("/dashboard/metrics");
  return data;
}
