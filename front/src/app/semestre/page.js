"use client";

import { useState, useEffect } from "react";
import "../global.css";
import Menu from '@/components/Menu';

export default function Semestres() {
    const [semestres, setSemestres] = useState([]);
    const [formData, setFormData] = useState({
        nome: "",
        dataInicio: "",
        dataFim: ""
    });
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token") || "";
        }
        return "";
    };

    const fetchWithAuth = async (url, options = {}) => {
        const token = getToken();
        if (!token) {
            alert("Sessão expirada ou não encontrada. Por favor, renove sua sessão!");
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
            [name]: value
        }));
    };

    const fetchSemestres = async () => {
        setLoading(true);
        try {
            const result = await fetchWithAuth("/api/semestres", { method: "GET" });
            if (result.success) {
                setSemestres(result.data);
            } else {
                console.warn("API retornou success=false:", result);
            }
        } catch (error) {
            console.error("Erro ao buscar semestres:", error.message);
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
            const result = await fetchWithAuth(`/api/semestre/${searchId}`, { method: "GET" });
            if (result.success && result.data) {
                setSemestres([result.data]);
            } else {
                alert("Semestre não encontrado!");
                setSemestres([]);
            }
        } catch (error) {
            console.error("Erro ao pesquisar semestre:", error.message);
            alert("Erro ao pesquisar semestre. Verifique o ID e tente novamente.");
            setSemestres([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchId("");
        fetchSemestres();
    };

    useEffect(() => {
        fetchSemestres();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.nome.trim() === "") {
            alert("O campo Nome não pode estar vazio!");
            return;
        }
        if (formData.dataInicio === "") {
            alert("O campo Data de Início não pode estar vazio!");
            return;
        }
        if (formData.dataFim === "") {
            alert("O campo Data de Fim não pode estar vazio!");
            return;
        }

        const payload = { ...formData };
        try {
            if (editingId) {
                const result = await fetchWithAuth(`/api/semestre/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload)
                });
                if (result.success) {
                    alert("Semestre updated com sucesso!");
                    setEditingId(null);
                    setFormData({ nome: "", dataInicio: "", dataFim: "" });
                    fetchSemestres();
                }
            } else {
                const result = await fetchWithAuth("/api/semestres", {
                    method: "POST",
                    body: JSON.stringify(payload)
                });
                if (result.success) {
                    alert("Semestre cadastrado com sucesso!");
                    setFormData({ nome: "", dataInicio: "", dataFim: "" });
                    fetchSemestres();
                }
            }
        } catch (error) {
            console.error("Erro ao salvar semestre:", error.message);
            alert("Erro ao salvar semestre. Verifique o console.");
        }
    };

    const handleEditClick = (semestre) => {
        setEditingId(semestre.id);
        setFormData({
            nome: semestre.nome,
            dataInicio: semestre.dataInicio ? semestre.dataInicio.split('T')[0] : "",
            dataFim: semestre.dataFim ? semestre.dataFim.split('T')[0] : ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ nome: "", dataInicio: "", dataFim: "" });
    };

    const handleDeleteSemestre = async (id) => {
        if (!id) return;
        if (!window.confirm("Tem certeza que deseja deletar este semestre?")) return;

        try {
            const result = await fetchWithAuth(`/api/semestres/${id}`, { method: "DELETE" });
            if (result.success) {
                alert("Semestre deletado com sucesso!");
                fetchSemestres();
            }
        } catch (error) {
            console.error("Erro ao deletar semestre:", error.message);
            alert("Erro ao deletar semestre.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    return (
        <div className="page-wrapper">
            <Menu />

            <div className="page-content">
                <div className="page-header">
                    <h1>Gestão de Semestres</h1>
                </div>

                <section className="search-section" id="section-pesquisar-semestre">
                    <h2>Pesquisar Semestre por ID</h2>
                    <form id="form-pesquisa" onSubmit={handleSearchById}>
                        <div className="form-group">
                            <label htmlFor="searchId">ID do Semestre:</label>
                            <input
                                type="number"
                                id="searchId"
                                name="searchId"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Digite o ID do semestre"
                                min="1"
                            />
                        </div>
                        <div className="botoes-pesquisa">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                                style={{ marginBottom: '15px', padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'rgb(221, 91, 49)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px', marginRight: '15px' }}
                            >
                                {loading ? "Pesquisando..." : "Pesquisar"}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleClearSearch}
                                disabled={loading}
                                style={{ marginBottom: '15px', padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#4a5568', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
                            >
                                Limpar
                            </button>
                        </div>
                    </form>
                </section>

                <section className="form-section" id="section-form-semestre">
                    <h2>{editingId ? "Editar Semestre" : "Cadastrar Novo Semestre"}</h2>
                    <form id="form-semestre" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nome">Nome do Semestre (Ex: 2026.1):</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Digite o nome do semestre"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dataInicio">Data de Início:</label>
                            <input
                                type="date"
                                id="dataInicio"
                                name="dataInicio"
                                value={formData.dataInicio}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dataFim">Data de Fim:</label>
                            <input
                                type="date"
                                id="dataFim"
                                name="dataFim"
                                value={formData.dataFim}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="botoes-pesquisa">
                            <button
                                type="submit"
                                className="btn-primary"
                                id="btn-criar"
                                disabled={loading}
                                style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'rgb(221, 91, 49)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px', marginBottom: '15px', marginRight: editingId ? '15px' : '0px' }}
                            >
                                {loading ? "Processando..." : (editingId ? "Salvar Alterações" : "Cadastrar Semestre")}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={handleCancelEdit}
                                    disabled={loading}
                                    style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#4a5568', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px', marginBottom: '15px' }}
                                >
                                    Cancelar Edição
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="list-section" id="section-listar-semestres">
                    <h2>Semestres Cadastrados</h2>
                    {loading && <p>Carregando semestres...</p>}
                    {semestres.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Data de Início</th>
                                    <th>Data de Fim</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {semestres.map(semestre => (
                                    <tr key={semestre.id} style={{ textAlign: "center" }}>
                                        <td>{semestre.id}</td>
                                        <td>{semestre.nome}</td>
                                        <td>{formatDate(semestre.dataInicio)}</td>
                                        <td>{formatDate(semestre.dataFim)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    type="button"
                                                    className="btn-warning"
                                                    onClick={() => handleEditClick(semestre)}
                                                    disabled={loading}
                                                    style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', minWidth: '110px' }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-danger"
                                                    onClick={() => handleDeleteSemestre(semestre.id)}
                                                    disabled={loading}
                                                    style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', minWidth: '110px' }}
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
                        !loading && <p>Nenhum semestre cadastrado ou erro ao buscar.</p>
                    )}
                </section>
            </div>
        </div>
    );
}