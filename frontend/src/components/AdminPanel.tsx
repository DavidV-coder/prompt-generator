import { useState, useEffect } from 'react';
import { testApiKey } from '../api/client';

const SYSTEM_PROMPT_KEY = 'prompt-generator-system-prompt';
const API_URL_KEY = 'prompt-generator-api-url';

const DEFAULT_PROMPT = `Вы — эксперт по созданию промптов для AI-ассистентов.

Описание бизнеса: {business}
Роль сотрудника: {role}

Ваша задача — создать 5 полезных промптов для сотрудника с указанной ролью.

Каждый промпт должен:
1. Быть конкретным и применимым к описанному бизнесу
2. Начинаться с обращения к AI (например, "Помоги мне...", "Составь...", "Проанализируй...")
3. Содержать контекст бизнеса и роли
4. Быть готовым к использованию без дополнительной модификации
5. Быть достаточно длинным и детальным (минимум 2-3 предложения)

Формат ответа — только список промптов, каждый с новой строки, без нумерации и лишнего текста.`;

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', url: 'https://platform.openai.com/api-keys' },
  { id: 'anthropic', name: 'Anthropic', url: 'https://console.anthropic.com/' },
  { id: 'google', name: 'Google AI (Gemini)', url: 'https://makersuite.google.com/app/apikey' },
  { id: 'openrouter', name: 'OpenRouter', url: 'https://openrouter.ai/keys' },
  { id: 'groq', name: 'Groq', url: 'https://console.groq.com/keys' },
  { id: 'deepseek', name: 'DeepSeek', url: 'https://platform.deepseek.com/' },
  { id: 'mistral', name: 'Mistral AI', url: 'https://console.mistral.ai/' },
  { id: 'cohere', name: 'Cohere', url: 'https://dashboard.cohere.com/api-keys' },
  { id: 'perplexity', name: 'Perplexity', url: 'https://www.perplexity.ai/settings/api' },
  { id: 'together', name: 'Together AI', url: 'https://api.together.xyz/settings/api-keys' },
];

