'use client'
import LayoutComponent from '@/components/Layout'
import { api } from '@/services/api'
import { authService } from '@/services/authService'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LocaisPage() {
  const [locais, setLocais] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadLocais()
  }, [])

  const loadLocais = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.get('/api/locais')
      setLocais(data.data || [])
    } catch (err) {
      setError(err.message || 'Erro ao carregar locais')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este local?')) return

    try {
      await api.delete(`/api/locais/${id}`)
      setLocais(locais.filter(l => l.id !== id))
      alert('Local deletado com sucesso!')
    } catch (err) {
      alert(err.message || 'Erro ao deletar local')
    }
  }

  const canEdit = authService.hasPermission(['ADMIN', 'COORDENADOR', 'PROFESSOR'])
  const canDelete = authService.hasPermission(['ADMIN', 'COORDENADOR', 'PROFESSOR'])

  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Locais de Apresentação</h1>
        {canEdit && (
          <Link href="/locais/novo">
            <button className="btn btn-primary">+ Novo Local</button>
          </Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>}

      {!loading && locais.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-600)' }}>
          Nenhum local encontrado
        </div>
      )}

      {!loading && locais.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Número/Identif.</th>
              <th>Criado em</th>
              <th>Criado por</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {locais.map(local => (
              <tr key={local.id}>
                <td>{local.id}</td>
                <td>{local.numero}</td>
                <td>{new Date(local.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>{local.createdBy}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEdit && (
                      <Link href={`/locais/${local.id}`}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                          Editar
                        </button>
                      </Link>
                    )}
                    {canDelete && (
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        onClick={() => handleDelete(local.id)}
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
