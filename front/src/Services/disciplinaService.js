import { request } from "@/services/api";

export const disciplinaService = {
  list(token) {
    return request("/api/disciplinas", {}, token);
  },

  getById(id, token) {
    return request(`/api/disciplinas/${id}`, {}, token);
  },

  create(data, token) {
    return request(
      "/api/disciplinas",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    );
  },

  update(id, data, token) {
    return request(
      `/api/disciplinas/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token
    );
  },

  remove(id, token) {
    return request(
      `/api/disciplinas/${id}`,
      {
        method: "DELETE",
      },
      token
    );
  },
};