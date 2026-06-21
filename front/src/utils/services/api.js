const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api-backend";

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

function getConnectionMessage() {
  if (API_URL.startsWith("/")) {
    return "Não foi possível conectar ao backend. Confira se o backend está rodando, se BACKEND_URL está correto no .env.local e reinicie o npm run dev.";
  }

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

  if (response.status === 401 || response.status === 403) {
    if (redirectOnUnauthorized && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }

    const message = await getErrorMessage(response);
    throw new Error(`Acesso não autorizado. ${message}`);
  }

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new Error(`Erro ${response.status}: ${message}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
