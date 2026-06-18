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
  const canManageAcademic = hasAnyProfile(user, ["ADMIN"]);
  const canManageTurmas = hasAnyProfile(user, ["PROFESSOR"]);
  const canManageGrupos = hasAnyProfile(user, ["PROFESSOR", "COORDENADOR", "ADMIN"]);
  const canEvaluateProjetos = hasAnyProfile(user, ["PROFESSOR", "AVALIADOR_EXTERNO"]);

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
        <div className="dashboard-card">
          <h2>Cursos</h2>
          <p>
            Consulte cursos, coordenadores e professores vinculados
            {canManageAcademic ? " e mantenha novos cadastros." : "."}
          </p>
          <Link className="button button-primary" href="/cursos">
            Acessar cursos
          </Link>
        </div>
        <div className="dashboard-card">
          <h2>Períodos Letivos</h2>
          <p>
            Consulte períodos letivos usados nas turmas
            {canManageAcademic ? " e mantenha datas atualizadas." : "."}
          </p>
          <Link className="button button-primary" href="/periodos-letivos">
            Acessar períodos
          </Link>
        </div>
        <div className="dashboard-card">
          <h2>Turmas</h2>
          <p>
            Consulte turmas vinculadas a cursos, disciplinas e períodos
            {canManageTurmas ? " e mantenha os cadastros da sua área." : "."}
          </p>
          <Link className="button button-primary" href="/turmas">
            Acessar turmas
          </Link>
        </div>
        <div className="dashboard-card">
          <h2>Grupos de Projeto</h2>
          <p>
            Consulte grupos, componentes, orientadores e dados de apresentação
            {canManageGrupos ? " ou cadastre novas formações." : "."}
          </p>
          <Link className="button button-primary" href="/grupos-projeto">
            Acessar grupos
          </Link>
        </div>
        <div className="dashboard-card">
          <h2>Avaliações</h2>
          <p>
            Consulte notas dos projetos apresentados
            {canEvaluateProjetos ? " e registre sua avaliação." : "."}
          </p>
          <Link className="button button-primary" href="/avaliacoes-projetos">
            Acessar avaliações
          </Link>
        </div>
      </section>
    </AuthenticatedLayout>
  );
}
