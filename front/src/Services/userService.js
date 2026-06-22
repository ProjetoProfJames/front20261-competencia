import { request } from "@/lib/api";

export const userService = {
  list(token) {
    return request("/api/users", {}, token);
  },
};
