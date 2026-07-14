'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Menu() {
  const [displayName, setDisplayName] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedName = localStorage.getItem("user_display_name");
    const savedRole = localStorage.getItem("user_profile");
    
    if (token) {
      setHasToken(true);
      setUserRole(savedRole || "");
      if (savedName) {
        const cleanName = savedName.includes("@") ? savedName.split("@")[0] : savedName;
        setDisplayName(cleanName);
      } else {
        setDisplayName("Usuário");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_display_name");
    localStorage.removeItem("user_profile");
    window.location.href = "/login";
  };

  if (!hasToken) {
    return null;
  }

  return (
    <nav className="app-menu">
      <div className="app-menu-left">
        <span className="app-menu-brand">PIE Manager</span>
        <div className="app-menu-user">
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>
      <div className="app-menu-links">
        <Link href="/" className="menu-link">Início</Link>
        
        {(userRole === "ADMIN" || userRole === "COORDENADOR" || userRole === "PROFESSOR") && (
          <Link href="/usuarios" className="menu-link">Usuários</Link>
        )}
        
        {(userRole === "ADMIN" || userRole === "COORDENADOR") && (
          <Link href="/locais" className="menu-link">Locais</Link>
        )}
        
        {userRole === "ADMIN" && (
          <Link href="/semestres" className="menu-link">Semestres</Link>
        )}
        
        {userRole === "ADMIN" && (
          <Link href="/cursos" className="menu-link">Cursos</Link>
        )}
        
        {(userRole === "ADMIN" || userRole === "PROFESSOR") && (
          <Link href="/turmas" className="menu-link">Turmas</Link>
        )}
        
        {userRole !== "AVALIADOR_EXTERNO" && (
          <Link href="/projetos" className="menu-link">Projetos</Link>
        )}
        
        {(userRole === "ADMIN" || userRole === "PROFESSOR" || userRole === "AVALIADOR_EXTERNO") && (
          <Link href="/avaliacoes" className="menu-link">Avaliações</Link>
        )}
      </div>
    </nav>
  );
}