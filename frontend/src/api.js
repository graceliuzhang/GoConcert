const TOKEN_KEY = 'goconcert_token';
export const API_URL = import.meta.env.VITE_API_URL;

export function buildApiUrl(path) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const base = (API_URL || '').replace(/\/$/, '').replace(/\/api$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!base) {
    return normalizedPath;
  }

  const backendPath = normalizedPath.replace(/^\/api(?=\/|$)/, '');
  return `${base}${backendPath}`;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function authRequest(path, method = 'GET', body) {
  const token = getToken();
  const response = await fetch(buildApiUrl(path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  return response;
}

export async function login(email, password) {
  const response = await fetch(buildApiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response;
}

export async function register(email, password) {
  const response = await fetch(buildApiUrl('/api/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response;
}

export async function getMe() {
  return authRequest('/api/users/me');
}