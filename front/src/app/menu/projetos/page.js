"use client";

import { useState, useEffect } from "react";
import Button from "@/app/framework/components/Button/Button";
import Modal from "@/app/framework/components/Modal/Modal";
import FormInput from "@/app/framework/components/FormInput/index";
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
  const [notaAvaliacao, setNotaAvaliacao] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    nome: "",
    turmaId: "",
    professorId: "",
    alunos: [],
    localId: "",
    localApresentacao: "",
    horarioInicio: "",
    horarioFim: "",
  });

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

  function getNomeTurma(turma) {
    return `${turma?.cursoFormatado || "Curso não informado"} - ${
      turma?.periodoFormatado || "Período não informado"
    }`;
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

  const turmaSelecionada = turmas.find(
    (t) => Number(t.id) === Number(form.turmaId)
  );

  const professoresDaTurma = Array.isArray(turmaSelecionada?.professores)
    ? turmaSelecionada.professores
    : [];

  const alunosDaTurma = Array.isArray(turmaSelecionada?.alunos)
    ? turmaSelecionada.alunos
    : [];

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

  function limparForm() {
    setForm({
      nome: "",
      turmaId: "",
      professorId: "",
      alunos: [],
      localId: "",
      localApresentacao: "",
      horarioInicio: "",
      horarioFim: "",
    });
  }

  function fecharModalGrupo() {
    setShowModal(false);
    setEditingGrupo(null);
    limparForm();
  }

  function abrirModalNovoGrupo() {
    setEditingGrupo(null);

    setForm({
      nome: "",
      turmaId: turmas[0]?.id || "",
      professorId: "",
      alunos: [],
      localId: locais[0]?.id || "",
      localApresentacao: locais[0]?.numero || "",
      horarioInicio: "",
      horarioFim: "",
    });

    setShowModal(true);
  }

  function abrirModalEditarGrupo(grupo) {
    setEditingGrupo(grupo);

    setForm({
      nome: grupo.nome || "",
      turmaId: grupo.turmaId || "",
      professorId: grupo.professorId || "",
      alunos: Array.isArray(grupo.alunos) ? grupo.alunos : [],
      localId: grupo.localId || "",
      localApresentacao: grupo.localApresentacao || "",
      horarioInicio: grupo.horarioInicio || "",
      horarioFim: grupo.horarioFim || "",
    });

    setShowModal(true);
  }

  async function handleSave(newGrupo) {
    try {
      const turmaSelecionadaSave = getTurma(newGrupo.turmaId);

      if (!turmaSelecionadaSave) {
        alert("Turma selecionada não encontrada.");
        return;
      }

      const professoresDaTurmaSave = turmaSelecionadaSave.professores || [];
      const alunosDaTurmaSave = turmaSelecionadaSave.alunos || [];

      const professorPertenceTurma = professoresDaTurmaSave.some(
        (professor) => Number(professor.id) === Number(newGrupo.professorId)
      );

      if (!professorPertenceTurma) {
        alert("O professor selecionado não pertence à turma escolhida.");
        return;
      }

      const alunosInvalidos = newGrupo.alunos.filter(
        (alunoId) =>
          !alunosDaTurmaSave.some((aluno) => Number(aluno.id) === Number(alunoId))
      );

      if (alunosInvalidos.length > 0) {
        alert("Um ou mais alunos selecionados não pertencem à turma escolhida.");
        return;
      }

      const payload = {
        ...newGrupo,
        id: editingGrupo?.id,
        semestreId: turmaSelecionadaSave.semestreId,
      };

      await grupoService.save(payload);

      fecharModalGrupo();
      await carregarDados();
    } catch (error) {
      console.error(error);
      alert(error.message || "Erro ao salvar grupo.");
    }
  }

  function handleSubmitGrupo(e) {
    e.preventDefault();

    if (!form.turmaId) {
      alert("Selecione uma turma.");
      return;
    }

    if (!form.professorId) {
      alert("Selecione um professor orientador.");
      return;
    }

    if (!form.localId) {
      alert("Selecione um local de apresentação.");
      return;
    }

    if (form.alunos.length < 3 || form.alunos.length > 7) {
      alert("O grupo deve ter entre 3 e 7 alunos.");
      return;
    }

    if (!form.horarioInicio || !form.horarioFim) {
      alert("Informe o horário de início e fim.");
      return;
    }

    if (new Date(form.horarioInicio) >= new Date(form.horarioFim)) {
      alert("O horário de início deve ser anterior ao horário de fim.");
      return;
    }

    handleSave({
      ...form,
      turmaId: Number(form.turmaId),
      professorId: Number(form.professorId),
      localId: Number(form.localId),
      semestreId: turmaSelecionada?.semestreId,
      alunos: form.alunos.map(Number),
    });
  }

  async function handleAvaliar(id, nota) {
    try {
      await grupoService.evaluate(id, nota);
      setGrupoParaAvaliar(null);
      setNotaAvaliacao("");
      await carregarDados();
    } catch (error) {
      alert(error.message || "Erro ao avaliar grupo.");
    }
  }

  function handleSubmitAvaliacao(e) {
    e.preventDefault();

    const notaNum = parseFloat(notaAvaliacao);

    if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
      alert("A nota deve estar entre 0 e 10!");
      return;
    }

    handleAvaliar(grupoParaAvaliar.id, notaNum);
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
          <FormInput
            type="input"
            name="search"
            placeholder="Pesquisar por componente, professor, turma, curso, semestre ou grupo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button onClick={abrirModalNovoGrupo}>
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
                            onClick={() => abrirModalEditarGrupo(grupo)}
                            className="text-blue-600"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => {
                              setGrupoParaAvaliar(grupo);
                              setNotaAvaliacao(grupo.nota || "");
                            }}
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
        onClose={fecharModalGrupo}
        title={editingGrupo ? "Editar Grupo" : "Novo Grupo de Projeto"}
      >
        <form onSubmit={handleSubmitGrupo}>
          <FormInput
            type="form-group"
            label="Nome do Grupo"
            name="nome"
            placeholder="Digite o nome do grupo"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Turma</label>
              <select
                className="form-input"
                value={form.turmaId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    turmaId: e.target.value,
                    professorId: "",
                    alunos: [],
                  })
                }
                required
              >
                <option value="">Selecione uma turma</option>

                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {getNomeTurma(t)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Professor Orientador</label>
              <select
                className="form-input"
                value={form.professorId}
                onChange={(e) => setForm({ ...form, professorId: e.target.value })}
                required
              >
                <option value="">Selecione um professor</option>

                {professoresDaTurma.map((p) => (
                  <option key={p.id} value={p.id}>
                    {getNomeUsuario(p)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Alunos componentes do grupo</label>
            <select
              multiple
              className="form-input"
              value={form.alunos.map(String)}
              onChange={(e) =>
                setForm({
                  ...form,
                  alunos: Array.from(e.target.selectedOptions, (option) =>
                    Number(option.value)
                  ),
                })
              }
            >
              {alunosDaTurma.map((a) => (
                <option key={a.id} value={a.id}>
                  {getNomeUsuario(a)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Local de Apresentação</label>
            <select
              className="form-input"
              value={form.localId}
              onChange={(e) => {
                const localSelecionado = locais.find(
                  (local) => Number(local.id) === Number(e.target.value)
                );

                setForm({
                  ...form,
                  localId: e.target.value,
                  localApresentacao: localSelecionado?.numero || "",
                });
              }}
              required
            >
              <option value="">Selecione um local</option>

              {locais.map((local) => (
                <option key={local.id} value={local.id}>
                  {local.numero}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Horário de Início</label>
              <input
                type="datetime-local"
                className="form-input"
                value={form.horarioInicio}
                onChange={(e) =>
                  setForm({ ...form, horarioInicio: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Horário de Fim</label>
              <input
                type="datetime-local"
                className="form-input"
                value={form.horarioFim}
                onChange={(e) =>
                  setForm({ ...form, horarioFim: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <Button type="submit" variant="success">
              Salvar Grupo
            </Button>

            <Button type="button" variant="danger" onClick={fecharModalGrupo}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!grupoParaAvaliar}
        onClose={() => {
          setGrupoParaAvaliar(null);
          setNotaAvaliacao("");
        }}
        title="Avaliação do Projeto"
      >
        {grupoParaAvaliar && (
          <form onSubmit={handleSubmitAvaliacao}>
            <div className="form-group">
              <p style={{ fontSize: "1.2rem", marginBottom: "8px" }}>
                <strong>Grupo:</strong> {grupoParaAvaliar.nome}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Nota Final (0 a 10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="form-input"
                value={notaAvaliacao}
                onChange={(e) => setNotaAvaliacao(e.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <Button type="submit" variant="success">
                Salvar Avaliação
              </Button>

              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  setGrupoParaAvaliar(null);
                  setNotaAvaliacao("");
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}