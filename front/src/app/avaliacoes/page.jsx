"use client"

import { useEffect, useState } from "react"
import "../styles/avaliacoes.css"

export default function AvaliacoesPage() {

  const [projetos, setProjetos] = useState([])
  const [avaliadores, setAvaliadores] = useState([])

  const [form, setForm] = useState({
    projetoId: "",
    avaliador: "",
    nota: ""
  })

  useEffect(() => {

    fetch("/api/projetos")
      .then(res => res.json())
      .then(data => setProjetos(data))

    fetch("/api/avaliadores")
      .then(res => res.json())
      .then(data => setAvaliadores(data))

  }, [])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function salvar() {

    if (!form.projetoId) {
      alert("Selecione um projeto")
      return
    }

    if (!form.avaliador) {
      alert("Selecione um avaliador")
      return
    }

    if (form.nota < 0 || form.nota > 10) {
      alert("Nota deve ser entre 0 e 10")
      return
    }

    try {

      await fetch("/api/avaliacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          projetoId: Number(form.projetoId),
          avaliadorId: Number(form.avaliador),
          nota: Number(form.nota)
        })
      })

      alert("Avaliação salva!")

      setForm({
        projetoId: "",
        avaliador: "",
        nota: ""
      })

    } catch(error){
      console.error(error)
      alert("Erro ao salvar avaliação")
    }
  }

  return (
    <div className="container">

      <h1 className="title">
        AVALIAÇÕES DE PROJETOS
      </h1>

      <div className="content">

        <div className="formContainer">

          <select
            className="select"
            name="projetoId"
            value={form.projetoId}
            onChange={handleChange}
          >
            <option value="">
              Selecione o projeto
            </option>

            {projetos.map(p => (
              <option
                key={p.id}
                value={p.id}
              >
                {p.titulo}
              </option>
            ))}

          </select>


          <select
            className="select"
            name="avaliador"
            value={form.avaliador}
            onChange={handleChange}
          >
            <option value="">
              Selecione o avaliador
            </option>

            {avaliadores.map(a => (
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
            name="nota"
            type="number"
            placeholder="Nota (0-10)"
            value={form.nota}
            onChange={handleChange}
          />

          <button
            className="button"
            onClick={salvar}
          >
            Salvar Avaliação
          </button>

        </div>

        <div className="tableContainer">

          <table className="table">

            <thead>

              <tr>
                <th>Projeto</th>
                <th>Grupo</th>
                <th>Professor</th>
                <th>Nota</th>
              </tr>

            </thead>

            <tbody>

              {projetos.map(p => (

                <tr key={p.id}>

                  <td>{p.titulo}</td>

                  <td>
                    {p.grupo?.nome || "-"}
                  </td>

                  <td>
                    {p.grupo?.professor?.nome || "-"}
                  </td>

                  <td>
                    <span className="nota">
                      {p.nota ?? "-"}
                    </span>
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