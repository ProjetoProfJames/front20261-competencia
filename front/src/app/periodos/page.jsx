'use client';

import React from 'react';
import PeriodosForm from '../../components/periodos/PeriodosForm'; // ajuste o caminho se necessário
import PeriodosList from '../../components/periodos/PeriodosList'; // ajuste o caminho se necessário


export default function PeriodosPage() {
  return (
    <div className="cursos-container"> 
      <h1>Gestão de Períodos Letivos</h1>
     
      
      <div className="cursos-content">
        <PeriodosForm />
        <PeriodosList />
      </div>
    </div>
  );
}