'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

const initialForm = {
  id: null,
  projetoId: "",
  nota: "",
  comentario: ""
};

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [pesquisa, setPesquisa] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getResponseData = async (response) => {
    const body = await response.json();
    return body.data || body || [];
  };

  const getErrorMessage = async (response, fallback) => {
    try {
      const body = await response.json();
      return body.message || body.error || fallback;
    } catch (err) {
      return fallback;
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };

      const [resAvaliacoes, resProjetos] = await Promise.all([
        fetch("/api/avaliacoes", { headers }),
        fetch("/api/projetos", { headers })
      ]);

      if (resAvaliacoes.ok) setAvaliacoes(await getResponseData(resAvaliacoes));
      if (resProjetos.ok) setProjetos(await getResponseData(resProjetos));
    } catch (err) {
      setError("Erro ao buscar dados do servidor.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchData();
  }, []);

  const normalizeText = (value) => {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const formatarData = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleString("pt-BR");
  };

  const getProjetoById = (id) => {
    return projetos.find((projeto) => String(projeto.id) === String(id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    const notaNumber = Number(form.nota);

    if (!form.projetoId) return "Selecione o projeto avaliado.";
    if (form.nota === "") return "Informe a nota do projeto.";
    if (Number.isNaN(notaNumber)) return "A nota precisa ser um número.";
    if (notaNumber < 0 || notaNumber > 10) return "A nota deve estar entre 0 e 10.";
    if (!form.comentario.trim()) return "Informe um comentário para a avaliação.";

    return "";
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const validationError = validarFormulario();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = form.id ? `/api/avaliacoes/${form.id}` : `/api/projetos/${form.projetoId}/avaliacoes`;
      const method = form.id ? "PUT" : "POST";

      const payload = {
        nota: Number(form.nota),
        comentario: form.comentario.trim()
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMessage(form.id ? "Avaliação atualizada com sucesso!" : "Avaliação cadastrada com sucesso!");
        setForm(initialForm);
        fetchData();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const message = await getErrorMessage(response, "Erro ao salvar a avaliação.");
        setError(message);
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  const handleEditar = (avaliacao) => {
    setForm({
      id: avaliacao.id,
      projetoId: avaliacao.projeto?.id || "",
      nota: avaliacao.nota ?? "",
      comentario: avaliacao.comentario || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelarEdicao = () => {
    setForm(initialForm);
    setError("");
    setSuccessMessage("");
  };

  const handleExcluir = async (avaliacao) => {
    setError("");
    setSuccessMessage("");

    const projetoId = avaliacao.projeto?.id;

    if (!projetoId) {
      setError("Não foi possível identificar o projeto vinculado a esta avaliação.");
      return;
    }

    if (!window.confirm(`Deseja realmente excluir a avaliação do projeto ${avaliacao.projeto?.nome || projetoId}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/projetos/${projetoId}/avaliacoes/${avaliacao.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccessMessage("Avaliação excluída com sucesso!");
        fetchData();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const message = await getErrorMessage(response, "Não foi possível excluir a avaliação.");
        setError(message);
      }
    } catch (err) {
      setError("Erro ao excluir avaliação.");
    }
  };

  const avaliacoesFiltradas = avaliacoes.filter((avaliacao) => {
    const projetoCompleto = getProjetoById(avaliacao.projeto?.id);

    const textoBusca = normalizeText([
      avaliacao.projeto?.nome,
      avaliacao.avaliador?.username,
      avaliacao.avaliador?.email,
      avaliacao.nota,
      avaliacao.comentario,
      projetoCompleto?.turma?.nome,
      projetoCompleto?.semestre?.nome,
      projetoCompleto?.professorOrientador?.username
    ].join(" "));

    return textoBusca.includes(normalizeText(pesquisa));
  });

  return (
    <div className="container container-flex-layout" style={{ maxWidth: "1100px", width: "100%" }}>
      <h1>Avaliação de Projetos Integradores</h1>

      <form onSubmit={handleSalvar} className="card form-full-width">
        <h2>{form.id ? "Editar Avaliação" : "Nova Avaliação"}</h2>

        {error && <div className="alert-message error-box">{error}</div>}
        {successMessage && <div className="alert-message success-box">{successMessage}</div>}

        <div className="form-group">
          <label>Projeto Avaliado</label>
          <select
            className="input-field"
            name="projetoId"
            value={form.projetoId}
            onChange={handleChange}
            disabled={!!form.id}
          >
            <option value="">Selecione o projeto...</option>
            {projetos.map((projeto) => (
              <option key={projeto.id} value={projeto.id}>
                {projeto.nome} - {projeto.turma?.nome || "Sem turma"} - {projeto.semestre?.nome || "Sem semestre"}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          label="Nota"
          type="number"
          name="nota"
          value={form.nota}
          onChange={handleChange}
        />

        <div className="form-group">
          <label>Comentário</label>
          <textarea
            className="input-field"
            name="comentario"
            value={form.comentario}
            onChange={handleChange}
            rows="4"
            style={{ resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Button type="submit">{form.id ? "Atualizar" : "Salvar"}</Button>
          {form.id && (
            <button type="button" onClick={handleCancelarEdicao} className="btn-action delete" style={{ padding: "0.75rem 1rem" }}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="card form-full-width">
        <h2>Pesquisar Avaliações</h2>
        <FormInput
          label="Buscar por projeto, avaliador, nota, comentário, turma, semestre ou professor"
          type="text"
          name="pesquisa"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div>

      <div className="table-scroll-container" style={{ maxHeight: "500px", overflowY: "auto", width: "100%" }}>
        <table className="data-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Projeto</th>
              <th>Avaliador</th>
              <th>Nota</th>
              <th>Comentário</th>
              <th>Atualização</th>
              <th style={{ width: "160px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {avaliacoesFiltradas.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>Nenhuma avaliação encontrada.</td>
              </tr>
            ) : (
              avaliacoesFiltradas.map((avaliacao) => (
                <tr key={avaliacao.id}>
                  <td>{avaliacao.id}</td>
                  <td>{avaliacao.projeto?.nome || "N/A"}</td>
                  <td>{avaliacao.avaliador?.username || "N/A"}</td>
                  <td>{avaliacao.nota}</td>
                  <td>{avaliacao.comentario || "N/A"}</td>
                  <td>{formatarData(avaliacao.updatedAt || avaliacao.createdAt)}</td>
                  <td>
                    <div className="actions-cell">
                      <button onClick={() => handleEditar(avaliacao)} className="btn-action edit">Editar</button>
                      <button onClick={() => handleExcluir(avaliacao)} className="btn-action delete">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}