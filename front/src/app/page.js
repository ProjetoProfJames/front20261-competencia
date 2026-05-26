'use client';
import { useState } from "react";
import  Button  from "@/components/Button";
import FormInput from "@/components/FormInput";
import { fetchApi } from "@/services/api";
import { useRouter } from "next/navigation";
import "./global.css";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const authenticate = async () => {
    setError("");
    try {
      const data = await fetchApi("/auth/login", {
        method: "POST",
        body: { email: user.email, password: user.password },
      });

      console.log("Resposta completa da API:", data);

      localStorage.setItem("token", data.token);

      console.log("Autenticado com sucesso!");

      router.push("/menu");

    } catch (err) {
      console.error("Falha no login:", err.message);
      setError(err.message);
    }
  };

    const loadBootstrap = () => {
        fetch("http://localhost:8080/api/public/bootstrap")
            .then((response) => response.json())
            .then((data) => console.log("Bootstrap carregado:", data))
            .catch((error) => console.error("Erro ao carregar Bootstrap:", error));
    };

  return (
    <main className="main">
      <section className="card">
        <header>
            <h1>Login</h1>
        </header>

        {error && <p className="error-message">{error}</p>}

        <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
        <FormInput label="Password" type="password" name="password" value={user.password} onChange={handleChange} />
        
        <div className="actions">
          <Button onClick={authenticate}>Login</Button>
          <Button href="/cadastro" >Cadastrar</Button>
          <Button onClick={loadBootstrap}>Carregar Bootstrap</Button>
        </div>
      </section>
    </main>
  );
}
