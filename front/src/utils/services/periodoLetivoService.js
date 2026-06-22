import { apiFetch } from "./api";

export function listarPeriodosLetivos() {
  return apiFetch("/api/semestres");
}

export function buscarPeriodoLetivoPorId(id) {
  return apiFetch(`/api/semestres/${id}`);
}

export function criarPeriodoLetivo(periodoLetivo) {
  return apiFetch("/api/semestres", {
    method: "POST",
    body: JSON.stringify(periodoLetivo)
  });
}

export function atualizarPeriodoLetivo(id, periodoLetivo) {
  return apiFetch(`/api/semestres/${id}`, {
    method: "PUT",
    body: JSON.stringify(periodoLetivo)
  });
}

export function removerPeriodoLetivo(id) {
  return apiFetch(`/api/semestres/${id}`, {
    method: "DELETE"
  });
}
