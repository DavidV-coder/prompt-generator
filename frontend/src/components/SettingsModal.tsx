import { useState, useEffect } from 'react';
import { getProviders, testApiKey } from '../api/client';
import type { Provider, Model } from '../types';

export interface Settings {
  provider: string;
  providerLabel: string;
  apiKey: string;
  model: string;
  modelName: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
  currentSettings: Settings | null;
}

const PROVIDER_ICONS: Record<string, string> = {
  openai: '🤖',
  anthropic: '🧠',
  openrouter: '🔀',
  xai: '⚡',
  zai: '🐉',
};

export function SettingsModal({ isOpen, onClose, onSave, currentSettings }: SettingsModalProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [provider, setProvider] = useState(currentSettings?.provider || '');
  const [apiKey, setApiKey] = useState(currentSettings?.apiKey || '');
  const [model, setModel] = useState(currentSettings?.model || '');

  // Test state
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load providers
  useEffect(() => {
    if (isOpen) {
      getProviders()
        .then((data) => {
          setProviders(data);
          if (!provider && data.length > 0) {
            setProvider(data[0].value);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  // Reset test when provider changes
  useEffect(() => {
    setTestResult(null);
    setModel('');
  }, [provider]);

  const currentProvider = providers.find((p) => p.value === provider);
  const availableModels: Model[] = currentProvider?.models || [];
  const isApiReady = testResult?.success === true;

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setTesting(true);
    setTestResult(null);

    try {
      const result = await testApiKey({ provider, api_key: apiKey });
      setTestResult(result);
      if (result.success && availableModels.length > 0) {
        setModel(availableModels[0].id);
      }
    } catch {
      setTestResult({ success: false, message: 'Ошибка соединения' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    if (!isApiReady || !model) return;
    const selectedModel = availableModels.find((m) => m.id === model);
    onSave({
      provider,
      providerLabel: currentProvider?.label || provider,
      apiKey,
      model,
      modelName: selectedModel?.name || model,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl border border-surface-light w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-surface-light">
          <h2 className="text-xl font-semibold text-primary">Настройка AI-провайдера</h2>
          <p className="text-sm text-gray-400 mt-1">Подключите API один раз</p>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center text-gray-400 py-4">Загрузка...</div>
          ) : (
            <>
              {/* Provider Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  AI-провайдер
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {providers.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setProvider(p.value)}
                      className={`
                        flex items-center gap-2 p-3 rounded-lg border transition-all
                        ${provider === p.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-surface-light hover:border-gray-500 text-gray-300'
                        }
                      `}
                    >
                      <span className="text-lg">{PROVIDER_ICONS[p.value] || '🤖'}</span>
                      <span className="text-sm font-medium">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  API-ключ
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setTestResult(null);
                    }}
                    placeholder={`Введите API ключ для ${currentProvider?.label || ''}...`}
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleTest}
                    disabled={!apiKey.trim() || testing}
                    className="px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-lg hover:bg-accent/30 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {testing ? '⏳' : '🔌'} Тест
                  </button>
                </div>
                {testResult && (
                  <div className={`p-3 rounded-lg text-sm ${
                    testResult.success
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-error/10 border border-error/30 text-error'
                  }`}>
                    {testResult.success ? '✓' : '✗'} {testResult.message}
                  </div>
                )}
              </div>

              {/* Model Selection */}
              {isApiReady && availableModels.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Модель
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Выберите модель...</option>
                    {availableModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 border-t border-surface-light flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-surface-light rounded-lg text-gray-300 hover:bg-surface-light transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isApiReady || !model}
            className="flex-1 btn-primary"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
