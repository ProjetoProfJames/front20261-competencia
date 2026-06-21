import { apiFetch } from "./api";

export function listarPeriodosLetivos() {
  return apiFetch("/periodos-letivos");
}

export function buscarPeriodoLetivoPorId(id) {
  return apiFetch(`/periodos-letivos/${id}`);
}

export function criarPeriodoLetivo(periodoLetivo) {
  return apiFetch("/periodos-letivos", {
    method: "POST",
    body: JSON.stringify(periodoLetivo)
  });
}

export function atualizarPeriodoLetivo(id, periodoLetivo) {
  return apiFetch(`/periodos-letivos/${id}`, {
    method: "PUT",
    body: JSON.stringify(periodoLetivo)
  });
}

export function removerPeriodoLetivo(id) {
  return apiFetch(`/periodos-letivos/${id}`, {
    method: "DELETE"
  });
}
