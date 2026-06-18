"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import { addSessionListener, clearSession, getSession, hasAnyProfile } from "@/lib/auth";

const navigationLinks = [
  { href: "/", label: "Início" },
  { href: "/usuarios", label: "Usuários", profiles: ["ADMIN", "PROFESSOR"] },
  { href: "/locais", label: "Locais" },
  { href: "/cursos", label: "Cursos" },
  { href: "/periodos-letivos", label: "Períodos Letivos" },
  { href: "/turmas", label: "Turmas" },
  { href: "/grupos-projeto", label: "Grupos" },
  { href: "/avaliacoes-projetos", label: "Avaliações" },
];

export default function AuthenticatedLayout({ children, requiredProfiles = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSessionState] = useState(null);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      const currentSession = getSession();

      if (!currentSession?.accessToken || !currentSession?.user) {
        clearSession();
        router.replace("/login");
        return;
      }

      setSessionState(currentSession);
      setCheckedSession(true);
    };

    syncSession();
    return addSessionListener(syncSession);
  }, [router]);

  const visibleLinks = useMemo(() => {
    return navigationLinks.filter((link) => hasAnyProfile(session?.user, link.profiles));
  }, [session]);

  const handleLogout = () => {
    clearSession();
    router.replace("/login");
  };

  if (!checkedSession) {
    return (
      <div className="login-page">
        <div className="login-panel">
          <p>Carregando sessão...</p>
        </div>
      </div>
    );
  }

  const user = session.user;
  const allowed = hasAnyProfile(user, requiredProfiles);

  return (
    <div className="auth-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          PIE Manager
        </Link>
        <nav className="nav-links">
          {visibleLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                className={`nav-link${active ? " nav-link-active" : ""}`}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="user-menu">
          <div className="user-summary">
            <strong>{user.username}</strong>
            <span>{user.profile}</span>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>
      <main className="page-container">
        {allowed ? (
          children
        ) : (
          <section className="panel access-denied">
            <div className="page-title">
              <h1>Acesso não autorizado</h1>
              <p>Seu perfil não possui permissão para acessar esta funcionalidade.</p>
            </div>
            <Link className="button button-secondary" href="/">
              Voltar ao início
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
