const TOKEN_KEY = 'TKN';
const PROFILE_KEY = 'TKN_PROFILE';

export function salvarToken(token, profile) {
  if (typeof window === 'undefined') return null;
  localStorage.setItem(TOKEN_KEY, token);
  if (profile) {
    localStorage.setItem(PROFILE_KEY, profile);
  }
}

export function obterToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removerToken() {
  if (typeof window === 'undefined') return null;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
}

export function decodificarToken() {
  const token = obterToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

export function obterRole() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PROFILE_KEY);
}

export function verificarToken() {
  const payload = decodificarToken();
  if (!payload) return false;

  if (payload.exp) {
    const agora = Math.floor(Date.now() / 1000);
    return payload.exp > agora;
  }

  return true;
}