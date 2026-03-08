'use client';

import { useState } from 'react';
import './globals.css';
import 'katex/dist/katex.min.css';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="tr">
      <head>
        <title>Psikometrik Test - Soru Bankası Yönetimi</title>
        <meta name="description" content="İK Aday Seçimi için Psikometrik Test Soru Bankası" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-slate-900 bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="flex h-screen bg-slate-50 overflow-hidden">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onOpen={() => setSidebarOpen(true)} />
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
