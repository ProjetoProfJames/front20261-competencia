'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getStoredAuth } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (!getStoredAuth()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <AppShell>
      <section className="card">
        <div className="section-header">
          <div>
            <h2>Bem-vindo ao PIE Manager</h2>
            <p>Use o menu para acessar cadastros e gerenciar usuários e locais de apresentação.</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Cadastro de usuários</h3>
            <p>Crie novos usuários, edite perfis e gerencie acessos a partir do painel.</p>
          </div>
          <div className="dashboard-card">
            <h3>Locais de apresentação</h3>
            <p>Cadastre e organize os espaços disponíveis para as bancas e apresentações.</p>
          </div>
          <div className="dashboard-card">
            <h3>Autenticação segura</h3>
            <p>O sistema usa token JWT para controlar o acesso e manter a sessão segura.</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
