'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { useSession } from "@/hooks/useSession";
import { disciplinaService } from "@/services/disciplinaService";
import { cursoService } from "@/services/cursoService";

export default function DisciplinaForm({ id = null }) {
  const router = useRouter();
  const isEditing = Boolean(id);
  const { loading, token, user } = useSession(["ADMIN"]);

  const [form, setForm] = useState({
    nome: "",
    cursoId: "",
  });

  const [cursos, setCursos] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading || !token) {
      return;
    }

    async function load() {
      try {
        const [cursoList, disciplina] = await Promise.all([
          cursoService.list(token),
          isEditing ? disciplinaService.getById(id, token) : Promise.resolve(null),
        ]);

        setCursos(Array.isArray(cursoList) ? cursoList : []);

        if (disciplina) {
          setForm({
            nome: disciplina.nome || "",
            cursoId: disciplina.cursoId ? String(disciplina.cursoId) : "",
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    if (!form.nome.trim()) {
      return "Informe o nome da disciplina";
    }

    if (!form.cursoId) {
      return "Selecione o curso";
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
      cursoId: Number(form.cursoId),
    };

    try {
      if (isEditing) {
        await disciplinaService.update(id, payload, token);
      } else {
        await disciplinaService.create(payload, token);
      }

      router.push("/disciplinas");
    } catch (err) {
      setError(err.message || "Não foi possível salvar a disciplina");
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
      <h1>{isEditing ? "Editar disciplina" : "Nova disciplina"}</h1>

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
          <span>Curso</span>
          <select
            name="cursoId"
            value={form.cursoId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </label>

        {error ? <p>{error}</p> : null}

        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
        {" "}
        <Button type="button" onClick={() => router.push("/disciplinas")}>
          Voltar
        </Button>
      </form>
    </section>
  );
}