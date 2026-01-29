import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PromptForm } from './components/PromptForm';
import { ResultDisplay } from './components/ResultDisplay';
import { SettingsModal, type Settings } from './components/SettingsModal';
import { AdminPanel } from './components/AdminPanel';
import { useGenerate } from './hooks/useGenerate';

const SETTINGS_KEY = 'prompt-generator-settings';

type Page = 'main' | 'admin';

function loadSettings(): Settings | null {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return null;
}

function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

function App() {
  const { loading, error, data, generate, reset } = useGenerate();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [page, setPage] = useState<Page>('main');

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = loadSettings();
    setSettings(saved);
    // If no settings, open the modal on first visit
    if (!saved) {
      setSettingsOpen(true);
    }
  }, []);

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Admin panel page
  if (page === 'admin') {
    return (
      <Layout>
        <AdminPanel onBack={() => setPage('main')} />
      </Layout>
    );
  }

  // Main page
  return (
    <Layout>
      {/* Admin link */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setPage('admin')}
          className="text-xs text-gray-500 hover:text-primary transition-colors"
        >
          ⚙️ Админ
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg text-error">
          {error}
        </div>
      )}

      {data ? (
        <ResultDisplay data={data} onReset={reset} />
      ) : (
        <div className="card">
          <PromptForm
            onSubmit={generate}
            loading={loading}
            settings={settings}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>
      )}

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={settings}
      />
    </Layout>
  );
}

export default App;
