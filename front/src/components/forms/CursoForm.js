'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { useSession } from "@/hooks/useSession";
import { cursoService } from "@/services/cursoService";
import { userService } from "@/services/userService";

export default function CursoForm({ id = null }) {
  const router = useRouter();
  const isEditing = Boolean(id);
  const { loading, token, user } = useSession(["ADMIN"]);
  const [form, setForm] = useState({
    nome: "",
    coordenadorId: "",
    professorIds: [],
  });
  const [users, setUsers] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading || !token) {
      return;
    }

    async function load() {
      try {
        const [userList, curso] = await Promise.all([
          userService.list(token),
          isEditing ? cursoService.getById(id, token) : Promise.resolve(null),
        ]);

        setUsers(userList || []);

        if (curso) {
          setForm({
            nome: curso.nome || "",
            coordenadorId: curso.coordenador?.id ? String(curso.coordenador.id) : "",
            professorIds: Array.isArray(curso.professores)
              ? curso.professores.map((professor) => String(professor.id))
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
      users.filter((item) =>
        ["ADMIN", "COORDENADOR", "PROFESSOR"].includes(item.profile)
      ),
    [users]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfessoresChange = (event) => {
    const values = Array.from(event.target.selectedOptions).map((option) => option.value);
    setForm((current) => ({ ...current, professorIds: values }));
  };

  const validate = () => {
    if (!form.nome.trim()) {
      return "Informe o nome do curso";
    }

    if (!form.coordenadorId) {
      return "Selecione o coordenador";
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
      coordenadorId: Number(form.coordenadorId),
      professorIds: form.professorIds.map(Number),
    };

    try {
      if (isEditing) {
        await cursoService.update(id, payload, token);
      } else {
        await cursoService.create(payload, token);
      }

      router.push("/cursos");
    } catch (err) {
      setError(err.message || "Não foi possível salvar o curso");
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingForm) {
    return <p>Carregando...</p>;
  }

  if (!user || user.profile !== "ADMIN") {
    return <p>Sem permissão para acessar este formulário.</p>;
  }

  return (
    <section>
      <h1>{isEditing ? "Editar curso" : "Novo curso"}</h1>

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
          <span>Coordenador</span>
          <select
            name="coordenadorId"
            value={form.coordenadorId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {eligibleUsers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.username} - {item.email} ({item.profile})
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
            onChange={handleProfessoresChange}
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
        <Button type="button" onClick={() => router.push("/cursos")}>
          Voltar
        </Button>
      </form>
    </section>
  );
}
