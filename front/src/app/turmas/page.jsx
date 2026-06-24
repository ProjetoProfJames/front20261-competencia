'use client';

import React from 'react';
import TurmasForm from '../../components/turmas/TurmasForm'; // ajuste o caminho se necessário
import TurmasList from '../../components/turmas/TurmasList'; // ajuste o caminho se necessário

export default function TurmasPage() {
  return (
    <div className="cursos-container">
      <h1>Gestão de Turmas</h1>
     
      
      <div className="cursos-content">
        <TurmasForm />
        <TurmasList />
      </div>
    </div>
  );
}