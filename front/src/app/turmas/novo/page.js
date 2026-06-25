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

export default function NovaTurmaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [cursos, setCursos] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [semestres, setSemestres] = useState([])
  const [professores, setProfessores] = useState([])
  const [alunos, setAlunos] = useState([])

  const [form, setForm] = useState({
    nome: '',
    cursoIds: [],
    disciplinaId: '',
    semestreId: '',
    professorIds: [],
    alunoIds: []
  })

  useEffect(() => {
    loadSelectData()
  }, [])

  const loadSelectData = async () => {
    try {
      setLoadingData(true)
      setError('')
      const [cursosData, disciplinasData, semestresData, usuariosData] = await Promise.all([
        api.get('/api/cursos'),
        api.get('/api/disciplinas'),
        api.get('/api/semestres'),
        api.get('/api/users')
      ])

      setCursos(cursosData.data || [])
      setDisciplinas(disciplinasData.data || [])
      setSemestres(semestresData.data || [])
      
      const usuarios = usuariosData.data || []
      setProfessores(usuarios.filter(user => user.profile === 'PROFESSOR'))
      setAlunos(usuarios.filter(user => user.profile === 'ALUNO'))
      
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError(err.message || 'Erro ao carregar dados do formulario')
    } finally {
      setLoadingData(false)
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

  const handleAlunoCheckbox = (alunoId, checked) => {
    setForm((prev) => ({
      ...prev,
      alunoIds: checked
        ? [...prev.alunoIds, alunoId]
        : prev.alunoIds.filter((id) => id !== alunoId),
    }))
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
      
      const response = await api.post('/api/turmas', {
        nome: form.nome.trim(),
        cursoIds: form.cursoIds.map(Number),
        disciplinaId: Number(form.disciplinaId),
        semestreId: Number(form.semestreId),
        professorIds: form.professorIds.map(Number)
      })

      const turmaCriada = response.data?.data || response.data
      const turmaCriadaId = turmaCriada?.id

      if (!turmaCriadaId) {
        throw new Error("A turma foi criada, mas não foi possível recuperar o ID para adicionar os alunos.")
      }

      if (form.alunoIds && form.alunoIds.length > 0) {
        for (const alunoId of form.alunoIds) {
          await api.post(`/api/turmas/${turmaCriadaId}/alunos`, {
            alunoId: Number(alunoId) 
          })
        }
      }

      alert('Turma criada e alunos vinculados com sucesso!')
      router.push('/turmas')
    } catch (err) {
      console.error('Erro ao criar turma ou vincular alunos:', err)
      setError(err.response?.data?.message || err.message || 'Erro ao processar a requisição')
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
        <Link href="/turmas" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          Voltar para Turmas
        </Link>

        <div className="form-container">
          <h1>Nova Turma</h1>

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

            <div className="form-group">
              <label>Alunos</label>
              {alunos.length === 0 && <p style={{ fontSize: '14px', color: '#666' }}>Nenhum aluno cadastrado.</p>}
              
              {alunos.map((a) => (
                <label
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "6px",
                    padding: "4px 0",
                    width: "100%",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ flex: 1 }}>{userLabel(a)}</span>
                  <input
                    type="checkbox"
                    checked={form.alunoIds.includes(a.id)}
                    onChange={(e) => handleAlunoCheckbox(a.id, e.target.checked)}
                    style={{
                      width: "16px",
                      height: "16px",
                      padding: "0",
                      margin: "0",
                      cursor: "pointer"
                    }}
                  />
                </label>
              ))}
            </div>

            <div className="btn-group" style={{ marginTop: '24px' }}>
              <button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Criar Turma'}
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
