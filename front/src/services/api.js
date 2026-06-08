import { validarToken } from './verificacao_jwt';

const API_URL = 'http://localhost:8080/api';

export async function apiRequest(endpoint, options = {}) {
  return validarToken(`${API_URL}${endpoint}`, options);
}

export async function publicRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!isJson) {
    throw new Error(`Resposta inesperada: ${endpoint} ~> não é JSON`);
  }

  const data = await response.json();

  if (!response.ok) {
    const mensagem = data.message || 'Erro na requisição';
    alert(mensagem);
    throw new Error(mensagem);
  }

  return data;
}