import { api } from './api'

export async function listarCursos() {
  const response = await api.get('/api/cursos')
  return response.data
}

export async function buscarCurso(id) {
  const response = await api.get(`/api/cursos/${id}`)
  return response.data
}

export async function criarCurso(dados) {
  const response = await api.post('/api/cursos', dados)
  return response.data
}

export async function editarCurso(id, dados) {
  const response = await api.put(`/api/cursos/${id}`, dados)
  return response.data
}

export async function deletarCurso(id) {
  const response = await api.delete(`/api/cursos/${id}`)
  return response.data
}
