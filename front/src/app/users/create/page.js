"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "@/components/Menu";
import { registerUser } from "@/services/usersApi";

const NewUserPage = () => {
  const router = useRouter();

  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
    profile: "ALUNO",
  });

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    try {
      await registerUser(fields);
      router.push("/users");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-wrapper">
      <Menu />
      <div className="page-content">
        <div className="form-card">
          <h1>Novo Usuário</h1>

          <div className="form-group">
            <label>Nome</label>
            <input placeholder="Nome" name="username" onChange={onFieldChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input placeholder="Email" name="email" onChange={onFieldChange} />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input placeholder="Senha" type="password" name="password" onChange={onFieldChange} />
          </div>

          <div className="form-group">
            <label>Perfil</label>
            <select name="profile" onChange={onFieldChange}>
              <option value="ADMIN">ADMIN</option>
              <option value="COORDENADOR">COORDENADOR</option>
              <option value="PROFESSOR">PROFESSOR</option>
              <option value="ALUNO">ALUNO</option>
              <option value="AVALIADOR_EXTERNO">AVALIADOR_EXTERNO</option>
            </select>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={onSave}>
              Salvar
            </button>
            <button className="btn btn-outline" onClick={() => router.push("/users")}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUserPage;
