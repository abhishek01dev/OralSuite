'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApiError } from '../../lib/api';
import { useAuthStore } from '@/lib/auth-store';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Login failed:', err);
      if (err instanceof ApiError) {
        if (err.code === 'INVALID_CREDENTIALS') {
          setError('Invalid credentials. Please verify your email and password.');
        } else {
          setError(err.message);
        }
      } else {
        setError(
          err instanceof Error ? err.message : 'Connection failed. Please check your network.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-surface-container-low font-body text-on-surface antialiased overflow-hidden selection:bg-primary-fixed-dim">
      {/* Visual / Branding Sidebar */}
      <section className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-on-surface">
        <img
          alt="High-end modern dental clinic interior"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZYZfMa0iLKrSy0OKB0M_vjlX3rU_7mrNCPvnsCl0sDK6LNJEp0ALEHGmEM1Bxuc0OKaaPevbfj7kOie1yHkbfmsc1C0ORBXUrj9RTZm_3OE_hEcwZOY-yjZoyxicF1eCQXWPIqRDyEWaVJe7GvizGpEdOC4OBknKEp60HUWbpMY_Fgcflf5AbKQq0dBwXvJ-FQ0M3-UFazbl1AgqqDlSD8LNBqp3WxGpQZqtOTB0jA35S_s6pOhetdZ_LnBxyTCYhT7QoCg_EBd2q"
        />
        {/* Tonal Layering Overlay matching Landing Page */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-tertiary-container/80 to-background/20 backdrop-blur-[2px]"></div>

        {/* Decorative elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary-fixed-dim rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary-container rounded-full blur-[120px] opacity-30"></div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full text-surface-container-lowest">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-2xl">dentistry</span>
            </div>
            <div>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight">DentFlow</h1>
              <p className="text-[10px] uppercase tracking-widest font-bold leading-none mt-0.5 opacity-80">
                Clinical OS
              </p>
            </div>
          </Link>

          <div className="max-w-md">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md rounded-full border border-white/20">
              Welcome Back
            </span>
            <h2 className="font-headline text-5xl font-bold leading-tight mb-6 mt-2">
              The AI-First <br />
              Dental OS
            </h2>
            <p className="text-xl font-light leading-relaxed mb-10 opacity-90">
              Precision diagnostics and practice management engineered for the next generation of
              clinical excellence.
            </p>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <p className="text-lg font-medium italic mb-4">
                "DentFlow saved us 15 hours a week on admin. My staff is happier, and I get to focus
                on actual surgery."
              </p>
              <div className="flex items-center gap-4">
                <img
                  className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRWXeS7jhEpd944ypJvP9YpjpS6ArNP8ZQHBr7BkvUQxHmzMnezd9nB4v4s1oZrOw4hbnTrU0SQhLzUvQSjnjH6ZO0qyWEDckeo1UdAFWp3_XEoo96lmWAAO0gsqCvS_2ys-_MvHZGa-80UyFvrJ4v7qFD4A1lhc2pOL-v4_RwNawmf8EWcdTDi5HNYweAWceag9Y_80rm-1i9e6KUw0VJTob_iDv9YzC1vEDUUzK9hCoCS37vUX6lsAsSS1iPJXYi49M4W0CtMWVq"
                  alt="Dr. Jensen"
                />
                <div>
                  <p className="font-bold">Dr. Sarah Jensen</p>
                  <p className="text-xs opacity-80">Principal, Elite Dental Care</p>
                </div>
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
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none bg-gradient-to-r from-primary to-tertiary-container opacity-15 blur-[60px]"></div>

        <div className="w-full max-w-md space-y-10 relative z-10">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <span
              className="material-symbols-outlined text-primary text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dentistry
            </span>
            <h1 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
              DentFlow
            </h1>
          </div>

          <header>
            <h3 className="font-headline text-4xl font-bold text-on-surface mb-2 tracking-tight">
              Welcome back
            </h3>
            <p className="text-on-surface-variant text-lg">
              Enter your clinical credentials to continue.
            </p>
          </header>

          {/* SSO Options */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-3 px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors duration-200 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span className="text-sm font-medium text-on-surface">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-3 px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors duration-200 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path d="M1 1h10v10H1z" fill="#f35325"></path>
                <path d="M12 1h10v10H12z" fill="#81bc06"></path>
                <path d="M1 12h10v10H1z" fill="#05a6f0"></path>
                <path d="M12 12h10v10H12z" fill="#ffba08"></path>
              </svg>
              <span className="text-sm font-medium text-on-surface">Microsoft</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/20"></div>
            </div>
            <span className="relative px-4 bg-background text-xs font-semibold text-outline tracking-widest uppercase">
              or email
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-error-container/50 text-on-error-container text-sm p-4 rounded-xl font-medium flex items-start gap-3 border border-error/20 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="material-symbols-outlined text-error mt-0.5">warning</span>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-on-surface-variant"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                  mail
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 text-on-surface placeholder:text-outline/50"
                  id="email"
                  placeholder="dr.smith@dentoflow.com"
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
                  className="block text-sm font-semibold text-on-surface-variant"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-primary hover:text-primary-fixed-variant transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                  lock
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 text-on-surface placeholder:text-outline/50 tracking-widest"
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

            <div className="flex items-center gap-3">
              <input
                className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                id="remember"
                type="checkbox"
              />
              <label
                className="text-sm text-on-surface-variant font-medium select-none"
                htmlFor="remember"
              >
                Remember this workstation for 30 days
              </label>
            </div>

            <button
              className="w-full bg-primary-container text-on-primary py-4 px-6 rounded-lg font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Authenticating...
                </>
              ) : (
                <>
                  Login to OS
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          <footer className="pt-8 text-center">
            <p className="text-on-surface-variant text-sm">
              New practice?{' '}
              <Link
                className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1"
                href="/register"
              >
                Schedule a briefing
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
