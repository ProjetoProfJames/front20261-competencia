'use client';

const BASE_URL = 'http://localhost:8080/api';

const safeStorage = {
  getItem(key) {
    try {
      if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') return null;
      return localStorage.getItem(key);
    } catch { return null; }
  },
  setItem(key, value) {
    try {
      if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') return;
      localStorage.setItem(key, value);
    } catch {}
  },
  removeItem(key) {
    try {
      if (typeof localStorage === 'undefined' || typeof localStorage.removeItem !== 'function') return;
      localStorage.removeItem(key);
    } catch {}
  },
};

function getToken() { return safeStorage.getItem('token'); }

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
  post:   (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  get:    (path)       => request(path),
  put:    (path, body) => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)       => request(path, { method: 'DELETE' }),
};

export function saveSession(token, user) {
  safeStorage.setItem('token', token);
  safeStorage.setItem('user', JSON.stringify(user));
}

export function getSession() {
  const token = safeStorage.getItem('token');
  const user  = safeStorage.getItem('user');
  if (!token || !user) return null;
  return { token, user: JSON.parse(user) };
}

export function clearSession() {
  safeStorage.removeItem('token');
  safeStorage.removeItem('user');
}

export async function validateSession() {
  const session = getSession();
  if (!session) return null;
  try {
    const backendUser = await api.get('/auth/me');
    // Deriva tipoCadastro do profile do backend se não estiver salvo localmente
    const profileToTipo = {
      ALUNO: 'ALUNO', PROFESSOR: 'PROFESSOR',
      COORDENADOR: 'COORDENADOR', AVALIADOR_EXTERNO: 'VISITANTE',
    };
    const tipoCadastro = session.user.tipoCadastro
      || profileToTipo[backendUser.profile]
      || '';
    const merged = { ...session.user, ...backendUser, tipoCadastro };
    saveSession(session.token, merged);
    return { token: session.token, user: merged };
  } catch {
    clearSession();
    return null;
  }
}

export const PROFILES = ['ADMIN','COORDENADOR','PROFESSOR','ALUNO','AVALIADOR_EXTERNO'];
export const PROFILE_LABELS = {
  ADMIN: 'Administrador', COORDENADOR: 'Coordenador',
  PROFESSOR: 'Professor', ALUNO: 'Aluno',
  AVALIADOR_EXTERNO: 'Avaliador Externo',
};

export const TIPO_CADASTRO = ['ALUNO','PROFESSOR','COORDENADOR','VISITANTE'];
export const TIPO_CADASTRO_LABELS = {
  ALUNO: 'Aluno', PROFESSOR: 'Professor',
  COORDENADOR: 'Coordenador', VISITANTE: 'Visitante',
};
export const TIPO_TO_PROFILE = {
  ALUNO: 'ALUNO', PROFESSOR: 'PROFESSOR',
  COORDENADOR: 'COORDENADOR', VISITANTE: 'AVALIADOR_EXTERNO',
};

export const CURSOS_DISPONIVEIS = [
  'Biomedicina','Ciências Biológicas','Enfermagem','Farmácia','Fisioterapia',
  'Nutrição','Psicologia','Arquitetura e Urbanismo','Engenharia Civil',
  'Engenharia de Software','Engenharia de Produção','Sistemas de Informação',
  'Administração','Ciências Contábeis','Direito','Educação Física','Filosofia',
  'Serviço Social',
];

export const PERIODOS = Array.from({ length: 12 }, (_, i) => i + 1);
export const HORARIOS = ['19:00 – 20:00','20:00 – 21:00','21:00 – 22:00'];
export const HORARIOS_VISITA = ['19:00 – 20:00','20:00 – 21:00','21:00 – 22:00'];

export function canDo(user, action) {
  if (!user) return false;
  const p = user.profile;
  const rules = {
    manageUsers:     ['ADMIN'],
    manageLocais:    ['ADMIN','COORDENADOR'],
    addLocais:       ['COORDENADOR'],
    manageCursos:    ['ADMIN'],
    manageSemestres: ['ADMIN'],
    manageTurmas:    ['PROFESSOR','ADMIN'],
    viewUsers:       ['ADMIN','PROFESSOR','COORDENADOR','ALUNO','AVALIADOR_EXTERNO'],
    viewAllLocais:   ['ADMIN','COORDENADOR','PROFESSOR','ALUNO','AVALIADOR_EXTERNO'],
  };
  return (rules[action] || []).includes(p);
}
