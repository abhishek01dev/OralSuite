'use client';
import { useState, useEffect } from 'react';
import { ClientSidebar } from '@/components/client-sidebar';

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('client-sidebar-collapsed');
    if (saved !== null) setCollapsed(JSON.parse(saved));
  }, []);

  const handleToggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem('client-sidebar-collapsed', JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen selection:bg-primary-fixed-dim">
      <ClientSidebar collapsed={collapsed} onToggle={handleToggle} />

      <main
        className={`min-h-screen flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}
      >
        <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm shadow-blue-900/5">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
              </div>
              <input
                className="block w-64 pl-10 pr-3 py-2 border-0 rounded-lg bg-surface-container-low text-sm focus:ring-2 focus:ring-blue-100 font-body outline-none"
                placeholder="Search patients, charts, or files..."
                type="text"
              />
            </div>
            <nav className="flex gap-6 font-manrope text-sm font-medium">
              <a href="#" className="text-primary border-b-2 border-primary pb-1">
                Main Branch
              </a>
              <a href="#" className="text-slate-500 hover:text-primary transition-all">
                Downtown Clinic
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <button className="text-slate-500 hover:text-primary transition-all relative cursor-pointer">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
              </button>
              <button className="text-slate-500 hover:text-primary transition-all cursor-pointer">
                <span className="material-symbols-outlined">auto_awesome</span>
              </button>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface">Dr. Julian Vance</p>
                <p className="text-[10px] text-on-surface-variant">Chief Surgeon</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                JV
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
