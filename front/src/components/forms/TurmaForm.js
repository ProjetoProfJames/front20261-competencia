'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { useSession } from "@/hooks/useSession";
import { turmaService } from "@/services/turmaService";
import { cursoService } from "@/services/cursoService";
import { semestreService } from "@/services/semestreService";
import { userService } from "@/services/userService";
import { disciplinaService } from "@/services/disciplinaService";

export default function TurmaForm({ id = null }) {
  const router = useRouter();
  const isEditing = Boolean(id);
  const { loading, token, user } = useSession(["PROFESSOR", "ADMIN"]);
  const [form, setForm] = useState({
    nome: "",
    cursoIds: [],
    disciplinaId: "",
    semestreId: "",
    professorIds: [],
  });
  const [cursos, setCursos] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading || !token) {
      return;
    }

    async function load() {
      try {
        const [cursoList, semestreList, disciplinaList, usuarioList, turma] = await Promise.all([
          cursoService.list(token),
          semestreService.list(token),
          disciplinaService.list(token),
          userService.list(token),
          isEditing ? turmaService.getById(id, token) : Promise.resolve(null),
        ]);

        setCursos(cursoList || []);
        setSemestres(semestreList || []);
        setDisciplinas(disciplinaList || []);
        setUsuarios(usuarioList || []);

        if (turma) {
          setForm({
            nome: turma.nome || "",
            cursoIds: Array.isArray(turma.cursos) ? turma.cursos.map((item) => String(item.id)) : [],
            disciplinaId: turma.disciplina?.id ? String(turma.disciplina.id) : "",
            semestreId: turma.semestre?.id ? String(turma.semestre.id) : "",
            professorIds: Array.isArray(turma.professores)
              ? turma.professores.map((item) => String(item.id))
              : [],
          });
        }
      } catch (err) {
        setError(err.message || "Falha ao carregar o formulário");
      } finally {
        setLoadingForm(false);
      }
    }

    load();
  }, [loading, token, id, isEditing]);

  const eligibleUsers = useMemo(
    () =>
      usuarios.filter((item) =>
        ["ADMIN", "COORDENADOR", "PROFESSOR"].includes(item.profile)
      ),
    [usuarios]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleMultipleChange = (field) => (event) => {
    const values = Array.from(event.target.selectedOptions).map((option) => option.value);
    setForm((current) => ({ ...current, [field]: values }));
  };

  const validate = () => {
    if (!form.nome.trim()) {
      return "Informe o nome da turma";
    }

    if (form.cursoIds.length === 0) {
      return "Selecione ao menos um curso";
    }

    if (!form.disciplinaId) {
      return "Selecione a disciplina";
    }

    if (!form.semestreId) {
      return "Selecione o período";
    }

    if (form.professorIds.length === 0) {
      return "Selecione ao menos um professor";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    const payload = {
      nome: form.nome.trim(),
      cursoIds: form.cursoIds.map(Number),
      disciplinaId: Number(form.disciplinaId),
      semestreId: Number(form.semestreId),
      professorIds: form.professorIds.map(Number),
    };

    try {
      if (isEditing) {
        await turmaService.update(id, payload, token);
      } else {
        await turmaService.create(payload, token);
      }

      router.push("/turmas");
    } catch (err) {
      setError(err.message || "Não foi possível salvar a turma");
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingForm) {
    return <p>Carregando...</p>;
  }

  if (!user || (user.profile !== "PROFESSOR" && user.profile !== "ADMIN")) {
    return <p>Sem permissão para acessar este formulário.</p>;
  }

  return (
    <section>
      <h1>{isEditing ? "Editar turma" : "Nova turma"}</h1>

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Nome"
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <label>
          <span>Cursos</span>
          <select
            multiple
            size="6"
            value={form.cursoIds}
            onChange={handleMultipleChange("cursoIds")}
            required
          >
            {cursos.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Disciplina</span>
          <select
            name="disciplinaId"
            value={form.disciplinaId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {disciplinas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome} - {item.cursoNome}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Período</span>
          <select
            name="semestreId"
            value={form.semestreId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {semestres.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Professores</span>
          <select
            multiple
            size="6"
            value={form.professorIds}
            onChange={handleMultipleChange("professorIds")}
            required
          >
            {eligibleUsers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.username} - {item.email} ({item.profile})
              </option>
            ))}
          </select>
        </label>

        {error ? <p>{error}</p> : null}

        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
        {" "}
        <Button type="button" onClick={() => router.push("/turmas")}>
          Voltar
        </Button>
      </form>
    </section>
  );
}
