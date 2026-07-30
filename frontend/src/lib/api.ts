const RENDER_BACKEND = 'https://gruhani-backend-ktro.onrender.com';

function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return RENDER_BACKEND;
  }

  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isLocal) {
    return (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';
  }

  // On any production domain (Vercel, Netlify, Render, custom domains)
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  return RENDER_BACKEND;
}

const API_BASE_URL = getApiBaseUrl();

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
