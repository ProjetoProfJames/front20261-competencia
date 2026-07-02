'use client';

import React, { useState } from 'react';
import PeriodosForm from '../../components/periodos/PeriodosForm';
import PeriodosList from '../../components/periodos/PeriodosList';

export default function PeriodosPage() {
  const [periodoParaEditar, setPeriodoParaEditar] = useState(null);

  return (
    <div className="container-crud" style={{ padding: '20px' }}>
      <h1>Gestão de Períodos Letivos</h1>
      
      <PeriodosForm 
        periodoEditando={periodoParaEditar} 
        limparEdicao={() => setPeriodoParaEditar(null)} 
      />
      
      <PeriodosList 
        aoClicarEmEditar={(periodo) => {
          setPeriodoParaEditar(periodo);
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela pro form
        }} 
      />
    </div>
  );
}