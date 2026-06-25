'use client'

import LayoutComponent from '@/components/Layout'
import { api } from '@/services/api'
import { authService } from '@/services/authService'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function nameLabel(value) {
  if (!value) return '-'
  if (typeof value === 'string') return value
  return value.nome || value.username || value.email || '-'
}

function listLabel(values) {
  if (!Array.isArray(values) || values.length === 0) return '-'
  return values.map(nameLabel).join(', ')
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('pt-BR')
}

export default function TurmasPage() {
  const [turmas, setTurmas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const user = authService.getUser()

    if (!user || user.profile !== 'PROFESSOR') {
      window.location.href = '/'
      return
    }

    loadTurmas()
  }, [])

  const loadTurmas = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.get('/api/turmas')
      setTurmas(data.data || [])
    } catch (err) {
      console.error('Erro ao carregar turmas:', err)
      setError(err.message || 'Erro ao carregar turmas')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar esta turma?')) return

    try {
      await api.delete(`/api/turmas/${id}`)
      setTurmas(turmas.filter(turma => turma.id !== id))
      alert('Turma deletada com sucesso!')
    } catch (err) {
      alert(err.message || 'Erro ao deletar turma')
    }
  }

  const canEdit = authService.hasPermission(['PROFESSOR'])
  const canDelete = authService.hasPermission(['PROFESSOR'])

  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Turmas</h1>
        {canEdit && (
          <Link href="/turmas/novo">
            <button className="btn btn-primary">+ Nova Turma</button>
          </Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>}

      {!loading && turmas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-600)' }}>
          Nenhuma turma encontrada
        </div>
      )}

      {!loading && turmas.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Cursos</th>
              <th>Disciplina</th>
              <th>Semestre</th>
              <th>Professores</th>
              <th>Alunos</th>
              <th>Criado em</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map(turma => (
              <tr key={turma.id}>
                <td>{turma.id}</td>
                <td>{turma.nome}</td>
                <td>{listLabel(turma.cursos)}</td>
                <td>{nameLabel(turma.disciplina)}</td>
                <td>{nameLabel(turma.semestre)}</td>
                <td>{listLabel(turma.professores)}</td>
                <td>{listLabel(turma.alunos)}</td>
                <td>{formatDate(turma.createdAt)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEdit && (
                      <Link href={`/turmas/${turma.id}`}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                          Editar
                        </button>
                      </Link>
                    )}
                    {canDelete && (
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        onClick={() => handleDelete(turma.id)}
                      >
                        Deletar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </LayoutComponent>
  )
}
