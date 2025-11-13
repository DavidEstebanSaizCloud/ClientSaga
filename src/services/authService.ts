import api from "./api";
import type { AuthUser, Credentials } from "../common/types/auth";

export async function login(credentials: Credentials) {
  const { data } = await api.post<AuthUser>("/auth/login", credentials);
  return data;
}

export async function me() {
  const { data } = await api.get<AuthUser>("/auth/me");
  return data;
}
