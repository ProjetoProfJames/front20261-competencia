// Wrapper único para todas as chamadas HTTP do app: uma versão exige
// token (rotas privadas) e outra é livre (rotas públicas, ex: login/bootstrap).

import { requestWithAuth } from "./tokenGuard";

const BASE_URL = "http://localhost:8080/api";

export const authorizedRequest = (path, config = {}) => {
  return requestWithAuth(`${BASE_URL}${path}`, config);
};

export const openRequest = async (path, config = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
  });

  const contentType = res.headers.get("content-type");
  const isJson = Boolean(contentType && contentType.includes("application/json"));

  if (!isJson) {
    throw new Error(`Resposta inesperada: ${path} ~> não é JSON`);
  }

  const payload = await res.json();

  if (!res.ok) {
    const msg = payload.message || "Erro na requisição";
    alert(msg);
    throw new Error(msg);
  }

  return payload;
};
