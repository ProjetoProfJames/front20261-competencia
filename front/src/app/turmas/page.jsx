'use client';

import React, { useState } from 'react';
import TurmasForm from '../../components/turmas/TurmasForm';
import TurmasList from '../../components/turmas/TurmasList';

export default function TurmasPage() {
  const [turmaParaEditar, setTurmaParaEditar] = useState(null);

  return (
    <div className="container-crud">
      <TurmasForm 
        turmaEditando={turmaParaEditar} 
        limparEdicao={() => setTurmaParaEditar(null)} 
      />
      <TurmasList 
        aoClicarEmEditar={(turma) => {
          setTurmaParaEditar(turma);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    </div>
  );
}