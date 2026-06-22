import { request } from "@/lib/api";

export const cursoService = {
  list(token) {
    return request("/api/cursos", {}, token);
  },
  getById(id, token) {
    return request(`/api/cursos/${id}`, {}, token);
  },
  create(payload, token) {
    return request("/api/cursos", {
      method: "POST",
      body: JSON.stringify(payload),
    }, token);
  },
  update(id, payload, token) {
    return request(`/api/cursos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }, token);
  },
  remove(id, token) {
    return request(`/api/cursos/${id}`, {
      method: "DELETE",
    }, token);
  },
};
