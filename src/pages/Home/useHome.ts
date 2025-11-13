import { useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUsers } from "../../hooks/useUsers";
import { useDashboard } from "../../hooks/useDashboard";

export function useHome() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { users, isLoading: isUsersLoading } = useUsers();
  const { metrics, health, isLoading: isDashboardLoading } = useDashboard();

  const hero = useMemo(() => {
    if (isAuthLoading) {
      return "Loading your workspace";
    }
    if (user) {
      return `Welcome back, ${user.name}`;
    }
    return "Welcome to ClientSaga";
  }, [isAuthLoading, user]);

  const highlightedUsers = users.slice(0, 3);

  return {
    hero,
    health,
    metrics,
    highlightedUsers,
    isLoading: isUsersLoading || isDashboardLoading || isAuthLoading,
  };
}
