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
  getProfile: () => {
    const user = authService.getUser()
    if (!user || !user.profile) return null

    return typeof user.profile === 'string' ? user.profile : (user.profile.name || user.profile)
  },

=======
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
>>>>>>> 24ac3991845d4c5ce5f63db6a4b26d0b545cccd9
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  hasPermission: (requiredProfiles) => {
<<<<<<< HEAD
    const profile = authService.getProfile()
    if (!profile) return false
    return requiredProfiles.includes(profile)
=======
<<<<<<< HEAD
    const user = authService.getUser()
    if (!user || !user.profile) return false
    return requiredProfiles.includes(user.profile)
>>>>>>> 24ac3991845d4c5ce5f63db6a4b26d0b545cccd9
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
<<<<<<< HEAD
    return authService.getProfile() === 'AVALIADOR_EXTERNO'
=======
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
>>>>>>> 24ac3991845d4c5ce5f63db6a4b26d0b545cccd9
  },
}
