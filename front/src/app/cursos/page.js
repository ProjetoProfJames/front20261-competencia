'use client'
import LayoutComponent from '@/components/Layout'
import { api } from '@/services/api'
import { authService } from '@/services/authService'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
      console.log('Resposta da API:', data)
      setCursos(data.data || [])
    } catch (err) {
      console.error('Erro ao carregar cursos:', err)
      const errorMsg = err.message || 'Erro ao carregar cursos'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este curso?')) return

    try {
      await api.delete(`/api/cursos/${id}`)
      setCursos(cursos.filter(c => c.id !== id))
      alert('Curso deletado com sucesso!')
    } catch (err) {
      alert(err.message || 'Erro ao deletar curso')
    }
  }

  const canEdit = authService.hasPermission(['ADMIN', 'COORDENADOR'])
  const canDelete = authService.hasPermission(['ADMIN', 'COORDENADOR'])

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
              <th>Código</th>
              <th>Carga Horária</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map(curso => (
              <tr key={curso.id}>
                <td>{curso.id}</td>
                <td>{curso.nome}</td>
                <td>{curso.codigo}</td>
                <td>{curso.cargaHoraria || 'N/A'}</td>
                <td>{new Date(curso.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEdit && (
                      <Link href={`/cursos/${curso.id}`}>
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
                        onClick={() => handleDelete(curso.id)}
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
