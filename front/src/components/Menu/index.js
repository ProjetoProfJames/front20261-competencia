'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Menu() {
  const [displayName, setDisplayName] = useState("");
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedName = localStorage.getItem("user_display_name");
    
    if (token) {
      setHasToken(true);
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
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <div>
        <span>Olá, {displayName}</span>
        <button onClick={handleLogout} style={{ marginLeft: "1rem", color: "red", border: "1px solid red", background: "none", padding: "2px 8px", cursor: "pointer", borderRadius: "4px" }}>Logout</button>
      </div>
      <div>
        <Link href="/" style={{ marginRight: "1rem" }}>Início</Link>
        <Link href="/usuarios" style={{ marginRight: "1rem" }}>Usuários</Link>
        <Link href="/locais">Locais de Apresentação</Link>
      </div>
    </nav>
  );
}