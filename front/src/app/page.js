"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/framework/components/Button";
import Container from "./framework/components/Layouts/Container";
import Row from "./framework/components/Layouts/Row";
import HeroCard from "@/app/framework/components/HeroCard";
import { verificarToken } from "@/utils/api/Auth";

export default function Home() {
  const router = useRouter();
  const [estaAutenticado, setEstaAutenticado] = useState(false);

  useEffect(() => {
    setEstaAutenticado(verificarToken());
  }, []);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 80px)",
      background: "radial-gradient(circle at 10% 20%, rgba(72, 32, 233, 0.04) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(242, 125, 170, 0.04) 0%, transparent 45%)",
      padding: "2rem"
    }}>
      <Container>
        <HeroCard
          title="PIE Manager"
          description="Gerenciamento de Projetos Integradores de Extensão de forma simples, elegante e eficiente. Acompanhe turmas, oriente projetos e realize avaliações acadêmicas."
          icon="🏫"
        >
          <Row justify="evenly" align="center">
            {estaAutenticado ? (
              <Button onClick={() => router.push("/menu")}>
                Ir para o Painel
              </Button>
            ) : (
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                <Button onClick={() => router.push("/login")}>
                  Entrar no Sistema
                </Button>
                <Button variant="secondary" onClick={() => router.push("/login")}>
                  Cadastrar
                </Button>
              </div>
            )}
          </Row>
        </HeroCard>
      </Container>
    </div>
  );
}
