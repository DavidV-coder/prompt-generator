import { useState } from 'react';
import type { GenerateResponse } from '../types';

interface ResultDisplayProps {
  data: GenerateResponse;
  onReset: () => void;
}

export function ResultDisplay({ data, onReset }: ResultDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-medium text-primary">
            Промпты для роли: {data.role}
          </h2>
          <p className="text-sm text-gray-400 mt-1 truncate">
            {data.business}
          </p>
          <p className="text-xs text-accent mt-1">
            {data.provider} / {data.model}
          </p>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-gray-400 hover:text-primary transition-colors whitespace-nowrap"
        >
          Новый запрос
        </button>
      </div>

      <div className="space-y-4">
        {data.prompts.map((prompt, index) => (
          <div
            key={index}
            className="card group hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-on-surface flex-1 whitespace-pre-wrap">
                {prompt}
              </p>
              <button
                onClick={() => copyToClipboard(prompt, index)}
                className="flex-shrink-0 text-gray-500 hover:text-accent transition-colors p-2"
                title="Копировать"
              >
                {copiedIndex === index ? (
                  <span className="text-accent">✓</span>
                ) : (
                  <span>📋</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="btn-primary w-full"
      >
        Сгенерировать для другой роли
      </button>
    </div>
  );
}
