"use client"

import { useState, useEffect } from "react";
import "../global.css";

export default function GestaoCursos() {
    const [cursos, setCursos] = useState([]);
    
    const [formData, setFormData] = useState({
        nome: "",
        coordenadorId: 0,
        professorIds: []
    });
    
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const opcoesCoordenadores = [{ id: 1, nome: "Coord. João" }, { id: 2, nome: "Coord. Maria" }];
    const opcoesProfessores = [{ id: 1, nome: "Prof. Silva" }, { id: 2, nome: "Prof. Santos" }, { id: 3, nome: "Prof. Oliveira" }];

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("jwt_token") || "";
        }
        return "";
    };

    const fetchWithAuth = async (url, options = {}) => {
        const token = getToken();
        if (!token) {
            alert("Sessão expirada ou não encontrada. Por favor, renove sua sessão (faça login novamente)!");
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
            [name]: name === "professorIds" ? [Number(value)] : (name === "nome" ? value : Number(value))
        }));
    };

    const fetchCursos = async () => {
        setLoading(true);
        try {
            const result = await fetchWithAuth("/api/cursos", { method: "GET" });
            if (result.success) {
                setCursos(result.data);
            } else {
                console.warn("API retornou success=false:", result);
            }
        } catch (error) {
            console.error("Erro ao buscar cursos:", error.message);
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
            const result = await fetchWithAuth(`/api/cursos/${searchId}`, { method: "GET" });
            if (result.success && result.data) {
                setCursos([result.data]);
            } else {
                alert("Curso não encontrado!");
                setCursos([]);
            }
        } catch (error) {
            console.error("Erro ao pesquisar curso:", error.message);
            alert("Erro ao pesquisar curso. Verifique o ID e tente novamente.");
            setCursos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchId("");
        fetchCursos();
    };

    useEffect(() => {
        fetchCursos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.nome === "") {
            alert("O campo Nome não pode estar vazio!");
            return;
        }
        if (formData.coordenadorId === 0) {
            alert("Selecione um Coordenador!");
            return;
        }
        if (formData.professorIds.length === 0 || formData.professorIds[0] === 0) {
            alert("Selecione pelo menos um Professor!");
            return;
        }

        const payload = { ...formData };

        try {
            if (editingId) {
                const result = await fetchWithAuth(`/api/cursos/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload)
                });
                if (result.success) {
                    alert("Curso atualizado com sucesso!");
                    setEditingId(null);
                    setFormData({ nome: "", coordenadorId: 0, professorIds: [] });
                    fetchCursos();
                }
            } else {
                const result = await fetchWithAuth("/api/cursos", {
                    method: "POST",
                    body: JSON.stringify(payload)
                });
                if (result.success) {
                    alert("Curso criado com sucesso!");
                    setFormData({ nome: "", coordenadorId: 0, professorIds: [] });
                    fetchCursos();
                }
            }
        } catch (error) {
            console.error("Erro ao salvar curso:", error.message);
            alert("Erro ao salvar curso. Verifique o console.");
        }
    };

    const handleEditClick = (curso) => {
        setEditingId(curso.id);
        setFormData({
            nome: curso.nome,
            coordenadorId: curso.coordenador?.id || 0,
            professorIds: curso.professores && curso.professores.length > 0 ? [curso.professores[0].id] : []
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ nome: "", coordenadorId: 0, professorIds: [] });
    };

    const handleDeleteCurso = async (id) => {
        if (!id) return;
        if (!confirm("Tem certeza que deseja deletar este curso?")) return;

        try {
            const result = await fetchWithAuth(`/api/cursos/${id}`, { method: "DELETE" });
            if (result.success) {
                alert("Curso deletado com sucesso!");
                fetchCursos();
            }
        } catch (error) {
            console.error("Erro ao deletar curso:", error.message);
            alert("Erro ao deletar curso.");
        }
    };

    return (
        <main className="container-principal" id="main-cursos">
            <header>
                <h1>Gestão de Cursos</h1>
            </header>

            <section className="search-section" id="section-pesquisar-curso">
                <h2>Pesquisar Curso por ID</h2>
                <form id="form-pesquisa" onSubmit={handleSearchById}>
                    <fieldset>
                        <legend>Busca</legend>
                        <div className="form-group">
                            <label htmlFor="searchId">ID do Curso:</label>
                            <input
                                type="number"
                                id="searchId"
                                name="searchId"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Digite o ID do curso"
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

            <section className="form-section" id="section-form-curso">
                <h2>{editingId ? "Editar Curso" : "Cadastrar Novo Curso"}</h2>
                <form id="form-curso" onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Dados do Curso</legend>

                        <div className="form-group">
                            <label htmlFor="nome">Nome do Curso:</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Digite o nome do curso"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="coordenadorId">Coordenador:</label>
                            <select id="coordenadorId" name="coordenadorId" value={formData.coordenadorId} onChange={handleChange}>
                                <option value="0">Selecione um Coordenador</option>
                                {opcoesCoordenadores.map(coord => (
                                    <option key={coord.id} value={coord.id}>{coord.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="professorIds">Professor Principal:</label>
                            <select id="professorIds" name="professorIds" value={formData.professorIds[0] || 0} onChange={handleChange}>
                                <option value="0">Selecione um Professor</option>
                                {opcoesProfessores.map(professor => (
                                    <option key={professor.id} value={professor.id}>{professor.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="botoes-pesquisa">
                            <button type="submit" className="btn-primary" id="btn-salvar" disabled={loading}>
                                {loading ? "Processando..." : (editingId ? "Salvar Alterações" : "Cadastrar Curso")}
                            </button>
                            {editingId && (
                                <button type="button" className="btn-secondary" onClick={handleCancelEdit} disabled={loading}>
                                    Cancelar Edição
                                </button>
                            )}
                        </div>
                    </fieldset>
                </form>
            </section>

            <section className="list-section" id="section-listar-cursos">
                <h2>Cursos Disponíveis</h2>
                {loading && <p>Carregando cursos...</p>}
                {cursos.length > 0 ? (
                    <table className="tabela-cursos" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '10px' }}>ID</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Nome</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Coordenador</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Professores</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cursos.map(curso => (
                                <tr key={curso.id} style={{ textAlign: 'center' }}>
                                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{curso.id}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{curso.nome}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{curso.coordenador?.username || "N/A"}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                        {curso.professores && curso.professores.length > 0 ? curso.professores.map(p => p.username).join(", ") : "N/A"}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                            <button 
                                                className="btn-warning" 
                                                style={{ width: 'auto', padding: '5px 10px' }}
                                                onClick={() => handleEditClick(curso)} 
                                                disabled={loading}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="btn-danger" 
                                                style={{ width: 'auto', padding: '5px 10px' }}
                                                onClick={() => handleDeleteCurso(curso.id)} 
                                                disabled={loading}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !loading && <p>Nenhum curso cadastrado ou erro ao buscar.</p>
                )}
            </section>
        </main>
    );
}