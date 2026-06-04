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
    <div>
      <h1>Bem-vindo ao PIE Manager</h1>
    </div>
  );
}