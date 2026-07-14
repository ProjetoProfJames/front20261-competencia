// Camada responsável por anexar o token JWT em cada chamada autenticada
// e redirecionar para o login quando a sessão não existe/expirou.

export const readStoredToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
};

export const requestWithAuth = async (url, config = {}) => {
  const token = readStoredToken();

  if (!token) {
    alert("Sessão inválida");
    window.location.href = "/login";
    throw new Error("Token JWT não encontrado");
  }

  const res = await fetch(url, {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...config.headers,
    },
  });

  const contentType = res.headers.get("content-type");
  const isJson = Boolean(contentType && contentType.includes("application/json"));

  if (!isJson) {
    throw new Error(`Resposta inesperada: ${url} ~> não é JSON`);
  }

  const payload = await res.json();

  if (!res.ok) {
    const msg = payload.message || "Erro na requisição";
    alert(msg);
    throw new Error(msg);
  }

  return payload;
};
