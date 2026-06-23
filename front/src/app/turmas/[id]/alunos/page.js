'use client';

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { useSession } from "@/hooks/useSession";
import { turmaService } from "@/services/turmaService";
import { userService } from "@/services/userService";

export default function TurmaAlunosPage() {
  const router = useRouter();
  const params = useParams();
  const turmaId = params.id;
  const { loading, token, user, logout } = useSession(["PROFESSOR", "ADMIN"]);

  const [turma, setTurma] = useState(null);
  const [users, setUsers] = useState([]);
  const [alunoId, setAlunoId] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [turmaData, userData] = await Promise.all([
      turmaService.getById(turmaId, token),
      userService.list(token),
    ]);

    setTurma(turmaData || null);
    setUsers(Array.isArray(userData) ? userData : []);
  };

  useEffect(() => {
    if (loading || !token || !turmaId) {
      return;
    }

    (async () => {
      try {
        await load();
      } catch (err) {
        setError(err.message || "Falha ao carregar os alunos da turma");
      } finally {
        setLoadingData(false);
      }
    })();
  }, [loading, token, turmaId]);

  const students = useMemo(() => {
    return users.filter((item) => item.profile === "ALUNO");
  }, [users]);

  const assignedStudents = useMemo(() => {
    return Array.isArray(turma?.alunos) ? turma.alunos : [];
  }, [turma]);

  const availableStudents = useMemo(() => {
    const assignedIds = new Set(assignedStudents.map((item) => String(item.id)));
    return students.filter((item) => !assignedIds.has(String(item.id)));
  }, [students, assignedStudents]);

  useEffect(() => {
    if (!alunoId && availableStudents.length > 0) {
      setAlunoId(String(availableStudents[0].id));
    }
  }, [availableStudents, alunoId]);

  const refresh = async () => {
    const turmaData = await turmaService.getById(turmaId, token);
    const userData = await userService.list(token);
    setTurma(turmaData || null);
    setUsers(Array.isArray(userData) ? userData : []);
  };

  const handleAddAluno = async () => {
    if (!alunoId) {
      setError("Selecione um aluno");
      return;
    }

    try {
      setBusy(true);
      setError("");
      await turmaService.addAluno(turmaId, alunoId, token);
      await refresh();
      setAlunoId("");
    } catch (err) {
      setError(err.message || "Falha ao adicionar aluno");
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveAluno = async (id) => {
    try {
      setBusy(true);
      setError("");
      await turmaService.removeAluno(turmaId, id, token);
      await refresh();
    } catch (err) {
      setError(err.message || "Falha ao remover aluno");
    } finally {
      setBusy(false);
    }
  };

  const handleGenerateMatriculas = async () => {
    try {
      setBusy(true);
      setError("");
      await turmaService.gerarMatriculas(turmaId, token);
      await refresh();
    } catch (err) {
      setError(err.message || "Falha ao gerar matrículas");
    } finally {
      setBusy(false);
    }
  };

  if (loading || loadingData) {
    return <p>Carregando...</p>;
  }

  if (!user || (user.profile !== "PROFESSOR" && user.profile !== "ADMIN")) {
    return <p>Sem permissão para acessar esta página.</p>;
  }

  return (
    <AppShell user={user} onLogout={logout}>
      <section>
        <h1>Gerenciar alunos da turma</h1>

        <p>
          <strong>Turma:</strong> {turma?.nome || "-"}
        </p>
        <p>
          <strong>Disciplina:</strong> {turma?.disciplina?.nome || "-"}
        </p>
        <p>
          <strong>Semestre:</strong> {turma?.semestre?.nome || "-"}
        </p>

        <div>
          <Button type="button" onClick={() => router.push(`/turmas/${turmaId}`)}>
            Voltar para edição
          </Button>
          {" "}
          <Button type="button" onClick={handleGenerateMatriculas} disabled={busy}>
            {busy ? "Processando..." : "Gerar matrículas"}
          </Button>
        </div>

        <hr />

        <h2>Adicionar aluno</h2>
        <label>
          <span>Aluno</span>
          <select value={alunoId} onChange={(event) => setAlunoId(event.target.value)}>
            <option value="">Selecione</option>
            {availableStudents.map((item) => (
              <option key={item.id} value={item.id}>
                {item.username} - {item.email}
              </option>
            ))}
          </select>
        </label>
        {" "}
        <Button type="button" onClick={handleAddAluno} disabled={busy || availableStudents.length === 0}>
          Adicionar
        </Button>

        {error ? <p>{error}</p> : null}

        <h2>Alunos vinculados</h2>

        <Table
          headers={["ID", "Usuário", "Email", "Ações"]}
          isEmpty={assignedStudents.length === 0}
          emptyMessage="Nenhum aluno vinculado"
        >
          {assignedStudents.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.username}</td>
              <td>{item.email}</td>
              <td>
                <Button
                  type="button"
                  onClick={() => handleRemoveAluno(item.id)}
                  disabled={busy}
                >
                  Remover
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </section>
    </AppShell>
  );
}
