'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppShell({ user, onLogout, children }) {
  const router = useRouter();
  const role = user?.profile || "";

  const canAccessCursos = role === "ADMIN";
  const canAccessSemestres = role === "ADMIN";
  const canAccessTurmas = role === "PROFESSOR" || role === "ADMIN";

  const logout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    localStorage.removeItem("API-KEY");
    localStorage.removeItem("USER");
    router.replace("/login");
  };

  return (
    <main>
      <section>{children}</section>
    </main>
  );
}
