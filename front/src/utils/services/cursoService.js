import { apiFetch } from "./api";

export function listarCursos() {
  return apiFetch("/api/cursos");
}

export function buscarCursoPorId(id) {
  return apiFetch(`/api/cursos/${id}`);
}

export function criarCurso(curso) {
  return apiFetch("/api/cursos", {
    method: "POST",
    body: JSON.stringify(curso)
  });
}

export function atualizarCurso(id, curso) {
  return apiFetch(`/api/cursos/${id}`, {
    method: "PUT",
    body: JSON.stringify(curso)
  });
}

export function removerCurso(id) {
  return apiFetch(`/api/cursos/${id}`, {
    method: "DELETE"
  });
}
