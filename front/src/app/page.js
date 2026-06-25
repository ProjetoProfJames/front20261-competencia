'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [perfil, setPerfil] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const userProfile = parsedUser.profile || parsedUser.perfil || parsedUser.role || "";
      setPerfil(userProfile.toUpperCase());
    }
  }, []);

  const podeAvaliar = perfil === "PROFESSOR" || perfil === "ROLE_PROFESSOR" || perfil === "AVALIADOR_EXTERNO";

  return (
    <div className="container" style={{ textAlign: "center", paddingTop: "50px", alignItems: "center" }}>
      <h1 style={{ fontSize: "2.5rem", color: "#333", marginBottom: "10px" }}>Bem-vindo ao PIE Manager</h1>
      <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "40px" }}>
        Selecione abaixo a operação que deseja realizar no sistema:
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
        
        <Link href="/projetos" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="card" style={{ width: "250px", padding: "30px", textAlign: "center", cursor: "pointer", border: "1px solid #ddd" }}>
            <h3 style={{ color: "#007bff", marginBottom: "10px" }}>Ver Projetos</h3>
            <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>Listar e gerenciar os grupos existentes</p>
          </div>
        </Link>

        <Link href="/grupo" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="card" style={{ width: "250px", padding: "30px", textAlign: "center", cursor: "pointer", border: "1px solid #ddd" }}>
            <h3 style={{ color: "#28a745", marginBottom: "10px" }}>Novo Grupo</h3>
            <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>Cadastrar um novo Projeto Integrador</p>
          </div>
        </Link>

        {podeAvaliar && (
          <Link href="/avaliacoes" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="card" style={{ width: "250px", padding: "30px", textAlign: "center", cursor: "pointer", border: "1px solid #ddd" }}>
              <h3 style={{ color: "#6f42c1", marginBottom: "10px" }}>Avaliações</h3>
              <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>Lançar notas e comentários aos projetos</p>
            </div>
          </Link>
        )}

      </div>
    </div>
  );
}