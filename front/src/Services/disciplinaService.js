import { request } from "@/lib/api";

export const disciplinaService = {
  list(token) {
    return request("/api/disciplinas", {}, token);
  },
};
