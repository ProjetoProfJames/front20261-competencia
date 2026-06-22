const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("TKN") || localStorage.getItem("token");
}

function clearToken() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("TKN");
  localStorage.removeItem("TKN_PROFILE");
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

function getConnectionMessage() {
  return `Não foi possível conectar ao backend em ${API_URL}. Confira se o backend está rodando e se a URL está correta no .env.local.`;
}

async function getErrorMessage(response) {
  const contentType = response.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const body = await response.json();
      return body?.message || body?.error || body?.erro || JSON.stringify(body);
    }

    const text = await response.text();
    return text || "Erro na requisição";
  } catch {
    return "Erro na requisição";
  }
}

function unwrapApiResponse(payload) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload;
}

export async function apiFetch(endpoint, options = {}) {
  const { skipAuth = false, redirectOnUnauthorized = true, ...fetchOptions } = options;
  const token = skipAuth ? null : getToken();

  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers
    });
  } catch {
    throw new Error(getConnectionMessage());
  }

  if (response.status === 401) {
    const message = await getErrorMessage(response);

    if (redirectOnUnauthorized && typeof window !== "undefined") {
      clearToken();
      window.location.href = "/login";
    }

    throw new Error(`Sessão expirada ou inválida. ${message}`);
  }

  if (response.status === 403) {
    const message = await getErrorMessage(response);
    throw new Error(`Você não tem permissão para executar esta ação. ${message}`);
  }

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new Error(`Erro ${response.status}: ${message}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  return unwrapApiResponse(payload);
}
