import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../common/constants/queryKeys";
import type { UserSummary } from "../common/types/user";
import { fetchUsers } from "../services/userService";

const placeholderUsers: UserSummary[] = [
  { id: "1", name: "María López", email: "maria@example.com", title: "PM" },
  { id: "2", name: "Diego Ramos", email: "diego@example.com", title: "CTO" },
  { id: "3", name: "Lucía Pérez", email: "lucia@example.com", title: "UX Lead" },
];

export function useUsers() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.users],
    queryFn: fetchUsers,
    placeholderData: placeholderUsers,
  });

  return {
    users: query.data ?? placeholderUsers,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
