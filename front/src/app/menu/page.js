'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import PageLayout from '@/components/PageLayout';
import RoleGuard from '@/components/RoleGuard';

export default function MenuPrincipal() {
  const [userProfile, setUserProfile] = useState(''); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const profileSalvo = localStorage.getItem("userProfile"); 
      
      if (profileSalvo) {
        setUserProfile(profileSalvo);
      }
    }
  }, []);

  const opcoesMenu = [
    { nome: 'Alunos', path: '/users/aluno', roles: ['ADMIN', 'COORDENADOR', 'PROFESSOR'] },
    { nome: 'Professores', path: '/users/professor', roles: ['ADMIN', 'COORDENADOR'] },
    { nome: 'Coordenadores', path: '/users/coordenador', roles: ['ADMIN'] },
    { nome: 'Avaliadores Externos', path: '/users/av_externo', roles: ['ADMIN', 'COORDENADOR'] },
    { nome: 'Locais', path: '/locais', roles: ['ADMIN', 'COORDENADOR',] },
    { nome: 'Cursos', path: '/cursos', roles: ['ADMIN', 'COORDENADOR'] },
    { nome: 'Períodos Letivos', path: '/periodos-letivos', roles: ['ADMIN'] },
    { nome: 'Turmas', path: '/turmas', roles: ['ADMIN', 'COORDENADOR'] },
    { nome: 'Grupos', path: '/grupos', roles: ['ADMIN', 'COORDENADOR', 'PROFESSOR'] },
    { nome: 'Projetos', path: '/projetos', roles: ['ADMIN', 'COORDENADOR', 'PROFESSOR', 'ALUNO'] },
    { nome: 'Avaliação de Projetos', path: '/avaliacao-projetos', roles: ['ADMIN', 'COORDENADOR', 'PROFESSOR', 'AVALIADOR_EXTERNO'] },
  ];

  const menuPermitido = opcoesMenu.filter(opcao => opcao.roles.includes(userProfile));

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };

  return (
      <PageLayout
        title="Sistema de Gestão Competência"
        subtitle="Selecione uma opção abaixo para navegar"
        bottomLeftAction={
          <Button href="/" onClick={handleLogout} className="btn-danger">
            Sair (Logout)
          </Button>
        }
      >
        <div className="grid-menu">
          {menuPermitido.map((opcao, index) => (
            <Button key={index} href={opcao.path}>
              <span className="texto-botao">{opcao.nome}</span>
            </Button>
          ))}
        </div>
      </PageLayout>
    );
  }