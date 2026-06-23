"use client";

import { useProjetos } from "@/app/hooks/useProjetos";
import Menu from "@/components/Menu";
import "../global.css";

export default function ProjetosPage() {
  const {
    projetos,
    loading,
    formData,
    searchId,
    filtroTexto,
    editingId,
    turmas,
    semestres,
    locais,
    professores,
    alunos,
    setSearchId,
    setFiltroTexto,
    handleChange,
    searchById,
    clearSearch,
    submit,
    editClick,
    cancelEdit,
    deleteProjeto
  } = useProjetos();

  const formatarData = (isoStr) => isoStr ? new Date(isoStr).toLocaleString("pt-BR") : "N/A";

  return (
    <div className="page-wrapper">
      <Menu />

      <div className="page-content">
        <div className="page-header">
          <h1>Gestão de Grupos de Projeto</h1>
        </div>

        <section className="search-section">
          <h2>Pesquisar Projeto por ID ou Texto</h2>
          <form onSubmit={searchById}>
            <div className="form-group">
              <label htmlFor="searchId">ID do Projeto:</label>
              <input
                type="number"
                id="searchId"
                placeholder="Digite o ID do projeto para buscar"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="filtroTexto">Filtro Geral (Componentes, Orientadores, Turma, Curso ou Semestre):</label>
              <input
                type="text"
                id="filtroTexto"
                placeholder="Digite termos de busca..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', marginBottom: '35px' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'rgb(221, 91, 49)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
              >
                Buscar por ID
              </button>
              {(searchId || filtroTexto) && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    clearSearch();
                    setFiltroTexto("");
                  }}
                  disabled={loading}
                  style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#4a5568', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
                >
                  Limpar Busca
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="form-section" style={{ marginBottom: '40px' }}>
          <h2>{editingId ? "Editar Grupo de Projeto" : "Cadastrar Novo Grupo de Projeto"}</h2>
          <form onSubmit={submit}>
            <div className="form-group">
              <label htmlFor="nome">Nome do Projeto:</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Sistema de Gestão de Estandes"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição do Projeto:</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva brevemente o projeto"
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid rgb(204, 204, 204)', borderRadius: '6px', fontSize: '14px', backgroundColor: 'rgb(245, 247, 250)', color: '#333', outline: 'none', transition: 'border-color 0.2s', minHeight: '100px' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="turmaId">Turma:</label>
              <select
                id="turmaId"
                name="turmaId"
                value={formData.turmaId || "0"}
                onChange={handleChange}
                required
              >
                <option value="0">Selecione uma Turma</option>
                {turmas.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="semestreId">Período Letivo:</label>
              <select
                id="semestreId"
                name="semestreId"
                value={formData.semestreId || "0"}
                onChange={handleChange}
                required
              >
                <option value="0">Selecione um Período Letivo</option>
                {semestres.map(s => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="professorOrientadorId">Professor Orientador:</label>
              <select
                id="professorOrientadorId"
                name="professorOrientadorId"
                value={formData.professorOrientadorId || "0"}
                onChange={handleChange}
                required
              >
                <option value="0">Selecione um Orientador</option>
                {professores.map(p => (
                  <option key={p.id} value={p.id}>{p.username}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="localId">Local de Apresentação:</label>
              <select
                id="localId"
                name="localId"
                value={formData.localId || "0"}
                onChange={handleChange}
                required
              >
                <option value="0">Selecione um Local</option>
                {locais.map(l => (
                  <option key={l.id} value={l.id}>{l.nome || l.numero}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="horarioInicio">Horário de Início:</label>
              <input
                type="datetime-local"
                id="horarioInicio"
                name="horarioInicio"
                value={formData.horarioInicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="horarioFim">Horário de Fim:</label>
              <input
                type="datetime-local"
                id="horarioFim"
                name="horarioFim"
                value={formData.horarioFim}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="integranteIds">Alunos Integrantes (Selecione de 3 a 7 alunos):</label>
              <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px' }}>Pressione Ctrl (ou Cmd no Mac) para selecionar múltiplos alunos.</span>
              <select
                id="integranteIds"
                name="integranteIds"
                multiple
                value={formData.integranteIds}
                onChange={handleChange}
                required
                style={{ minHeight: '140px' }}
              >
                {alunos.map(a => (
                  <option key={a.id} value={a.id}>{a.username} (ID: {a.id})</option>
                ))}
              </select>
            </div>

            <div className="form-buttons" style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'rgb(221, 91, 49)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
              >
                {editingId ? "Salvar Alterações" : "Cadastrar Projeto"}
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

        <section className="list-section">
          <h2>Projetos Cadastrados</h2>
          {loading && <p>Processando requisição de dados...</p>}

          {!loading && projetos.length > 0 ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Projeto</th>
                    <th>Turma</th>
                    <th>Orientador</th>
                    <th>Componentes</th>
                    <th>Apresentação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {projetos.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>
                        <strong>{p.nome}</strong>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{p.descricao}</p>
                      </td>
                      <td>
                        {p.turma?.nome || "N/A"}
                        <span style={{ display: 'block', fontSize: '12px', color: '#666' }}>{p.semestre?.nome}</span>
                      </td>
                      <td>{p.professorOrientador?.username || "N/A"}</td>
                      <td>
                        <ul style={{ paddingLeft: '16px', fontSize: '13px' }}>
                          {p.integrantes?.map(i => (
                            <li key={i.id}>{i.username}</li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <strong>Local:</strong> {p.local?.nome || "N/A"}
                        <span style={{ display: 'block', fontSize: '12px', color: '#666', marginTop: '4px' }}>
                          {formatarData(p.horarioInicio)}<br />até {formatarData(p.horarioFim)}
                        </span>
                      </td>
                      <td>
                        <div className="td-actions">
                          <button
                            className="btn-edit"
                            onClick={() => editClick(p)}
                            disabled={loading}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteProjeto(p.id)}
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
            </div>
          ) : (
            !loading && <p>Nenhum grupo de projeto encontrado.</p>
          )}
        </section>
      </div>
    </div>
  );
}
