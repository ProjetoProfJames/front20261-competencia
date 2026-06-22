"use client";

import { useEffect, useState } from "react";
import { api } from "../../services/api";

const initialForm = {
  nome: "",
  descricao: "",
  turmaId: "",
  semestreId: "",
  professorOrientadorId: "",
  integranteIds: "",
  localId: "",
  horarioInicio: "",
  horarioFim: "",
};

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function formatUser(user) {
  return user?.username || user?.nome || user?.email || "-";
}

function parseIdList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number)
    .filter((number) => !Number.isNaN(number));
}

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    carregarProjetos();
  }, []);

  const carregarProjetos = async () => {
    try {
      setLoading(true);
      setError("");

      const resposta = await api.get("/api/projetos");
      const dados = resposta?.data || [];
      setProjetos(Array.isArray(dados) ? dados : [dados]);
    } catch (err) {
      setProjetos([]);
      setError(err.message || "Não foi possível carregar os projetos.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => ({
    nome: form.nome,
    descricao: form.descricao,
    turmaId: Number(form.turmaId),
    semestreId: Number(form.semestreId),
    professorOrientadorId: Number(form.professorOrientadorId),
    integranteIds: parseIdList(form.integranteIds),
    localId: Number(form.localId),
    horarioInicio: form.horarioInicio ? new Date(form.horarioInicio).toISOString() : null,
    horarioFim: form.horarioFim ? new Date(form.horarioFim).toISOString() : null,
  });

  const handleSalvar = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.nome || !form.descricao || !form.turmaId || !form.semestreId || !form.professorOrientadorId || !form.localId) {
      setError("Preencha nome, descrição, turma, semestre, orientador e local.");
      return;
    }

    try {
      const payload = buildPayload();

      if (editingId) {
        await api.put(`/api/projetos/${editingId}`, payload);
        setSuccess("Projeto atualizado com sucesso.");
      } else {
        await api.post("/api/projetos", payload);
        setSuccess("Projeto cadastrado com sucesso.");
      }

      resetForm();
      carregarProjetos();
    } catch (err) {
      setError(err.message || "Erro ao salvar o projeto.");
    }
  };

  const handleEditar = (projeto) => {
    setEditingId(projeto.id);
    setForm({
      nome: projeto.nome || "",
      descricao: projeto.descricao || "",
      turmaId: projeto.turma?.id || "",
      semestreId: projeto.semestre?.id || "",
      professorOrientadorId: projeto.professorOrientador?.id || "",
      integranteIds: (projeto.integrantes || []).map((integrante) => integrante.id).join(", "),
      localId: projeto.local?.id || "",
      horarioInicio: formatDateTime(projeto.horarioInicio),
      horarioFim: formatDateTime(projeto.horarioFim),
    });
    setError("");
    setSuccess("");
  };

  const handleExcluir = async (id) => {
    if (!confirm("Deseja remover este projeto?")) {
      return;
    }

    try {
      await api.delete(`/api/projetos/${id}`);
      setSuccess("Projeto removido com sucesso.");
      carregarProjetos();
    } catch (err) {
      setError(err.message || "Erro ao remover o projeto.");
    }
  };

  return (
    <div>
      <h2>Gestão de Projetos</h2>
      <p>Cadastre e atualize projetos com turma, semestre, orientador, integrantes, local e horários.</p>

      <form onSubmit={handleSalvar} className="login-form" style={{ margin: "2rem 0", maxWidth: "100%" }}>
        <h3>{editingId ? "Editar Projeto" : "Novo Projeto"}</h3>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div style={{ display: "grid", gap: "1rem" }}>
          <input
            type="text"
            name="nome"
            placeholder="Nome do projeto"
            value={form.nome}
            onChange={handleChange}
          />

          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
          />

          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <input
              type="number"
              name="turmaId"
              placeholder="ID da turma"
              value={form.turmaId}
              onChange={handleChange}
            />
            <input
              type="number"
              name="semestreId"
              placeholder="ID do semestre"
              value={form.semestreId}
              onChange={handleChange}
            />
            <input
              type="number"
              name="professorOrientadorId"
              placeholder="ID do orientador"
              value={form.professorOrientadorId}
              onChange={handleChange}
            />
            <input
              type="number"
              name="localId"
              placeholder="ID do local"
              value={form.localId}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="integranteIds"
            placeholder="IDs dos integrantes separados por vírgula"
            value={form.integranteIds}
            onChange={handleChange}
          />

          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <label>
              Horário de início
              <input
                type="datetime-local"
                name="horarioInicio"
                value={form.horarioInicio}
                onChange={handleChange}
              />
            </label>
            <label>
              Horário de fim
              <input
                type="datetime-local"
                name="horarioFim"
                value={form.horarioFim}
                onChange={handleChange}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button type="submit" style={{ padding: "0.8rem 2rem" }}>
              {editingId ? "Salvar alteração" : "Cadastrar projeto"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: "0.8rem 2rem", backgroundColor: "#6c757d" }}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        <p style={{ fontSize: "0.9rem", color: "#333" }}>
          Use os IDs exibidos nas páginas de turmas, semestres, usuários e locais.
        </p>
      </form>

      <section>
        <h3>Projetos Cadastrados</h3>
        {loading ? (
          <p>Carregando projetos...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Turma</th>
                <th>Semestre</th>
                <th>Orientador</th>
                <th>Local</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {projetos.map((projeto) => (
                <tr key={projeto.id}>
                  <td>{projeto.id}</td>
                  <td>{projeto.nome}</td>
                  <td>{projeto.turma?.nome || projeto.turma?.id || "-"}</td>
                  <td>{projeto.semestre?.nome || projeto.semestre?.id || "-"}</td>
                  <td>{formatUser(projeto.professorOrientador)}</td>
                  <td>{projeto.local?.nome || projeto.local?.numero || projeto.local?.id || "-"}</td>
                  <td>
                    <button type="button" onClick={() => handleEditar(projeto)}>Editar</button>
                    <button type="button" onClick={() => handleExcluir(projeto.id)} style={{ backgroundColor: "#dc3545" }}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {projetos.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Nenhum projeto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
