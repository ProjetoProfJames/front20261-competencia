'use client'
import LayoutComponent from '@/components/Layout'
import { authService } from '@/services/authService'
import Link from 'next/link'

function ShortcutCard({ href, title, description }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
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
        <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>{title}</h3>
        <p style={{ color: 'var(--gray-600)' }}>{description}</p>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const user = authService.getUser()

  const showUsers = authService.hasPermission(['ADMIN', 'PROFESSOR'])
  const showLocals = authService.hasPermission(['ADMIN', 'COORDENADOR', 'PROFESSOR'])
  const showCourses = authService.hasPermission(['ADMIN', 'COORDENADOR'])
  const showTurmas = authService.hasPermission(['PROFESSOR'])
  const showPeriods = authService.hasPermission(['ADMIN', 'COORDENADOR'])
  const showClasses = authService.hasPermission(['PROFESSOR'])

  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Bem-vindo, {user?.username}!</h1>
      </div>

      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ marginBottom: '24px' }}>Acesso Rapido</h2>

        <div className="grid grid-cols-2">
          {showLocals && (
            <ShortcutCard
              href="/locais"
              title="Locais"
              description="Gerenciar locais de apresentacao"
            />
          )}

          {showUsers && (
            <ShortcutCard
              href="/usuarios"
              title="Usuarios"
              description="Gerenciar usuarios do sistema"
            />
          )}

          {showCourses && (
            <ShortcutCard
              href="/cursos"
              title="Cursos"
              description="Gerenciar cursos"
            />
          )}

          {showPeriods && (
            <ShortcutCard
              href="/periodos-letivos-letivos-letivos"
              title="Periodos Letivos"
              description="Gerenciar periodos letivos"
            />
          )}

          {showClasses && (
            <ShortcutCard
              href="/turmas"
              title="Turmas"
              description="Gerenciar turmas"
            />
          )}

          <ShortcutCard
            href="/projetos"
            title="Projetos"
            description="Ver projetos integradores"
          />
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
