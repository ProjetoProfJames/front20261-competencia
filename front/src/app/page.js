"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { getCurrentUser, hasAnyProfile } from "@/lib/auth";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const canViewUsers = hasAnyProfile(user, ["ADMIN", "PROFESSOR"]);
  const canManageLocais = hasAnyProfile(user, ["ADMIN", "COORDENADOR"]);

  return (
    <AuthenticatedLayout>
      <section className="page-header">
        <div className="page-title">
          <h1>Início</h1>
          <p>Gerencie os cadastros disponíveis conforme as permissões do seu perfil.</p>
        </div>
      </section>

      <section className="dashboard-grid">
        {canViewUsers && (
          <div className="dashboard-card">
            <h2>Usuários</h2>
            <p>Liste usuários, atualize dados e mantenha novos cadastros quando autorizado.</p>
            <Link className="button button-primary" href="/usuarios">
              Acessar usuários
            </Link>
          </div>
        )}
        <div className="dashboard-card">
          <h2>Locais</h2>
          <p>
            Consulte os locais cadastrados para apresentações de projetos
            {canManageLocais ? " e mantenha a lista atualizada." : "."}
          </p>
          <Link className="button button-primary" href="/locais">
            Acessar locais
          </Link>
        </div>
      </section>
    </AuthenticatedLayout>
  );
}
