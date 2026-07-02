'use client';

import React from 'react';
import CursosForm from '../../components/cursos/CursosForm';
import CursosList from '../../components/cursos/CursosList';

export default function CursosPage() {
  return (
    <div className="cursos-container">
      <h1>Gestão de Cursos</h1>
      
      <div className="cursos-content">
        <CursosForm />
        <CursosList />
      </div>
    </div>
  );
}