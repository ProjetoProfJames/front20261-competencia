// CRUD de usuários — mesma API consumida pelas telas /users.

import { authorizedRequest } from "./httpClient";

const jsonBody = (data) => ({
  method: undefined,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify(data),
});

export const fetchUsers = () => authorizedRequest("/users");

export const registerUser = (data) =>
  authorizedRequest("/users", { ...jsonBody(data), method: "POST" });

export const editUser = (id, data) =>
  authorizedRequest(`/users/${id}`, { ...jsonBody(data), method: "PUT" });

export const removeUser = (id) =>
  authorizedRequest(`/users/${id}`, { method: "DELETE" });
