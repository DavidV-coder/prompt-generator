import { useState, useCallback } from 'react';
import { generatePrompts } from '../api/client';
import type { GenerateResponse, GenerateRequest } from '../types';

interface UseGenerateReturn {
  loading: boolean;
  error: string | null;
  data: GenerateResponse | null;
  generate: (request: GenerateRequest) => Promise<void>;
  reset: () => void;
}

export function useGenerate(): UseGenerateReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GenerateResponse | null>(null);

  const generate = useCallback(async (request: GenerateRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await generatePrompts(request);
      setData(response);
    } catch (err: unknown) {
      let message = 'Произошла ошибка при генерации';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        message = axiosErr.response?.data?.detail || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { loading, error, data, generate, reset };
}
