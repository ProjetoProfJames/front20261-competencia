export const authService = {
  getUser: () => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getToken: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  hasPermission: (requiredProfiles) => {
    const user = authService.getUser()
    if (!user || !user.profile) return false
    return requiredProfiles.includes(user.profile)
  },

  isAdmin: () => {
    const user = authService.getUser()
    return user?.profile === 'ADMIN'
  },

  isCoordenador: () => {
    const user = authService.getUser()
    return user?.profile === 'COORDENADOR'
  },

  isProfessor: () => {
    const user = authService.getUser()
    return user?.profile === 'PROFESSOR'
  },

  isAluno: () => {
    const user = authService.getUser()
    return user?.profile === 'ALUNO'
  },

  isAvaliadorExterno: () => {
    const user = authService.getUser()
    return user?.profile === 'AVALIADOR_EXTERNO'
  },
}
