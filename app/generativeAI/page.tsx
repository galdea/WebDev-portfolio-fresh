'use client';

import { GenerativeAI } from '@/components/GenerativeAI/GenerativeAI';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function GenerativeAIPage() {
  const [currentView, setCurrentView] = useState<'films' | 'folder'>('folder');

  const handleViewChange = (view: 'films' | 'folder') => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-background dark:from-bg-dark dark:to-dark">
      <Navbar />
      <main className="pt-24">
        <GenerativeAI
          onViewChange={handleViewChange}
          currentView={currentView}
        />
      </main>
    </div>
  );
}
