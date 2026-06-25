'use client'
import LayoutComponent from '@/components/Layout'
import { api } from '@/services/api'
import { authService } from '@/services/authService'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const STATUS_STORAGE_KEY = 'periodosLetivosStatus'

function readStoredStatuses() {
  if (typeof window === 'undefined') return {}

  try {
    return JSON.parse(localStorage.getItem(STATUS_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveStoredStatuses(statuses) {
  localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(statuses))
}

function formatDate(value) {
  if (!value) return '-'
  const date = String(value).includes('T') ? new Date(value) : new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('pt-BR')
}

export default function PeriodosLetivosPage() {
  const [periodos, setPeriodos] = useState([])
  const [periodoStatuses, setPeriodoStatuses] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setPeriodoStatuses(readStoredStatuses())
    loadPeriodos()
  }, [])

  const loadPeriodos = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.get('/api/semestres')
      setPeriodos(data.data || [])
    } catch (err) {
      console.error('Erro ao carregar periodos letivos:', err)
      setError(err.message || 'Erro ao carregar periodos letivos')
    } finally {
      setLoading(false)
    }
  }

  const isPeriodoAtivo = (id) => Boolean(periodoStatuses[String(id)])

  const toggleStatus = (id) => {
    setPeriodoStatuses(prev => {
      const next = {
        ...prev,
        [String(id)]: !Boolean(prev[String(id)])
      }
      saveStoredStatuses(next)
      return next
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este periodo letivo?')) return

    try {
      await api.delete(`/api/semestres/${id}`)
      setPeriodos(periodos.filter(periodo => periodo.id !== id))
      setPeriodoStatuses(prev => {
        const next = { ...prev }
        delete next[String(id)]
        saveStoredStatuses(next)
        return next
      })
      alert('Periodo letivo deletado com sucesso!')
    } catch (err) {
      alert(err.message || 'Erro ao deletar periodo letivo')
    }
  }

  const canEdit = authService.hasPermission(['ADMIN'])
  const canDelete = authService.hasPermission(['ADMIN'])
  const canToggleStatus = authService.hasPermission(['ADMIN', 'COORDENADOR'])

  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Periodos Letivos</h1>
        {canEdit && (
          <Link href="/periodos/novo">
            <button className="btn btn-primary">+ Novo Periodo Letivo</button>
          </Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>}

      {!loading && periodos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-600)' }}>
          Nenhum periodo letivo encontrado
        </div>
      )}

      {!loading && periodos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Data Inicio</th>
              <th>Data Fim</th>
              <th>Status</th>
              <th>Criado em</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {periodos.map(periodo => {
              const ativo = isPeriodoAtivo(periodo.id)

              return (
                <tr key={periodo.id}>
                  <td>{periodo.id}</td>
                  <td>{periodo.nome}</td>
                  <td>{formatDate(periodo.dataInicio)}</td>
                  <td>{formatDate(periodo.dataFim)}</td>
                  <td>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '4px',
                      backgroundColor: ativo ? 'var(--success)' : '#9ca3af',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}>
                      {ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>{formatDate(periodo.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {canToggleStatus && (
                        <button
                          className={ativo ? 'btn btn-secondary' : 'btn btn-success'}
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          onClick={() => toggleStatus(periodo.id)}
                        >
                          {ativo ? 'Desativar' : 'Ativar'}
                        </button>
                      )}
                      {canEdit && (
                        <Link href={`/periodos/${periodo.id}`}>
                          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                            Editar
                          </button>
                        </Link>
                      )}
                      {canDelete && (
                        <button
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          onClick={() => handleDelete(periodo.id)}
                        >
                          Deletar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </LayoutComponent>
  )
}
