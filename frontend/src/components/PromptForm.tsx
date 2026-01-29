import { useState } from 'react';
import type { GenerateRequest } from '../types';
import type { Settings } from './SettingsModal';

const SYSTEM_PROMPT_KEY = 'prompt-generator-system-prompt';

interface PromptFormProps {
  onSubmit: (request: GenerateRequest) => void;
  loading: boolean;
  settings: Settings | null;
  onOpenSettings: () => void;
}

const ROLE_SUGGESTIONS = [
  'Менеджер',
  'HR-специалист',
  'Бухгалтер',
  'Директор',
  'Зам. директора',
  'Продавец',
  'Маркетолог',
  'Аналитик',
];

const PROVIDER_ICONS: Record<string, string> = {
  openai: '🤖',
  anthropic: '🧠',
  openrouter: '🔀',
  xai: '⚡',
  zai: '🐉',
};

export function PromptForm({ onSubmit, loading, settings, onOpenSettings }: PromptFormProps) {
  const [business, setBusiness] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings && isValid) {
      // Get custom system prompt from localStorage
      const systemPrompt = localStorage.getItem(SYSTEM_PROMPT_KEY) || '';

      onSubmit({
        business: business.trim(),
        role: role.trim(),
        provider: settings.provider,
        api_key: settings.apiKey,
        model: settings.model,
        system_prompt: systemPrompt,
      });
    }
  };

  const isValid = business.trim().length >= 10 && role.trim().length >= 2;

  return (
    <div className="space-y-6">
      {/* Connected Provider Status */}
      <div className="flex items-center justify-between p-4 bg-surface-light/50 rounded-lg border border-surface-light">
        {settings ? (
          <div className="flex items-center gap-3">
            <span className="text-2xl">{PROVIDER_ICONS[settings.provider] || '🤖'}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-on-surface">{settings.providerLabel}</span>
                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                  Подключено
                </span>
              </div>
              <p className="text-xs text-gray-400">{settings.modelName}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-2xl opacity-50">🔌</span>
            <div>
              <span className="font-medium text-gray-400">Провайдер не подключён</span>
              <p className="text-xs text-gray-500">Нажмите "Настроить" для подключения</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onOpenSettings}
          className="px-4 py-2 text-sm border border-primary/50 text-primary rounded-lg hover:bg-primary/10 transition-colors"
        >
          ⚙️ Настроить
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="business" className="block text-sm font-medium text-gray-300">
            Описание бизнеса
          </label>
          <textarea
            id="business"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Опишите ваш бизнес: сфера деятельности, размер компании, особенности..."
            className="input-field min-h-[120px] resize-y"
            disabled={loading || !settings}
          />
          <p className="text-xs text-gray-500">Минимум 10 символов</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium text-gray-300">
            Роль сотрудника
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Например: HR-специалист, Директор..."
            className="input-field"
            disabled={loading || !settings}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {ROLE_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setRole(suggestion)}
                disabled={loading || !settings}
                className="text-xs px-3 py-1.5 rounded-full bg-surface-light hover:bg-primary/20 hover:text-primary transition-colors disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!settings || !isValid || loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Генерация...
            </>
          ) : !settings ? (
            'Сначала подключите провайдера'
          ) : (
            'Сгенерировать промпты'
          )}
        </button>
      </form>
    </div>
  );
}
