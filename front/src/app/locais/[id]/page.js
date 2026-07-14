"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Menu from "@/components/Menu";
import { fetchLocationById, editLocation } from "@/services/locationsApi";

const EditLocationPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [fields, setFields] = useState({ numero: "" });

  const loadLocation = async () => {
    try {
      const { data } = await fetchLocationById(id);
      setFields({ numero: data.numero });
    } catch (err) {
      alert("Erro ao carregar local.");
    }
  };

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    if (!fields.numero.trim()) {
      alert("Informe o nome do local.");
      return;
    }
    try {
      await editLocation(id, fields);
      router.push("/locais");
    } catch (err) {
      alert("Erro ao atualizar local.");
    }
  };

  useEffect(() => {
    loadLocation();
  }, []);

  return (
    <div className="page-wrapper">
      <Menu />
      <div className="page-content">
        <div className="form-card">
          <h1>Editar Local</h1>
          <div className="form-group">
            <label>Nome do local</label>
            <input
              placeholder="Nome do local"
              name="numero"
              value={fields.numero}
              onChange={onFieldChange}
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={onSave}>
              Salvar
            </button>
            <button className="btn btn-outline" onClick={() => router.push("/locais")}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLocationPage;
