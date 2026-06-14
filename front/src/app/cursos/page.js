"use client";

import { useCursos } from "@/app/hooks/useCursos";
import "../global.css";
import Menu from '@/components/Menu';

export default function Cursos() {
    const {
        cursos,
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
        deleteCurso
    } = useCursos();

    const opcoesCoordenadores = [
        { id: 1, username: "Coord. João" },
        { id: 2, username: "Coord. Maria" }
    ];

    const opcoesProfessores = [
        { id: 1, username: "Prof. Silva" },
        { id: 2, username: "Prof. Santos" },
        { id: 3, username: "Prof. Oliveira" }
    ];

    return (
        <div className="page-wrapper">
            <Menu />

            <div className="page-content">
                <div className="page-header">
                    <h1>Gestão de Cursos</h1>
                </div>

                <section className="search-section" id="section-pesquisar-curso">
                    <h2>Pesquisar Curso por ID</h2>
                    <form id="form-pesquisa" onSubmit={searchById}>
                        <div className="form-group">
                            <label htmlFor="searchById">ID do Curso:</label>
                            <input
                                type="number"
                                id="searchById"
                                name="searchById"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Digite o ID do curso"
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

                <section className="form-section" id="section-form-curso">
                    <h2>{editingId ? "Editar Curso" : "Cadastrar Novo Curso"}</h2>
                    <form id="form-curso" onSubmit={submit}>

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
                                    <option key={coord.id} value={coord.id}>{coord.username}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="professorIds">Professor Principal:</label>
                            <select id="professorIds" name="professorIds" value={formData.professorIds[0] || 0} onChange={handleChange}>
                                <option value="0">Selecione um Professor</option>
                                {opcoesProfessores.map(professor => (
                                    <option key={professor.id} value={professor.id}>{professor.username}</option>
                                ))}
                            </select>
                        </div>

                        <div className="botoes-pesquisa" style={{ display: 'flex', gap: '16px', marginTop: '16px', marginBottom: '35px' }}>
                            <button
                                type="submit"
                                className="btn-primary"
                                id="btn-salvar"
                                disabled={loading}
                                style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'rgb(221, 91, 49)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
                            >
                                {loading ? "Processando..." : (editingId ? "Salvar Alterações" : "Cadastrar Curso")}
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

                <section className="list-section" id="section-listar-cursos">
                    <h2>Cursos Disponíveis</h2>
                    {Array.isArray(cursos) && cursos.length > 0 ? (
                        <table className="tabela-cursos">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Coordenador</th>
                                    <th>Professores</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cursos.map(curso => (
                                    <tr key={curso.id} style={{ textAlign: "center" }}>
                                        <td>{curso.id}</td>
                                        <td>{curso.nome}</td>
                                        <td>{curso.coordenador?.username || "N/A"}</td>
                                        <td>
                                            {curso.professores && curso.professores.length > 0
                                                ? curso.professores.map(p => p.username).join(", ")
                                                : "N/A"
                                            }
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    className="btn-warning"
                                                    onClick={() => editClick(curso)}
                                                    disabled={loading}
                                                    style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', minWidth: '110px' }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn-danger"
                                                    onClick={() => deleteCurso(curso.id)}
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
                        <p>Carregando cursos...</p>
                    ) : (
                        <p>Nenhum curso cadastrado ou erro ao buscar.</p>
                    )}
                </section>
            </div>
        </div>
    );
}