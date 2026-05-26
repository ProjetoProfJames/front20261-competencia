"use client"

import { useState } from "react"
import "../styles/grupos.css"

export default function GruposPage() {

  const [grupos] = useState([
    {
      id: 1,
      nome: "Grupo A",
      professor: "João",
      turma: "ADS 1",
      alunos: ["Ana", "Pedro", "Carlos"],
      local: "Sala 101",
      inicio: "10:00",
      fim: "10:30"
    }
  ])

  const [form, setForm] = useState({
    nome: "",
    professor: "",
    turma: "",
    local: "",
    inicio: "",
    fim: ""
  })

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container">

      <h1 className="title">Grupos</h1>

      <div className="formContainer">

        <input
          className="input"
          name="nome"
          placeholder="Nome do grupo"
          onChange={handleChange}
        />

        <input
          className="input"
          name="professor"
          placeholder="Professor"
          onChange={handleChange}
        />

        <input
          className="input"
          name="turma"
          placeholder="Turma"
          onChange={handleChange}
        />

        <input
          className="input"
          name="local"
          placeholder="Local"
          onChange={handleChange}
        />

        <input
          className="input"
          type="time"
          name="inicio"
          onChange={handleChange}
        />

        <input
          className="input"
          type="time"
          name="fim"
          onChange={handleChange}
        />

        <button className="button">
          Salvar
        </button>

      </div>

      <div className="tableContainer">

        <table className="table">

          <thead>
            <tr>
              <th>Grupo</th>
              <th>Professor</th>
              <th>Turma</th>
              <th>Alunos</th>
            </tr>
          </thead>

          <tbody>

            {grupos.map(g => (
              <tr key={g.id}>
                <td>{g.nome}</td>
                <td>{g.professor}</td>
                <td>{g.turma}</td>
                <td>{g.alunos.join(", ")}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}