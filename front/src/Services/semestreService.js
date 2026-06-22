import { request } from "@/lib/api";

export const semestreService = {
  list(token) {
    return request("/api/semestres", {}, token);
  },
  getById(id, token) {
    return request(`/api/semestres/${id}`, {}, token);
  },
  create(payload, token) {
    return request("/api/semestres", {
      method: "POST",
      body: JSON.stringify(payload),
    }, token);
  },
  update(id, payload, token) {
    return request(`/api/semestres/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }, token);
  },
  remove(id, token) {
    return request(`/api/semestres/${id}`, {
      method: "DELETE",
    }, token);
  },
};
