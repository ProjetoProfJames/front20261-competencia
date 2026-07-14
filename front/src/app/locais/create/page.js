"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "@/components/Menu";
import { registerLocation } from "@/services/locationsApi";

const NewLocationPage = () => {
  const router = useRouter();
  const [fields, setFields] = useState({ numero: "" });

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
      await registerLocation(fields);
      router.push("/locais");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar local.");
    }
  };

  return (
    <div className="page-wrapper">
      <Menu />
      <div className="page-content">
        <div className="form-card">
          <h1>Novo Local</h1>
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

export default NewLocationPage;
