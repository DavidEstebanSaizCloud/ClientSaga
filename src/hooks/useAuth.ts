import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../common/constants/queryKeys";
import type { AuthUser, Credentials } from "../common/types/auth";
import { login, me } from "../services/authService";

export function useAuth() {
  const queryClient = useQueryClient();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  const hasRealApi = apiBaseUrl.length > 0 && apiBaseUrl !== "https://api.example.com";

  const meQuery = useQuery({
    queryKey: [QUERY_KEYS.me],
    queryFn: me,
    enabled: Boolean(hasRealApi),
  });

  const loginMutation = useMutation({
    mutationFn: (payload: Credentials) => login(payload),
    onSuccess: (authUser: AuthUser) => {
      queryClient.setQueryData([QUERY_KEYS.me], authUser);
    },
  });

  return {
    user: meQuery.data,
    isLoading: meQuery.isLoading,
    login: loginMutation.mutateAsync,
    isAuthenticating: loginMutation.isPending,
  };
}
