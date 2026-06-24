"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../framework/components/Layouts/Container";
import Col from "../framework/components/Layouts/Col";
import MenuCard from "@/app/framework/components/MenuCard";
import { obterRole } from "@/utils/api/Auth";

export default function Menu() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(obterRole());
  }, []);

  const menuItems = [
    {
      id: "users",
      title: "Usuários",
      description: "Gerencie os usuários do sistema, altere perfis de acesso e permissões.",
      icon: "👥",
      path: "/menu/users",
      allowedRoles: ["ADMIN"]
    },
    {
      id: "turmas",
      title: "Turmas",
      description: "Organize as turmas de alunos, vincule cursos e professores.",
      icon: "📚",
      path: "/menu/turmas"
    },
    {
      id: "projetos",
      title: "Projetos",
      description: "Cadastre, gerencie e avalie os projetos integradores de extensão.",
      icon: "💡",
      path: "/menu/projetos"
    },
    {
      id: "locais",
      title: "Locais",
      description: "Controle as salas e laboratórios disponíveis para apresentações.",
      icon: "📍",
      path: "/menu/locais",
      allowedRoles: ["ADMIN", "COORDENADOR"]
    },
    {
      id: "cursos",
      title: "Cursos",
      description: "Cadastre e organize as grades curriculares dos cursos da instituição.",
      icon: "🏫",
      path: "/menu/cursos"
    },
    {
      id: "periodos-letivos",
      title: "Períodos Letivos",
      description: "Configure os semestres, anos acadêmicos e calendários letivos.",
      icon: "📅",
      path: "/menu/periodos-letivos"
    }
  ];

  const visibleItems = menuItems.filter(item => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(role);
  });

  return (
    <div style={{
      minHeight: "calc(100vh - 80px)",
      background: "radial-gradient(circle at 5% 5%, rgba(72, 32, 233, 0.03) 0%, transparent 35%), radial-gradient(circle at 95% 95%, rgba(242, 125, 170, 0.03) 0%, transparent 35%)",
      padding: "3rem 1.5rem"
    }}>
      <Container>
        <Col>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{
              fontFamily: "var(--font-family, sans-serif)",
              fontSize: "2.25rem",
              fontWeight: "var(--font-weight-bold, 700)",
              color: "var(--primary-color)",
              marginBottom: "0.5rem"
            }}>
              Painel de Controle
            </h1>
            <p style={{
              fontFamily: "var(--font-family, sans-serif)",
              fontSize: "1.1rem",
              color: "#718096"
            }}>
              Selecione uma das opções abaixo para gerenciar o sistema
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            width: "100%"
          }}>
            {visibleItems.map((item) => (
              <MenuCard
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                onClick={() => router.push(item.path)}
              />
            ))}
          </div>
        </Col>
      </Container>
    </div>
  );
}
