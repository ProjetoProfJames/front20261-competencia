import { request } from "@/lib/api";

export const turmaService = {
  list(token) {
    return request("/api/turmas", {}, token);
  },
  getById(id, token) {
    return request(`/api/turmas/${id}`, {}, token);
  },
  create(payload, token) {
    return request("/api/turmas", {
      method: "POST",
      body: JSON.stringify(payload),
    }, token);
  },
  update(id, payload, token) {
    return request(`/api/turmas/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }, token);
  },
  remove(id, token) {
    return request(`/api/turmas/${id}`, {
      method: "DELETE",
    }, token);
  },
};
