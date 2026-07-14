'use client';
import { useEffect, useState } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setDisplayName(localStorage.getItem("user_display_name") || "");
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="container">
      <div className="hero-card">
        <div className="hero-eyebrow">PIE Manager</div>
        <h1>{displayName ? `Bem-vindo, ${displayName}` : "Bem-vindo ao PIE Manager"}</h1>
        <p>Utilize o menu superior para navegar no sistema.</p>
      </div>
    </div>
  );
}