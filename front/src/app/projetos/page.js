'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

const initialForm = {
  id: null,
  nome: "",
  descricao: "",
  turmaId: "",
  semestreId: "",
  professorOrientadorId: "",
  integranteIds: [],
  localId: "",
  horarioInicio: "",
  horarioFim: ""
};

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
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

      const [resProjetos, resTurmas, resLocais, resAvaliacoes] = await Promise.all([
        fetch("/api/projetos", { headers }),
        fetch("/api/turmas", { headers }),
        fetch("/api/locais", { headers }),
        fetch("/api/avaliacoes", { headers })
      ]);

      if (resProjetos.ok) setProjetos(await getResponseData(resProjetos));
      if (resTurmas.ok) setTurmas(await getResponseData(resTurmas));
      if (resLocais.ok) setLocais(await getResponseData(resLocais));
      if (resAvaliacoes.ok) setAvaliacoes(await getResponseData(resAvaliacoes));
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

  const getTurmaById = (id) => {
    return turmas.find((turma) => String(turma.id) === String(id));
  };

  const getTurmaSelecionada = () => {
    return getTurmaById(form.turmaId);
  };

  const getCursosDaTurma = (turmaId) => {
    const turma = getTurmaById(turmaId);
    return turma?.cursos?.map((curso) => curso.nome).join(", ") || "N/A";
  };

  const getSemestreDaTurma = (turmaId) => {
    const turma = getTurmaById(turmaId);
    return turma?.semestre?.nome || "N/A";
  };

  const formatarHorario = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleString("pt-BR");
  };

  const toDateTimeLocal = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const projetoPossuiAvaliacao = (projetoId) => {
    return avaliacoes.some((avaliacao) => String(avaliacao.projeto?.id) === String(projetoId));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTurmaChange = (e) => {
    const turmaId = e.target.value;
    const turma = getTurmaById(turmaId);

    setForm((prev) => ({
      ...prev,
      turmaId,
      semestreId: turma?.semestre?.id || "",
      professorOrientadorId: "",
      integranteIds: []
    }));
  };

  const handleIntegranteToggle = (id) => {
    setForm((prev) => {
      const isSelected = prev.integranteIds.includes(id);
      const integranteIds = isSelected
        ? prev.integranteIds.filter((item) => item !== id)
        : [...prev.integranteIds, id];

      return { ...prev, integranteIds };
    });
  };

  const validarFormulario = () => {
    if (!form.nome.trim()) return "Informe o nome do projeto.";
    if (!form.descricao.trim()) return "Informe a descrição do projeto.";
    if (!form.turmaId) return "Selecione a turma.";
    if (!form.semestreId) return "A turma selecionada precisa ter semestre vinculado.";
    if (!form.professorOrientadorId) return "Selecione o professor orientador.";
    if (!form.localId) return "Selecione o local da apresentação.";
    if (!form.horarioInicio || !form.horarioFim) return "Informe o horário de início e fim da apresentação.";
    if (new Date(form.horarioInicio) >= new Date(form.horarioFim)) return "O horário de início deve ser anterior ao horário de fim.";
    if (form.integranteIds.length < 3 || form.integranteIds.length > 7) return "O grupo deve possuir entre 3 e 7 alunos.";
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
      const url = form.id ? `/api/projetos/${form.id}` : "/api/projetos";
      const method = form.id ? "PUT" : "POST";

      const payload = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        turmaId: parseInt(form.turmaId),
        semestreId: parseInt(form.semestreId),
        professorOrientadorId: parseInt(form.professorOrientadorId),
        integranteIds: form.integranteIds,
        localId: parseInt(form.localId),
        horarioInicio: new Date(form.horarioInicio).toISOString(),
        horarioFim: new Date(form.horarioFim).toISOString()
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
        setSuccessMessage(form.id ? "Projeto atualizado com sucesso!" : "Projeto cadastrado com sucesso!");
        setForm(initialForm);
        fetchData();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const message = await getErrorMessage(response, "Erro ao salvar o projeto.");
        setError(message);
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  const handleEditar = (projeto) => {
    setForm({
      id: projeto.id,
      nome: projeto.nome || "",
      descricao: projeto.descricao || "",
      turmaId: projeto.turma?.id || "",
      semestreId: projeto.semestre?.id || "",
      professorOrientadorId: projeto.professorOrientador?.id || "",
      integranteIds: projeto.integrantes?.map((integrante) => integrante.id) || [],
      localId: projeto.local?.id || "",
      horarioInicio: toDateTimeLocal(projeto.horarioInicio),
      horarioFim: toDateTimeLocal(projeto.horarioFim)
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelarEdicao = () => {
    setForm(initialForm);
    setError("");
    setSuccessMessage("");
  };

  const handleExcluir = async (projeto) => {
    setError("");
    setSuccessMessage("");

    if (projetoPossuiAvaliacao(projeto.id)) {
      setError("Não é possível excluir este projeto porque já existe avaliação vinculada.");
      return;
    }

    if (!window.confirm(`Deseja realmente excluir o projeto ${projeto.nome}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/projetos/${projeto.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccessMessage("Projeto excluído com sucesso!");
        fetchData();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const message = await getErrorMessage(response, "Não foi possível excluir o projeto.");
        setError(message);
      }
    } catch (err) {
      setError("Erro ao excluir projeto.");
    }
  };

  const projetosFiltrados = projetos.filter((projeto) => {
    const turma = getTurmaById(projeto.turma?.id);
    const textoBusca = normalizeText([
      projeto.nome,
      projeto.descricao,
      projeto.turma?.nome,
      projeto.semestre?.nome,
      projeto.professorOrientador?.username,
      projeto.professorOrientador?.email,
      projeto.local?.nome,
      turma?.cursos?.map((curso) => curso.nome).join(" "),
      projeto.integrantes?.map((integrante) => `${integrante.username} ${integrante.email}`).join(" ")
    ].join(" "));

    return textoBusca.includes(normalizeText(pesquisa));
  });

  const turmaSelecionada = getTurmaSelecionada();
  const professoresDaTurma = turmaSelecionada?.professores || [];
  const alunosDaTurma = turmaSelecionada?.alunos || [];

  return (
    <div className="container container-flex-layout" style={{ maxWidth: "1200px", width: "100%" }}>
      <h1>Gerenciamento de Grupos de Projeto</h1>

      <form onSubmit={handleSalvar} className="card form-full-width">
        <h2>{form.id ? "Editar Grupo de Projeto" : "Novo Grupo de Projeto"}</h2>

        {error && <div className="alert-message error-box">{error}</div>}
        {successMessage && <div className="alert-message success-box">{successMessage}</div>}

        <FormInput label="Nome do Projeto" type="text" name="nome" value={form.nome} onChange={handleChange} />

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            className="input-field"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows="4"
            style={{ resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div className="form-group" style={{ flex: 1, minWidth: "260px" }}>
            <label>Turma</label>
            <select className="input-field" name="turmaId" value={form.turmaId} onChange={handleTurmaChange}>
              <option value="">Selecione a turma...</option>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome} - {turma.cursos?.map((curso) => curso.nome).join(", ") || "Sem curso"} - {turma.semestre?.nome || "Sem semestre"}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: "260px" }}>
            <label>Semestre</label>
            <input className="input-field" value={turmaSelecionada?.semestre?.nome || ""} disabled />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div className="form-group" style={{ flex: 1, minWidth: "260px" }}>
            <label>Professor Orientador</label>
            <select
              className="input-field"
              name="professorOrientadorId"
              value={form.professorOrientadorId}
              onChange={handleChange}
              disabled={!form.turmaId}
            >
              <option value="">Selecione o professor...</option>
              {professoresDaTurma.map((professor) => (
                <option key={professor.id} value={professor.id}>
                  {professor.username} ({professor.email})
                </option>
              ))}
            </select>
            {form.turmaId && professoresDaTurma.length === 0 && (
              <span style={{ color: "#666", fontSize: "0.9rem" }}>Nenhum professor vinculado a esta turma.</span>
            )}
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: "260px" }}>
            <label>Local de Apresentação</label>
            <select className="input-field" name="localId" value={form.localId} onChange={handleChange}>
              <option value="">Selecione o local...</option>
              {locais.map((local) => (
                <option key={local.id} value={local.id}>
                  {local.numero || local.nome || `Local ${local.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div className="form-group" style={{ flex: 1, minWidth: "260px" }}>
            <label>Horário de Início</label>
            <input
              className="input-field"
              type="datetime-local"
              name="horarioInicio"
              value={form.horarioInicio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: "260px" }}>
            <label>Horário de Fim</label>
            <input
              className="input-field"
              type="datetime-local"
              name="horarioFim"
              value={form.horarioFim}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Alunos Integrantes ({form.integranteIds.length}/7)</label>
          <div style={{ maxHeight: "170px", overflowY: "auto", border: "1px solid var(--border-color)", padding: "0.5rem", borderRadius: "var(--radius)", backgroundColor: "#fff" }}>
            {!form.turmaId && <span style={{ color: "#666" }}>Selecione uma turma para carregar os alunos.</span>}

            {form.turmaId && alunosDaTurma.length === 0 && (
              <span style={{ color: "#666" }}>Nenhum aluno vinculado a esta turma.</span>
            )}

            {alunosDaTurma.map((aluno) => (
              <label key={aluno.id} style={{ display: "block", marginBottom: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={form.integranteIds.includes(aluno.id)}
                  onChange={() => handleIntegranteToggle(aluno.id)}
                  style={{ marginRight: "0.5rem" }}
                />
                {aluno.username} ({aluno.email})
              </label>
            ))}
          </div>
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
        <h2>Pesquisar Projetos</h2>
        <FormInput
          label="Buscar por projeto, componente, professor, turma, curso, semestre ou local"
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
              <th>Turma</th>
              <th>Curso</th>
              <th>Semestre</th>
              <th>Professor</th>
              <th>Alunos</th>
              <th>Local</th>
              <th>Horário</th>
              <th style={{ width: "160px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {projetosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>Nenhum projeto encontrado.</td>
              </tr>
            ) : (
              projetosFiltrados.map((projeto) => (
                <tr key={projeto.id}>
                  <td>{projeto.id}</td>
                  <td>{projeto.nome}</td>
                  <td>{projeto.turma?.nome || "N/A"}</td>
                  <td>{getCursosDaTurma(projeto.turma?.id)}</td>
                  <td>{projeto.semestre?.nome || getSemestreDaTurma(projeto.turma?.id)}</td>
                  <td>{projeto.professorOrientador?.username || "N/A"}</td>
                  <td>
                    {projeto.integrantes?.length > 0
                      ? projeto.integrantes.map((integrante) => integrante.username).join(", ")
                      : "N/A"}
                  </td>
                  <td>{projeto.local?.nome || "N/A"}</td>
                  <td>
                    {formatarHorario(projeto.horarioInicio)}
                    <br />
                    até {formatarHorario(projeto.horarioFim)}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button onClick={() => handleEditar(projeto)} className="btn-action edit">Editar</button>
                      <button onClick={() => handleExcluir(projeto)} className="btn-action delete">Excluir</button>
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