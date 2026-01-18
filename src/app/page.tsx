'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ContextPanel from '@/components/ContextPanel';
import Canvas from '@/components/Canvas';

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative graph-grid bg-background-dark overflow-hidden cursor-grab active:cursor-grabbing shadow-inner">
           <Canvas />
        </main>
        <ContextPanel />
      </div>
    </div>
  );
}
