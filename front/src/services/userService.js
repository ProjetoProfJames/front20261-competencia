import { apiRequest } from './api';

export function getUsers() {
  return apiRequest('/users');
}

export function createUser(data) {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateUser(id, data) {
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteUser(id) {
  return apiRequest(`/users/${id}`, {
    method: 'DELETE',
  });
}