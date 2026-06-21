"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GrupoForm from "../../../components/GrupoForm";
import { criarGrupo } from "../../../utils/api";

export default function NewGrupoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSaved(data) {
    setSaving(true);
    const res = await criarGrupo(data);
    setSaving(false);
    if (res) {
      alert('Grupo criado');
      router.push('/grupos');
    } else {
      alert('Erro ao criar grupo');
    }
  }

  return (
    <div>
      <h1>Novo Grupo</h1>
      <GrupoForm onSaved={handleSaved} />
      {saving && <div>Salvando...</div>}
    </div>
  );
}
