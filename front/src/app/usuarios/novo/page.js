'use client'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'
import Button from '@/components/Button'
import { api } from '@/services/api'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NovoUsuarioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    profile: 'ALUNO'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.username || !form.email || !form.password || !form.profile) {
      setError('Todos os campos são obrigatórios')
      return
    }

    if (form.username.trim().length < 3) {
      setError('Nome deve ter no mínimo 3 caracteres')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Email inválido')
      return
    }

    if (form.password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/api/users', {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        profile: form.profile
      })
      alert('Usuário criado com sucesso!')
      router.push('/usuarios')
    } catch (err) {
      const errorMsg = err.message || 'Erro ao criar usuário'
      console.error('Erro ao criar usuário:', err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LayoutComponent>
      <div style={{ maxWidth: '500px', margin: '32px auto' }}>
        <Link href="/usuarios" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Voltar para Usuários
        </Link>

        <div className="form-container">
          <h1>Novo Usuário</h1>

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
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <FormInput
              label="Senha"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <div className="form-group">
              <label>Perfil</label>
              <select name="profile" value={form.profile} onChange={handleChange}>
                <option value="ADMIN">Admin</option>
                <option value="COORDENADOR">Coordenador</option>
                <option value="PROFESSOR">Professor</option>
                <option value="ALUNO">Aluno</option>
                <option value="AVALIADOR_EXTERNO">Avaliador Externo</option>
              </select>
            </div>

            <div className="btn-group">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Criar Usuário'}
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
