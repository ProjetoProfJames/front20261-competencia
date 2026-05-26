'use client'; 

import '../global.css';
import Button from '@/components/Button';

export default function MenuPrincipal() {
  const opcoesMenu = [
    { nome: 'Alunos', path: '/alunos'},
    { nome: 'Professores', path: '/professores'},
    { nome: 'Locais', path: '/locais'},
    { nome: 'Cursos', path: '/cursos'},
    { nome: 'Períodos Letivos', path: '/periodos-letivos'},
    { nome: 'Turmas', path: '/turmas'},
    { nome: 'Grupos', path: '/grupos'},
    { nome: 'Avaliação de Projetos', path: '/avaliacao-projetos'},
  ];

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };

  return (
    <div className="container-menu">
      <div className="top-right-actions">
        <Button href="/cadastro" className="btn-secondary">
          Cadastrar Usuário
        </Button>
      </div>

      <div className="bottom-left-actions">
        <Button href="/" onClick={handleLogout} className="btn-danger">
          Sair (Logout)
        </Button>
      </div>

      <header className="header-menu">
        <h1>Sistema de Gestão Competência</h1>
        <p>Selecione uma opção abaixo para navegar</p>
      </header>

      <main className="grid-menu">
        {opcoesMenu.map((opcao, index) => (
          <Button href={opcao.path} key={index}>
            <span className="texto-botao">{opcao.nome}</span>
          </Button>
        ))}
      </main>
    </div>
  );
}