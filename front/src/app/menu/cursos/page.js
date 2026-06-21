'use client';
import RotaProtegida from '@/app/framework/components/RotaProtegida';

export default function Cursos() {
  return (
    <RotaProtegida roles={['ADMIN']}>
      <div>Cursos</div>
    </RotaProtegida>
  );
}
