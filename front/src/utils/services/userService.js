import { apiFetch } from "./api";

export function listarUsuarios() {
  return apiFetch("/api/users");
}
