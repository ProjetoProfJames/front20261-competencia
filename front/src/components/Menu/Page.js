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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null; 

  return (
    <nav style={{ padding: "15px", backgroundColor: "#f4f4f4", borderBottom: "2px solid #ccc", display: "flex", gap: "20px", alignItems: "center" }}>
      <strong style={{ color: "#333" }}>Olá, {user.username}</strong>
      
      <Link href="/" style={{ color: "blue", textDecoration: "none" }}>Home</Link>
      
      {user.profile === "ADMIN" && (
        <Link href="/usuarios" style={{ color: "blue", textDecoration: "none" }}>Usuários</Link>
      )}
      
      {(user.profile === "ADMIN" || user.profile === "COORDENADOR") && (
      <>
        <Link href="/locais" style={{ color: "blue", textDecoration: "none" }}>Locais</Link>
        <Link href="/cursos" style={{ color: "blue", textDecoration: "none" }}>Cursos</Link>
        <Link href="/periodos" style={{ color: "blue", textDecoration: "none" }}>Períodos Letivos</Link>
        <Link href="/turmas" style={{ color: "blue", textDecoration: "none" }}>Turmas</Link>
      </>
    )}

      <button 
        onClick={handleLogout} 
        style={{ marginLeft: "auto", padding: "5px 15px", cursor: "pointer", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "4px" }}
      >
        Logout
      </button>
    </nav>
  );
       }
