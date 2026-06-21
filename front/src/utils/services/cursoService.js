import { apiFetch } from "./api";

export function listarCursos() {
  return apiFetch("/cursos");
}

export function buscarCursoPorId(id) {
  return apiFetch(`/cursos/${id}`);
}

export function criarCurso(curso) {
  return apiFetch("/cursos", {
    method: "POST",
    body: JSON.stringify(curso)
  });
}

export function atualizarCurso(id, curso) {
  return apiFetch(`/cursos/${id}`, {
    method: "PUT",
    body: JSON.stringify(curso)
  });
}

export function removerCurso(id) {
  return apiFetch(`/cursos/${id}`, {
    method: "DELETE"
  });
}
