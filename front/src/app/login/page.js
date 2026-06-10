'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { apiRequest } from "@/lib/api";
import { getSession, setSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getSession();

    if (session?.accessToken) {
      router.replace("/");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((currentCredentials) => ({ ...currentCredentials, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!credentials.email.trim()) {
      validationErrors.email = "Informe o email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email.trim())) {
      validationErrors.email = "Informe um email válido.";
    }

    if (!credentials.password) {
      validationErrors.password = "Informe a senha.";
    }

    return validationErrors;
  };

  const authenticate = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setStatus(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: {
          email: credentials.email.trim(),
          password: credentials.password,
        },
      });

      setSession(data);
      router.replace("/");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const loadBootstrap = async () => {
    setStatus(null);
    setLoading(true);

    try {
      await apiRequest("/public/bootstrap", { method: "POST" });
      setStatus({
        type: "success",
        message: "Dados iniciais preparados. Use admin@unisales.br com a senha admin@123.",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <h1>Entrar</h1>
        <p>Acesse o PIE Manager com seu email institucional.</p>

        {status && <div className={`status status-${status.type}`}>{status.message}</div>}

        <form onSubmit={authenticate}>
          <div className="content-grid">
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />
            <FormInput
              label="Senha"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <Button type="button" variant="secondary" onClick={loadBootstrap} disabled={loading}>
              Inicializar dados
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
