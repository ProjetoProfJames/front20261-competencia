// CRUD de locais de apresentação — consumido pelas telas /locais.

import { authorizedRequest } from "./httpClient";

const jsonBody = (data) => ({
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify(data),
});

export const fetchLocations = () => authorizedRequest("/locais");

export const fetchLocationById = (id) => authorizedRequest(`/locais/${id}`);

export const registerLocation = (data) =>
  authorizedRequest("/locais", { ...jsonBody(data), method: "POST" });

export const editLocation = (id, data) =>
  authorizedRequest(`/locais/${id}`, { ...jsonBody(data), method: "PUT" });

export const removeLocation = (id) =>
  authorizedRequest(`/locais/${id}`, { method: "DELETE" });
