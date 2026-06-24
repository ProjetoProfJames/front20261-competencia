'use client'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'
import Button from '@/components/Button'
import { api } from '@/services/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditarUsuarioPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true)
      const data = await api.get(`/api/users/${userId}`)
      setForm({
        username: data.data.username,
        password: ''
      })
    } catch (err) {
      setError(err.message || 'Erro ao carregar usuário')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.username) {
      setError('Nome é obrigatório')
      return
    }

    if (form.username.trim().length < 3) {
      setError('Nome deve ter no mínimo 3 caracteres')
      return
    }

    if (form.password && form.password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      setLoading(true)
      const updateData = { 
        username: form.username.trim(),
      }
      if (form.password && form.password.trim()) {
        updateData.password = form.password
      }
      await api.put(`/api/users/${userId}`, updateData)
      alert('Usuário atualizado com sucesso!')
      router.push('/usuarios')
    } catch (err) {
      const errorMsg = err.message || 'Erro ao atualizar usuário'
      console.error('Erro ao atualizar usuário:', err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !form.username) {
    return (
      <LayoutComponent>
        <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
      </LayoutComponent>
    )
  }

  return (
    <LayoutComponent>
      <div style={{ maxWidth: '500px', margin: '32px auto' }}>
        <Link href="/usuarios" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Voltar para Usuários
        </Link>

        <div className="form-container">
          <h1>Editar Usuário</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Nome"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
            />

            <FormInput
              label="Nova Senha (deixe em branco para manter)"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <div className="btn-group">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Link href="/usuarios">
                <Button type="button" className="btn btn-secondary" style={{ width: '100%' }}>
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </LayoutComponent>
  )
}
