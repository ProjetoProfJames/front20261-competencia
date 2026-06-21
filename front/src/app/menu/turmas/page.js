'use client';
import RotaProtegida from '@/app/framework/components/RotaProtegida';

export default function Turmas() {
  return (
    <RotaProtegida roles={['ALUNO', 'PROFESSOR', 'COORDENADOR', 'ADMIN']}>
      <div>Turmas</div>
    </RotaProtegida>
  );
}
