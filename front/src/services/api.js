const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

function getToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
}

async function parseResponse(response) {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  const message = payload?.message || response.statusText || "Erro na comunicacao com a API.";

  if (!response.ok || payload?.success === false) {
    throw new Error(message);
  }

  if (payload && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload.data;
  }

  return payload;
}

async function request(endpoint, options = {}) {
  const { body, auth = true, headers: customHeaders, ...fetchOptions } = options;
  const token = getToken();
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const headers = {
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
    ...fetchOptions,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return parseResponse(response);
}

export const api = {
  login(email, password) {
    return request("/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
  },
  bootstrap() {
    return request("/public/bootstrap", {
      method: "POST",
      auth: false,
    });
  },
  get(endpoint) {
    return request(endpoint);
  },
  post(endpoint, body) {
    return request(endpoint, {
      method: "POST",
      body,
    });
  },
  put(endpoint, body) {
    return request(endpoint, {
      method: "PUT",
      body,
    });
  },
  delete(endpoint) {
    return request(endpoint, {
      method: "DELETE",
    });
  },
};
