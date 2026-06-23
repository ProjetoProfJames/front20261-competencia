"use client";

import { useState, useEffect } from "react";
import Button from "@/app/framework/components/Button/Button";
import Modal from "@/app/framework/components/Modal/Modal";
import GrupoForm from "@/app/framework/components/FormInput/GrupoForm";
import AvaliacaoModal from "@/app/framework/components/Modal/AvaliacaoModal";
import { grupoService } from "@/utils/api/api";
import { listarTurmas } from "@/utils/services/turmaService";
import { listarUsuarios } from "@/utils/services/userService";
import { apiFetch } from "@/utils/services/api";

export default function ProjetosPage() {
  const [grupos, setGrupos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [locais, setLocais] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState(null);
  const [grupoParaAvaliar, setGrupoParaAvaliar] = useState(null);
  const [search, setSearch] = useState("");

  function getNomeUsuario(usuario) {
    return usuario?.username || usuario?.nome || usuario?.name || usuario?.email || "Sem nome";
  }

  function getCursoTurma(turma) {
    if (Array.isArray(turma?.cursos) && turma.cursos.length > 0) {
      return turma.cursos.map((curso) => curso.nome).join(", ");
    }

    return turma?.curso?.nome || turma?.cursoNome || turma?.nome || "Curso não informado";
  }

  function getPeriodoTurma(turma) {
    return turma?.semestre?.nome || turma?.periodoLetivo?.nome || turma?.periodo || "Período não informado";
  }

  function getSemestreIdTurma(turma) {
    return turma?.semestre?.id || turma?.semestreId || turma?.periodoLetivo?.id || null;
  }

  function normalizarTurma(turma) {
    return {
      ...turma,
      id: Number(turma.id),
      cursoFormatado: getCursoTurma(turma),
      periodoFormatado: getPeriodoTurma(turma),
      semestreId: getSemestreIdTurma(turma),
      professores: Array.isArray(turma.professores) ? turma.professores : [],
      alunos: Array.isArray(turma.alunos) ? turma.alunos : [],
    };
  }

  async function carregarDados() {
    try {
      const [gruposRes, turmasRes, usuariosRes, locaisRes] = await Promise.all([
        grupoService.getAll(),
        listarTurmas(),
        listarUsuarios(),
        apiFetch("/api/locais"),
      ]);

      const turmasNormalizadas = Array.isArray(turmasRes)
        ? turmasRes.map(normalizarTurma)
        : [];

      const usuarios = Array.isArray(usuariosRes) ? usuariosRes : [];

      console.log("TURMAS DO BACK:", turmasNormalizadas);

      setGrupos(gruposRes || []);
      setTurmas(turmasNormalizadas);
      setLocais(Array.isArray(locaisRes) ? locaisRes : []);

      setProfessores(usuarios.filter((usuario) => usuario.profile === "PROFESSOR"));
      setAlunosDisponiveis(usuarios.filter((usuario) => usuario.profile === "ALUNO"));
    } catch (error) {
      console.error(error);
      alert(error.message || "Erro ao carregar dados.");
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const getTurma = (turmaId) =>
    turmas.find((t) => Number(t.id) === Number(turmaId));

  const getProfessor = (professorId) =>
    professores.find((p) => Number(p.id) === Number(professorId));

  const getAlunosPorIds = (ids = []) =>
    ids
      .map((id) => alunosDisponiveis.find((a) => Number(a.id) === Number(id)))
      .filter(Boolean);

  const filteredGrupos = grupos.filter((grupo) => {
    const turma = getTurma(grupo.turmaId);
    const professor = getProfessor(grupo.professorId);
    const alunosGrupo = getAlunosPorIds(grupo.alunos || []);
    const termo = search.trim().toLowerCase();

    if (!termo) return true;

    const campos = [
      grupo.nome,
      turma?.cursoFormatado,
      turma?.periodoFormatado,
      getNomeUsuario(professor),
      grupo.localApresentacao,
      grupo.horarioInicio,
      grupo.horarioFim,
      ...alunosGrupo.map((aluno) => getNomeUsuario(aluno)),
    ];

    return campos.some((valor) =>
      String(valor || "").toLowerCase().includes(termo)
    );
  });

  async function handleSave(newGrupo) {
    try {
      const turmaSelecionada = getTurma(newGrupo.turmaId);

      if (!turmaSelecionada) {
        alert("Turma selecionada não encontrada.");
        return;
      }

      const professoresDaTurma = turmaSelecionada.professores || [];
      const alunosDaTurma = turmaSelecionada.alunos || [];

      const professorPertenceTurma = professoresDaTurma.some(
        (professor) => Number(professor.id) === Number(newGrupo.professorId)
      );

      if (!professorPertenceTurma) {
        alert("O professor selecionado não pertence à turma escolhida.");
        return;
      }

      const alunosInvalidos = newGrupo.alunos.filter(
        (alunoId) =>
          !alunosDaTurma.some((aluno) => Number(aluno.id) === Number(alunoId))
      );

      if (alunosInvalidos.length > 0) {
        alert("Um ou mais alunos selecionados não pertencem à turma escolhida.");
        return;
      }

      const payload = {
        ...newGrupo,
        id: editingGrupo?.id,
        semestreId: turmaSelecionada.semestreId,
      };

      console.log("TURMA SELECIONADA:", turmaSelecionada);
      console.log("PAYLOAD FINAL PARA SALVAR:", payload);

      await grupoService.save(payload);

      setShowModal(false);
      setEditingGrupo(null);
      await carregarDados();
    } catch (error) {
      console.error(error);
      alert(error.message || "Erro ao salvar grupo.");
    }
  }

  async function handleAvaliar(id, nota) {
    try {
      await grupoService.evaluate(id, nota);
      setGrupoParaAvaliar(null);
      await carregarDados();
    } catch (error) {
      alert(error.message || "Erro ao avaliar grupo.");
    }
  }

  async function handleDelete(id) {
    const grupo = grupos.find((g) => Number(g.id) === Number(id));

    if (grupo?.nota !== undefined && grupo?.nota !== null) {
      alert("Não é possível excluir grupo já avaliado!");
      return;
    }

    if (confirm("Excluir este grupo?")) {
      try {
        await grupoService.delete(id);
        await carregarDados();
      } catch (error) {
        alert(error.message || "Erro ao excluir grupo.");
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
                          ? `${turma.cursoFormatado} - ${turma.periodoFormatado}`
                          : "-"}
                      </td>

                      <td>{getNomeUsuario(professor)}</td>

                      <td>
                        {alunosGrupo.length > 0
                          ? alunosGrupo.map((aluno) => getNomeUsuario(aluno)).join(", ")
                          : "-"}
                      </td>

                      <td className="text-sm">
                        {grupo.localApresentacao || "-"}
                        <br />
                        {grupo.horarioInicio
                          ? new Date(grupo.horarioInicio).toLocaleString("pt-BR")
                          : ""}
                        {grupo.horarioFim
                          ? ` - ${new Date(grupo.horarioFim).toLocaleString("pt-BR")}`
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
          locais={locais}
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