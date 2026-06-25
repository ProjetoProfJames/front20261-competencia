import { api } from './api'

export async function listarProjetos() {
  const response = await api.get('/api/projetos')
  return response.data
}

export async function buscarProjeto(id) {
  const response = await api.get(`/api/projetos/${id}`)
  return response.data
}

export async function criarProjeto(dados) {
  const response = await api.post('/api/projetos', dados)
  return response.data
}

export async function editarProjeto(id, dados) {
  const response = await api.put(`/api/projetos/${id}`, dados)
  return response.data
}

export async function deletarProjeto(id) {
  const response = await api.delete(`/api/projetos/${id}`)
  return response.data
}

export async function adicionarIntegrante(projetoId, alunoId) {
  const response = await api.post(`/api/projetos/${projetoId}/integrantes`, { alunoId })
  return response.data
}

export async function removerIntegrante(projetoId, alunoId) {
  const response = await api.delete(`/api/projetos/${projetoId}/integrantes/${alunoId}`)
  return response.data
}

export async function criarAvaliacao(projetoId, dados) {
  const response = await api.post(`/api/projetos/${projetoId}/avaliacoes`, dados)
  return response.data
}

export async function editarAvaliacao(projetoId, avaliacaoId, dados) {
  const response = await api.put(`/api/projetos/${projetoId}/avaliacoes/${avaliacaoId}`, dados)
  return response.data
}

export async function deletarAvaliacao(projetoId, avaliacaoId) {
  const response = await api.delete(`/api/projetos/${projetoId}/avaliacoes/${avaliacaoId}`)
  return response.data
}

export async function listarAvaliacoesPorProjeto(projetoId) {
  const response = await api.get('/api/avaliacoes')
  return response.data.filter((a) => a.projeto.id === Number(projetoId))
}