'use client'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'
import { api } from '@/services/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const STATUS_STORAGE_KEY = 'periodosLetivosStatus'

function readPeriodoStatus(id) {
  if (typeof window === 'undefined' || !id) return false

  try {
    const statuses = JSON.parse(localStorage.getItem(STATUS_STORAGE_KEY) || '{}')
    return Boolean(statuses[String(id)])
  } catch {
    return false
  }
}

function savePeriodoStatus(id, ativo) {
  if (typeof window === 'undefined' || !id) return

  try {
    const statuses = JSON.parse(localStorage.getItem(STATUS_STORAGE_KEY) || '{}')
    statuses[String(id)] = ativo
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(statuses))
  } catch {
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify({ [String(id)]: ativo }))
  }
}

function toDateInput(value) {
  if (!value) return ''
  return String(value).split('T')[0]
}

export default function EditarPeriodoLetivoPage() {
  const router = useRouter()
  const params = useParams()
  const periodoId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nome: '',
    dataInicio: '',
    dataFim: '',
    ativo: false
  })

  useEffect(() => {
    loadPeriodo()
  }, [])

  const loadPeriodo = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.get(`/api/semestres/${periodoId}`)
      const periodo = data.data || {}

      setForm({
        nome: periodo.nome || '',
        dataInicio: toDateInput(periodo.dataInicio),
        dataFim: toDateInput(periodo.dataFim),
        ativo: readPeriodoStatus(periodoId)
      })
    } catch (err) {
      console.error('Erro ao carregar periodo letivo:', err)
      setError(err.message || 'Erro ao carregar periodo letivo')
    } finally {
      setLoading(false)
    }
  }

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

    if (!form.nome.trim() || !form.dataInicio || !form.dataFim) {
      setError('Nome, data de inicio e data de fim sao obrigatorios')
      return
    }

    if (form.nome.trim().length < 3) {
      setError('Nome deve ter no minimo 3 caracteres')
      return
    }

    if (new Date(form.dataInicio) >= new Date(form.dataFim)) {
      setError('Data de inicio deve ser anterior a data de fim')
      return
    }

    try {
      setLoading(true)
      await api.put(`/api/semestres/${periodoId}`, {
        nome: form.nome.trim(),
        dataInicio: form.dataInicio,
        dataFim: form.dataFim
      })

      savePeriodoStatus(periodoId, form.ativo)
      alert('Periodo letivo atualizado com sucesso!')
      router.push('/periodos')
    } catch (err) {
      console.error('Erro ao atualizar periodo letivo:', err)
      setError(err.message || 'Erro ao atualizar periodo letivo')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !form.nome) {
    return (
      <LayoutComponent>
        <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
      </LayoutComponent>
    )
  }

  return (
    <LayoutComponent>
      <div style={{ maxWidth: '500px', margin: '32px auto' }}>
        <Link href="/periodos" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          Voltar para Periodos Letivos
        </Link>

        <div className="form-container">
          <h1>Editar Periodo Letivo</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Nome"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
            />

            <FormInput
              label="Data de Inicio"
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
              <button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Atualizar Periodo Letivo'}
              </button>
              <Link href="/periodos" style={{ flex: 1 }}>
                <button type="button" className="btn btn-secondary" style={{ width: '100%' }}>
                  Cancelar
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </LayoutComponent>
  )
}
