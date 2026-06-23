import { request } from "@/services/api";

export const userService = {
  list(token) {
    return request("/api/users", {}, token);
  },
};
