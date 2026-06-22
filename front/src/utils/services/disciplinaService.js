import { apiFetch } from "./api";

export function listarDisciplinas() {
  return apiFetch("/api/disciplinas");
}
