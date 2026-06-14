"use client";

import { useSemestre } from "@/app/hooks/useSemestre";
import "../global.css";
import Menu from '@/components/Menu';

export default function Semestres() {
    const {
        semestres,
        loading,
        formData,
        searchId,
        editingId,
        setSearchId,
        handleChange,
        searchById,
        clearSearch,
        submit,
        editClick,
        cancelEdit,
        deleteSemestre
    } = useSemestre();

    const formatarDataBR = (dataString) => {
        if (!dataString) return "N/A";
        const [ano, mes, dia] = dataString.split("-");
        return `${dia}/${mes}/${ano}`;
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
                    <form id="form-pesquisa" onSubmit={searchById}>
                        <div className="form-group">
                            <label htmlFor="searchById">ID do Semestre:</label>
                            <input
                                type="number"
                                id="searchById"
                                name="searchById"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Digite o ID do semestre"
                                min="1"
                            />
                        </div>
                        <div className="botoes-pesquisa" style={{ display: 'flex', gap: '16px', marginTop: '8px', marginBottom: '35px' }}>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                                style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'rgb(221, 91, 49)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
                            >
                                {loading ? "Pesquisando..." : "Pesquisar"}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={clearSearch}
                                disabled={loading}
                                style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#4a5568', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
                            >
                                Limpar
                            </button>
                        </div>
                    </form>
                </section>

                <section className="form-section" id="section-form-semestre">
                    <h2>{editingId ? "Editar Semestre" : "Cadastrar Novo Semestre"}</h2>
                    <form id="form-semestre" onSubmit={submit}>

                        <div className="form-group">
                            <label htmlFor="nome">Nome do Semestre (Ex: 2026/1):</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Digite o nome do semestre"
                            />
                        </div>

                        <div className="form-group" style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="dataInicio">Data de Início:</label>
                                <input
                                    type="date"
                                    id="dataInicio"
                                    name="dataInicio"
                                    value={formData.dataInicio}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="dataFim">Data de Término:</label>
                                <input
                                    type="date"
                                    id="dataFim"
                                    name="dataFim"
                                    value={formData.dataFim}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px' }}
                                />
                            </div>
                        </div>

                        <div className="botoes-pesquisa" style={{ display: 'flex', gap: '16px', marginTop: '16px', marginBottom: '35px' }}>
                            <button
                                type="submit"
                                className="btn-primary"
                                id="btn-salvar"
                                disabled={loading}
                                style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'rgb(221, 91, 49)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
                            >
                                {loading ? "Processando..." : (editingId ? "Salvar Alterações" : "Cadastrar Semestre")}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={cancelEdit}
                                    disabled={loading}
                                    style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#4a5568', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
                                >
                                    Cancelar Edição
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="list-section" id="section-listar-semestres">
                    <h2>Semestres Disponíveis</h2>
                    {Array.isArray(semestres) && semestres.length > 0 ? (
                        <table className="tabela-cursos">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Data de Início</th>
                                    <th>Data de Término</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {semestres.map(semestre => (
                                    <tr key={semestre.id} style={{ textAlign: "center" }}>
                                        <td>{semestre.id}</td>
                                        <td>{semestre.nome}</td>
                                        <td>{formatarDataBR(semestre.dataInicio)}</td>
                                        <td>{formatarDataBR(semestre.dataFim)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    className="btn-warning"
                                                    onClick={() => editClick(semestre)}
                                                    disabled={loading}
                                                    style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', minWidth: '110px' }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn-danger"
                                                    onClick={() => deleteSemestre(semestre.id)}
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
                    ) : loading ? (
                        <p>Carregando semestres...</p>
                    ) : (
                        <p>Nenhum semestre cadastrado ou erro ao buscar.</p>
                    )}
                </section>
            </div>
        </div>
    );
}