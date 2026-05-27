"use client"

import { useEffect, useState } from "react"
import "../styles/grupos.css"

export default function GruposPage() {

  const [turmas, setTurmas] = useState([])
  const [professores, setProfessores] = useState([])
  const [alunos, setAlunos] = useState([])
  const [grupos, setGrupos] = useState([])

  const [filtro, setFiltro] = useState("")

  const horarios = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00"
  ]

  const [form, setForm] = useState({
    turmaId: "",
    professorId: "",
    alunosIds: [],
    local: "",
    horarioInicio: "",
    horarioFim: ""
  })

  useEffect(() => {

    fetch("/api/turmas")
      .then(res => res.json())
      .then(data => setTurmas(data))

    fetch("/api/professores")
      .then(res => res.json())
      .then(data => setProfessores(data))

    fetch("/api/alunos")
      .then(res => res.json())
      .then(data => setAlunos(data))

    fetch("/api/grupos")
      .then(res => res.json())
      .then(data => setGrupos(data))

  }, [])

  function handleChange(e) {

    const { name, value } = e.target

    if (name === "horarioInicio") {

      const hora = parseInt(value.split(":")[0])

      const fim = `${hora + 1}:00`

      setForm({
        ...form,
        horarioInicio: value,
        horarioFim: fim
      })

      return
    }

    setForm({
      ...form,
      [name]: value
    })

  }

  function handleAlunos(e) {

    const valores = Array
      .from(e.target.selectedOptions)
      .map(option => Number(option.value))

    setForm({
      ...form,
      alunosIds: valores
    })

  }

  async function salvar() {

    if (form.alunosIds.length < 3) {
      alert("O grupo precisa ter no mínimo 3 alunos")
      return
    }

    if (form.alunosIds.length > 7) {
      alert("O grupo precisa ter no máximo 7 alunos")
      return
    }

    const conflito = grupos.find(g =>

      g.local === form.local &&
      g.horarioInicio === form.horarioInicio

    )

    if (conflito) {
      alert("Já existe apresentação neste local e horário")
      return
    }

    await fetch("/api/grupos", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(form)

    })

    alert("Grupo salvo")

  }

  const gruposFiltrados = grupos.filter(g =>

    g.professor?.nome?.toLowerCase().includes(
      filtro.toLowerCase()
    ) ||

    g.alunos?.some(
      a => a.nome.toLowerCase().includes(
        filtro.toLowerCase()
      )
    )

  )

  return (

    <div className="container">

      <h1 className="title">
        GRUPOS DE PROJETOS
      </h1>

      <div className="content">

        <div className="formContainer">

          <select
            className="select"
            name="turmaId"
            value={form.turmaId}
            onChange={handleChange}
          >

            <option value="">
              Selecione a turma
            </option>

            {turmas.map(t => (

              <option
                key={t.id}
                value={t.id}
              >

                {t.curso} - {t.periodo}

              </option>

            ))}

          </select>

          <select
            className="select"
            name="professorId"
            value={form.professorId}
            onChange={handleChange}
          >

            <option value="">
              Professor orientador
            </option>

            {professores.map(p => (

              <option
                key={p.id}
                value={p.id}
              >

                {p.nome}

              </option>

            ))}

          </select>

          <select
            multiple
            className="select"
            onChange={handleAlunos}
          >

            {alunos.map(a => (

              <option
                key={a.id}
                value={a.id}
              >

                {a.nome}

              </option>

            ))}

          </select>

          <input
            className="input"
            name="local"
            placeholder="Local da apresentação"
            value={form.local}
            onChange={handleChange}
          />

          <div className="field">

            <label className="label">
              Horário de início
            </label>

            <select
              className="select"
              name="horarioInicio"
              value={form.horarioInicio}
              onChange={handleChange}
            >

              <option value="">
                Selecione
              </option>

              {horarios.map(h => (

                <option
                  key={h}
                  value={h}
                >

                  {h}

                </option>

              ))}

            </select>

          </div>

          <div className="field">

            <label className="label">
              Horário de término
            </label>

            <input
              className="input"
              value={form.horarioFim}
              readOnly
            />

          </div>

          <button
            className="button"
            onClick={salvar}
          >
            Salvar Grupo
          </button>

        </div>

        <div className="tableContainer">

          <input
            className="input"
            placeholder="Pesquisar"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          <table className="table">

            <thead>

              <tr>
                <th>Professor</th>
                <th>Alunos</th>
                <th>Local</th>
                <th>Horário</th>
              </tr>

            </thead>

            <tbody>

              {gruposFiltrados.map(g => (

                <tr key={g.id}>

                  <td>{g.professor?.nome}</td>

                  <td>
                    {g.alunos?.map(
                      a => a.nome
                    ).join(", ")}
                  </td>

                  <td>{g.local}</td>

                  <td>
                    {g.horarioInicio}
                    {" - "}
                    {g.horarioFim}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}