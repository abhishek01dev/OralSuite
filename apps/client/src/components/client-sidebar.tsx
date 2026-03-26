'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Patients', href: '/dashboard/patients', icon: 'person' },
  { label: 'Appointments', href: '/dashboard/appointments', icon: 'calendar_month' },
  { label: 'Charting', href: '/dashboard/charting', icon: 'dentistry' },
  { label: 'Billing', href: '/dashboard/billing', icon: 'payments' },
  { label: 'Inventory', href: '/dashboard/inventory', icon: 'inventory_2' },
  { label: 'Staff', href: '/dashboard/staff', icon: 'badge' },
  { label: 'Reports', href: '/dashboard/reports', icon: 'analytics' },
];

const bottomItems: NavItem[] = [
  { label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
  { label: 'Support', href: '/dashboard/support', icon: 'help' },
];

interface ClientSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function ClientSidebar({ collapsed, onToggle }: ClientSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-screen flex-col border-r border-outline-variant/15 bg-surface-container-low fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div
        className={`flex h-16 items-center border-b border-outline-variant/15 shrink-0 ${collapsed ? 'justify-center px-0' : 'justify-between px-4'}`}
      >
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
            <div className="w-9 h-9 shrink-0 bg-primary rounded-xl flex items-center justify-center text-on-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-sm">dentistry</span>
            </div>
            <div className="overflow-hidden">
              <span className="block text-base font-bold tracking-tight text-primary font-manrope whitespace-nowrap">
                DentFlow
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-semibold">
                Clinical OS
              </span>
            </div>
          </Link>
        )}
        <button
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-on-surface-variant hover:bg-primary-fixed/30 hover:text-primary transition-colors cursor-pointer"
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
                      ? 'bg-primary-fixed/20 text-primary border border-primary/15 font-semibold'
                      : 'text-on-surface-variant hover:bg-primary-fixed/15 hover:text-primary'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined shrink-0`}
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

      {/* Bottom Section */}
      <div className="border-t border-outline-variant/15 p-2 shrink-0">
        <ul className="space-y-0.5 mb-3">
          {bottomItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-primary-fixed/15 hover:text-primary transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
              >
                <span className="material-symbols-outlined shrink-0" style={{ fontSize: '20px' }}>
                  {item.icon}
                </span>
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Quick Add Button */}
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-primary-container text-on-primary text-center">
            <button className="font-bold flex items-center justify-center gap-2 w-full text-sm">
              <span className="material-symbols-outlined text-sm">add</span>
              Quick Add
            </button>
          </div>
        ) : (
          <button
            title="Quick Add"
            className="w-full flex items-center justify-center p-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              add
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}
