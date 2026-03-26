'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/lib/auth-store';

interface NavItem {
  label: string;
  href: string;
  icon: string; // Material Symbol icon name
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Demo Requests', href: '/dashboard/demo-requests', icon: 'forward_to_inbox' },
  { label: 'Tenants', href: '/dashboard/tenants', icon: 'corporate_fare' },
  { label: 'Patients', href: '/dashboard/patients', icon: 'person' },
  { label: 'Appointments', href: '/dashboard/appointments', icon: 'calendar_month' },
  { label: 'Billing', href: '/dashboard/billing', icon: 'payments' },
  { label: 'Staff', href: '/dashboard/staff', icon: 'badge' },
  { label: 'Inventory', href: '/dashboard/inventory', icon: 'inventory_2' },
  { label: 'Reports', href: '/dashboard/reports', icon: 'analytics' },
  { label: 'Subscriptions', href: '/dashboard/subscriptions', icon: 'credit_card' },
  { label: 'Users', href: '/dashboard/users', icon: 'group' },
  { label: 'Roles', href: '/dashboard/roles', icon: 'shield' },
  { label: 'Feature Flags', href: '/dashboard/feature-flags', icon: 'flag' },
  { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: 'receipt_long' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside
      className={`flex h-screen flex-col border-r border-slate-800/60 bg-slate-900 fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div
        className={`flex h-16 items-center border-b border-slate-800/60 shrink-0 ${collapsed ? 'justify-center px-0' : 'justify-between px-4'}`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              <span className="material-symbols-outlined text-sm">shield</span>
            </div>
            <div className="overflow-hidden">
              <span className="block text-base font-bold tracking-tight text-white font-manrope whitespace-nowrap">
                DentFlow
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Super Admin
              </span>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">
            {collapsed ? 'menu_open' : 'menu'}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-primary/20 text-primary-fixed-dim border border-primary/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined shrink-0 ${isActive ? 'text-blue-400' : ''}`}
                    style={{ fontSize: '20px' }}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="whitespace-nowrap overflow-hidden transition-all duration-200">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Footer */}
      {user && (
        <div className={`border-t border-slate-800/60 p-3 shrink-0`}>
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center flex-col' : ''}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-blue-400 border border-primary/30">
              {user.firstName?.[0]?.toUpperCase() ?? user.email[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                title="Sign out"
                className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  logout
                </span>
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={handleLogout}
              title="Sign out"
              className="cursor-pointer mt-2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-red-400 w-full flex items-center justify-center"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                logout
              </span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
