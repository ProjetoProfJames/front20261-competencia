import { request } from "@/services/api";

export const disciplinaService = {
  list(token) {
    return request("/api/disciplinas", {}, token);
  },
};
