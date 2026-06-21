'use client';
import RotaProtegida from '@/app/framework/components/RotaProtegida';

export default function Projetos() {
  return (
    <RotaProtegida roles={['ALUNO', 'PROFESSOR', 'COORDENADOR', 'ADMIN']}>
      <div>Projetos</div>
    </RotaProtegida>
  );
}
