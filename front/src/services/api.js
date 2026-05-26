const BASE_URL = "http://localhost:8080/api";

export async function fetchApi(endpoint, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    };

    if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    }

  const config = {
    method: options.method || "GET",
    headers,
    ...options,
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (response.status === 401) {
      console.warn("Sessão expirada. Faça login novamente.");
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      throw new Error("Não autorizado");
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Erro na comunicação com o servidor.");
    }

    return data;  
  } catch (error) {
    console.error(`Erro na requisição [${config.method}] ${endpoint}:`, error);
    throw error;
  } 
}

  export const api = {
    get: (endpoint, options = {}) => 
      fetchApi(endpoint, { ...options, method: "GET" }),

    post: (endpoint, body, options = {}) => 
      fetchApi(endpoint, { ...options, method: "POST", body }),

    put: (endpoint, body, options = {}) => 
      fetchApi(endpoint, { ...options, method: "PUT", body }),

    delete: (endpoint, options = {}) => 
      fetchApi(endpoint, { ...options, method: "DELETE" }),
  };