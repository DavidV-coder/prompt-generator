import axios from 'axios';
import type {
  Provider,
  GenerateRequest,
  GenerateResponse,
  TestApiRequest,
  TestApiResponse,
} from '../types';

// API URL настраивается через localStorage в AdminPanel
// Для production используем Railway backend URL
const PRODUCTION_API_URL = 'https://prompt-generator-backend-production.up.railway.app';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Сначала проверяем localStorage (пользовательская настройка)
    const savedUrl = localStorage.getItem('prompt-generator-api-url');
    if (savedUrl) return savedUrl;

    // В production используем захардкоженный URL
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return PRODUCTION_API_URL;
    }
  }
  return 'http://localhost:8000'; // для локальной разработки
};

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Обновляем baseURL перед каждым запросом
api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});

export async function getProviders(): Promise<Provider[]> {
  const response = await api.get<Provider[]>('/api/providers');
  return response.data;
}

export async function testApiKey(request: TestApiRequest): Promise<TestApiResponse> {
  const response = await api.post<TestApiResponse>('/api/test-api', request);
  return response.data;
}

export async function generatePrompts(request: GenerateRequest): Promise<GenerateResponse> {
  const response = await api.post<GenerateResponse>('/api/generate', request);
  return response.data;
}

export default api;
