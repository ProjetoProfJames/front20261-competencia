'use client';
import RotaProtegida from '@/app/framework/components/RotaProtegida';

export default function MenuLayout({ children }) {
  return (
    <RotaProtegida>
      {children}
    </RotaProtegida>
  );
}
