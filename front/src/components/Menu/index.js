"use client";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import auth from "@/utils/auth";

export default function Menu() {
  const [user, setUser] = useState(null);
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(location.pathname);

    if (location.pathname === "/login") {
      return;
    }

    const loggedUser = auth.protectPage();

    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  const links = [
    {
      label: "Home",
      href: "/home",
      profiles: [
        "ADMIN",
        "COORDENADOR",
        "PROFESSOR",
        "ALUNO",
        "AVALIADOR_EXTERNO",
      ],
    },
    { label: "Usuarios", href: "/users", profiles: ["ADMIN", "PROFESSOR"] },
    { label: "Locais", href: "/locais", profiles: ["ADMIN", "COORDENADOR"] },
    { label: "Cursos", href: "/cursos", profiles: ["ADMIN", "COORDENADOR"] },
    {
      label: "Semestre",
      href: "/semestres",
      profiles: ["ADMIN", "COORDENADOR"],
    },
    {
      label: "Turma",
      href: "/turmas",
      profiles: ["ADMIN", "COORDENADOR", "PROFESSOR"],
    },
    {
      label: "Grupos",
      href: "/grupos",
      profiles: ["ADMIN", "COORDENADOR", "PROFESSOR", "ALUNO"],
    },
    {
      label: "Disciplinas",
      href: "/disciplinas",
      profiles: ["ADMIN", "COORDENADOR", "PROFESSOR"],
    },
  ];

  if (path === "/login" || !user) {
    return null;
  }

  return (
    <>
      <aside className="sidebar">
        <h2>PIE Manager</h2>
        <nav>
          {links.map((link) => {
            if (link.profiles.includes(user.profile)) {
              return (
                <a
                  className="menu-link"
                  key={link.href}
                  href={link.href}
                  style={{ margin: "5px" }}
                >
                  {link.label}
                </a>
              );
            }
            return null;
          })}
        </nav>
      </aside>
      <header className="topbar">
        <p>Bem vindo, {user.username}</p>
        <Button type="button" onClick={auth.logout}>
          Sair
        </Button>
      </header>
    </>
  );
}
