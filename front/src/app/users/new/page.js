"use client";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import api from "@/utils/api";
import auth from "@/utils/auth";
import { useEffect, useState } from "react";

export default function UserNewPage() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    profile: "",
  });
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    auth.protectPage(["ADMIN"]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const validar = () => {
    if (!user.username || !user.email || !user.password || !user.profile) {
      setMensagem("Preencha todos os campos");
      return false;
    }

    if (!user.email.includes("@")) {
      setMensagem("Informe um email valido");
      return false;
    }

    if (user.password.length < 6) {
      setMensagem("A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validar()) {
      return;
    }

    try {
      setLoading(true);
      setMensagem("");
      await api.post("/users", user);
      alert("Usuario criado com sucesso");
      location.href = "/users";
    } catch (error) {
      setMensagem(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Novo Usuario</h1>
      {mensagem && <p>{mensagem}</p>}
      <div>
        <FormInput label="Nome" type="text" name="username" value={user.username} onChange={handleChange} required></FormInput>
        <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} required></FormInput>
        <FormInput label="Senha" type="password" name="password" value={user.password} onChange={handleChange} required></FormInput>
        <select name="profile" value={user.profile} onChange={handleChange} required>
          <option value="">Selecione o perfil</option>
          <option value="ADMIN">ADMIN</option>
          <option value="COORDENADOR">COORDENADOR</option>
          <option value="PROFESSOR">PROFESSOR</option>
          <option value="ALUNO">ALUNO</option>
          <option value="AVALIADOR_EXTERNO">AVALIADOR_EXTERNO</option>
        </select>
        <Button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Salvando..." : "Criar Usuario"}
        </Button>
        <Button type="button" onClick={() => location.href = "/users"}>Voltar</Button>
      </div>
    </>
  );
}
