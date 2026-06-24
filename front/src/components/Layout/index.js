'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { authService } from '@/services/authService'

export default function LayoutComponent({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = authService.getUser()
    if (!userData) {
      window.location.href = '/login'
      return
    }
    setUser(userData)
    setLoading(false)
  }, [])

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja fazer logout?')) {
      authService.logout()
    }
  }

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando...</div>
  }

  const showUsers = authService.hasPermission(['ADMIN', 'PROFESSOR'])
  const showLocals = authService.hasPermission(['ADMIN', 'COORDENADOR', 'PROFESSOR'])
  const showProjects = authService.hasPermission(['ADMIN', 'COORDENADOR', 'PROFESSOR', 'ALUNO', 'AVALIADOR_EXTERNO'])
  const showTurmas = authService.hasPermission(['PROFESSOR'])
  const showCursos = authService.hasPermission(['ADMIN'])
  const showPeriodos = authService.hasPermission(['ADMIN'])

  return (
    <>
      <header>
        <div className="container">
          <Link href="/" className="logo">PIE Manager</Link>
          <nav>
            {showProjects && <Link href="/projetos">Projetos</Link>}
            {showLocals && <Link href="/locais">Locais</Link>}
            {showUsers && <Link href="/usuarios">Usuários</Link>}
            {showTurmas && <Link href="/turmas">Turmas</Link>}
            {showCursos && <Link href="/cursos">Cursos</Link>}
            {showPeriodos && <Link href="/periodos">Periodos</Link>}
          </nav>
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        {children}
      </main>
    </>
  )
}
