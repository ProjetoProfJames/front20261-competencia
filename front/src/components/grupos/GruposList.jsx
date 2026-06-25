"use client";

import { useEffect, useState } from "react";
import {
  listarProjetos,
  excluirProjeto,
} from "@/app/services/gruposService";

export default function GrupoList({ onNovo, onEditar }) {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarProjetos();
  }, []);

  async function carregarProjetos() {
    try {
      setCarregando(true);

      const dados = await listarProjetos();

      setProjetos(dados || []);
    } catch (error) {
      console.error(error);

      setProjetos([]);
    } finally {
      setCarregando(false);
    }
  }

  async function handleExcluir(id) {
    const confirmar = confirm(
      "Deseja excluir este projeto?"
    );

    if (!confirmar) return;

    try {
      await excluirProjeto(id);

      carregarProjetos();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  if (carregando) {
    return (
      <div className="grupo-container">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="grupo-container">
      <div className="grupo-header">
        <h1>Projetos</h1>

        <button onClick={onNovo}>
          Novo Projeto
        </button>
      </div>

      {projetos.length === 0 ? (
        <div className="grupo-vazio">
          <p>Nenhum projeto encontrado.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Turma</th>
              <th>Professor</th>
              <th>Integrantes</th>
              <th>Local</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {projetos.map((projeto) => (
              <tr key={projeto.id}>
                <td>{projeto.nome}</td>

                <td>
                  {projeto.turma?.nome || "-"}
                </td>

                <td>
                  {projeto.professorOrientador
                    ?.username || "-"}
                </td>

                <td>
                  {projeto.integrantes?.length || 0}
                </td>

                <td>
                  {projeto.local?.nome || "-"}
                </td>

                <td className="acoes">
                  <button
                    className="btn-editar"
                    onClick={() =>
                      onEditar?.(projeto)
                    }
                  >
                    Editar
                  </button>

                  <button
                    className="btn-excluir"
                    onClick={() =>
                      handleExcluir(projeto.id)
                    }
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}