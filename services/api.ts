// app/services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_BASE_URL = 'https://wma-object-arrest-convertible.trycloudflare.com/api';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
}

interface AuthResponse {
  token: string;
}

interface DecodedToken {
  exp: number; // timestamp de expiración
  iat: number; // timestamp de emisión
  sub: string; // sujeto (user id)
  // ...otros campos según tu JWT
}

// Expresiones regulares y utilidades
const isValidEmail = (email: string): boolean =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

// Gestión del token en AsyncStorage
const TOKEN_KEY = 'userToken';
export const authStorage = {
  getToken: async (): Promise<string | null> => AsyncStorage.getItem(TOKEN_KEY),
  setToken: async (token: string): Promise<void> => AsyncStorage.setItem(TOKEN_KEY, token),
  removeToken: async (): Promise<void> => AsyncStorage.removeItem(TOKEN_KEY),
};

// Construye headers con token si existe
async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await authStorage.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Función genérica para manejar respuestas JSON y errores
async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.error || data?.message || response.statusText;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // =======================
  // AUTENTICACIÓN (AUTH)
  // =======================
  register: async (email: string, password: string): Promise<void> => {
    if (!isValidEmail(email)) {
      throw new Error('El formato de correo no es válido');
    }
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });
    // Si la respuesta no es exitosa, handleResponse lanzará un error.
    await handleResponse(response);
  },

  login: async (email: string, password: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });
    const { token } = await handleResponse<AuthResponse>(response);
    if (!token) {
      throw new Error('No se recibió token del servidor');
    }
    await authStorage.setToken(token);
    return token;
  },

  // Decodificar y validar JWT
  decodeToken: async (): Promise<DecodedToken | null> => {
    const token = await authStorage.getToken();
    if (!token) return null;
    return jwtDecode<DecodedToken>(token);
  },

  isTokenExpired: async (): Promise<boolean> => {
    const decoded = await api.decodeToken();
    if (!decoded) return true;
    const now = Date.now() / 1000;
    return decoded.exp < now;
  },

  // =======================
  // MÉTODOS PARA TAREAS
  // =======================
  getTareas: async (): Promise<Tarea[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/tareas`, { headers });
    return handleResponse<Tarea[]>(response);
  },

  getTarea: async (id: number): Promise<Tarea> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, { headers });
    return handleResponse<Tarea>(response);
  },

  createTarea: async (tarea: Omit<Tarea, 'id'>): Promise<Tarea> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      method: 'POST',
      headers,
      body: JSON.stringify(tarea),
    });
    return handleResponse<Tarea>(response);
  },

  updateTarea: async (id: number, tarea: Partial<Tarea>): Promise<Tarea> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(tarea),
    });
    return handleResponse<Tarea>(response);
  },

  deleteTarea: async (id: number): Promise<void> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'DELETE',
      headers,
    });
    await handleResponse<void>(response);
  },
};