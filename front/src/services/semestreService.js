import { apiRequest, readSession } from '@/lib/api'

function getToken() {
  const session = readSession()
  return session?.token
}

export async function listarSemestres() {
  return apiRequest('/api/semestres', { token: getToken() })
}

export async function buscarSemestre(id) {
  return apiRequest(`/api/semestres/${id}`, { token: getToken() })
}

export async function criarSemestre(dados) {
  return apiRequest('/api/semestres', { method: 'POST', body: dados, token: getToken() })
}

export async function editarSemestre(id, dados) {
  return apiRequest(`/api/semestres/${id}`, { method: 'PUT', body: dados, token: getToken() })
}

export async function deletarSemestre(id) {
  return apiRequest(`/api/semestres/${id}`, { method: 'DELETE', token: getToken() })
}
