'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiError } from '../lib/api';

// System tenant ID — the admin portal always authenticates against the system tenant
const SYSTEM_TENANT_ID = process.env['NEXT_PUBLIC_TENANT_ID'] ?? 'system';

interface LoginResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      roles: string[];
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Set tenant ID for the system tenant
      api.setTenantId(SYSTEM_TENANT_ID);

      const response = await api.post<LoginResponse>('/api/v1/auth/login', {
        email,
        password,
      });

      // Store tokens and user data
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'INVALID_CREDENTIALS') {
          setError('Invalid credentials. Please verify your admin privileges.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Connection failed. Please check API availability.');
      }
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-surface-container-low font-body text-on-surface antialiased overflow-hidden selection:bg-tertiary-fixed-dim">
      {/* Visual / Branding Sidebar */}
      <section className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-on-surface">
        <img
          alt="High-end modern dental clinic interior"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105 filter grayscale"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZYZfMa0iLKrSy0OKB0M_vjlX3rU_7mrNCPvnsCl0sDK6LNJEp0ALEHGmEM1Bxuc0OKaaPevbfj7kOie1yHkbfmsc1C0ORBXUrj9RTZm_3OE_hEcwZOY-yjZoyxicF1eCQXWPIqRDyEWaVJe7GvizGpEdOC4OBknKEp60HUWbpMY_Fgcflf5AbKQq0dBwXvJ-FQ0M3-UFazbl1AgqqDlSD8LNBqp3WxGpQZqtOTB0jA35S_s6pOhetdZ_LnBxyTCYhT7QoCg_EBd2q"
        />
        {/* Tonal Layering Overlay (Darker, more administrative feel) */}
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary/90 via-on-surface/90 to-background/40 backdrop-blur-[2px]"></div>

        {/* Decorative elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-tertiary-fixed-dim rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-fixed-dim rounded-full blur-[120px] opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full text-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
              <span className="material-symbols-outlined text-2xl">shield</span>
            </div>
            <div>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight">DentFlow</h1>
              <p className="text-[10px] uppercase tracking-widest font-bold leading-none mt-0.5 opacity-80 text-tertiary-container">
                Super Admin
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-tertiary-container">
              Restricted Access
            </span>
            <h2 className="font-headline text-5xl font-bold leading-tight mb-6 mt-2">
              Global <br />
              Operations
            </h2>
            <p className="text-xl font-light leading-relaxed mb-10 opacity-90">
              Oversee multi-tenant architecture, manage global billing, and control infrastructure
              across 500+ clinics worldwide.
            </p>

            <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-4">
              <span className="material-symbols-outlined text-tertiary-container text-3xl">
                public
              </span>
              <div>
                <p className="text-sm font-bold tracking-wide">Infrastructure Health</p>
                <p className="text-xs opacity-70">All systems operating normally</p>
              </div>
            </div>
          </div>
          <div className="text-xs tracking-widest uppercase opacity-60 font-semibold">
            © 2024 DentFlow AI Systems
          </div>
        </div>
      </section>

      {/* Auth Form Side */}
      <section className="w-full lg:w-7/12 flex items-center justify-center p-8 relative">
        {/* AI Glow Background Element */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none bg-gradient-to-r from-tertiary to-outline-variant opacity-15 blur-[60px]"></div>

        <div className="w-full max-w-md space-y-10 relative z-10">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <span
              className="material-symbols-outlined text-tertiary text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield
            </span>
            <h1 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
              DentFlow Admin
            </h1>
          </div>

          <header>
            <h3 className="font-headline text-4xl font-bold text-on-surface mb-2 tracking-tight">
              System Login
            </h3>
            <p className="text-on-surface-variant text-lg">
              Authenticate to access the backend terminal.
            </p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-error-container/50 text-on-error-container text-sm p-4 rounded-xl font-medium flex items-start gap-3 border border-error/20 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="material-symbols-outlined text-error mt-0.5">warning</span>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface-variant" htmlFor="email">
                Admin ID (Email)
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/60 group-focus-within:text-tertiary transition-colors">
                  admin_panel_settings
                </span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-4 focus:ring-tertiary/10 focus:border-tertiary outline-none transition-all duration-300 text-on-surface placeholder:text-outline-variant font-medium"
                  id="email"
                  placeholder="admin@dentflow.demo"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  readOnly={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  className="block text-sm font-bold text-on-surface-variant"
                  htmlFor="password"
                >
                  Security Key
                </label>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/60 group-focus-within:text-tertiary transition-colors">
                  lock
                </span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-4 focus:ring-tertiary/10 focus:border-tertiary outline-none transition-all duration-300 text-on-surface placeholder:text-outline-variant font-medium tracking-widest"
                  id="password"
                  placeholder="••••••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  readOnly={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 pb-4">
              <div className="relative flex items-center">
                <input
                  className="w-5 h-5 text-tertiary bg-surface-container-lowest border-outline-variant/60 rounded focus:ring-tertiary/20 transition-all cursor-pointer peer appearance-none checked:bg-tertiary checked:border-tertiary"
                  id="remember"
                  type="checkbox"
                />
                <span className="material-symbols-outlined absolute left-0.5 top-0.5 text-white text-[16px] pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                  check
                </span>
              </div>
              <label
                className="text-sm text-on-surface-variant font-bold select-none cursor-pointer"
                htmlFor="remember"
              >
                Trust this device
              </label>
            </div>

            <button
              className="w-full bg-tertiary text-on-tertiary py-4 px-6 rounded-xl font-headline font-bold text-lg shadow-lg shadow-tertiary/10 hover:shadow-xl hover:shadow-tertiary/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:pointer-events-none"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Verifying...
                </>
              ) : (
                <>
                  Access Terminal
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    login
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Form Footer Tools */}
          <div className="mt-12 flex justify-center gap-6 text-sm font-semibold text-outline">
            <Link href="#" className="hover:text-on-surface-variant transition-colors">
              System Protocol
            </Link>
            <span className="w-1 h-1 rounded-full bg-outline-variant/50 self-center"></span>
            <Link href="#" className="hover:text-on-surface-variant transition-colors">
              Emergency Overlay
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
