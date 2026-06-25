import { api } from './api'

export async function listarPeriodosLetivos() {
  const response = await api.get('/api/periodos-letivos')
  return response.data
}

export async function buscarPeriodoLetivo(id) {
  const response = await api.get(`/api/periodos-letivos/${id}`)
  return response.data
}

export async function criarPeriodoLetivo(dados) {
  const response = await api.post('/api/periodos-letivos', dados)
  return response.data
}

export async function editarPeriodoLetivo(id, dados) {
  const response = await api.put(`/api/periodos-letivos/${id}`, dados)
  return response.data
}

export async function deletarPeriodoLetivo(id) {
  const response = await api.delete(`/api/periodos-letivos/${id}`)
  return response.data
}
