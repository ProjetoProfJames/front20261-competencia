'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { api } from '@/services/api';

export default function CursosPage() {
  const router = useRouter();

  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [isDisciplinaModalOpen, setIsDisciplinaModalOpen] = useState(false);
  const [disciplina, setDisciplina] = useState({
    nome: "",
    cursoId: ""
  });
  const [disciplinaError, setDisciplinaError] = useState("");
  const [isSavingDisciplina, setIsSavingDisciplina] = useState(false);

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'nome' },
    { label: 'Coordenador', key: 'coordenadorNome' },
    { label: 'Professores', key: 'professoresTexto' },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserProfile(localStorage.getItem("userProfile") || "");
    }

    carregarCursos();
  }, []);

  const carregarCursos = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        setCursos([]);
        setError("Você ainda não está logado. A tela está pronta, mas os dados só serão carregados após login.");
        return;
      }

      const response = await api.get('/cursos');
      const cursosApi = response.data || [];

      const cursosFormatados = cursosApi.map((curso) => ({
        ...curso,
        coordenadorNome: curso.coordenador?.username || "-",
        professoresTexto: curso.professores?.map((p) => p.username).join(", ") || "-"
      }));

      setCursos(cursosFormatados);
    } catch (err) {
      console.error("Erro ao buscar cursos:", err);
      setError("Não foi possível carregar a lista de cursos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (curso) => {
    router.push(`/cursos/cadastro?id=${curso.id}`);
  };

  const handleDelete = async (curso) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o curso ${curso.nome}?`);

    if (!confirmacao) return;

    try {
      await api.delete(`/cursos/${curso.id}`);
      setCursos((prev) => prev.filter((c) => c.id !== curso.id));
      alert("Curso excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir curso:", err);
      alert(err.message || "Erro ao tentar excluir curso.");
    }
  };

  const abrirModalDisciplina = () => {
    setDisciplina({
      nome: "",
      cursoId: cursos[0]?.id ? String(cursos[0].id) : ""
    });
    setDisciplinaError("");
    setIsDisciplinaModalOpen(true);
  };

  const fecharModalDisciplina = () => {
    setIsDisciplinaModalOpen(false);
    setDisciplinaError("");
    setIsSavingDisciplina(false);
  };

  const handleDisciplinaChange = (event) => {
    const { name, value } = event.target;

    setDisciplina((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateDisciplina = async () => {
    setDisciplinaError("");

    if (!disciplina.nome.trim()) {
      setDisciplinaError("Informe o nome da disciplina.");
      return;
    }

    if (disciplina.nome.length > 120) {
      setDisciplinaError("O nome da disciplina deve ter no maximo 120 caracteres.");
      return;
    }

    if (!disciplina.cursoId) {
      setDisciplinaError("Selecione o curso da disciplina.");
      return;
    }

    setIsSavingDisciplina(true);

    try {
      await api.post("/disciplinas", {
        nome: disciplina.nome.trim(),
        cursoId: Number(disciplina.cursoId)
      });

      alert("Disciplina cadastrada com sucesso!");
      fecharModalDisciplina();
    } catch (err) {
      console.error("Erro ao cadastrar disciplina:", err);
      setDisciplinaError(err.message || "Erro ao cadastrar disciplina.");
    } finally {
      setIsSavingDisciplina(false);
    }
  };

  return (
    <PageLayout
      title="Gestão de Cursos"
      subtitle="Lista de cursos cadastrados no sistema"
      topRightAction={
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {userProfile === "ADMIN" && (
            <Button type="button" onClick={abrirModalDisciplina} className="btn-secondary">
              Nova Disciplina
            </Button>
          )}

          <Button href="/cursos/cadastro" className="btn-secondary">
            Novo Curso
          </Button>
        </div>
      }
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Carregando cursos...
        </div>
      ) : (
        <Table
          data={cursos}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {isDisciplinaModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">Cadastrar Disciplina</h2>

            {disciplinaError && (
              <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                {disciplinaError}
              </p>
            )}

            <div className="form-group">
              <FormInput
                label="Nome da Disciplina"
                type="text"
                name="nome"
                value={disciplina.nome}
                onChange={handleDisciplinaChange}
                maxLength={120}
              />
            </div>

            <div className="input-group" style={{ marginTop: '10px' }}>
              <label>Curso</label>
              <select
                name="cursoId"
                value={disciplina.cursoId}
                onChange={handleDisciplinaChange}
                className="form-select"
              >
                <option value="">Selecione um curso</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button
                type="button"
                onClick={handleCreateDisciplina}
                className="btn-secondary"
                disabled={isSavingDisciplina}
              >
                {isSavingDisciplina ? "Salvando..." : "Salvar"}
              </Button>

              <Button type="button" onClick={fecharModalDisciplina} className="btn-danger">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
