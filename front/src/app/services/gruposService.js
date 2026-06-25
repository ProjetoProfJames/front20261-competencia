const API_URL = "http://localhost:8080/api/projetos";
const TURMAS_URL = "http://localhost:8080/api/turmas";
const SEMESTRES_URL = "http://localhost:8080/api/semestres";
const LOCAIS_URL = "http://localhost:8080/api/locais";

export async function listarTurmas() {
  const res = await request(TURMAS_URL);
  return res?.data ?? [];
}

export async function buscarTurma(id) {
  const res = await request(`${TURMAS_URL}/${id}`);
  return res?.data ?? null;
}

export async function listarSemestres() {
  const res = await request(SEMESTRES_URL);
  return res?.data ?? [];
}

export async function listarLocais() {
  const res = await request(LOCAIS_URL);
  return res?.data ?? [];
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request(url, options = {}) {
  const token = getToken(); // corrigido: chama uma vez só

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.warn("Resposta não é JSON válido:", e); // corrigido: loga o erro
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `Erro ${response.status}: ${response.statusText}`,
    );
  }

  return data;
}

export async function listarProjetos() {
  const response = await request(API_URL);
  return response?.data || [];
}

export async function buscarProjeto(id) {
  const response = await request(`${API_URL}/${id}`);
  return response?.data;
}

export async function criarProjeto(projeto) {
  const response = await request(API_URL, {
    method: "POST",
    body: JSON.stringify(projeto),
  });

  return response?.data;
}

export async function atualizarProjeto(id, projeto) {
  const response = await request(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(projeto),
  });

  return response?.data;
}

export async function excluirProjeto(id) {
  await request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
