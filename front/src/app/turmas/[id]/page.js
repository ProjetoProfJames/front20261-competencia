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

export default function EditarTurmaPage() {
  const router = useRouter()
  const params = useParams()
  const turmaId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cursos, setCursos] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [semestres, setSemestres] = useState([])
  const [professores, setProfessores] = useState([])
  const [form, setForm] = useState({
    nome: '',
    cursoIds: [],
    disciplinaId: '',
    semestreId: '',
    professorIds: []
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [turmaData, cursosData, disciplinasData, semestresData, usuariosData] = await Promise.all([
        api.get(`/api/turmas/${turmaId}`),
        api.get('/api/cursos'),
        api.get('/api/disciplinas'),
        api.get('/api/semestres'),
        api.get('/api/users')
      ])

      const turma = turmaData.data || {}

      setCursos(cursosData.data || [])
      setDisciplinas(disciplinasData.data || [])
      setSemestres(semestresData.data || [])
      setProfessores((usuariosData.data || []).filter(user => user.profile === 'PROFESSOR'))
      setForm({
        nome: turma.nome || '',
        cursoIds: Array.isArray(turma.cursos) ? turma.cursos.map(curso => String(curso.id)) : [],
        disciplinaId: turma.disciplina?.id ? String(turma.disciplina.id) : '',
        semestreId: turma.semestre?.id ? String(turma.semestre.id) : '',
        professorIds: Array.isArray(turma.professores) ? turma.professores.map(professor => String(professor.id)) : []
      })
    } catch (err) {
      console.error('Erro ao carregar turma:', err)
      setError(err.message || 'Erro ao carregar turma')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target

    if (name === 'cursoIds' || name === 'professorIds') {
      setForm(prev => ({
        ...prev,
        [name]: Array.from(selectedOptions, option => option.value)
      }))
      return
    }

    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.nome.trim() || form.cursoIds.length === 0 || !form.disciplinaId || !form.semestreId || form.professorIds.length === 0) {
      setError('Nome, curso, disciplina, semestre e professor sao obrigatorios')
      return
    }

    if (form.nome.trim().length < 3) {
      setError('Nome deve ter no minimo 3 caracteres')
      return
    }

    try {
      setLoading(true)
      await api.put(`/api/turmas/${turmaId}`, {
        nome: form.nome.trim(),
        cursoIds: form.cursoIds.map(Number),
        disciplinaId: Number(form.disciplinaId),
        semestreId: Number(form.semestreId),
        professorIds: form.professorIds.map(Number)
      })
      alert('Turma atualizada com sucesso!')
      router.push('/turmas')
    } catch (err) {
      console.error('Erro ao atualizar turma:', err)
      setError(err.message || 'Erro ao atualizar turma')
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
        <Link href="/turmas" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          Voltar para Turmas
        </Link>

        <div className="form-container">
          <h1>Editar Turma</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Nome"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
            />

            <div className="form-group">
              <label>Cursos</label>
              <select
                name="cursoIds"
                multiple
                value={form.cursoIds}
                onChange={handleChange}
                style={{ minHeight: '100px' }}
              >
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Disciplina</label>
              <select name="disciplinaId" value={form.disciplinaId} onChange={handleChange}>
                <option value="">Selecione uma disciplina</option>
                {disciplinas.map(disciplina => (
                  <option key={disciplina.id} value={disciplina.id}>
                    {disciplina.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Semestre</label>
              <select name="semestreId" value={form.semestreId} onChange={handleChange}>
                <option value="">Selecione um semestre</option>
                {semestres.map(semestre => (
                  <option key={semestre.id} value={semestre.id}>
                    {semestre.nome}
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
                {loading ? 'Salvando...' : 'Atualizar Turma'}
              </button>
              <Link href="/turmas" style={{ flex: 1 }}>
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
