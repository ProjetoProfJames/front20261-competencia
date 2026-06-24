const BASE_URL = 'http://localhost:8080/api';

// Wrapper seguro para localStorage. Em alguns ambientes Node (com a flag
// experimental --localstorage-file ativada via NODE_OPTIONS), o Node cria um
// `globalThis.localStorage` que existe mas não é funcional do lado do
// servidor, fazendo `typeof window === 'undefined'` não ser suficiente para
// detectar o ambiente. Por isso, em vez de checar `window`, testamos se as
// funções de localStorage realmente funcionam antes de usá-las.
const safeStorage = {
  getItem(key) {
    try {
      if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') {
        return null;
      }
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') {
        return;
      }
      localStorage.setItem(key, value);
    } catch {
      // ignora ambientes sem localStorage funcional (ex.: SSR)
    }
  },
  removeItem(key) {
    try {
      if (typeof localStorage === 'undefined' || typeof localStorage.removeItem !== 'function') {
        return;
      }
      localStorage.removeItem(key);
    } catch {
      // ignora ambientes sem localStorage funcional (ex.: SSR)
    }
  },
};

function getToken() {
  return safeStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const msg = data?.message || data?.error || 'Erro na requisição';
    throw new Error(msg);
  }
  return data.data !== undefined ? data.data : data;
}

export const api = {
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  get: (path) => request(path),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export function saveSession(token, user) {
  safeStorage.setItem('token', token);
  safeStorage.setItem('user', JSON.stringify(user));
}

export function getSession() {
  const token = safeStorage.getItem('token');
  const user = safeStorage.getItem('user');
  if (!token || !user) return null;
  return { token, user: JSON.parse(user) };
}

export function clearSession() {
  safeStorage.removeItem('token');
  safeStorage.removeItem('user');
}

/**
 * Confirma com o backend se a sessão salva localmente ainda é válida
 * (token não expirado/revogado, usuário ainda existe). Deve ser usada
 * antes de redirecionar para uma área protegida só com base no que está
 * salvo no localStorage, já que um token salvo localmente pode estar
 * expirado ou pertencer a um usuário removido.
 *
 * Retorna a sessão atualizada (com os dados de usuário mais recentes) em
 * caso de sucesso, ou null se a sessão não for válida — limpando o
 * armazenamento local nesse caso.
 */
export async function validateSession() {
  const session = getSession();
  if (!session) return null;
  try {
    const backendUser = await api.get('/auth/me');
    // Preserva campos que só existem localmente (curso, periodo)
    // mesclando com os dados atualizados do backend
    const merged = { ...session.user, ...backendUser, curso: session.user.curso, periodo: session.user.periodo };
    saveSession(session.token, merged);
    return { token: session.token, user: merged };
  } catch {
    clearSession();
    return null;
  }
}

export const PROFILES = ['ADMIN', 'COORDENADOR', 'PROFESSOR', 'ALUNO', 'AVALIADOR_EXTERNO'];

export const PROFILE_LABELS = {
  ADMIN: 'Administrador',
  COORDENADOR: 'Coordenador',
  PROFESSOR: 'Professor',
  ALUNO: 'Aluno',
  AVALIADOR_EXTERNO: 'Avaliador Externo',
};

export function canDo(user, action) {
  if (!user) return false;
  const p = user.profile;
  const rules = {
    manageUsers: ['ADMIN'],
    manageLocais: ['ADMIN', 'COORDENADOR'],
    manageCursos: ['ADMIN'],
    manageSemestres: ['ADMIN'],
    manageTurmas: ['PROFESSOR', 'ADMIN'],
    viewUsers: ['ADMIN', 'PROFESSOR'],
  };
  return (rules[action] || []).includes(p);
}
