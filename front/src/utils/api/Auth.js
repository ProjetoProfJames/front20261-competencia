const TOKEN_KEY = 'meu_framework_token';

export function salvarToken(token) {
  const dataExpiracao = new Date();
  dataExpiracao.setTime(dataExpiracao.getTime() + (30 * 60 * 1000)); // 30 minutos
  const expires = `expires=${dataExpiracao.toUTCString()}`;

  document.cookie = `${TOKEN_KEY}=${token}; ${expires}; path=/; SameSite=Strict`;
}

export function obterToken() {
  if (typeof window === 'undefined') return null;

  const nomeChave = `${TOKEN_KEY}=`;

  const cookiesArray = document.cookie.split(';');

  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i].trim(); 

    if (cookie.indexOf(nomeChave) === 0) {
      return cookie.substring(nomeChave.length, cookie.length); 
    }
  }
  
  return null; 
}

export function removerToken() {
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}