import { api } from './api'

export async function listarTurmas() {
  const response = await api.get('/api/turmas')
  return response.data
}

export async function buscarTurma(id) {
  const response = await api.get(`/api/turmas/${id}`)
  return response.data
}

export async function criarTurma(dados) {
  const response = await api.post('/api/turmas', dados)
  return response.data
}

export async function editarTurma(id, dados) {
  const response = await api.put(`/api/turmas/${id}`, dados)
  return response.data
}

export async function deletarTurma(id) {
  const response = await api.delete(`/api/turmas/${id}`)
  return response.data
}
