'use client'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'
import Button from '@/components/Button'
import { api } from '@/services/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditarLocalPage() {
  const router = useRouter()
  const params = useParams()
  const localId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    numero: ''
  })

  useEffect(() => {
    loadLocal()
  }, [])

  const loadLocal = async () => {
    try {
      setLoading(true)
      const data = await api.get(`/api/locais/${localId}`)
      setForm({
        numero: data.data.numero
      })
    } catch (err) {
      setError(err.message || 'Erro ao carregar local')
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
      await api.put(`/api/locais/${localId}`, {
        numero: form.numero.trim()
      })
      alert('Local atualizado com sucesso!')
      router.push('/locais')
    } catch (err) {
      const errorMsg = err.message || 'Erro ao atualizar local'
      console.error('Erro ao atualizar local:', err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !form.numero) {
    return (
      <LayoutComponent>
        <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
      </LayoutComponent>
    )
  }

  return (
    <LayoutComponent>
      <div style={{ maxWidth: '500px', margin: '32px auto' }}>
        <Link href="/locais" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Voltar para Locais
        </Link>

        <div className="form-container">
          <h1>Editar Local</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Número/Identificação"
              type="text"
              name="numero"
              value={form.numero}
              onChange={handleChange}
            />

            <div className="btn-group">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
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
