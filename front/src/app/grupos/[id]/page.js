"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import GrupoForm from "../../../components/GrupoForm";
import { obterGrupoPorId, atualizarGrupo } from "../../../utils/api";

export default function EditGrupoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [grupo, setGrupo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const g = await obterGrupoPorId(id);
      setGrupo(g);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSaved(data) {
    const res = await atualizarGrupo(id, data);
    if (res) {
      alert('Grupo atualizado');
      router.push('/grupos');
    } else {
      alert('Erro ao atualizar');
    }
  }

  if (loading) return <div>Carregando...</div>;
  if (!grupo) return <div>Grupo não encontrado</div>;

  return (
    <div>
      <h1>Editar Grupo {id}</h1>
      <GrupoForm initialData={grupo} onSaved={handleSaved} />
    </div>
  );
}
