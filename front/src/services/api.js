import { validarToken } from './verificacao_jwt';

const API_URL = 'http://localhost:8080/api';

export async function apiRequest(endpoint, options = {}) {
  return validarToken(`${API_URL}${endpoint}`, options);
}