import { request } from "@/services/api";

export const turmaService = {
  list(token) {
    return request("/api/turmas", {}, token);
  },
  getById(id, token) {
    return request(`/api/turmas/${id}`, {}, token);
  },
  create(payload, token) {
    return request(
      "/api/turmas",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token
    );
  },
  update(id, payload, token) {
    return request(
      `/api/turmas/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      token
    );
  },
  remove(id, token) {
    return request(
      `/api/turmas/${id}`,
      {
        method: "DELETE",
      },
      token
    );
  },
  addAluno(id, alunoId, token) {
    return request(
      `/api/turmas/${id}/alunos`,
      {
        method: "POST",
        body: JSON.stringify({ alunoId: Number(alunoId) }),
      },
      token
    );
  },
  removeAluno(id, alunoId, token) {
    return request(
      `/api/turmas/${id}/alunos/${alunoId}`,
      {
        method: "DELETE",
      },
      token
    );
  },
  gerarMatriculas(id, token) {
    return request(
      `/api/turmas/${id}/matriculas`,
      {
        method: "POST",
      },
      token
    );
  },
};
