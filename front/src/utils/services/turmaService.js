import { apiFetch } from "./api";

export function listarTurmas() {
  return apiFetch("/turmas");
}

export function buscarTurmaPorId(id) {
  return apiFetch(`/turmas/${id}`);
}

export function criarTurma(turma) {
  return apiFetch("/turmas", {
    method: "POST",
    body: JSON.stringify(turma)
  });
}

export function atualizarTurma(id, turma) {
  return apiFetch(`/turmas/${id}`, {
    method: "PUT",
    body: JSON.stringify(turma)
  });
}

export function removerTurma(id) {
  return apiFetch(`/turmas/${id}`, {
    method: "DELETE"
  });
}
