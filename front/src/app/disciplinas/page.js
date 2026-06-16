"use client";

import { useDisciplinas } from "@/app/hooks/useDisciplinas";
import Menu from "@/components/Menu";
import "../global.css";

export default function DisciplinasPage() {
    const {
        disciplinas,
        loading,
        formData,
        searchId,
        editingId,
        cursos,
        setSearchId,
        handleChange,
        searchById,
        clearSearch,
        submit,
        editClick,
        cancelEdit,
        deleteDisciplina
    } = useDisciplinas();

    return (
        <div className="page-wrapper">
            <Menu />

            <div className="page-content">
                <div className="page-header">
                    <h1>Gestão de Disciplinas</h1>
                </div>

                {/* Seção de Pesquisa por ID */}
                <section className="search-section">
                    <h2>Pesquisar Disciplina por ID</h2>
                    <form onSubmit={searchById} className="search-form">
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px', marginBottom: '35px' }}>
                            <input
                                type="number"
                                placeholder="ID da Disciplina"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                style={{ width: '100%' }}
                            />
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                    style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'rgb(221, 91, 49)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
                                >
                                    Buscar
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
                        </div>
                    </form>
                </section>

                {/* Formulário de Cadastro / Edição */}
                <section className="form-section">
                    <h2>{editingId ? "Editar Disciplina" : "Cadastrar Nova Disciplina"}</h2>
                    <form onSubmit={submit}>
                        <div className="form-group">
                            <label htmlFor="nome">Nome da Disciplina:</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Ex: Cálculo I"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cursoId">Curso:</label>
                            <select
                                id="cursoId"
                                name="cursoId"
                                value={formData.cursoId || "0"}
                                onChange={handleChange}
                                required
                            >
                                <option value="0">Selecione um Curso</option>
                                {cursos.map(curso => (
                                    <option key={curso.id} value={curso.id}>{curso.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-buttons" style={{ display: 'flex', gap: '16px', marginTop: '16px', marginBottom: '35px' }}>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                                style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'rgb(221, 91, 49)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
                            >
                                {editingId ? "Salvar Alterações" : "Cadastrar Disciplina"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={cancelEdit}
                                    disabled={loading}
                                    style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#4a5568', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                {/* Listagem Geral de Disciplinas */}
                <section className="list-section">
                    <h2>Disciplinas Cadastradas</h2>
                    {loading && <p>Processando requisição de dados...</p>}

                    {!loading && disciplinas.length > 0 ? (
                        <table className="tabela-cursos">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Curso</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {disciplinas.map((disciplina) => (
                                    <tr key={disciplina.id} style={{ textAlign: "center" }}>
                                        <td>{disciplina.id}</td>
                                        <td>{disciplina.nome}</td>
                                        <td>{disciplina.cursoNome || disciplina.curso?.nome || "Não informado"}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    className="btn-warning"
                                                    onClick={() => editClick(disciplina)}
                                                    disabled={loading}
                                                    style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', minWidth: '110px' }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn-danger"
                                                    onClick={() => deleteDisciplina(disciplina.id)}
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
                        !loading && <p>Nenhuma disciplina encontrada na base de dados.</p>
                    )}
                </section>
            </div>
        </div>
    );
}