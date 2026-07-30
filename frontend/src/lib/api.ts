const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const DEFAULT_BACKEND = isLocalhost ? 'http://localhost:5000' : 'https://gruhani-backend-ktro.onrender.com';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || DEFAULT_BACKEND;

export function getAuthToken(): string | null {
  return localStorage.getItem('gruhini_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('gruhini_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('gruhini_token');
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    if (contentType && contentType.includes('application/json')) {
      const errorJson = await response.json();
      errorMessage = errorJson.message || errorJson.errorCode || JSON.stringify(errorJson);
    } else {
      errorMessage = await response.text();
    }
    throw new Error(errorMessage);
  }

  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
}
