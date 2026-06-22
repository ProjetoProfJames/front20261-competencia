'use client'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'
import Button from '@/components/Button'
import { api } from '@/services/api'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NovoPeriodoLetivoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nome: '',
    dataInicio: '',
    dataFim: '',
    ativo: true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.nome || !form.dataInicio || !form.dataFim) {
      setError('Nome, data de início e data de fim são obrigatórios')
      return
    }

    if (form.nome.trim().length < 3) {
      setError('Nome deve ter no mínimo 3 caracteres')
      return
    }

    if (new Date(form.dataInicio) >= new Date(form.dataFim)) {
      setError('Data de início deve ser anterior à data de fim')
      return
    }

    try {
      setLoading(true)
      await api.post('/api/periodos-letivos', {
        nome: form.nome.trim(),
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
        ativo: form.ativo
      })
      alert('Período letivo criado com sucesso!')
      router.push('/periodos-letivos')
    } catch (err) {
      const errorMsg = err.message || 'Erro ao criar período letivo'
      console.error('Erro ao criar período letivo:', err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LayoutComponent>
      <div style={{ maxWidth: '500px', margin: '32px auto' }}>
        <Link href="/periodos-letivos" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Voltar para Períodos Letivos
        </Link>

        <div className="form-container">
          <h1>Novo Período Letivo</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Nome"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: 2024/1"
            />

            <FormInput
              label="Data de Início"
              type="date"
              name="dataInicio"
              value={form.dataInicio}
              onChange={handleChange}
            />

            <FormInput
              label="Data de Fim"
              type="date"
              name="dataFim"
              value={form.dataFim}
              onChange={handleChange}
            />

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  name="ativo"
                  checked={form.ativo}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span>Ativo</span>
              </label>
            </div>

            <div className="btn-group">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Criar Período Letivo'}
              </Button>
              <Link href="/periodos-letivos">
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
