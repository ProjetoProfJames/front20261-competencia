'use client'

import LayoutComponent from '@/components/Layout'

export default function PeriodosPage() {
  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Periodos</h1>
      </div>

      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', textAlign: 'center', color: 'var(--gray-600)' }}>
        <p style={{ marginBottom: '16px' }}>Página de periodos em desenvolvimento</p>
        <p style={{ fontSize: '0.9rem' }}>Aqui será possível visualizar, criar e gerenciar periodos</p>
      </div>
    </LayoutComponent>
  )}