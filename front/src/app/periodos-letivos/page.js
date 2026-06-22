'use client'
import LayoutComponent from '@/components/Layout'
import { api } from '@/services/api'
import { authService } from '@/services/authService'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PeriodosLetivosPage() {
  const [periodos, setPeriodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPeriodos()
  }, [])

  const loadPeriodos = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.get('/api/periodos-letivos')
      console.log('Resposta da API:', data)
      setPeriodos(data.data || [])
    } catch (err) {
      console.error('Erro ao carregar períodos letivos:', err)
      const errorMsg = err.message || 'Erro ao carregar períodos letivos'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este período letivo?')) return

    try {
      await api.delete(`/api/periodos-letivos/${id}`)
      setPeriodos(periodos.filter(p => p.id !== id))
      alert('Período letivo deletado com sucesso!')
    } catch (err) {
      alert(err.message || 'Erro ao deletar período letivo')
    }
  }

  const canEdit = authService.hasPermission(['ADMIN', 'COORDENADOR'])
  const canDelete = authService.hasPermission(['ADMIN', 'COORDENADOR'])

  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Períodos Letivos</h1>
        {canEdit && (
          <Link href="/periodos-letivos/novo">
            <button className="btn btn-primary">+ Novo Período Letivo</button>
          </Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>}

      {!loading && periodos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-600)' }}>
          Nenhum período letivo encontrado
        </div>
      )}

      {!loading && periodos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Data Início</th>
              <th>Data Fim</th>
              <th>Status</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {periodos.map(periodo => (
              <tr key={periodo.id}>
                <td>{periodo.id}</td>
                <td>{periodo.nome}</td>
                <td>{new Date(periodo.dataInicio).toLocaleDateString('pt-BR')}</td>
                <td>{new Date(periodo.dataFim).toLocaleDateString('pt-BR')}</td>
                <td>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    backgroundColor: periodo.ativo ? 'var(--primary)' : '#9ca3af',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    {periodo.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>{new Date(periodo.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEdit && (
                      <Link href={`/periodos-letivos/${periodo.id}`}>
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
                        onClick={() => handleDelete(periodo.id)}
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
