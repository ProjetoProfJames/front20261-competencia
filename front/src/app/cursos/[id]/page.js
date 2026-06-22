'use client'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'
import Button from '@/components/Button'
import { api } from '@/services/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditarCursoPage() {
  const router = useRouter()
  const params = useParams()
  const cursoId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nome: '',
    codigo: '',
    cargaHoraria: ''
  })

  useEffect(() => {
    loadCurso()
  }, [])

  const loadCurso = async () => {
    try {
      setLoading(true)
      const data = await api.get(`/api/cursos/${cursoId}`)
      setForm({
        nome: data.data.nome,
        codigo: data.data.codigo,
        cargaHoraria: data.data.cargaHoraria || ''
      })
    } catch (err) {
      setError(err.message || 'Erro ao carregar curso')
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

    if (!form.nome || !form.codigo) {
      setError('Nome e código são obrigatórios')
      return
    }

    if (form.nome.trim().length < 3) {
      setError('Nome deve ter no mínimo 3 caracteres')
      return
    }

    if (form.codigo.trim().length < 1) {
      setError('Código é obrigatório')
      return
    }

    try {
      setLoading(true)
      await api.put(`/api/cursos/${cursoId}`, {
        nome: form.nome.trim(),
        codigo: form.codigo.trim().toUpperCase(),
        cargaHoraria: form.cargaHoraria ? parseInt(form.cargaHoraria) : null
      })
      alert('Curso atualizado com sucesso!')
      router.push('/cursos')
    } catch (err) {
      const errorMsg = err.message || 'Erro ao atualizar curso'
      console.error('Erro ao atualizar curso:', err)
      setError(errorMsg)
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
        <Link href="/cursos" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Voltar para Cursos
        </Link>

        <div className="form-container">
          <h1>Editar Curso</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Nome"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Engenharia de Software"
            />

            <FormInput
              label="Código"
              type="text"
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              placeholder="Ex: ES"
            />

            <FormInput
              label="Carga Horária (horas)"
              type="number"
              name="cargaHoraria"
              value={form.cargaHoraria}
              onChange={handleChange}
              placeholder="Ex: 120"
            />

            <div className="btn-group">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Atualizar Curso'}
              </Button>
              <Link href="/cursos">
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
