"use client";

import { useAvaliacoes } from "@/app/hooks/useAvaliacoes";
import Menu from "@/components/Menu";
import { useEffect, useState } from "react";
import "../global.css";

export default function AvaliacoesPage() {
  const {
    avaliacoes,
    projetos,
    avaliadores,
    loading,
    formData,
    editingId,
    handleChange,
    submit,
    editClick,
    cancelEdit,
    deleteAvaliacao
  } = useAvaliacoes();

  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUsuarioLogado(JSON.parse(stored));
  }, []);

  const podeEditarExcluir = (avaliacao) => {
    if (!usuarioLogado) return false;
    const profile = usuarioLogado.profile;
    if (profile === "ADMIN" || profile === "COORDENADOR") return true;
    return avaliacao.createdBy === usuarioLogado.email || avaliacao.createdBy === usuarioLogado.username;
  };

  const podeAvaliar = () => {
    if (!usuarioLogado) return false;
    const profile = usuarioLogado.profile;
    return profile === "PROFESSOR" || profile === "AVALIADOR_EXTERNO" || profile === "ADMIN" || profile === "COORDENADOR";
  };

  const isAdminOuCoordenador = usuarioLogado?.profile === "ADMIN" || usuarioLogado?.profile === "COORDENADOR";

  return (
    <div className="page-wrapper">
      <Menu />

      <div className="page-content">
        <div className="page-header">
          <h1>Avaliações de Projetos Integradores</h1>
        </div>

        {podeAvaliar() ? (
          <section className="form-section" style={{ marginBottom: '40px' }}>
            <h2>{editingId ? "Editar Avaliação" : "Registrar Nova Avaliação"}</h2>
            <form onSubmit={submit}>
              <div className="form-group">
                <label htmlFor="projetoId">Projeto Integrador:</label>
                <select
                  id="projetoId"
                  name="projetoId"
                  value={formData.projetoId || "0"}
                  onChange={handleChange}
                  required
                  disabled={!!editingId}
                >
                  <option value="0">Selecione um Projeto</option>
                  {projetos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} (ID: {p.id})</option>
                  ))}
                </select>
              </div>

              {isAdminOuCoordenador && (
                <div className="form-group">
                  <label htmlFor="avaliadorId">Avaliador Responsável:</label>
                  <select
                    id="avaliadorId"
                    name="avaliadorId"
                    value={formData.avaliadorId || "0"}
                    onChange={handleChange}
                    required
                  >
                    <option value="0">Selecione um Avaliador</option>
                    {avaliadores.map(a => (
                      <option key={a.id} value={a.id}>{a.username} ({a.profile})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="nota">Nota (0 a 10):</label>
                <input
                  type="number"
                  id="nota"
                  name="nota"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.nota}
                  onChange={handleChange}
                  placeholder="Ex: 8.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="comentario">Comentário/Feedback:</label>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  placeholder="Insira as observações sobre a apresentação e entrega do projeto"
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid rgb(204, 204, 204)', borderRadius: '6px', fontSize: '14px', backgroundColor: 'rgb(245, 247, 250)', color: '#333', outline: 'none', transition: 'border-color 0.2s', minHeight: '100px' }}
                />
              </div>

              <div className="form-buttons" style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ padding: '14px 44px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'rgb(221, 91, 49)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minWidth: '190px' }}
                >
                  {editingId ? "Salvar Alterações" : "Enviar Avaliação"}
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
        ) : (
          <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', borderLeft: '4px solid rgb(221, 91, 49)', marginBottom: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#555', fontSize: '14px' }}>Somente professores e avaliadores externos credenciados podem registrar notas e feedbacks de projetos.</p>
          </div>
        )}

        <section className="list-section">
          <h2>Notas e Feedbacks Registrados</h2>
          {loading && <p>Processando requisição de dados...</p>}

          {!loading && avaliacoes.length > 0 ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Projeto</th>
                    <th>Avaliador</th>
                    <th>Nota</th>
                    <th>Comentários</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {avaliacoes.map(a => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>
                        <strong>{a.projeto?.nome || "Projeto Removido"}</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: '#888' }}>ID do Projeto: {a.projeto?.id}</span>
                      </td>
                      <td>
                        {a.avaliador?.username || "N/A"}
                        <span style={{ display: 'block', fontSize: '11px', color: '#888' }}>{a.avaliador?.email}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'rgb(221, 91, 49)' }}>{Number(a.nota).toFixed(1)}</span>
                      </td>
                      <td>
                        <p style={{ fontSize: '13px', color: '#444' }}>{a.comentario}</p>
                      </td>
                      <td>
                        {podeEditarExcluir(a) && (
                          <div className="td-actions">
                            <button
                              className="btn-edit"
                              onClick={() => editClick(a)}
                              disabled={loading}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteAvaliacao(a.id)}
                              disabled={loading}
                            >
                              Excluir
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && <p>Nenhuma avaliação cadastrada ainda.</p>
          )}
        </section>
      </div>
    </div>
  );
}
