import { envs } from '../config/env.js';

const buildHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  return {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  return response.json();
};

export const apiClient = {
  get: (path) =>
    fetch(`${envs.apiUrl}${path}`, {
      headers: buildHeaders(),
    }).then(handleResponse),

  post: (path, body) =>
    fetch(`${envs.apiUrl}${path}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path, body) =>
    fetch(`${envs.apiUrl}${path}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(`${envs.apiUrl}${path}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    }).then(handleResponse),

  postFormData: (path, formData) =>
    fetch(`${envs.apiUrl}${path}`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: formData,
    }).then(handleResponse),
};
