'use client'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'
import Button from '@/components/Button'
import { api } from '@/services/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditarTurmaPage() {
  const router = useRouter()
  const params = useParams()
  const turmaId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cursos, setCursos] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [form, setForm] = useState({
    nome: '',
    codigo: '',
    cursoId: '',
    periodoLetivoId: '',
    semestre: '1'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [turmaData, cursosData, periodosData] = await Promise.all([
        api.get(`/api/turmas/${turmaId}`),
        api.get('/api/cursos'),
        api.get('/api/periodos-letivos')
      ])
      
      setCursos(cursosData.data || [])
      setPeriodos(periodosData.data || [])
      
      setForm({
        nome: turmaData.data.nome,
        codigo: turmaData.data.codigo,
        cursoId: turmaData.data.cursoId.toString(),
        periodoLetivoId: turmaData.data.periodoLetivoId.toString(),
        semestre: turmaData.data.semestre.toString()
      })
    } catch (err) {
      setError(err.message || 'Erro ao carregar turma')
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

    if (!form.nome || !form.codigo || !form.cursoId || !form.periodoLetivoId) {
      setError('Nome, código, curso e período letivo são obrigatórios')
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
      await api.put(`/api/turmas/${turmaId}`, {
        nome: form.nome.trim(),
        codigo: form.codigo.trim().toUpperCase(),
        cursoId: parseInt(form.cursoId),
        periodoLetivoId: parseInt(form.periodoLetivoId),
        semestre: parseInt(form.semestre)
      })
      alert('Turma atualizada com sucesso!')
      router.push('/turmas')
    } catch (err) {
      const errorMsg = err.message || 'Erro ao atualizar turma'
      console.error('Erro ao atualizar turma:', err)
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
        <Link href="/turmas" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Voltar para Turmas
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
              placeholder="Ex: Turma A"
            />

            <FormInput
              label="Código"
              type="text"
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              placeholder="Ex: TUR001"
            />

            <div className="form-group">
              <label>Curso</label>
              <select name="cursoId" value={form.cursoId} onChange={handleChange}>
                <option value="">Selecione um curso</option>
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Período Letivo</label>
              <select name="periodoLetivoId" value={form.periodoLetivoId} onChange={handleChange}>
                <option value="">Selecione um período letivo</option>
                {periodos.map(periodo => (
                  <option key={periodo.id} value={periodo.id}>
                    {periodo.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Semestre</label>
              <select name="semestre" value={form.semestre} onChange={handleChange}>
                <option value="1">1º Semestre</option>
                <option value="2">2º Semestre</option>
                <option value="3">3º Semestre</option>
                <option value="4">4º Semestre</option>
                <option value="5">5º Semestre</option>
                <option value="6">6º Semestre</option>
                <option value="7">7º Semestre</option>
                <option value="8">8º Semestre</option>
              </select>
            </div>

            <div className="btn-group">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Atualizar Turma'}
              </Button>
              <Link href="/turmas">
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
