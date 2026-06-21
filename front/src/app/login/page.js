'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { login } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    if (token) {
      try {
        const storedUser = rawUser ? JSON.parse(rawUser) : null;
        router.replace(storedUser?.profile === "PROFESSOR" ? "/turmas" : "/cursos");
      } catch {
        router.replace("/cursos");
      }
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!user.email.trim() || !user.password.trim()) {
      setError("Informe email e senha");
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        email: user.email.trim(),
        password: user.password,
      });

      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      router.replace(response.user?.profile === "PROFESSOR" ? "/turmas" : "/cursos");
    } catch (err) {
      setError(err.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  const loadBootstrap = async () => {
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/public/bootstrap", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Falha ao executar o bootstrap");
      }
    } catch (err) {
      setError(err.message || "Falha ao executar o bootstrap");
    }
  };

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Senha"
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />

        {error ? <p>{error}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
        {" "}
        <Button type="button" onClick={loadBootstrap}>
          Bootstrap
        </Button>
      </form>
    </main>
  );
}
