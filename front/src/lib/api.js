import { clearSession, getSession } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

function isFormData(body) {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function getErrorMessage(payload, fallback) {
  if (payload?.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    return Object.entries(payload.data)
      .map(([field, message]) => `${field}: ${message}`)
      .join(" ");
  }

  return payload?.message || fallback;
}

export async function apiRequest(path, options = {}) {
  const session = getSession();
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined && options.body !== null;

  if (hasBody && !isFormData(options.body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (session?.accessToken) {
    headers.set("Authorization", `${session.tokenType || "Bearer"} ${session.accessToken}`);
  }

  const requestOptions = {
    ...options,
    headers,
    body: hasBody && !isFormData(options.body) && typeof options.body !== "string"
      ? JSON.stringify(options.body)
      : options.body,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (response.status === 401) {
    clearSession();

    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(getErrorMessage(payload, "Não foi possível concluir a operação."));
  }

  return payload?.data ?? null;
}
