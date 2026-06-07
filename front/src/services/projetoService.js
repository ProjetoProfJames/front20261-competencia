import { apiRequest, readSession } from '@/lib/api'

function getToken() {
  const session = readSession()
  return session?.token
}

export async function listarProjetos() {
  return apiRequest('/api/projetos', { token: getToken() })
}

export async function buscarProjeto(id) {
  return apiRequest(`/api/projetos/${id}`, { token: getToken() })
}

export async function criarProjeto(dados) {
  return apiRequest('/api/projetos', { method: 'POST', body: dados, token: getToken() })
}

export async function editarProjeto(id, dados) {
  return apiRequest(`/api/projetos/${id}`, { method: 'PUT', body: dados, token: getToken() })
}

export async function deletarProjeto(id) {
  return apiRequest(`/api/projetos/${id}`, { method: 'DELETE', token: getToken() })
}

export async function adicionarIntegrante(projetoId, alunoId) {
  return apiRequest(`/api/projetos/${projetoId}/integrantes`, { method: 'POST', body: { alunoId }, token: getToken() })
}

export async function removerIntegrante(projetoId, alunoId) {
  return apiRequest(`/api/projetos/${projetoId}/integrantes/${alunoId}`, { method: 'DELETE', token: getToken() })
}

export async function criarAvaliacao(projetoId, dados) {
  return apiRequest(`/api/projetos/${projetoId}/avaliacoes`, { method: 'POST', body: dados, token: getToken() })
}

export async function editarAvaliacao(projetoId, avaliacaoId, dados) {
  return apiRequest(`/api/projetos/${projetoId}/avaliacoes/${avaliacaoId}`, { method: 'PUT', body: dados, token: getToken() })
}

export async function deletarAvaliacao(projetoId, avaliacaoId) {
  return apiRequest(`/api/projetos/${projetoId}/avaliacoes/${avaliacaoId}`, { method: 'DELETE', token: getToken() })
}

export async function listarAvaliacoesPorProjeto(projetoId) {
  const avaliacoes = await apiRequest('/api/avaliacoes', { token: getToken() })
  return avaliacoes.filter((a) => a.projeto.id === Number(projetoId))
}