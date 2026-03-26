'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { useState } from 'react';

export const Navbar = () => {
  const itemCount = useCartStore((s) => s.getItemCount());
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-bg)/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-2xl font-black tracking-tight text-primary font-headline"
        >
          <svg width="32" height="32" viewBox="0 0 256 256" className="rounded-lg shadow-sm">
            <rect width="256" height="256" rx="64" fill="currentColor" />
            <path
              d="M128 60 C88 60 56 80 56 124 C56 160 81 210 100 210 C116 210 128 170 128 170 C128 170 140 210 156 210 C175 210 200 160 200 124 C200 80 168 60 128 60 Z"
              fill="#ffffff"
            />
            <circle cx="128" cy="110" r="14" fill="currentColor" />
          </svg>
          <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
            DentFlow
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/products"
            className="text-sm font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-text)"
          >
            Products
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative text-(--color-text-secondary) transition-colors hover:text-(--color-text)"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-cart-badge) text-xs font-bold text-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-(--color-text-secondary)">{user?.firstName}</span>
              <button
                onClick={logout}
                className="cursor-pointer rounded-lg border border-(--color-border) px-4 py-1.5 text-sm font-medium transition-colors hover:bg-(--color-bg-secondary)"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-(--color-primary) px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-(--color-primary-dark)"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="cursor-pointer text-(--color-text-secondary) md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-(--color-border) bg-(--color-bg) px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-(--color-text-secondary)"
            >
              Products
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-(--color-text-secondary)"
            >
              Cart
              {itemCount > 0 && (
                <span className="rounded-full bg-(--color-cart-badge) px-2 py-0.5 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="cursor-pointer text-left text-sm font-medium text-(--color-text-secondary)"
              >
                Logout ({user?.firstName})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-(--color-primary)"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
