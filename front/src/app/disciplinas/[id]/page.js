'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import DisciplinaForm from "@/components/forms/DisciplinaForm";

import { disciplinaService } from "@/services/disciplinaService";

export default function EditarDisciplinaPage() {
  const params = useParams();
  const router = useRouter();

  const [disciplina, setDisciplina] =
    useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await disciplinaService.getById(
      params.id
    );

    setDisciplina(data);
  }

  async function handleSubmit(data) {
    await disciplinaService.update(
      params.id,
      data
    );

    router.push("/disciplinas");
  }

  if (!disciplina) {
    return <p>Carregando...</p>;
  }

  return (
    <main>
      <h1>Editar Disciplina</h1>

      <DisciplinaForm
        initialData={disciplina}
        onSubmit={handleSubmit}
      />
    </main>
  );
}