import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-surface-light">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-primary">
            Генератор промптов
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Создавайте AI-промпты для любых бизнес-ролей
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        {children}
      </main>

      <footer className="border-t border-surface-light mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          produced by Anticoncept
        </div>
      </footer>
    </div>
  );
}
