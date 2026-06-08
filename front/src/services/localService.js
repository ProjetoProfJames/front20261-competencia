import { apiRequest } from './api';

export function getLocais() {
  return apiRequest('/locais');
}

export function getLocal(id) {
  return apiRequest(`/locais/${id}`);
}

export function createLocal(data) {
  return apiRequest('/locais', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function updateLocal(id, data) {
  return apiRequest(`/locais/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function deleteLocal(id) {
  return apiRequest(`/locais/${id}`, {
    method: 'DELETE',
  });
}