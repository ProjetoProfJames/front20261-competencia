'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Menu() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [pathname]);

  if (pathname === "/login") return null;
  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const perfil = (user.profile || user.perfil || user.role || "").toUpperCase();

  const linkStyle = { color: "blue", textDecoration: "none" };

  return (
    <nav style={{
      padding: "15px",
      backgroundColor: "#f4f4f4",
      borderBottom: "2px solid #ccc",
      display: "flex",
      gap: "20px",
      alignItems: "center",
      flexWrap: "wrap",
    }}>
      <strong style={{ color: "#333" }}>Olá, {user.username}</strong>

      <Link href="/" style={linkStyle}>Home</Link>

      {perfil === "ADMIN" && (
        <Link href="/usuarios" style={linkStyle}>Usuários</Link>
      )}

      {(perfil === "ADMIN" || perfil === "COORDENADOR") && (
        <>
          <Link href="/locais" style={linkStyle}>Locais</Link>
          <Link href="/cursos" style={linkStyle}>Cursos</Link>
          <Link href="/periodos" style={linkStyle}>Períodos Letivos</Link>
          <Link href="/disciplinas" style={linkStyle}>Disciplinas</Link>
        </>
      )}

      {(perfil === "ADMIN" || perfil === "COORDENADOR" || perfil === "PROFESSOR") && (
        <Link href="/turmas" style={linkStyle}>Turmas</Link>
      )}

      {/* Grupos de Projeto: visível para todos os perfis autenticados */}
      <Link href="/grupo" style={linkStyle}>Grupos de Projeto</Link>

      <button
        onClick={handleLogout}
        style={{
          marginLeft: "auto",
          padding: "5px 15px",
          cursor: "pointer",
          backgroundColor: "#ff4d4d",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Logout
      </button>
    </nav>
  );
}
