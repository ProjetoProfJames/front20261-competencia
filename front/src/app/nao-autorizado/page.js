'use client';
import { useRouter } from 'next/navigation';
import Button from '@/app/framework/components/Button';
import Container from '@/app/framework/components/Layouts/Container';
import Col from '@/app/framework/components/Layouts/Col';
import Row from '@/app/framework/components/Layouts/Row';

export default function NaoAutorizadoPage() {
  const router = useRouter();

  return (
    <Container>
      <Col>
        <h1>403</h1>
        <h2>Acesso Não Autorizado</h2>
        <p>
          Você não tem permissão para acessar esta página.
          Entre em contato com o administrador caso acredite que isso seja um erro.
        </p>
        <Row>
          <Button type="azul" onClick={() => router.push('/menu')}>
            Voltar ao Menu
          </Button>
          <Button type="laranja" onClick={() => router.push('/login')}>
            Fazer Login
          </Button>
        </Row>
      </Col>
    </Container>
  );
}
