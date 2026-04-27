const API_URL = import.meta.env.VITE_API_URL;

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
    throw new Error(errorData.message || `Error ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
};

export const apiClient = {
  get: (path) =>
    fetch(`${API_URL}${path}`, {
      headers: buildHeaders(),
    }).then(handleResponse),

  post: (path, body) =>
    fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path, body) =>
    fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    }).then(handleResponse),

  postFormData: (path, formData) =>
    fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: formData,
    }).then(handleResponse),
};
