"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Persist sidebar state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    if (saved !== null) setCollapsed(JSON.parse(saved));
  }, []);

  const handleToggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <div className="bg-surface font-body selection:bg-primary-fixed-dim min-h-screen text-on-surface overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />

      {/* Header */}
      <header
        className={`fixed top-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm shadow-blue-900/5 h-16 flex justify-between items-center px-8 transition-all duration-300 ${
          collapsed ? 'left-16' : 'left-64'
        }`}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-80 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              className="w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none placeholder:text-slate-400"
              placeholder="Search clinics, invoices, or tickets..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-slate-500 hover:text-primary transition-colors relative cursor-pointer">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          <button className="text-slate-500 hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
            <div className="text-right">
              <p className="text-sm font-bold text-on-surface">Alex Rivera</p>
              <p className="text-[10px] text-on-surface-variant font-medium">SUPER ADMIN</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              AR
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`pt-16 pb-12 px-8 min-h-screen overflow-y-auto transition-all duration-300 ${
          collapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
