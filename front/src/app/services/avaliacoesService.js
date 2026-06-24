const BASE_URL = "http://localhost:8080/api/avaliacoes";
const USERS_URL = "http://localhost:8080/api/users";

export async function listarAvaliadores() {
  const res = await request(USERS_URL);
  const todos = res?.data ?? [];

  
  return todos.filter(
    (u) => u.profile === "PROFESSOR" || u.profile === "AVALIADOR_EXTERNO",
  );
}

export async function listarAvaliacoes({ projetoId, avaliadorId } = {}) {
  const params = new URLSearchParams();
  if (projetoId) params.append("projetoId", projetoId);
  if (avaliadorId) params.append("avaliadorId", avaliadorId);

  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`${BASE_URL}${query}`);
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Erro na requisição");
  }

  return data;
}

export async function buscarAvaliacao(id) {
  return request(`${BASE_URL}/${id}`);
}

export async function criarAvaliacao(data) {
  return request(BASE_URL, {
    method: "POST",
    body: JSON.stringify({
      projetoId: Number(data.projetoId),
      avaliadorId: Number(data.avaliadorId),
      nota: Number(data.nota),
      comentario: data.comentario,
    }),
  });
}

export async function atualizarAvaliacao(id, data) {
  const body = {};
  if (data.avaliadorId) body.avaliadorId = Number(data.avaliadorId);
  if (data.nota !== undefined) body.nota = Number(data.nota);
  if (data.comentario) body.comentario = data.comentario;

  return request(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deletarAvaliacao(id) {
  return request(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}