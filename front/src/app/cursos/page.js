'use client'
import LayoutComponent from '@/components/Layout'
import { api } from '@/services/api'
import { authService } from '@/services/authService'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function userLabel(user) {
  if (!user) return '-'
  return user.username || user.email || '-'
}

function userListLabel(users) {
  if (!Array.isArray(users) || users.length === 0) return '-'
  return users.map(userLabel).join(', ')
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('pt-BR')
}

export default function CursosPage() {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCursos()
  }, [])

  const loadCursos = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.get('/api/cursos')
      setCursos(data.data || [])
    } catch (err) {
      console.error('Erro ao carregar cursos:', err)
      setError(err.message || 'Erro ao carregar cursos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este curso?')) return

    try {
      await api.delete(`/api/cursos/${id}`)
      setCursos(cursos.filter(curso => curso.id !== id))
      alert('Curso deletado com sucesso!')
    } catch (err) {
      alert(err.message || 'Erro ao deletar curso')
    }
  }

  const canEdit = authService.hasPermission(['ADMIN'])
  const canDelete = authService.hasPermission(['ADMIN'])

  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Cursos</h1>
        {canEdit && (
          <Link href="/cursos/novo">
            <button className="btn btn-primary">+ Novo Curso</button>
          </Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>}

      {!loading && cursos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-600)' }}>
          Nenhum curso encontrado
        </div>
      )}

      {!loading && cursos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Coordenador</th>
              <th>Professores</th>
              <th>Criado em</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map(curso => (
              <tr key={curso.id}>
                <td>{curso.id}</td>
                <td>{curso.nome}</td>
                <td>{userLabel(curso.coordenador)}</td>
                <td>{userListLabel(curso.professores)}</td>
                <td>{formatDate(curso.createdAt)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEdit && (
                      <Link href={`/cursos/${curso.id}`}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                          Editar
                        </button>
                      </Link>
                    )}
                    {canDelete && (
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        onClick={() => handleDelete(curso.id)}
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