type Tab = 'prompt' | 'api' | 'api-settings';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>('prompt');
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT);
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string } | null>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});

  // Load saved data on mount
  useEffect(() => {
    const savedPrompt = localStorage.getItem(SYSTEM_PROMPT_KEY);
    if (savedPrompt) {
      setSystemPrompt(savedPrompt);
    }
    const savedUrl = localStorage.getItem(API_URL_KEY);
    if (savedUrl) {
      setApiUrl(savedUrl);
    }

    // Load API keys
    const loadedKeys: Record<string, string> = {};
    PROVIDERS.forEach(provider => {
      const key = localStorage.getItem(`api-key-${provider.id}`);
      if (key) {
        loadedKeys[provider.id] = key;
      }
    });
    setApiKeys(loadedKeys);
  }, []);

  const handleSavePrompt = () => {
    localStorage.setItem(SYSTEM_PROMPT_KEY, systemPrompt);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetPrompt = () => {
    setSystemPrompt(DEFAULT_PROMPT);
    localStorage.removeItem(SYSTEM_PROMPT_KEY);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveApiUrl = () => {
    localStorage.setItem(API_URL_KEY, apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTestApiKey = async (providerId: string) => {
    const apiKey = apiKeys[providerId];
    if (!apiKey || !apiKey.trim()) {
      setTestResults(prev => ({
        ...prev,
        [providerId]: { success: false, message: 'Введите API ключ' }
      }));
      return;
    }

    setTesting(prev => ({ ...prev, [providerId]: true }));
    setTestResults(prev => ({ ...prev, [providerId]: null }));

    try {
      const result = await testApiKey({ provider: providerId as any, api_key: apiKey });
      setTestResults(prev => ({ ...prev, [providerId]: result }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [providerId]: { success: false, message: error.message || 'Ошибка тестирования' }
      }));
    } finally {
      setTesting(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const handleSaveApiKey = (providerId: string) => {
    const apiKey = apiKeys[providerId];
    if (apiKey && apiKey.trim()) {
      localStorage.setItem(`api-key-${providerId}`, apiKey);
    } else {
      localStorage.removeItem(`api-key-${providerId}`);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveAllApiKeys = () => {
    PROVIDERS.forEach(provider => {
      const apiKey = apiKeys[provider.id];
      if (apiKey && apiKey.trim()) {
        localStorage.setItem(`api-key-${provider.id}`, apiKey);
      } else {
        localStorage.removeItem(`api-key-${provider.id}`);
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exampleRequest = `{
  "business": "Автосервис в Москве, 5 сотрудников",
  "role": "Менеджер",
  "provider": "openrouter",
  "api_key": "sk-or-v1-xxx",
  "model": "qwen/qwen3-coder:free",
  "system_prompt": ""
}`;

  const exampleCurl = `curl -X POST "${apiUrl}/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '${exampleRequest.replace(/\n/g, '').replace(/  /g, '')}'`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">Админ панель</h2>
          <p className="text-sm text-gray-400 mt-1">Настройки генератора промптов</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm border border-surface-light text-gray-300 rounded-lg hover:bg-surface-light transition-colors"
        >
          ← Назад
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-surface-light">
        <button
          onClick={() => setTab('prompt')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'prompt'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          📝 Промпт
        </button>
        <button
          onClick={() => setTab('api')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'api'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          🔌 API
        </button>
        <button
          onClick={() => setTab('api-settings')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'api-settings'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          🔑 Настройки API
        </button>
      </div>

      {/* Prompt Tab */}
      {tab === 'prompt' && (
        <>
          <div className="card space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Системный промпт
              </label>
              <p className="text-xs text-gray-500">
                Используйте {'{role}'} и {'{business}'} как переменные
              </p>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="input-field min-h-[300px] resize-y font-mono text-sm"
                placeholder="Введите системный промпт..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSavePrompt}
                className="btn-primary flex items-center gap-2"
              >
                {saved ? '✓ Сохранено' : '💾 Сохранить'}
              </button>
              <button
                onClick={handleResetPrompt}
                className="px-4 py-2 border border-surface-light text-gray-300 rounded-lg hover:bg-surface-light transition-colors"
              >
                Сбросить
              </button>
            </div>
          </div>

          <div className="card bg-surface-light/30">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Переменные:</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li><code className="text-accent">{'{role}'}</code> — роль сотрудника</li>
              <li><code className="text-accent">{'{business}'}</code> — описание бизнеса</li>
            </ul>
          </div>
        </>
      )}

      {/* API Tab */}
      {tab === 'api' && (
        <>
          <div className="card space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                URL сервера API
              </label>
              <p className="text-xs text-gray-500">
                Измените при деплое на Railway или другой хостинг
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="input-field flex-1 font-mono text-sm"
                  placeholder="https://your-app.railway.app"
                />
                <button
                  onClick={handleSaveApiUrl}
                  className="btn-primary"
                >
                  {saved ? '✓' : '💾'}
                </button>
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Эндпоинт генерации</h3>
            <div className="bg-surface-light rounded-lg p-3">
              <code className="text-accent text-sm">POST {apiUrl}/api/generate</code>
            </div>

            <h4 className="text-sm font-medium text-gray-300 mt-4">Тело запроса (JSON):</h4>
            <div className="relative">
              <pre className="bg-surface-light rounded-lg p-3 text-xs text-gray-300 overflow-x-auto">
                {exampleRequest}
              </pre>
              <button
                onClick={() => copyToClipboard(exampleRequest)}
                className="absolute top-2 right-2 text-xs text-gray-500 hover:text-accent"
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>

            <h4 className="text-sm font-medium text-gray-300 mt-4">Пример cURL:</h4>
            <div className="relative">
              <pre className="bg-surface-light rounded-lg p-3 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                {exampleCurl}
              </pre>
              <button
                onClick={() => copyToClipboard(exampleCurl)}
                className="absolute top-2 right-2 text-xs text-gray-500 hover:text-accent"
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="card bg-surface-light/30 space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Параметры запроса:</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><code className="text-accent">business</code> — описание бизнеса (обязательно)</li>
              <li><code className="text-accent">role</code> — роль сотрудника (обязательно)</li>
              <li><code className="text-accent">provider</code> — провайдер: openai, anthropic, openrouter, xai, zai</li>
              <li><code className="text-accent">api_key</code> — API ключ провайдера</li>
              <li><code className="text-accent">model</code> — ID модели (опционально)</li>
              <li><code className="text-accent">system_prompt</code> — кастомный промпт (опционально)</li>
            </ul>
          </div>

          <div className="card bg-surface-light/30 space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Другие эндпоинты:</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><code className="text-accent">GET /api/providers</code> — список провайдеров и моделей</li>
              <li><code className="text-accent">POST /api/test-api</code> — проверка API ключа</li>
              <li><code className="text-accent">GET /api/health</code> — проверка статуса сервера</li>
            </ul>
          </div>
        </>
      )}

      {/* API Settings Tab */}
      {tab === 'api-settings' && (
        <>
          <div className="card space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">Настройка AI провайдеров</h3>
              <p className="text-sm text-gray-400">
                Введите API ключи для провайдеров, которые хотите использовать.
                Нажмите "🔌 Тест" для проверки ключа.
              </p>
            </div>

            <div className="space-y-4">
              {PROVIDERS.map((provider) => {
                const testResult = testResults[provider.id];
                const isSuccess = testResult?.success;
                const isTesting = testing[provider.id];

                return (
                  <div key={provider.id} className="border border-surface-light rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-200">{provider.name}</h4>
                        <a
                          href={provider.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline"
                        >
                          Получить API ключ →
                        </a>
                      </div>
                      {isSuccess && (
                        <span className="text-green-500 text-sm">✓ Подключено</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKeys[provider.id] || ''}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                        placeholder={`Введите ${provider.name} API ключ`}
                        className="input-field flex-1 font-mono text-sm"
                      />
                      <button
                        onClick={() => handleTestApiKey(provider.id)}
                        disabled={isTesting || !apiKeys[provider.id]?.trim()}
                        className="px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                      >
                        {isTesting ? '⏳' : '🔌'} Тест
                      </button>
                    </div>

                    {testResult && (
                      <div className={`text-sm p-2 rounded ${
                        testResult.success
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {testResult.message}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveAllApiKeys}
                className="btn-primary flex items-center gap-2"
              >
                {saved ? '✓ Сохранено' : '💾 Сохранить все'}
              </button>
            </div>
          </div>

          <div className="card bg-surface-light/30 space-y-3">
            <h3 className="text-sm font-medium text-gray-300">💡 Рекомендации:</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><span className="text-green-400">🆓 Google AI (Gemini)</span> — 60 запросов/мин бесплатно</li>
              <li><span className="text-green-400">🆓 Groq</span> — очень быстрый, бесплатный лимит</li>
              <li><span className="text-green-400">🆓 OpenRouter</span> — есть бесплатные модели</li>
              <li><span className="text-yellow-400">💰 OpenAI</span> — лучшие модели (платно)</li>
              <li><span className="text-yellow-400">💰 Anthropic</span> — Claude 3.5 Sonnet (платно)</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
