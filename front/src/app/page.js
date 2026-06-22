'use client'
import LayoutComponent from '@/components/Layout'
import { authService } from '@/services/authService'
import Link from 'next/link'

export default function HomePage() {
  const user = authService.getUser()

  const showUsers = authService.hasPermission(['ADMIN', 'PROFESSOR'])
  const showLocals = authService.hasPermission(['ADMIN', 'COORDENADOR', 'PROFESSOR'])

  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Bem-vindo, {user?.username}!</h1>
      </div>

      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ marginBottom: '24px' }}>Acesso Rápido</h2>
        
        <div className="grid grid-cols-2">
          {showLocals && (
            <Link href="/locais" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '24px',
                backgroundColor: 'var(--gray-50)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--gray-200)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textDecoration: 'none',
                color: 'inherit'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              }} onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--gray-200)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Locais</h3>
                <p style={{ color: 'var(--gray-600)' }}>Gerenciar locais de apresentação</p>
              </div>
            </Link>
          )}

          {showUsers && (
            <Link href="/usuarios" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '24px',
                backgroundColor: 'var(--gray-50)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--gray-200)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textDecoration: 'none',
                color: 'inherit'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              }} onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--gray-200)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Usuários</h3>
                <p style={{ color: 'var(--gray-600)' }}>Gerenciar usuários do sistema</p>
              </div>
            </Link>
          )}

          <Link href="/projetos" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '24px',
              backgroundColor: 'var(--gray-50)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--gray-200)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textDecoration: 'none',
              color: 'inherit'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--gray-200)'
              e.currentTarget.style.boxShadow = 'none'
            }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Projetos</h3>
              <p style={{ color: 'var(--gray-600)' }}>Ver projetos integradores</p>
            </div>
          </Link>

          <Link href="/turmas" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '24px',
              backgroundColor: 'var(--gray-50)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--gray-200)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textDecoration: 'none',
              color: 'inherit'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--gray-200)'
              e.currentTarget.style.boxShadow = 'none'
            }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Turmas</h3>
              <p style={{ color: 'var(--gray-600)' }}>Gerenciar turmas</p>
            </div>
          </Link>

          <Link href="/cursos" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '24px',
              backgroundColor: 'var(--gray-50)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--gray-200)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textDecoration: 'none',
              color: 'inherit'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--gray-200)'
              e.currentTarget.style.boxShadow = 'none'
            }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Cursos</h3>
              <p style={{ color: 'var(--gray-600)' }}>Gerenciar cursos</p>
            </div>
          </Link>

          <Link href="/periodos" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '24px',
              backgroundColor: 'var(--gray-50)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--gray-200)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textDecoration: 'none',
              color: 'inherit'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--gray-200)'
              e.currentTarget.style.boxShadow = 'none'
            }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Períodos</h3>
              <p style={{ color: 'var(--gray-600)' }}>Gerenciar períodos letivos</p>
            </div>
          </Link>
        </div>

        <div style={{ marginTop: '32px', padding: '16px', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)', borderLeft: '4px solid var(--primary)' }}>
          <p style={{ margin: 0, color: 'var(--gray-700)' }}>
            <strong>Seu perfil:</strong> {user?.profile}
          </p>
        </div>
      </div>
    </LayoutComponent>
  )
}
