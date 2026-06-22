'use client'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'
import Button from '@/components/Button'
import { api } from '@/services/api'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NovoLocalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    numero: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.numero || !form.numero.trim()) {
      setError('Número/Identificação é obrigatório')
      return
    }

    if (form.numero.trim().length < 2) {
      setError('Número/Identificação deve ter no mínimo 2 caracteres')
      return
    }

    try {
      setLoading(true)
      await api.post('/api/locais', {
        numero: form.numero.trim()
      })
      alert('Local criado com sucesso!')
      router.push('/locais')
    } catch (err) {
      const errorMsg = err.message || 'Erro ao criar local'
      console.error('Erro ao criar local:', err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LayoutComponent>
      <div style={{ maxWidth: '500px', margin: '32px auto' }}>
        <Link href="/locais" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Voltar para Locais
        </Link>

        <div className="form-container">
          <h1>Novo Local</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Número/Identificação"
              type="text"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              placeholder="Ex: Sala 101, Auditório, Pátio A"
            />

            <div className="btn-group">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Criar Local'}
              </Button>
              <Link href="/locais">
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
