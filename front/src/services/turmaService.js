import { apiRequest, readSession } from '@/lib/api'

function getToken() {
  const session = readSession()
  return session?.token
}

export async function listarTurmas() {
  return apiRequest('/api/turmas', { token: getToken() })
}

export async function buscarTurma(id) {
  return apiRequest(`/api/turmas/${id}`, { token: getToken() })
}

export async function criarTurma(dados) {
  return apiRequest('/api/turmas', { method: 'POST', body: dados, token: getToken() })
}

export async function editarTurma(id, dados) {
  return apiRequest(`/api/turmas/${id}`, { method: 'PUT', body: dados, token: getToken() })
}

export async function deletarTurma(id) {
  return apiRequest(`/api/turmas/${id}`, { method: 'DELETE', token: getToken() })
}
