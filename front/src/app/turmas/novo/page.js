'use client'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'
import Button from '@/components/Button'
import { api } from '@/services/api'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NovaTurmaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
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
    loadSelectData()
  }, [])

  const loadSelectData = async () => {
    try {
      setLoadingData(true)
      const [cursosData, periodosData] = await Promise.all([
        api.get('/api/cursos'),
        api.get('/api/periodos-letivos')
      ])
      setCursos(cursosData.data || [])
      setPeriodos(periodosData.data || [])
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoadingData(false)
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
      await api.post('/api/turmas', {
        nome: form.nome.trim(),
        codigo: form.codigo.trim().toUpperCase(),
        cursoId: parseInt(form.cursoId),
        periodoLetivoId: parseInt(form.periodoLetivoId),
        semestre: parseInt(form.semestre)
      })
      alert('Turma criada com sucesso!')
      router.push('/turmas')
    } catch (err) {
      const errorMsg = err.message || 'Erro ao criar turma'
      console.error('Erro ao criar turma:', err)
      setError(errorMsg)
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
          ← Voltar para Turmas
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
                {loading ? 'Salvando...' : 'Criar Turma'}
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
