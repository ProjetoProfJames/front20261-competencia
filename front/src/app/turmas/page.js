"use client"

import { useState, useEffect } from "react";
import "../global.css";

export default function Turmas() {
    const [turmas, setTurmas] = useState([]);

    const [formData, setFormData] = useState({
        nome: "",
        cursoIds: [],
        disciplinaId: 0,
        semestreId: 0,
        professorIds: []
    });

    const [alunoIdForm, setAlunoIdForm] = useState("");
    const [loading, setLoading] = useState(false);

    const [searchId, setSearchId] = useState("");

    const opcoesCursos = [{ id: 1, nome: "Engenharia" }, { id: 2, nome: "Computação" }];
    const opcoesDisciplinas = [{ id: 1, nome: "Cálculo" }, { id: 2, nome: "Programação Web" }];
    const opcoesSemestres = [{ id: 1, nome: "2026.1" }, { id: 2, nome: "2026.2" }];
    const opcoesProfessores = [{ id: 1, nome: "Prof. Silva" }, { id: 2, nome: "Prof. Santos" }];

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("jwt_token") || "";
        }
        return "";
    };

    const fetchWithAuth = async (url, options = {}) => {
        const token = getToken();

        if (!token) {
            alert("Token JWT não encontrado. Faça login novamente!");
            throw new Error("Token JWT não encontrado");
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...options.headers
            }
        });

        const contentType = response.headers.get("content-type");
        const isJson = contentType && contentType.includes("application/json");

        if (!response.ok) {
            const errorBody = isJson ? await response.json() : await response.text();
            console.error(`Erro HTTP ${response.status} em ${url}:`, errorBody);
            throw new Error(`HTTP ${response.status}: ${isJson ? JSON.stringify(errorBody) : "Resposta não-JSON"}`);
        }

        if (!isJson) {
            throw new Error(`Resposta inesperada de ${url}: não é JSON`);
        }

        return response.json();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes("Ids") ? [Number(value)] : (name === "nome" ? value : Number(value))
        }));
    };

    const fetchTurmas = async () => {
        setLoading(true);
        try {
            const result = await fetchWithAuth("/api/turmas", { method: "GET" });
            if (result.success) {
                setTurmas(result.data);
            } else {
                console.warn("API retornou success=false:", result);
            }
        } catch (error) {
            console.error("Erro ao buscar turmas:", error.message);
            alert("Não foi possível carregar as turmas. Verifique se a API está no ar!");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchById = async (e) => {
        e.preventDefault();

        if (searchId === "" || Number(searchId) === 0) {
            alert("Digite um ID válido para pesquisar!");
            return;
        }

        setLoading(true);
        try {
            const result = await fetchWithAuth(`/api/turmas/${searchId}`, { method: "GET" });
            if (result.success && result.data) {
                setTurmas([result.data]);
                alert(`Turma encontrada: ${result.data.nome}`);
            } else {
                alert("Turma não encontrada!");
                setTurmas([]);
            }
        } catch (error) {
            console.error("Erro ao pesquisar turma:", error.message);
            alert("Erro ao pesquisar turma. Verifique o ID e tente novamente.");
            setTurmas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchId("");
        fetchTurmas();
    };

    useEffect(() => {
        fetchTurmas();
    }, []);

    const handleCreateTurma = async (e) => {
        e.preventDefault();

        if (formData.nome === "") {
            alert("O campo Nome da Turma não pode estar vazio!");
            return;
        }
        if (formData.cursoIds.length === 0 || formData.cursoIds[0] === 0) {
            alert("Selecione pelo menos um Curso!");
            return;
        }
        if (formData.disciplinaId === 0) {
            alert("Selecione uma Disciplina!");
            return;
        }
        if (formData.semestreId === 0) {
            alert("Selecione um Semestre!");
            return;
        }
        if (formData.professorIds.length === 0 || formData.professorIds[0] === 0) {
            alert("Selecione pelo menos um Professor!");
            return;
        }

        try {
            const result = await fetchWithAuth("/api/turmas", {
                method: "POST",
                body: JSON.stringify(formData)
            });

            if (result.success) {
                alert("Turma criada com sucesso!");
                fetchTurmas();
            }
        } catch (error) {
            console.error("Erro ao criar turma:", error.message);
            alert("Erro ao criar turma. Verifique o console para mais detalhes.");
        }
    };

    const handleUpdateTurma = async (id) => {
        if (!id) {
            alert("ID da turma inválido!");
            return;
        }

        if (formData.nome === "") {
            alert("Preencha o Nome da Turma no formulário antes de atualizar.");
            return;
        }
        if (formData.cursoIds.length === 0 || formData.cursoIds[0] === 0) {
            alert("Selecione pelo menos um Curso no formulário antes de atualizar.");
            return;
        }
        if (formData.disciplinaId === 0) {
            alert("Selecione uma Disciplina no formulário antes de atualizar.");
            return;
        }
        if (formData.semestreId === 0) {
            alert("Selecione um Semestre no formulário antes de atualizar.");
            return;
        }
        if (formData.professorIds.length === 0 || formData.professorIds[0] === 0) {
            alert("Selecione pelo menos um Professor no formulário antes de atualizar.");
            return;
        }

        try {
            const result = await fetchWithAuth(`/api/turmas/${id}`, {
                method: "PUT",
                body: JSON.stringify(formData)
            });
            if (result.success) {
                alert("Turma atualizada com sucesso!");
                fetchTurmas();
            }
        } catch (error) {
            console.error("Erro ao atualizar turma:", error.message);
            alert("Erro ao atualizar turma.");
        }
    };

    const handleDeleteTurma = async (id) => {
        if (!id) {
            alert("ID da turma inválido!");
            return;
        }

        if (!confirm("Tem certeza que deseja deletar esta turma?")) return;

        try {
            const result = await fetchWithAuth(`/api/turmas/${id}`, { method: "DELETE" });
            if (result.success) {
                alert("Turma deletada com sucesso!");
                fetchTurmas();
            }
        } catch (error) {
            console.error("Erro ao deletar turma:", error.message);
            alert("Erro ao deletar turma.");
        }
    };

    const handleAddAluno = async (e, turmaId) => {
        e.preventDefault();

        if (!turmaId) {
            alert("ID da turma inválido!");
            return;
        }

        if (alunoIdForm === "" || Number(alunoIdForm) === 0) {
            alert("O campo de ID do Aluno não pode estar vazio!");
            return;
        }

        const payload = { alunoId: Number(alunoIdForm) };

        try {
            const result = await fetchWithAuth(`/api/turmas/${turmaId}/alunos`, {
                method: "POST",
                body: JSON.stringify(payload)
            });
            if (result.success) {
                alert("Aluno matriculado com sucesso na turma!");
                setAlunoIdForm("");
                fetchTurmas();
            }
        } catch (error) {
            console.error("Erro ao matricular aluno:", error.message);
            alert("Erro ao matricular aluno.");
        }
    };

    const handleRemoveAluno = async (turmaId, alunoId) => {
        if (!turmaId) {
            alert("ID da turma inválido!");
            return;
        }
        if (!alunoId) {
            alert("ID do aluno inválido!");
            return;
        }

        if (!confirm("Remover aluno da turma?")) return;

        try {
            const result = await fetchWithAuth(`/api/turmas/${turmaId}/alunos/${alunoId}`, { method: "DELETE" });
            if (result.success) {
                alert("Aluno removido da turma com sucesso!");
                fetchTurmas();
            }
        } catch (error) {
            console.error("Erro ao remover aluno:", error.message);
            alert("Erro ao remover aluno.");
        }
    };

    return (
        <main className="container-principal" id="main-turmas">
            <header>
                <h1>Gestão de Turmas</h1>
            </header>

            <section className="search-section" id="section-pesquisar-turma">
                <h2>Pesquisar Turma por ID</h2>
                <form id="form-pesquisa" onSubmit={handleSearchById}>
                    <fieldset>
                        <legend>Busca</legend>
                        <div className="form-group">
                            <label htmlFor="searchId">ID da Turma:</label>
                            <input
                                type="number"
                                id="searchId"
                                name="searchId"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Digite o ID da turma"
                                min="1"
                            />
                        </div>
                        <div className="botoes-pesquisa">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? "Pesquisando..." : "Pesquisar"}
                            </button>
                            <button type="button" className="btn-secondary" onClick={handleClearSearch} disabled={loading}>
                                Limpar
                            </button>
                        </div>
                    </fieldset>
                </form>
            </section>

            <section className="form-section" id="section-criar-turma">
                <h2>Criar / Preparar Atualização de Turma</h2>
                <form id="form-turma" onSubmit={handleCreateTurma}>
                    <fieldset>
                        <legend>Dados da Turma</legend>

                        <div className="form-group">
                            <label htmlFor="nome">Nome da Turma:</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Digite o nome da turma"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cursoIds">Curso:</label>
                            <select id="cursoIds" name="cursoIds" value={formData.cursoIds[0] || 0} onChange={handleChange}>
                                <option value="0">Selecione um Curso</option>
                                {opcoesCursos.map(curso => (
                                    <option key={curso.id} value={curso.id}>{curso.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="disciplinaId">Disciplina:</label>
                            <select id="disciplinaId" name="disciplinaId" value={formData.disciplinaId} onChange={handleChange}>
                                <option value="0">Selecione uma Disciplina</option>
                                {opcoesDisciplinas.map(disciplina => (
                                    <option key={disciplina.id} value={disciplina.id}>{disciplina.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="semestreId">Semestre:</label>
                            <select id="semestreId" name="semestreId" value={formData.semestreId} onChange={handleChange}>
                                <option value="0">Selecione um Semestre</option>
                                {opcoesSemestres.map(semestre => (
                                    <option key={semestre.id} value={semestre.id}>{semestre.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="professorIds">Professor:</label>
                            <select id="professorIds" name="professorIds" value={formData.professorIds[0] || 0} onChange={handleChange}>
                                <option value="0">Selecione um Professor</option>
                                {opcoesProfessores.map(professor => (
                                    <option key={professor.id} value={professor.id}>{professor.nome}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn-primary" id="btn-criar" disabled={loading}>
                            {loading ? "Processando..." : "Criar Turma"}
                        </button>
                    </fieldset>
                </form>
            </section>

            <section className="list-section" id="section-listar-turmas">
                <h2>Turmas Cadastradas</h2>
                {loading && <p>Carregando turmas...</p>}
                {turmas.length > 0 ? (
                    <ul className="lista-turmas" id="ul-turmas">
                        {turmas.map(turma => (
                            <li key={turma.id} className="item-turma">
                                <h3>{turma.nome}</h3>

                                <p><strong>Cursos:</strong> {turma.cursos && turma.cursos.length > 0 ? turma.cursos.map(c => c.nome).join(", ") : "N/A"}</p>
                                <p><strong>Disciplina:</strong> {turma.disciplina?.nome || "N/A"}</p>
                                <p><strong>Semestre:</strong> {turma.semestre?.nome || "N/A"}</p>
                                <p><strong>Professores:</strong> {turma.professores && turma.professores.length > 0 ? turma.professores.map(p => p.username).join(", ") : "N/A"}</p>

                                <div className="acoes-turma">
                                    <button
                                        className="btn-warning"
                                        onClick={() => handleUpdateTurma(turma.id)}
                                        disabled={loading}>
                                        Atualizar com Dados do Form
                                    </button>
                                    <button
                                        className="btn-danger"
                                        onClick={() => handleDeleteTurma(turma.id)}
                                        disabled={loading}>
                                        Deletar Turma
                                    </button>
                                </div>

                                <div className="gestao-alunos">
                                    <h4>Alunos da Turma</h4>
                                    <ul>
                                        {turma.alunos && turma.alunos.length > 0 ? turma.alunos.map(aluno => (
                                            <li key={`${turma.id}-${aluno.id}`}>
                                                {aluno.username} ({aluno.email})
                                                <button
                                                    className="btn-remover-aluno"
                                                    onClick={() => handleRemoveAluno(turma.id, aluno.id)}
                                                    disabled={loading}>
                                                    Remover
                                                </button>
                                            </li>
                                        )) : <li>Nenhum aluno matriculado</li>}
                                    </ul>

                                    <form onSubmit={(e) => handleAddAluno(e, turma.id)} className="form-add-aluno">
                                        <input
                                            type="number"
                                            placeholder="ID do Aluno"
                                            value={alunoIdForm}
                                            onChange={(e) => setAlunoIdForm(e.target.value)}
                                            min="1"
                                        />
                                        <button type="submit" className="btn-secondary" disabled={loading}>Matricular Aluno</button>
                                    </form>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>Nenhuma turma cadastrada ou erro ao buscar.</p>
                )}
            </section>
        </main>
    );
}