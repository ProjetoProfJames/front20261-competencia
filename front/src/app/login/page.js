'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { apiRequest, readSession, saveSession } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  useEffect(() => {
    const session = readSession();

    if (session?.token) {
      router.replace("/");
    }
  }, [router]);

  const authenticate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setNotice("");

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: {
          email: user.email.trim().toLowerCase(),
          password: user.password,
        },
      });

      saveSession({
        tokenType: data.tokenType,
        token: data.accessToken,
        expiresIn: data.expiresIn,
        user: data.user,
      });

      router.replace("/");
    } catch (error) {
      setNotice(error.message || "Falha ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  const loadBootstrap = async () => {
    setLoading(true);
    setNotice("");

    try {
      await apiRequest("/api/public/bootstrap", {
        method: "POST",
      });

      setNotice("Bootstrap executado com sucesso");
    } catch (error) {
      setNotice(error.message || "Erro ao carregar bootstrap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-card__brand">
          <h1>PIE Manager</h1>
        </div>

        <form className="auth-form" onSubmit={authenticate}>
          <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} placeholder="voce@exemplo.com" required />
          <FormInput label="Senha" type="password" name="password" value={user.password} onChange={handleChange} placeholder="Sua senha" required />

          {notice ? <div className="notice-box">{notice}</div> : null}

          <div className="auth-actions">
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
