const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function request(path, options = {}, token = null) {
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      (typeof payload === "string" ? payload : null) ||
      "Erro ao comunicar com a API";

    throw new Error(message);
  }

  if (payload && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload.data;
  }

  return payload;
}

export function apiUrl() {
  return API_BASE_URL;
}
