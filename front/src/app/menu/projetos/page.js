"use client";

import { useState, useEffect } from "react";
import Button from "@/app/framework/components/Button/Button";
import Modal from "@/app/framework/components/Modal/Modal";
import GrupoForm from "@/app/framework/components/FormInput/GrupoForm";
import AvaliacaoModal from "@/app/framework/components/Modal/AvaliacaoModal";
import { grupoService } from "@/utils/api/api";

const turmas = [
  { id: 1, curso: "Engenharia de Software", periodo: "2026.1", semestre: "2026/1" },
  { id: 2, curso: "Ciência da Computação", periodo: "2026.1", semestre: "2026/1" },
];

const professores = [
  { id: 1, nome: "Dr. João Silva" },
  { id: 2, nome: "Profa. Maria Santos" },
];

const alunosDisponiveis = [
  { id: 1, nome: "Ana Oliveira", matricula: "2023001" },
  { id: 2, nome: "Bruno Costa", matricula: "2023002" },
  { id: 3, nome: "Carla Mendes", matricula: "2023003" },
  { id: 4, nome: "Diego Souza", matricula: "2023004" },
  { id: 5, nome: "Elena Rocha", matricula: "2023005" },
];

export default function ProjetosPage() {
  const [grupos, setGrupos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState(null);
  const [grupoParaAvaliar, setGrupoParaAvaliar] = useState(null);
  const [search, setSearch] = useState("");

  async function carregarDados() {
    try {
      const dados = await grupoService.getAll();
      setGrupos(dados || []);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const getTurma = (turmaId) => turmas.find((t) => t.id === turmaId);

  const getProfessor = (professorId) =>
    professores.find((p) => p.id === professorId);

  const getAlunosPorIds = (ids = []) =>
    ids
      .map((id) => alunosDisponiveis.find((a) => a.id === id))
      .filter(Boolean);

  const filteredGrupos = grupos.filter((grupo) => {
    const turma = getTurma(grupo.turmaId);
    const professor = getProfessor(grupo.professorId);
    const alunosGrupo = getAlunosPorIds(grupo.alunos || []);
    const termo = search.trim().toLowerCase();

    if (!termo) return true;

    const campos = [
      grupo.nome,
      turma?.curso,
      turma?.periodo,
      turma?.semestre,
      professor?.nome,
      grupo.localApresentacao,
      grupo.horarioInicio,
      grupo.horarioFim,
      ...alunosGrupo.map((aluno) => `${aluno.nome} ${aluno.matricula}`),
    ];

    return campos.some((valor) =>
      String(valor || "").toLowerCase().includes(termo)
    );
  });

  async function handleSave(newGrupo) {
    try {
      const payload = editingGrupo
        ? { ...newGrupo, id: editingGrupo.id }
        : newGrupo;

      await grupoService.save(payload);

      setShowModal(false);
      setEditingGrupo(null);
      await carregarDados();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleAvaliar(id, nota) {
    try {
      await grupoService.evaluate(id, nota);

      setGrupoParaAvaliar(null);
      await carregarDados();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(id) {
    const grupo = grupos.find((g) => g.id === id);

    if (grupo?.projetoId || grupo?.projetoVinculado) {
      alert("Não é possível excluir um grupo com projeto vinculado.");
      return;
    }

    if (grupo?.nota !== undefined && grupo?.nota !== null) {
      alert("Não é possível excluir grupo já avaliado!");
      return;
    }

    if (confirm("Excluir este grupo?")) {
      try {
        await grupoService.delete(id);
        await carregarDados();
      } catch (error) {
        alert(error.message);
      }
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl">
        <h1>Gestão de Projetos e Avaliações Acadêmicas</h1>

        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            placeholder="Pesquisar por componente, professor, turma, curso, semestre ou grupo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <Button
            onClick={() => {
              setEditingGrupo(null);
              setShowModal(true);
            }}
          >
            + Novo Grupo
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="table w-full">
            <thead className="bg-gray-50">
              <tr>
                <th>Grupo</th>
                <th>Turma</th>
                <th>Orientador</th>
                <th>Componentes</th>
                <th>Apresentação</th>
                <th>Nota</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredGrupos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    Nenhum grupo cadastrado ainda.
                  </td>
                </tr>
              ) : (
                filteredGrupos.map((grupo) => {
                  const turma = getTurma(grupo.turmaId);
                  const professor = getProfessor(grupo.professorId);
                  const alunosGrupo = getAlunosPorIds(grupo.alunos || []);

                  return (
                    <tr key={grupo.id} className="border-t">
                      <td className="font-medium">{grupo.nome}</td>

                      <td>
                        {turma
                          ? `${turma.curso} - ${turma.periodo}`
                          : "-"}
                      </td>

                      <td>{professor?.nome || "-"}</td>

                      <td>
                        {alunosGrupo.length > 0
                          ? alunosGrupo.map((aluno) => aluno.nome).join(", ")
                          : "-"}
                      </td>

                      <td className="text-sm">
                        {grupo.localApresentacao || "-"}
                        <br />
                        {grupo.horarioInicio
                          ? new Date(grupo.horarioInicio).toLocaleString(
                              "pt-BR"
                            )
                          : ""}

                        {grupo.horarioFim
                          ? ` - ${new Date(grupo.horarioFim).toLocaleString(
                              "pt-BR"
                            )}`
                          : ""}
                      </td>

                      <td className="font-bold text-lg">
                        {grupo.nota !== undefined && grupo.nota !== null
                          ? `${grupo.nota}/10`
                          : "-"}
                      </td>

                      <td>
                        <div className="space-x-4">
                          <button
                            onClick={() => {
                              setEditingGrupo(grupo);
                              setShowModal(true);
                            }}
                            className="text-blue-600"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => setGrupoParaAvaliar(grupo)}
                            className="text-green-600"
                          >
                            Avaliar
                          </button>

                          <button
                            onClick={() => handleDelete(grupo.id)}
                            className="text-red-600"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingGrupo(null);
        }}
        title={editingGrupo ? "Editar Grupo" : "Novo Grupo de Projeto"}
      >
        <GrupoForm
          initialData={editingGrupo}
          turmas={turmas}
          professores={professores}
          alunos={alunosDisponiveis}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingGrupo(null);
          }}
        />
      </Modal>

      {grupoParaAvaliar && (
        <AvaliacaoModal
          grupo={grupoParaAvaliar}
          onSave={handleAvaliar}
          onClose={() => setGrupoParaAvaliar(null)}
        />
      )}
    </div>
  );
}