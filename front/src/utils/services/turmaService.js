import { apiFetch } from "./api";

export function listarTurmas() {
  return apiFetch("/api/turmas");
}

export function buscarTurmaPorId(id) {
  return apiFetch(`/api/turmas/${id}`);
}

export function criarTurma(turma) {
  return apiFetch("/api/turmas", {
    method: "POST",
    body: JSON.stringify(turma)
  });
}

export function atualizarTurma(id, turma) {
  return apiFetch(`/api/turmas/${id}`, {
    method: "PUT",
    body: JSON.stringify(turma)
  });
}

export function removerTurma(id) {
  return apiFetch(`/api/turmas/${id}`, {
    method: "DELETE"
  });
}
