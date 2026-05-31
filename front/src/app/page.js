"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppWorkspace from "@/components/AppWorkspace";
import { clearSession, readSession } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const storedSession = readSession();

    if (!storedSession?.token) {
      router.replace("/login");
      return;
    }

    setSession(storedSession);
  }, [router]);

  if (!session) {
    return (
      <main className="app-loading">
        <div className="app-loading__card">
          <span className="app-loading__eyebrow">PIE Manager</span>
          <h1>Carregando sua área restrita</h1>
          <p>Se você ainda não entrou, será redirecionado para a tela de login.</p>
        </div>
      </main>
    );
  }

  return (
    <AppWorkspace
      session={session}
      onLogout={() => {
        clearSession();
        router.replace("/login");
      }}
    />
  );
}
