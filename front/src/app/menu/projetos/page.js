"use client";

import { useState, useEffect } from "react";
import Button from "@/app/framework/components/Button/Button";
import Modal from "@/app/framework/components/Modal/Modal";
import FormInput from "@/app/framework/components/FormInput/index";
import formStyles from "@/app/framework/components/FormInput/form.module.css";
import Table from "@/app/framework/components/Table/index";
import Container from "@/app/framework/components/Layouts/Container";
import Row from "@/app/framework/components/Layouts/Row";
import Col from "@/app/framework/components/Layouts/Col";
import styles from "./page_module.css";

import { carregarDadosPage } from "./actions/carregarDados";
import { salvarGrupo, validarSubmitGrupo, excluirGrupo } from "@/app/menu/projetos/actions/grupoActions";
import { avaliarGrupo, validarSubmitAvaliacao } from "@/app/menu/projetos/actions/avalicaoActions";
import { getNomeUsuario, getNomeTurma, normalizarTurma } from "@/utils/projeto/grupoHelper";
import { filtrarGrupos } from "@/utils/projeto/grupoFilter";
import { columns, montarTableData } from "@/utils/projeto/grupoTable";

export default function ProjetosPage() {
  const [grupos, setGrupos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [locais, setLocais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState(null);
  const [grupoParaAvaliar, setGrupoParaAvaliar] = useState(null);
  const [notaAvaliacao, setNotaAvaliacao] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    nome: "", turmaId: "", professorId: "", alunos: [], localId: "",
    localApresentacao: "", horarioInicio: "", horarioFim: "",
  });

  async function carregarDados() {
    await carregarDadosPage({ setGrupos, setTurmas, setLocais, setProfessores, setAlunosDisponiveis, normalizarTurma });
  }

  useEffect(() => { carregarDados(); }, []);

  const getTurma = (turmaId) => turmas.find((t) => Number(t.id) === Number(turmaId));
  const getProfessor = (professorId) => professores.find((p) => Number(p.id) === Number(professorId));
  const getAlunosPorIds = (ids = []) => ids.map((id) => alunosDisponiveis.find((a) => Number(a.id) === Number(id))).filter(Boolean);

  const turmaSelecionada = turmas.find((t) => Number(t.id) === Number(form.turmaId));
  const professoresDaTurma = Array.isArray(turmaSelecionada?.professores) ? turmaSelecionada.professores : [];
  const alunosDaTurma = Array.isArray(turmaSelecionada?.alunos) ? turmaSelecionada.alunos : [];

  const filteredGrupos = filtrarGrupos({ grupos, search, getTurma, getProfessor, getAlunosPorIds, getNomeUsuario });

  const tableData = montarTableData({
    grupos: filteredGrupos, getTurma, getProfessor, getAlunosPorIds, getNomeUsuario,
    abrirModalEditarGrupo, setGrupoParaAvaliar, setNotaAvaliacao, handleDelete,
  });

  function limparForm() {
    setForm({ nome: "", turmaId: "", professorId: "", alunos: [], localId: "", localApresentacao: "", horarioInicio: "", horarioFim: "" });
  }

  function fecharModalGrupo() {
    setShowModal(false);
    setEditingGrupo(null);
    limparForm();
  }

  function fecharModalAvaliacao() {
    setGrupoParaAvaliar(null);
    setNotaAvaliacao("");
  }

  function abrirModalNovoGrupo() {
    setEditingGrupo(null);
    setForm({
      nome: "", turmaId: turmas[0]?.id || "", professorId: "", alunos: [],
      localId: locais[0]?.id || "", localApresentacao: locais[0]?.numero || "",
      horarioInicio: "", horarioFim: "",
    });
    setShowModal(true);
  }

  function abrirModalEditarGrupo(grupo) {
    setEditingGrupo(grupo);
    setForm({
      nome: grupo.nome || "", turmaId: grupo.turmaId || "", professorId: grupo.professorId || "",
      alunos: Array.isArray(grupo.alunos) ? grupo.alunos : [], localId: grupo.localId || "",
      localApresentacao: grupo.localApresentacao || "", horarioInicio: grupo.horarioInicio || "", horarioFim: grupo.horarioFim || "",
    });
    setShowModal(true);
  }

  async function handleSave(newGrupo) {
    await salvarGrupo({ newGrupo, editingGrupo, getTurma, fecharModalGrupo, carregarDados });
  }

  function handleSubmitGrupo(e) {
    e.preventDefault();
    validarSubmitGrupo({ form, turmaSelecionada, handleSave });
  }

  async function handleAvaliar(id, nota) {
    await avaliarGrupo({ id, nota, setGrupoParaAvaliar, setNotaAvaliacao, carregarDados });
  }

  function handleSubmitAvaliacao(e) {
    e.preventDefault();
    validarSubmitAvaliacao({ notaAvaliacao, grupoParaAvaliar, handleAvaliar });
  }

  async function handleDelete(id) {
    await excluirGrupo({ id, grupos, carregarDados });
  }

  return (
    <main className={styles.main}>
      <Container>
        <div className={styles.header}>
  <div>
    <h1 className={styles.title}>Projetos</h1>
  </div>

  <Button variant="primary" onClick={abrirModalNovoGrupo}>
    + Novo Projeto
  </Button>
</div>

        <div className={styles.tableCard}>
          <div className={styles.searchBox}>
            <FormInput type="input" name="search" placeholder="Pesquisar projeto..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {filteredGrupos.length === 0 ? (
            <div className={styles.stateCard}>
              <h2 className={styles.stateTitle}>Nenhum projeto cadastrado</h2>
              <p>Clique em Novo Projeto para criar o primeiro registro.</p>
            </div>
          ) : (
            <Table columns={columns} data={tableData} />
          )}
        </div>

        <Modal isOpen={showModal} onClose={fecharModalGrupo} title={editingGrupo ? "Editar Projeto" : "Novo Projeto"}>
          <form onSubmit={handleSubmitGrupo}>
            <FormInput type="form-group" label="Nome do Grupo" name="nome" placeholder="Digite o nome do grupo" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />

            <div className="grid grid-cols-2 gap-6">
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Turma</label>
                <select className={formStyles.input} value={form.turmaId} onChange={(e) => setForm({ ...form, turmaId: e.target.value, professorId: "", alunos: [] })} required>
                  <option value="">Selecione uma turma</option>
                  {turmas.map((t) => <option key={t.id} value={t.id}>{getNomeTurma(t)}</option>)}
                </select>
              </div>

              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Professor Orientador</label>
                <select className={formStyles.input} value={form.professorId} onChange={(e) => setForm({ ...form, professorId: e.target.value })} required>
                  <option value="">Selecione um professor</option>
                  {professoresDaTurma.map((p) => <option key={p.id} value={p.id}>{getNomeUsuario(p)}</option>)}
                </select>
              </div>
            </div>

            <div className={formStyles.formGroup}>
              <label className={formStyles.label}>Alunos componentes do grupo</label>
              <select multiple className={formStyles.input} value={form.alunos.map(String)} onChange={(e) => setForm({ ...form, alunos: Array.from(e.target.selectedOptions, (option) => Number(option.value)) })}>
                {alunosDaTurma.map((a) => <option key={a.id} value={a.id}>{getNomeUsuario(a)}</option>)}
              </select>
            </div>

            <div className={formStyles.formGroup}>
              <label className={formStyles.label}>Local de Apresentação</label>
              <select className={formStyles.input} value={form.localId} onChange={(e) => {
                const localSelecionado = locais.find((local) => Number(local.id) === Number(e.target.value));
                setForm({ ...form, localId: e.target.value, localApresentacao: localSelecionado?.numero || "" });
              }} required>
                <option value="">Selecione um local</option>
                {locais.map((local) => <option key={local.id} value={local.id}>{local.numero}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Horário de Início</label>
                <input type="datetime-local" className={formStyles.input} value={form.horarioInicio} onChange={(e) => setForm({ ...form, horarioInicio: e.target.value })} required />
              </div>

              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Horário de Fim</label>
                <input type="datetime-local" className={formStyles.input} value={form.horarioFim} onChange={(e) => setForm({ ...form, horarioFim: e.target.value })} required />
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary">Salvar Projeto</Button>
              <Button type="button" variant="danger" onClick={fecharModalGrupo}>Cancelar</Button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={!!grupoParaAvaliar} onClose={fecharModalAvaliacao} title="Avaliação do Projeto">
          {grupoParaAvaliar && (
            <form onSubmit={handleSubmitAvaliacao}>
              <div className={formStyles.formGroup}>
                <p className={styles.avaliacaoGrupo}><strong>Grupo:</strong> {grupoParaAvaliar.nome}</p>
              </div>

              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Nota Final (0 a 10)</label>
                <input type="number" step="0.1" min="0" max="10" className={formStyles.input} value={notaAvaliacao} onChange={(e) => setNotaAvaliacao(e.target.value)} required />
              </div>

              <div className="form-actions">
                <Button type="submit" variant="primary">Salvar Avaliação</Button>
                <Button type="button" variant="danger" onClick={fecharModalAvaliacao}>Cancelar</Button>
              </div>
            </form>
          )}
        </Modal>
      </Container>
    </main>
  );
}