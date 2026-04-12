import type { Metadata } from 'next';
import './globals.css';
import { EmpresaProvider } from '@/lib/EmpresaContext';
import { ToastProvider } from '@/components/ui/Toast';
import Sidebar from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';

export const metadata: Metadata = {
  title: 'Sistema Multiempresa',
  description: 'Prototipo de sistema de gestión multiempresa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-surface-50">
        <EmpresaProvider>
          <ToastProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
          </div>
          </ToastProvider>
        </EmpresaProvider>
      </body>
    </html>
  );
}
