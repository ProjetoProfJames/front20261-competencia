'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Menu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  if (!user) {
    return null;
  }

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <div>
        <span>Olá, {user.email}</span>
        <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Logout</button>
      </div>
      <div>
        <Link href="/usuarios" style={{ marginRight: "1rem" }}>Usuários</Link>
        <Link href="/locais">Locais de Apresentação</Link>
      </div>
    </nav>
  );
}