'use client'
import LayoutComponent from '@/components/Layout'
import { api } from '@/services/api'
import { authService } from '@/services/authService'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function TurmasPage() {
  const [turmas, setTurmas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTurmas()
  }, [])

  const loadTurmas = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.get('/api/turmas')
      console.log('Resposta da API:', data)
      setTurmas(data.data || [])
    } catch (err) {
      console.error('Erro ao carregar turmas:', err)
      const errorMsg = err.message || 'Erro ao carregar turmas'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar esta turma?')) return

    try {
      await api.delete(`/api/turmas/${id}`)
      setTurmas(turmas.filter(t => t.id !== id))
      alert('Turma deletada com sucesso!')
    } catch (err) {
      alert(err.message || 'Erro ao deletar turma')
    }
  }

  const canEdit = authService.hasPermission(['ADMIN', 'COORDENADOR', 'PROFESSOR'])
  const canDelete = authService.hasPermission(['ADMIN', 'COORDENADOR'])

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
              <th>Código</th>
              <th>Curso</th>
              <th>Período Letivo</th>
              <th>Semestre</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map(turma => (
              <tr key={turma.id}>
                <td>{turma.id}</td>
                <td>{turma.nome}</td>
                <td>{turma.codigo}</td>
                <td>{turma.cursoNome || 'N/A'}</td>
                <td>{turma.periodoLetivoNome || 'N/A'}</td>
                <td>{turma.semestre}</td>
                <td>{new Date(turma.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEdit && (
                      <Link href={`/turmas/${turma.id}`}>
                        <button style={{
                          padding: '6px 12px',
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}>
                          Editar
                        </button>
                      </Link>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(turma.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}>
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
