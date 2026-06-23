import { apiRequest, readSession } from '@/lib/api'

function getToken() {
  const session = readSession()
  return session?.token
}

export async function listarCursos() {
  return apiRequest('/api/cursos', { token: getToken() })
}

export async function buscarCurso(id) {
  return apiRequest(`/api/cursos/${id}`, { token: getToken() })
}

export async function criarCurso(dados) {
  return apiRequest('/api/cursos', { method: 'POST', body: dados, token: getToken() })
}

export async function editarCurso(id, dados) {
  return apiRequest(`/api/cursos/${id}`, { method: 'PUT', body: dados, token: getToken() })
}

export async function deletarCurso(id) {
  return apiRequest(`/api/cursos/${id}`, { method: 'DELETE', token: getToken() })
}
