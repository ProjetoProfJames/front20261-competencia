'use client';
import RotaProtegida from '@/app/framework/components/RotaProtegida';

export default function Avaliacao() {
  return (
    <RotaProtegida roles={['PROFESSOR', 'AVALIADOR_EXTERNO', 'COORDENADOR', 'ADMIN']}>
      <div>Avaliacao</div>
    </RotaProtegida>
  );
}
