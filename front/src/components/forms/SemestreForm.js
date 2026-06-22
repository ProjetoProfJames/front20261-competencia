'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { useSession } from "@/hooks/useSession";
import { semestreService } from "@/services/semestreService";

export default function SemestreForm({ id = null }) {
  const router = useRouter();
  const isEditing = Boolean(id);
  const { loading, token, user } = useSession(["ADMIN"]);
  const [form, setForm] = useState({
    nome: "",
    dataInicio: "",
    dataFim: "",
  });
  const [loadingForm, setLoadingForm] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading || !token) {
      return;
    }

    async function load() {
      try {
        if (isEditing) {
          const semestre = await semestreService.getById(id, token);
          setForm({
            nome: semestre.nome || "",
            dataInicio: semestre.dataInicio || "",
            dataFim: semestre.dataFim || "",
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
      return "Informe o nome do período";
    }

    if (!form.dataInicio) {
      return "Informe a data de início";
    }

    if (!form.dataFim) {
      return "Informe a data de fim";
    }

    if (form.dataFim < form.dataInicio) {
      return "A data de fim deve ser maior ou igual à data de início";
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
      dataInicio: form.dataInicio,
      dataFim: form.dataFim,
    };

    try {
      if (isEditing) {
        await semestreService.update(id, payload, token);
      } else {
        await semestreService.create(payload, token);
      }

      router.push("/semestres");
    } catch (err) {
      setError(err.message || "Não foi possível salvar o período");
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
      <h1>{isEditing ? "Editar período" : "Novo período"}</h1>

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Nome"
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Data de início"
          type="date"
          name="dataInicio"
          value={form.dataInicio}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Data de fim"
          type="date"
          name="dataFim"
          value={form.dataFim}
          onChange={handleChange}
          required
        />

        {error ? <p>{error}</p> : null}

        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
        {" "}
        <Button type="button" onClick={() => router.push("/semestres")}>
          Voltar
        </Button>
      </form>
    </section>
  );
}
