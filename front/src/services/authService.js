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

<<<<<<< HEAD
=======
  getProfile: () => {
    const user = authService.getUser()
    if (!user || !user.profile) return null
    // Se profile for um objeto (from Java enum), pega o nome dele
    // Se for string, retorna direto
    return typeof user.profile === 'string' ? user.profile : (user.profile.name || user.profile)
  },

>>>>>>> origin/squad-5
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  hasPermission: (requiredProfiles) => {
<<<<<<< HEAD
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
=======
    const profile = authService.getProfile()
    if (!profile) return false
    return requiredProfiles.includes(profile)
  },

  isAdmin: () => {
    return authService.getProfile() === 'ADMIN'
  },

  isCoordenador: () => {
    return authService.getProfile() === 'COORDENADOR'
  },

  isProfessor: () => {
    return authService.getProfile() === 'PROFESSOR'
  },

  isAluno: () => {
    return authService.getProfile() === 'ALUNO'
  },

  isAvaliadorExterno: () => {
    return authService.getProfile() === 'AVALIADOR_EXTERNO'
>>>>>>> origin/squad-5
  },
}
