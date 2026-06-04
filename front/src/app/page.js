'use client';
import { useEffect, useState } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "100%", margin: "2rem 0" }}>
        <h1>Bem-vindo ao PIE Manager</h1>
        <p>Utilize o menu superior para navegar pelas opções do sistema.</p>
      </div>
    </div>
  );
}