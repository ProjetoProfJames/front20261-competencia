"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

const MIN_ALUNOS = 3;
const MAX_ALUNOS = 7;

const FORM_VAZIO = {
  nome: "",
  descricao: "",
  turmaId: "",
  semestreId: "",
  professorOrientadorId: "",
  localId: "",
  horarioInicio: "",
  horarioFim: "",
  alunosSelecionados: ["", "", ""],
};

const selectStyle = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  outline: "none",
  backgroundColor: "white",
  width: "100%",
};
const labelStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "var(--text-color)",
};
const colStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  flex: 1,
};

export default function GruposPage() {
  const [turmas, setTurmas] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);

  const [grupos, setGrupos] = useState([]);
  const [filtros, setFiltros] = useState({
    componente: "",
    professor: "",
    turma: "",
    curso: "",
    semestre: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(FORM_VAZIO);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const extrairLista = (json) =>
    Array.isArray(json) ? json : json?.data || json?.content || [];

  const carregarDadosBase = useCallback(async () => {
    setLoading(true);
    const h = getHeaders();
    const fetchJson = async (url) => {
      try {
        const r = await fetch(url, { headers: h });
        return r.ok ? extrairLista(await r.json()) : [];
      } catch {
        return [];
      }
    };

    const [dataTurmas, dataSemestres, dataLocais] = await Promise.all([
      fetchJson("http://localhost:8080/api/turmas"),
      fetchJson("http://localhost:8080/api/semestres"),
      fetchJson("http://localhost:8080/api/locais"),
    ]);

    setTurmas(dataTurmas);
    setSemestres(dataSemestres);
    setLocais(dataLocais);
    setLoading(false);
  }, []);

  const carregarGrupos = useCallback(
    async (params = filtros) => {
      const q = new URLSearchParams();
      if (params.componente) q.append("componente", params.componente);
      if (params.professor) q.append("professor", params.professor);
      if (params.turma) q.append("turmaNome", params.turma);
      if (params.curso) q.append("cursoNome", params.curso);
      if (params.semestre) q.append("semestre", params.semestre);

      try {
        const r = await fetch(
          `http://localhost:8080/api/projetos?${q.toString()}`,
          { headers: getHeaders() },
        );
        if (r.ok) setGrupos(extrairLista(await r.json()));
      } catch (e) {
        console.error(e);
      }
    },
    [filtros],
  );

  useEffect(() => {
    carregarDadosBase().then(() => carregarGrupos({}));
  }, [carregarDadosBase, carregarGrupos]);

  const turmaSelecionada = useMemo(
    () => turmas.find((t) => String(t.id) === String(formData.turmaId)) || null,
    [turmas, formData.turmaId],
  );

  const professoresDaTurma = useMemo(
    () => turmaSelecionada?.professores || [],
    [turmaSelecionada],
  );

  const alunosDaTurma = useMemo(
    () => turmaSelecionada?.alunos || [],
    [turmaSelecionada],
  );
  const handleTurmaChange = (novoTurmaId) => {
    const turma = turmas.find((t) => String(t.id) === String(novoTurmaId));
    setFormData((prev) => ({
      ...prev,
      turmaId: novoTurmaId,
      semestreId: turma?.semestre?.id ? String(turma.semestre.id) : "",
      professorOrientadorId: "",
      alunosSelecionados: ["", "", ""],
    }));
  };
  const alunosValidos = useMemo(
    () =>
      Array.from(
        new Set(
          formData.alunosSelecionados
            .map((id) => String(id).trim())
            .filter(Boolean),
        ),
      ),
    [formData.alunosSelecionados],
  );

  const formularioValido =
    formData.nome.trim() !== "" &&
    formData.descricao.trim() !== "" &&
    formData.turmaId !== "" &&
    formData.semestreId !== "" &&
    formData.professorOrientadorId !== "" &&
    formData.localId !== "" &&
    formData.horarioInicio !== "" &&
    formData.horarioFim !== "" &&
    alunosValidos.length >= MIN_ALUNOS &&
    alunosValidos.length <= MAX_ALUNOS;

  const alunosDisponiveis = (indexAtual) =>
    alunosDaTurma.filter(
      (a) =>
        !formData.alunosSelecionados.some(
          (id, i) => i !== indexAtual && String(id) === String(a.id),
        ),
    );

  const atualizarAluno = (index, valor) =>
    setFormData((prev) => ({
      ...prev,
      alunosSelecionados: prev.alunosSelecionados.map((v, i) =>
        i === index ? valor : v,
      ),
    }));

  const adicionarSlotAluno = () => {
    if (formData.alunosSelecionados.length >= MAX_ALUNOS) return;
    setFormData((prev) => ({
      ...prev,
      alunosSelecionados: [...prev.alunosSelecionados, ""],
    }));
  };

  const removerSlotAluno = (index) => {
    if (formData.alunosSelecionados.length <= MIN_ALUNOS) return;
    setFormData((prev) => ({
      ...prev,
      alunosSelecionados: prev.alunosSelecionados.filter((_, i) => i !== index),
    }));
  };

  const handleEditar = (grupo) => {
    const toLocal = (iso) =>
      iso ? new Date(iso).toISOString().slice(0, 16) : "";

    const ids = (grupo.integrantes || []).map((i) => String(i.id));
    while (ids.length < MIN_ALUNOS) ids.push("");

    setEditingId(grupo.id);
    setFormData({
      nome: grupo.nome || "",
      descricao: grupo.descricao || "",
      turmaId: String(grupo.turma?.id || ""),
      semestreId: String(grupo.semestre?.id || ""),
      professorOrientadorId: String(grupo.professorOrientador?.id || ""),
      localId: String(grupo.local?.id || ""),
      horarioInicio: toLocal(grupo.horarioInicio),
      horarioFim: toLocal(grupo.horarioFim),
      alunosSelecionados: ids,
    });
    setErro("");
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fecharFormulario = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(FORM_VAZIO);
    setErro("");
  };

  const handleExcluir = async (id, nome) => {
    if (!confirm(`Excluir o grupo "${nome}"?\n\nEsta ação é irreversível.`))
      return;

    try {
      const r = await fetch(`http://localhost:8080/api/projetos/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        alert(
          err.message ||
            "Não foi possível excluir. Verifique se existe avaliação vinculada a este grupo.",
        );
        return;
      }

      setGrupos((prev) => prev.filter((g) => g.id !== id));
    } catch {
      alert("Erro de conexão ao tentar excluir.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!formularioValido) {
      setErro(
        `Preencha todos os campos obrigatórios e selecione entre ${MIN_ALUNOS} e ${MAX_ALUNOS} alunos únicos.`,
      );
      return;
    }
    const payload = {
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      turmaId: Number(formData.turmaId),
      semestreId: Number(formData.semestreId),
      professorOrientadorId: Number(formData.professorOrientadorId),
      integranteIds: alunosValidos.map(Number),
      localId: Number(formData.localId),
      horarioInicio: new Date(formData.horarioInicio).toISOString(),
      horarioFim: new Date(formData.horarioFim).toISOString(),
    };

    const url = editingId
      ? `http://localhost:8080/api/projetos/${editingId}`
      : "http://localhost:8080/api/projetos";
    const method = editingId ? "PUT" : "POST";

    setSalvando(true);
    try {
      const r = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const errData = await r.json().catch(() => ({}));
        throw new Error(
          errData.message || errData.error || "Erro ao salvar o grupo.",
        );
      }

      fecharFormulario();
      await carregarGrupos(filtros);
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const colunas = [
    {
      header: "Nome",
      render: (g) => (
        <span style={{ fontWeight: "600", color: "#222" }}>{g.nome}</span>
      ),
    },
    {
      header: "Turma (Curso / Período)",
      render: (g) => {
        const turma = g.turma?.nome || "—";
        const semestre = g.semestre?.nome || "";
        return semestre ? `${turma} — ${semestre}` : turma;
      },
    },
    {
      header: "Professor Orientador",
      render: (g) =>
        g.professorOrientador?.username || g.professorOrientador?.email || "—",
    },
    {
      header: "Alunos (Componentes)",
      render: (g) =>
        g.integrantes?.length ? (
          g.integrantes.map((i) => i.username || i.email).join(", ")
        ) : (
          <span style={{ color: "#999" }}>Nenhum</span>
        ),
    },
    {
      header: "Local / Horário",
      render: (g) => {
        const local = g.local?.nome || "—";
        const ini = g.horarioInicio
          ? new Date(g.horarioInicio).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "—";
        const fim = g.horarioFim
          ? new Date(g.horarioFim).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "—";
        return (
          <span style={{ fontSize: "13px" }}>
            <strong>{local}</strong>
            <br />
            {ini} → {fim}
          </span>
        );
      },
    },
    {
      header: "Ações",
      render: (g) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button onClick={() => handleEditar(g)}>Editar</Button>
          <Button variant="danger" onClick={() => handleExcluir(g.id, g.nome)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div
      className="container"
      style={{ alignItems: "stretch", justifyContent: "flex-start" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 className="title">Grupos de Projeto</h1>

        {!isFormOpen && (
          <Button
            onClick={() => {
              setEditingId(null);
              setFormData(FORM_VAZIO);
              setErro("");
              setIsFormOpen(true);
            }}
          >
            + Novo Grupo
          </Button>
        )}
      </div>
      {!isFormOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            carregarGrupos(filtros);
          }}
          className="card"
          style={{
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {[
              { label: "Componente (aluno)", name: "componente" },
              { label: "Professor", name: "professor" },
              { label: "Turma", name: "turma" },
              { label: "Curso", name: "curso" },
              { label: "Semestre", name: "semestre" },
            ].map(({ label, name }) => (
              <div key={name} style={{ flex: 1, minWidth: "140px" }}>
                <FormInput
                  label={label}
                  type="text"
                  name={name}
                  value={filtros[name]}
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, [name]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <Button type="submit">Pesquisar</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const vazio = {
                  componente: "",
                  professor: "",
                  turma: "",
                  curso: "",
                  semestre: "",
                };
                setFiltros(vazio);
                carregarGrupos(vazio);
              }}
            >
              Limpar
            </Button>
          </div>
        </form>
      )}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="card"
          style={{
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            textAlign: "left",
            maxWidth: "760px",
            alignSelf: "center",
            width: "100%",
          }}
        >
          <h2 className="subtitle" style={{ margin: 0 }}>
            {editingId ? "✏️ Editar Grupo" : "➕ Novo Grupo de Projeto"}
          </h2>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <div style={colStyle}>
              <FormInput
                label="Nome do Grupo"
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, nome: e.target.value }))
                }
                required
              />
            </div>
            <div style={colStyle}>
              <FormInput
                label="Descrição"
                type="text"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, descricao: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <div style={colStyle}>
              <label style={labelStyle}>Turma</label>
              <select
                style={selectStyle}
                value={formData.turmaId}
                onChange={(e) => handleTurmaChange(e.target.value)}
                required
              >
                <option value="">Selecione uma turma…</option>
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>

            <div style={colStyle}>
              <label style={labelStyle}>
                Semestre{" "}
                <span
                  style={{ fontSize: "11px", color: "#888", fontWeight: 400 }}
                >
                  (definido pela turma)
                </span>
              </label>
              <select
                style={{
                  ...selectStyle,
                  backgroundColor: "#f9f9f9",
                  color: "#555",
                }}
                value={formData.semestreId}
                disabled
              >
                <option value="">—</option>
                {semestres.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <div style={colStyle}>
              <label style={labelStyle}>Professor Orientador</label>
              <select
                style={selectStyle}
                value={formData.professorOrientadorId}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    professorOrientadorId: e.target.value,
                  }))
                }
                required
                disabled={!formData.turmaId}
              >
                <option value="">
                  {formData.turmaId
                    ? "Selecione um professor…"
                    : "Selecione a turma primeiro"}
                </option>
                {professoresDaTurma.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.username || p.email}
                  </option>
                ))}
              </select>
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>Local de Apresentação</label>
              <select
                style={selectStyle}
                value={formData.localId}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, localId: e.target.value }))
                }
                required
              >
                <option value="">Selecione um local…</option>
                {locais.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.numero || l.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <div style={colStyle}>
              <FormInput
                label="Horário de Início"
                type="datetime-local"
                value={formData.horarioInicio}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, horarioInicio: e.target.value }))
                }
                required
              />
            </div>
            <div style={colStyle}>
              <FormInput
                label="Horário de Fim"
                type="datetime-local"
                value={formData.horarioFim}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, horarioFim: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <hr style={{ margin: "2px 0", borderTop: "1px solid #ddd" }} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label style={labelStyle}>
                Alunos componentes &mdash;{" "}
                <span
                  style={{
                    color:
                      alunosValidos.length >= MIN_ALUNOS &&
                      alunosValidos.length <= MAX_ALUNOS
                        ? "green"
                        : "red",
                  }}
                >
                  {alunosValidos.length} selecionado(s)
                </span>{" "}
                <span style={{ fontWeight: 400, color: "#888" }}>
                  (mín. {MIN_ALUNOS} / máx. {MAX_ALUNOS})
                </span>
              </label>
              <Button
                type="button"
                variant="secondary"
                disabled={
                  !formData.turmaId ||
                  formData.alunosSelecionados.length >= MAX_ALUNOS
                }
                onClick={adicionarSlotAluno}
              >
                + Adicionar Aluno
              </Button>
            </div>
            {!formData.turmaId && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#999",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                Selecione uma turma para listar os alunos disponíveis.
              </p>
            )}
            {formData.alunosSelecionados.map((alunoId, idx) => (
              <div
                key={idx}
                style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
              >
                <div style={colStyle}>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#666",
                    }}
                  >
                    Aluno {idx + 1}
                  </label>
                  <select
                    style={selectStyle}
                    value={alunoId}
                    onChange={(e) => atualizarAluno(idx, e.target.value)}
                    disabled={!formData.turmaId}
                  >
                    <option value="">Selecione o aluno…</option>
                    {alunosDisponiveis(idx).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.username || a.email}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  variant="danger"
                  disabled={formData.alunosSelecionados.length <= MIN_ALUNOS}
                  onClick={() => removerSlotAluno(idx)}
                  style={{ height: "36px", flexShrink: 0 }}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
          {erro && (
            <p
              style={{
                color: "red",
                fontWeight: "bold",
                margin: 0,
                padding: "10px",
                backgroundColor: "#fff0f0",
                borderRadius: "4px",
                border: "1px solid #ffcccc",
              }}
            >
              ⚠️ {erro}
            </p>
          )}
          <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
            <Button
              type="submit"
              disabled={!formularioValido || salvando}
              style={{ flex: 1 }}
            >
              {salvando
                ? "Salvando…"
                : editingId
                  ? "Salvar Alterações"
                  : "Cadastrar Grupo"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={fecharFormulario}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
      {!isFormOpen &&
        (loading ? (
          <p>Carregando grupos…</p>
        ) : (
          <Table columns={colunas} data={grupos} />
        ))}
    </div>
  );
}
