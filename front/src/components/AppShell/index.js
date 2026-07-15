'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearStoredAuth, getStoredAuth } from "@/lib/api";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = getStoredAuth();
  const user = auth?.user;
  const profile = user?.profile || "";

  const links = [
    { href: "/", label: "Início" },
    { href: "/usuarios", label: "Usuários", allowed: ["ADMIN", "PROFESSOR"] },
    { href: "/locais", label: "Locais", allowed: ["ADMIN", "COORDENADOR", "PROFESSOR", "ALUNO"] },
  ];

  const visibleLinks = links.filter((link) => !link.allowed || link.allowed.includes(profile));

  const handleLogout = () => {
    clearStoredAuth();
    router.replace("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">PIE Manager</p>
          <h1>Gestão de projetos integradores</h1>
        </div>
        <div className="topbar-actions">
          <div className="user-chip">
            <span className="user-name">{user?.username || "Usuário"}</span>
            <span className="user-role">{user?.profile || ""}</span>
          </div>
          <button type="button" className="ghost-button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <nav className="sidebar">
        <div className="sidebar-title">Navegação</div>
        {visibleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link${pathname === link.href ? " active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
}
