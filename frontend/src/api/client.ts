import axios from 'axios';
import type {
  Provider,
  GenerateRequest,
  GenerateResponse,
  TestApiRequest,
  TestApiResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
