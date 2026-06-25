'use client'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'
import { api } from '@/services/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function userLabel(user) {
  return user?.username || user?.email || `Usuario ${user?.id}`
}

export default function NovoCursoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
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
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      setLoadingData(true)
      setError('')
      const data = await api.get('/api/users')
      const usuarios = data.data || []

      setCoordenadores(usuarios.filter(user => user.profile === 'COORDENADOR'))
      setProfessores(usuarios.filter(user => user.profile === 'PROFESSOR'))
    } catch (err) {
      console.error('Erro ao carregar usuarios:', err)
      setError(err.message || 'Erro ao carregar professores e coordenadores')
    } finally {
      setLoadingData(false)
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
      await api.post('/api/cursos', {
        nome: form.nome.trim(),
        cargaHoraria: form.cargaHoraria ? Number(form.cargaHoraria) : null,
        coordenadorId: Number(form.coordenadorId),
        professorIds: form.professorIds.map(Number)
      })
      alert('Curso criado com sucesso!')
      router.push('/cursos')
    } catch (err) {
      console.error('Erro ao criar curso:', err)
      setError(err.message || 'Erro ao criar curso')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <LayoutComponent>
        <div style={{ textAlign: 'center', padding: '40px' }}>Carregando dados...</div>
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
          <h1>Novo Curso</h1>

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
                {loading ? 'Salvando...' : 'Criar Curso'}
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
