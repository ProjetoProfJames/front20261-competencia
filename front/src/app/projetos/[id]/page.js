'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { buscarProjeto, editarProjeto } from '@/services/projetoService'
import Button from '@/components/Button'
import FormInput from '@/components/FormInput'

export default function EditarProjetoPage() {
  const router = useRouter()
  const { id } = useParams()
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  const [turmas, setTurmas] = useState([])
  const [semestres, setSemestres] = useState([])
  const [professores, setProfessores] = useState([])
  const [alunos, setAlunos] = useState([])
  const [locais, setLocais] = useState([])

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    turmaId: '',
    semestreId: '',
    professorOrientadorId: '',
    integranteIds: [],
    localId: '',
    horarioInicio: '',
    horarioFim: '',
  })

  useEffect(() => {
    setTurmas([{ id: 1, nome: 'T1-Estatistica' }])
    setSemestres([{ id: 1, nome: '2026/1' }])
    setProfessores([
      { id: 3, username: 'prof.computacao' },
      { id: 4, username: 'prof.engenharia' },
    ])
    setAlunos([
      { id: 5, username: 'aluno.um' },
      { id: 6, username: 'aluno.dois' },
      { id: 7, username: 'aluno.tres' },
    ])
    setLocais([
      { id: 1, numero: 'A01' },
      { id: 2, numero: 'A02' },
    ])
    carregarProjeto()
  }, [])

  async function carregarProjeto() {
    try {
      setCarregando(true)
      const projeto = await buscarProjeto(id)
      setForm({
        nome: projeto.nome ?? '',
        descricao: projeto.descricao ?? '',
        turmaId: projeto.turma?.id ?? '',
        semestreId: projeto.semestre?.id ?? '',
        professorOrientadorId: projeto.professorOrientador?.id ?? '',
        integranteIds: projeto.integrantes?.map((i) => i.id) ?? [],
        localId: projeto.local?.id ?? '',
        horarioInicio: projeto.horarioInicio ? toDatetimeLocal(projeto.horarioInicio) : '',
        horarioFim: projeto.horarioFim ? toDatetimeLocal(projeto.horarioFim) : '',
      })
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  function toDatetimeLocal(isoString) {
    const date = new Date(isoString)
    const offset = date.getTimezoneOffset()
    const local = new Date(date.getTime() - offset * 60000)
    return local.toISOString().slice(0, 16)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleIntegrantesChange(e) {
    const selecionados = Array.from(e.target.selectedOptions).map((o) => Number(o.value))
    setForm((prev) => ({ ...prev, integranteIds: selecionados }))
  }

  async function handleSubmit() {
    if (!form.nome || !form.turmaId || !form.semestreId || !form.professorOrientadorId || !form.localId || !form.horarioInicio || !form.horarioFim) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    if (form.integranteIds.length < 2 || form.integranteIds.length > 6) {
      setErro('O grupo deve ter entre 2 e 6 integrantes.')
      return
    }

    try {
      setSalvando(true)
      setErro(null)

      await editarProjeto(id, {
        ...form,
        turmaId: Number(form.turmaId),
        semestreId: Number(form.semestreId),
        professorOrientadorId: Number(form.professorOrientadorId),
        localId: Number(form.localId),
        horarioInicio: new Date(form.horarioInicio).toISOString(),
        horarioFim: new Date(form.horarioFim).toISOString(),
      })

      router.push('/projetos')
    } catch (e) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) return <p>Carregando...</p>
  if (erro) return <p>Erro: {erro}</p>

  return (
    <main>
      <h1>Editar Projeto</h1>
      {erro && <p className="mensagem-erro">{erro}</p>}

      <div className="formulario">
        <FormInput label="Nome" type="text" name="nome" value={form.nome} onChange={handleChange} />
        <FormInput label="Descrição" type="text" name="descricao" value={form.descricao} onChange={handleChange} />

        <div>
          <label>Turma</label>
          <select name="turmaId" value={form.turmaId} onChange={handleChange}>
            <option value="">Selecione</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Semestre</label>
          <select name="semestreId" value={form.semestreId} onChange={handleChange}>
            <option value="">Selecione</option>
            {semestres.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Professor Orientador</label>
          <select name="professorOrientadorId" value={form.professorOrientadorId} onChange={handleChange}>
            <option value="">Selecione</option>
            {professores.map((p) => (
              <option key={p.id} value={p.id}>{p.username}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Integrantes (selecione entre 2 e 6)</label>
          <select multiple name="integranteIds" value={form.integranteIds} onChange={handleIntegrantesChange}>
            {alunos.map((a) => (
              <option key={a.id} value={a.id}>{a.username}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Local</label>
          <select name="localId" value={form.localId} onChange={handleChange}>
            <option value="">Selecione</option>
            {locais.map((l) => (
              <option key={l.id} value={l.id}>{l.numero}</option>
            ))}
          </select>
        </div>

        <FormInput label="Horário de Início" type="datetime-local" name="horarioInicio" value={form.horarioInicio} onChange={handleChange} />
        <FormInput label="Horário de Fim" type="datetime-local" name="horarioFim" value={form.horarioFim} onChange={handleChange} />

        <div className="formulario-rodape">
          <button className="botao-secundario" onClick={() => router.push('/projetos')}>Cancelar</button>
          <button onClick={handleSubmit} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </main>
  )
}