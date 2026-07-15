const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function readAuth() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem("piemanager-auth");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeAuth(auth) {
  if (typeof window === "undefined") {
    return;
  }

  if (auth) {
    window.localStorage.setItem("piemanager-auth", JSON.stringify(auth));
    return;
  }

  window.localStorage.removeItem("piemanager-auth");
}

async function request(path, options = {}) {
  const auth = readAuth();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (auth?.accessToken) {
    headers.Authorization = `Bearer ${auth.accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Falha na requisição");
  }

  return payload.data;
}

export function getStoredAuth() {
  return readAuth();
}

export function setStoredAuth(auth) {
  writeAuth(auth);
}

export function clearStoredAuth() {
  writeAuth(null);
}

export async function loginUser(email, password) {
  const payload = await request("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

  return payload;
}

export async function bootstrapData() {
  const payload = await request("/api/public/bootstrap", {
    method: "POST",
    body: {},
  });

  return payload;
}

export async function getUsers() {
  return request("/api/users");
}

export async function createUser(user) {
  return request("/api/users", {
    method: "POST",
    body: user,
  });
}

export async function updateUser(id, user) {
  return request(`/api/users/${id}`, {
    method: "PUT",
    body: user,
  });
}

export async function deleteUser(id) {
  return request(`/api/users/${id}`, {
    method: "DELETE",
  });
}

export async function getLocais() {
  return request("/api/locais");
}

export async function createLocal(local) {
  return request("/api/locais", {
    method: "POST",
    body: local,
  });
}

export async function updateLocal(id, local) {
  return request(`/api/locais/${id}`, {
    method: "PUT",
    body: local,
  });
}

export async function deleteLocal(id) {
  return request(`/api/locais/${id}`, {
    method: "DELETE",
  });
}
