'use client'
import LayoutComponent from '@/components/Layout'

export default function ProjetosPage() {
  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Projetos</h1>
      </div>

      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', textAlign: 'center', color: 'var(--gray-600)' }}>
        <p style={{ marginBottom: '16px' }}>Página de projetos em desenvolvimento</p>
        <p style={{ fontSize: '0.9rem' }}>Aqui será possível visualizar, criar e gerenciar projetos integradores</p>
      </div>
    </LayoutComponent>
  )
}