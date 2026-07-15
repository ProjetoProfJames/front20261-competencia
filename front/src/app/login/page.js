'use client';

import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { bootstrapData, getStoredAuth, loginUser, setStoredAuth } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootstrapLoading, setBootstrapLoading] = useState(false);
  const [bootstrapMessage, setBootstrapMessage] = useState("");
  const [bootstrapResult, setBootstrapResult] = useState(null);
  const bootstrapPassword = "admin@123";

  useEffect(() => {
    if (getStoredAuth()) {
      router.replace("/");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const authenticate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!user.email || !user.password) {
        throw new Error("Informe e-mail e senha.");
      }

      const auth = await loginUser(user.email, user.password);
      setStoredAuth(auth);
      router.replace("/");
    } catch (err) {
      setError(err.message || "Falha ao autenticar.");
    } finally {
      setLoading(false);
    }
  };

  const initializeBootstrap = async () => {
    setBootstrapLoading(true);
    setError("");
    setBootstrapMessage("");

    try {
      const result = await bootstrapData();
      setBootstrapResult(result);
      setBootstrapMessage(
        result?.adminCreated
          ? "Dados iniciais carregados com sucesso."
          : "Os dados iniciais já existiam e foram reaproveitados."
      );
    } catch (err) {
      setError(err.message || "Não foi possível inicializar os dados.");
      setBootstrapResult(null);
    } finally {
      setBootstrapLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={authenticate}>
        <div className="login-header">
          <div>
            <p className="eyebrow">Acesso ao sistema</p>
            <h1>Entrar no PIE Manager</h1>
          </div>
        </div>
        <p className="login-description">Faça login para gerenciar cadastros e locais de apresentação.</p>
        <FormInput label="E-mail" type="email" name="email" value={user.email} onChange={handleChange} required />
        <FormInput label="Senha" type="password" name="password" value={user.password} onChange={handleChange} required />
        {error ? <p className="error-text">{error}</p> : null}
        <div className="actions-row">
          <Button type="submit" disabled={loading} className="primary-button">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <Button type="button" className="ghost-button" onClick={initializeBootstrap} disabled={bootstrapLoading}>
            {bootstrapLoading ? "Inicializando..." : "Inicializar dados"}
          </Button>
        </div>
        {bootstrapMessage ? <p className="success-text bootstrap-message">{bootstrapMessage}</p> : null}
        {bootstrapResult ? (
          <section className="bootstrap-result" aria-live="polite">
            <div className="bootstrap-result-header">
              <div>
                <p className="eyebrow">Credenciais iniciais</p>
                <h2>Acesso do administrador</h2>
              </div>
              <span className={bootstrapResult.adminCreated ? "status-pill success" : "status-pill muted"}>
                {bootstrapResult.adminCreated ? "Admin criado" : "Admin existente"}
              </span>
            </div>

            <div className="bootstrap-admin-card">
              <div>
                <p className="bootstrap-label">E-mail</p>
                <strong>{bootstrapResult.adminUser?.email || "admin@unisales.br"}</strong>
              </div>
              <div>
                <p className="bootstrap-label">Senha</p>
                <strong>{bootstrapPassword}</strong>
              </div>
            </div>
          </section>
        ) : null}
      </form>
    </div>
  );
}
