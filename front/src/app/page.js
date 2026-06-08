"use client";

import Button from "@/app/framework/components/Button";
import FormInput from "@/app/framework/components/FormInput";
import { useRouter } from "next/navigation";
import Container from "./framework/components/Layouts/Container";
import Col from "./framework/components/Layouts/Col"

export default function Home() {
  return (
    <div>
      <Container>
        <Col>
          <h1>
            Bem vindo ao sistema de gestão de Projetos e Avaliações Academicas! 
          </h1>
        </Col>
      </Container>
    </div>
  );
}
