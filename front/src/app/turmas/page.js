'use client'

import { useEffect } from 'react'
import LayoutComponent from '@/components/Layout'
import { authService } from '@/services/authService'

export default function TurmasPage() {
  useEffect(() => {
    const user = authService.getUser()
    if (!user || user.profile !== 'PROFESSOR') {
      window.location.href = '/'
    }
  }, [])

  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Turmas</h1>
      </div>

      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', textAlign: 'center', color: 'var(--gray-600)' }}>
        <p style={{ marginBottom: '16px' }}>Página de turmas em desenvolvimento</p>
        <p style={{ fontSize: '0.9rem' }}>Aqui será possível visualizar, criar e gerenciar turmas</p>
      </div>
    </LayoutComponent>
  )
}