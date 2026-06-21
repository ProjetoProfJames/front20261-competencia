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

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <main>
      <header>
        <div>
          <strong>{user?.username || user?.email || "Usuário"}</strong>
          {role ? <span> - {role}</span> : null}
        </div>

        <nav>
          {canAccessCursos ? <Link href="/cursos">Cursos</Link> : null}
          {canAccessCursos && canAccessSemestres ? " | " : null}
          {canAccessSemestres ? <Link href="/semestres">Períodos</Link> : null}
          {canAccessSemestres && canAccessTurmas ? " | " : null}
          {canAccessTurmas ? <Link href="/turmas">Turmas</Link> : null}
          {" | "}
          <button type="button" onClick={logout}>Logout</button>
        </nav>

        <div>
          {canAccessCursos ? <Link href="/cursos/novo">Novo curso</Link> : null}
          {" "}
          {canAccessSemestres ? <Link href="/semestres/novo">Novo período</Link> : null}
          {" "}
          {canAccessTurmas ? <Link href="/turmas/novo">Nova turma</Link> : null}
        </div>
      </header>

      <section>{children}</section>
    </main>
  );
}
