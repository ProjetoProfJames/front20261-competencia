'use client'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'
import { api } from '@/services/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

function userLabel(user) {
  return user?.username || user?.email || `Usuario ${user?.id}`
}

export default function EditarCursoPage() {
  const router = useRouter()
  const params = useParams()
  const cursoId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [coordenadores, setCoordenadores] = useState([])
  const [professores, setProfessores] = useState([])
  const [form, setForm] = useState({
    nome: '',
    cargaHoraria: '',
    coordenadorId: '',
    professorIds: []
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [cursoData, usuariosData] = await Promise.all([
        api.get(`/api/cursos/${cursoId}`),
        api.get('/api/users')
      ])

      const curso = cursoData.data || {}
      const usuarios = usuariosData.data || []

      setCoordenadores(usuarios.filter(user => user.profile === 'COORDENADOR'))
      setProfessores(usuarios.filter(user => user.profile === 'PROFESSOR'))
      setForm({
        nome: curso.nome || '',
        cargaHoraria: curso.cargaHoraria || '',
        coordenadorId: curso.coordenador?.id ? String(curso.coordenador.id) : '',
        professorIds: Array.isArray(curso.professores) ? curso.professores.map(professor => String(professor.id)) : []
      })
    } catch (err) {
      console.error('Erro ao carregar curso:', err)
      setError(err.message || 'Erro ao carregar curso')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target

    if (name === 'professorIds') {
      setForm(prev => ({
        ...prev,
        professorIds: Array.from(selectedOptions, option => option.value)
      }))
      return
    }

    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.nome.trim() || !form.coordenadorId || form.professorIds.length === 0) {
      setError('Nome, coordenador e ao menos um professor sao obrigatorios')
      return
    }

    if (form.nome.trim().length < 3) {
      setError('Nome deve ter no minimo 3 caracteres')
      return
    }

    if (form.cargaHoraria && Number(form.cargaHoraria) <= 0) {
      setError('Carga horaria deve ser maior que zero')
      return
    }

    try {
      setLoading(true)
      await api.put(`/api/cursos/${cursoId}`, {
        nome: form.nome.trim(),
        cargaHoraria: form.cargaHoraria ? Number(form.cargaHoraria) : null,
        coordenadorId: Number(form.coordenadorId),
        professorIds: form.professorIds.map(Number)
      })
      alert('Curso atualizado com sucesso!')
      router.push('/cursos')
    } catch (err) {
      console.error('Erro ao atualizar curso:', err)
      setError(err.message || 'Erro ao atualizar curso')
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
          Voltar para Cursos
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
            />

            <FormInput
              label="Carga Horaria"
              type="number"
              name="cargaHoraria"
              value={form.cargaHoraria}
              onChange={handleChange}
            />

            <div className="form-group">
              <label>Coordenador</label>
              <select name="coordenadorId" value={form.coordenadorId} onChange={handleChange}>
                <option value="">Selecione um coordenador</option>
                {coordenadores.map(coordenador => (
                  <option key={coordenador.id} value={coordenador.id}>
                    {userLabel(coordenador)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Professores</label>
              <select
                name="professorIds"
                multiple
                value={form.professorIds}
                onChange={handleChange}
                style={{ minHeight: '120px' }}
              >
                {professores.map(professor => (
                  <option key={professor.id} value={professor.id}>
                    {userLabel(professor)}
                  </option>
                ))}
              </select>
            </div>

            <div className="btn-group">
              <button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Atualizar Curso'}
              </button>
              <Link href="/cursos" style={{ flex: 1 }}>
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
