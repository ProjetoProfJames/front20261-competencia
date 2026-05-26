'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { api } from "@/services/api";

export default function CadastroPage() {
  const router = useRouter();
  const [user, setUser] = useState({ username: "", email: "", password: "", profile: "ADMIN" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

    const handleRegister = async () => {
        setError("");
        setIsLoading(true);

        try {
        await api.post("/users", user);

        const loginData = await api.post("/auth/login", {
          email: user.email,
          password: user.password
        });
        
        localStorage.setItem("token", loginData.token);

        alert("Cadastro realizado com sucesso!");
        router.push("/menu");
        } catch (err) {
        setError(err.message);
        } finally {
        setIsLoading(false);
        }
    };

  return (
    <main className="main">
      <section className="card">
        <header>
          <h1>Cadastre-se</h1>
        </header>

        {error && <p className="error-message">{error}</p>}

        <FormInput label="Nome de Usuário" type="text" name="username" value={user.username} onChange={handleChange} />
        <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
        <FormInput label="Senha" type="password" name="password" value={user.password} onChange={handleChange} />
        
        <div className="input-group">
          <label>Perfil</label>
          <select name="profile" value={user.profile} onChange={handleChange} className="form-select">
            <option value="ALUNO">Aluno</option>
            <option value="PROFESSOR">Professor</option>
            <option value="COORDENADOR">Coordenador</option>
            <option value="AVALIADOR_EXTERNO">Avaliador Externo</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        
        <div className="actions">
          <Button type="button" onClick={handleRegister}>
            {isLoading ? "Cadastrando..." : "Confirmar Cadastro"}
          </Button>
          
          <Button href="/">Voltar para o Login</Button>
        </div>
      </section>
    </main>
  );
}