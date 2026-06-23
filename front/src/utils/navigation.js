export const NAVIGATION_ITEMS = [
    { href: '/menu', label: 'Menu', roles: ['ALUNO', 'PROFESSOR', 'COORDENADOR', 'AVALIADOR_EXTERNO', 'ADMIN'] },
    { href: '/turmas', label: 'Turmas', roles: ['ALUNO', 'PROFESSOR', 'COORDENADOR', 'AVALIADOR_EXTERNO', 'ADMIN'] },
    { href: '/locais', label: 'Locais', roles: ['COORDENADOR', 'ADMIN'] },
    { href: '/usuarios', label: 'Usuários', roles: ['PROFESSOR', 'ADMIN'] },
    { href: '/semestres', label: 'Semestres', roles: ['ADMIN'] },
    { href: '/cursos', label: 'Cursos', roles: ['ADMIN'] },
    { href: '/grupos', label: 'Grupos', roles: ['ADMIN'] },
];

export function getNavigationItems(profile) {
    if (!profile) {
        return [];
    }

    return NAVIGATION_ITEMS.filter((item) => item.roles.includes(profile));
}