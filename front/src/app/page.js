import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <main className="container">
      <h1 className="title">Bem-vindo ao PIE Manager</h1>
      <p className="subtitle">
        Selecione abaixo a operação que deseja realizar no sistema:
      </p>

      <div className="grid">
        <Link href="/projetos" className="card">
          <h2 style={{ color: "var(--primary-color)", marginBottom: "0.5rem" }}>
            Ver Projetos
          </h2>
          <p>Listar e gerenciar os grupos existentes</p>
        </Link>

        <Link href="/grupo" className="card">
          <h2 style={{ color: "#16a34a", marginBottom: "0.5rem" }}>
            Novo Grupo
          </h2>
          <p>Cadastrar um novo Projeto Integrador</p>
        </Link>

        <Link href="/avaliacoes" className="card">
          <h2 style={{ color: "#9333ea", marginBottom: "0.5rem" }}>
            Avaliações
          </h2>
          <p>Lançar notas e comentários aos projetos</p>
        </Link>
      </div>
    </main>
  );
}
