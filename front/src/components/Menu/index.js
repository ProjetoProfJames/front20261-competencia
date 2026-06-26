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
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #ccc", flexWrap: "wrap", gap: "1rem" }}>
      <div>
        <span>Olá, {displayName}</span>
        <button onClick={handleLogout} style={{ marginLeft: "1rem", color: "red", border: "1px solid red", background: "none", padding: "2px 8px", cursor: "pointer", borderRadius: "4px" }}>Logout</button>
      </div>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href="/">Início</Link>
        
        {(userRole === "ADMIN" || userRole === "COORDENADOR" || userRole === "PROFESSOR") && (
          <Link href="/usuarios">Usuários</Link>
        )}
        
        {(userRole === "ADMIN" || userRole === "COORDENADOR") && (
          <Link href="/locais">Locais</Link>
        )}
        
        {userRole === "ADMIN" && (
          <Link href="/semestres">Semestres</Link>
        )}
        
        {userRole === "ADMIN" && (
          <Link href="/cursos">Cursos</Link>
        )}
        
        {(userRole === "ADMIN" || userRole === "PROFESSOR") && (
          <Link href="/turmas">Turmas</Link>
        )}
        
        {userRole !== "AVALIADOR_EXTERNO" && (
          <Link href="/projetos">Projetos</Link>
        )}
        
        {(userRole === "ADMIN" || userRole === "PROFESSOR" || userRole === "AVALIADOR_EXTERNO") && (
          <Link href="/avaliacoes">Avaliações</Link>
        )}
      </div>
    </nav>
  );
}