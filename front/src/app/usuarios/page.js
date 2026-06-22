'use client'
import LayoutComponent from '@/components/Layout'
import { api } from '@/services/api'
import { authService } from '@/services/authService'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function UsuariosPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.get('/api/users')
      console.log('Resposta da API:', data)
      setUsers(data.data || [])
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
      const errorMsg = err.message || 'Erro ao carregar usuários'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return

    try {
      await api.delete(`/api/users/${id}`)
      setUsers(users.filter(u => u.id !== id))
      alert('Usuário deletado com sucesso!')
    } catch (err) {
      alert(err.message || 'Erro ao deletar usuário')
    }
  }

  const canEdit = authService.hasPermission(['ADMIN'])
  const canDelete = authService.hasPermission(['ADMIN'])

  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Usuários</h1>
        {canEdit && (
          <Link href="/usuarios/novo">
            <button className="btn btn-primary">+ Novo Usuário</button>
          </Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>}

      {!loading && users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-600)' }}>
          Nenhum usuário encontrado
        </div>
      )}

      {!loading && users.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    {user.profile}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEdit && (
                      <Link href={`/usuarios/${user.id}`}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                          Editar
                        </button>
                      </Link>
                    )}
                    {canDelete && (
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        onClick={() => handleDelete(user.id)}
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
