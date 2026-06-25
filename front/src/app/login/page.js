'use client'
import { useState } from 'react'
import Button from '@/components/Button'
import FormInput from '@/components/FormInput'

export default function LoginPage() {
  const [user, setUser] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prevUser) => ({ ...prevUser, [name]: value }))
    setError('')
  }

  const authenticate = async (e) => {
    e.preventDefault()
    if (!user.email || !user.password) {
      setError('Preencha o email e a senha.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email.trim().toLowerCase(), 
          password: user.password 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Email ou senha inválidos.')
        return
      }

      localStorage.setItem('token', data.data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      window.location.href = '/'
    } catch (e) {
      console.error('Erro ao conectar:', e)
      setError('Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  const loadBootstrap = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8080/api/public/bootstrap', { method: 'POST' })
      const data = await response.json()
      alert(data.message || 'Dados carregados com sucesso!')
    } catch (e) {
      alert('Erro ao carregar dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--gray-50)' }}>
      <div className="form-container" style={{ maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>PIE Manager</h1>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={authenticate}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          <FormInput
            label="Senha"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />

          <div className="btn-group">
            <Button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>

        <hr style={{ margin: '24px 0', borderColor: 'var(--gray-200)' }} />

        <p style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
          Primeira vez aqui?
        </p>

        <Button
          type="button"
          onClick={loadBootstrap}
          disabled={loading}
          style={{ width: '100%', backgroundColor: 'var(--success)' }}
        >
          {loading ? 'Carregando...' : 'Carregar Dados de Teste'}
        </Button>

        <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--gray-600)', fontSize: '0.85rem' }}>
          Use este botão para popular o banco com dados de teste.
          <br />
          <strong>Credenciais:</strong> admin@unisales.br / admin@123
        </p>
      </div>
    </div>
  )
}
