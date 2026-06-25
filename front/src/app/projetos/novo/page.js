'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { criarProjeto } from '@/services/projetoService'
import { listarTurmas } from '@/services/turmaService'
import { api } from '@/services/api'
import LayoutComponent from '@/components/Layout'
import FormInput from '@/components/FormInput'

export default function NovoProjetoPage() {
  const router = useRouter()
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [carregandoDependencias, setCarregandoDependencias] = useState(true)

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
    carregarDependencias()
  }, [])

  async function carregarDependencias() {
    try {
      setCarregandoDependencias(true)

      const usersResponse = await api.get('/api/users')
      const usuarios = usersResponse.data || usersResponse || []
      setProfessores(usuarios.filter((u) => u.profile === 'PROFESSOR'))
      setAlunos(usuarios.filter((u) => u.profile === 'ALUNO'))

      const locaisResponse = await api.get('/api/locais')
      setLocais(locaisResponse.data || locaisResponse || [])

      const turmasData = await listarTurmas()
      setTurmas(turmasData || [])

      const periodosResponse = await api.get('/api/semestres')
      setSemestres(periodosResponse.data || periodosResponse || [])
      
    } catch (e) {
      setErro(e.message || 'Erro ao carregar dados de apoio')
    } finally {
      setCarregandoDependencias(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleIntegranteCheckbox(alunoId, checked) {
    setForm((prev) => ({
      ...prev,
      integranteIds: checked
        ? [...prev.integranteIds, alunoId]
        : prev.integranteIds.filter((id) => id !== alunoId),
    }))
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
      setCarregando(true)
      setErro(null)

      await criarProjeto({
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
      setCarregando(false)
    }
  }

  if (carregandoDependencias) return <LayoutComponent><p>Carregando...</p></LayoutComponent>

  return (
    <LayoutComponent>
      <h1>Novo Projeto</h1>
      {erro && <p className="mensagem-erro">{erro}</p>}

      <div className="formulario">
        <FormInput
          label="Nome"
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
        />
        <FormInput
          label="Descrição"
          type="text"
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
        />

        <div>
          <label>Turma</label>
          <select name="turmaId" value={form.turmaId} onChange={handleChange}>
            <option value="">Selecione</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Semestre</label>
          <select
            name="semestreId"
            value={form.semestreId}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            {semestres.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome} 
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Professor Orientador</label>
          <select
            name="professorOrientadorId"
            value={form.professorOrientadorId}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            {professores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Integrantes (selecione entre 2 e 6)</label>
          {alunos.length === 0 && <p>Nenhum aluno cadastrado.</p>}
          {alunos.map((a) => (
            <label
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
                padding: "4px 0",
                width: "100%",
              }}
            >
              <span style={{ flex: 1 }}>{a.username}</span>
              <input
                type="checkbox"
                checked={form.integranteIds.includes(a.id)}
                onChange={(e) =>
                  handleIntegranteCheckbox(a.id, e.target.checked)
                }
                style={{
                  width: "16px",
                  height: "16px",
                  padding: "0",
                  margin: "0",
                  border: "none",
                }}
              />
            </label>
          ))}
        </div>

        <div>
          <label>Local</label>
          <select name="localId" value={form.localId} onChange={handleChange}>
            <option value="">Selecione</option>
            {locais.map((l) => (
              <option key={l.id} value={l.id}>
                {l.numero}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          label="Horário de Início"
          type="datetime-local"
          name="horarioInicio"
          value={form.horarioInicio}
          onChange={handleChange}
        />
        <FormInput
          label="Horário de Fim"
          type="datetime-local"
          name="horarioFim"
          value={form.horarioFim}
          onChange={handleChange}
        />

        <div className="formulario-rodape">
          <button
            className="botao-secundario"
            onClick={() => router.push("/projetos")}
          >
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={carregando}>
            {carregando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </LayoutComponent>
  );
}