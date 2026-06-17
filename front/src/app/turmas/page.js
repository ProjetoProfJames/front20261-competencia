"use client";

import { useTurmas } from "@/app/hooks/useTurmas";
import Menu from "@/components/Menu";
import "../global.css";

export default function TurmasPage() {
    const {
        turmas,
        loading,
        formData,
        searchId,
        editingId,
        alunoIdForm,
        cursos,
        disciplinasFiltradas,
        semestres,
        professores,
        setSearchId,
        setAlunoIdForm,
        handleChange,
        searchById,
        clearSearch,
        submit,
        editClick,
        cancelEdit,
        deleteTurma,
        handleAddAluno,
        handleRemoveAluno
    } = useTurmas();

    return (
        <div className="page-wrapper">
            <Menu />

            <div className="page-content">
                <div className="page-header">
                    <h1>Gestão de Turmas</h1>
                </div>

                <section className="search-section">
                    <h2>Pesquisar Turma por ID</h2>
                    <form onSubmit={searchById} className="search-form">
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px', marginBottom: '35px' }}>
                            <input
                                type="number"
                                placeholder="ID da Turma"
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

                <section className="form-section">
                    <h2>{editingId ? "Editar Turma" : "Cadastrar Nova Turma"}</h2>
                    <form onSubmit={submit}>
                        <div className="form-group">
                            <label htmlFor="nome">Nome da Turma:</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Ex: Engenharia de Software - Noturno"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cursoIds">Curso:</label>
                            <select
                                id="cursoIds"
                                name="cursoIds"
                                value={formData.cursoIds[0] || "0"}
                                onChange={handleChange}
                                required
                            >
                                <option value="0">Selecione um Curso</option>
                                {cursos.map(curso => (
                                    <option key={curso.id} value={curso.id}>{curso.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="disciplinaId">Disciplina:</label>
                            <select
                                id="disciplinaId"
                                name="disciplinaId"
                                value={formData.disciplinaId || "0"}
                                onChange={handleChange}
                                required
                                disabled={!formData.cursoIds[0] || disciplinasFiltradas.length === 0}
                            >
                                <option value="0">
                                    {!formData.cursoIds[0] 
                                        ? "Selecione um Curso primeiro" 
                                        : disciplinasFiltradas.length === 0 
                                            ? "Nenhuma disciplina para este curso" 
                                            : "Selecione uma Disciplina"
                                    }
                                </option>
                                {disciplinasFiltradas.map(disc => (
                                    <option key={disc.id} value={disc.id}>{disc.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="semestreId">Semestre:</label>
                            <select
                                id="semestreId"
                                name="semestreId"
                                value={formData.semestreId || "0"}
                                onChange={handleChange}
                                required
                            >
                                <option value="0">Selecione um Semestre</option>
                                {semestres.map(sem => (
                                    <option key={sem.id} value={sem.id}>{sem.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="professorIds">Professor:</label>
                            <select
                                id="professorIds"
                                name="professorIds"
                                value={formData.professorIds[0] || "0"}
                                onChange={handleChange}
                                required
                            >
                                <option value="0">Selecione um Professor</option>
                                {professores.map(prof => (
                                    <option key={prof.id} value={prof.id}>{prof.nome || prof.username}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="btn-primary" disabled={loading} style={{ marginBottom: '15px', padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'rgb(221, 91, 49)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}>
                                {editingId ? "Salvar Alterações" : "Cadastrar Turma"}
                            </button>
                            {editingId && (
                                <button type="button" className="btn-secondary" onClick={cancelEdit} disabled={loading} style={{ marginLeft: '15px', padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#4a5568', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="list-section">
                    <h2>Turmas Cadastradas</h2>
                    {loading && <p>Processando requisição de dados...</p>}

                    {!loading && turmas.length > 0 ? (
                        <ul className="cards-list" style={{ listStyle: 'none', padding: 0 }}>
                            {turmas.map((turma) => (
                                <li key={turma.id} className="card-item" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                                    <div className="card-info">
                                        <h3>{turma.nome} <span style={{ fontSize: '14px', color: '#666' }}>(ID: {turma.id})</span></h3>
                                        <p><strong>Curso:</strong> {turma.cursos?.map(c => c.nome).join(", ") || "Não informado"}</p>
                                        <p><strong>Disciplina:</strong> {turma.disciplina?.nome || "Não informada"}</p>
                                        <p><strong>Semestre:</strong> {turma.semestre?.nome || "Não informado"}</p>
                                        <p><strong>Professor:</strong> {turma.professores?.map(p => p.nome || p.username).join(", ") || "Não informado"}</p>
                                    </div>

                                    <div className="card-actions" style={{ margin: '15px 0', display: 'flex', gap: '10px' }}>
                                        <button className="btn-primary" onClick={() => editClick(turma)} disabled={loading} style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', minWidth: '110px' }}>Editar</button>
                                        <button className="btn-danger" onClick={() => deleteTurma(turma.id)} disabled={loading} style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', minWidth: '110px' }}>Remover</button>
                                    </div>

                                    <div className="alunos-section" style={{ background: '#f9f9f9', padding: '15px', borderRadius: '6px', marginTop: '15px' }}>
                                        <h4>Alunos Matriculados nesta Turma</h4>
                                        <ul className="alunos-list" style={{ paddingLeft: '20px', marginBottom: '15px' }}>
                                            {turma.alunos && turma.alunos.length > 0 ? (
                                                turma.alunos.map((aluno) => (
                                                    <li key={aluno.id} className="aluno-item" style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between', maxWidth: '350px' }}>
                                                        <span>{aluno.nome || aluno.username} (ID: {aluno.id})</span>
                                                        <button
                                                            className="btn-link-danger"
                                                            onClick={() => handleRemoveAluno(turma.id, aluno.id)}
                                                            disabled={loading}
                                                            style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', textDecoration: 'underline' }}
                                                        >
                                                            Remover
                                                        </button>
                                                    </li>
                                                ))
                                            ) : (
                                                <li style={{ listStyle: 'none', color: '#777' }}>Nenhum aluno matriculado</li>
                                            )}
                                        </ul>

                                        <form onSubmit={(e) => handleAddAluno(e, turma.id)} className="form-add-aluno" style={{ display: 'flex', gap: '10px', maxWidth: '400px' }}>
                                            <input
                                                type="number"
                                                placeholder="ID do Aluno"
                                                value={alunoIdForm}
                                                onChange={(e) => setAlunoIdForm(e.target.value)}
                                                min="1"
                                                required
                                                style={{ flex: 1, padding: '6px' }}
                                            />
                                            <button type="submit" className="btn-secondary" disabled={loading} style={{ padding: '6px 12px' }}>Matricular Aluno</button>
                                        </form>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !loading && <p>Nenhuma turma encontrada na base de dados.</p>
                    )}
                </section>
            </div>
        </div>
    );
}