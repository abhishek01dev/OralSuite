'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';

export default function ClientRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    practiceName: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const register = useAuthStore((state) => state.register);
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await register(formData);
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Registration failed:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        <div className="absolute inset-0 bg-gradient-to-bl from-secondary/90 via-tertiary-container/80 to-background/20 backdrop-blur-[2px]"></div>

        {/* Decorative elements */}
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-secondary-container rounded-full blur-[100px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-fixed-dim rounded-full blur-[120px] opacity-30"></div>

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
              Onboarding
            </span>
            <h2 className="font-headline text-5xl font-bold leading-tight mb-6 mt-2">
              Join the future <br />
              of dentistry
            </h2>
            <p className="text-xl font-light leading-relaxed mb-10 opacity-90">
              Set up your practice in minutes and reclaim 15+ hours a week in administrative
              overhead.
            </p>

            {/* Steps indicator visualization */}
            <div className="flex gap-4 mb-4">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-12 bg-white' : 'w-6 bg-white/30'}`}
              ></div>
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'w-12 bg-white' : 'w-6 bg-white/30'}`}
              ></div>
            </div>
            <p className="text-sm font-semibold opacity-80 uppercase tracking-widest">
              Step {step} of 2: {step === 1 ? 'Personal Info' : 'Practice Setup'}
            </p>
          </div>
          <div className="text-xs tracking-widest uppercase opacity-60 font-semibold">
            © 2024 DentFlow AI Systems
          </div>
        </div>
      </section>

      {/* Auth Form Side */}
      <section className="w-full lg:w-7/12 flex items-center justify-center p-8 relative">
        {/* AI Glow Background Element */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none bg-gradient-to-r from-secondary to-tertiary-container opacity-15 blur-[60px]"></div>

        <div className="w-full max-w-md space-y-10 relative z-10">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <span
              className="material-symbols-outlined text-secondary text-3xl"
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
              {step === 1 ? 'Create Account' : 'Practice Details'}
            </h3>
            <p className="text-on-surface-variant text-lg">
              {step === 1
                ? 'Enter your clinical credentials to begin.'
                : 'Set up your clinic workspace environment.'}
            </p>
            {error && (
              <div className="mt-4 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
          </header>

          {step === 1 ? (
            <form
              onSubmit={handleNext}
              className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold text-on-surface-variant"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 text-on-surface placeholder:text-outline/50"
                    id="firstName"
                    placeholder="Sarah"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateForm('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold text-on-surface-variant"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 text-on-surface placeholder:text-outline/50"
                    id="lastName"
                    placeholder="Jensen"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateForm('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-on-surface-variant"
                  htmlFor="email"
                >
                  Work Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                    mail
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 text-on-surface placeholder:text-outline/50"
                    id="email"
                    placeholder="dr.jensen@clinic.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                className="w-full bg-on-surface text-surface-container-lowest py-4 px-6 rounded-lg font-bold text-lg shadow-xl shadow-on-surface/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                type="submit"
              >
                Continue
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleRegister}
              className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-on-surface-variant"
                  htmlFor="practiceName"
                >
                  Practice Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                    domain
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 text-on-surface placeholder:text-outline/50"
                    id="practiceName"
                    placeholder="Elite Dental Care"
                    type="text"
                    value={formData.practiceName}
                    onChange={(e) => updateForm('practiceName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-on-surface-variant"
                  htmlFor="password"
                >
                  Secure Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                    lock
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 text-on-surface placeholder:text-outline/50 tracking-widest"
                    id="password"
                    placeholder="••••••••••••"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    required
                  />
                </div>
                <p className="text-[11px] text-outline font-medium mt-1">
                  Must be at least 12 characters, including HIPAA compliant symbols.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-surface-container-highest text-on-surface py-4 rounded-lg font-bold hover:bg-outline-variant/30 transition-colors flex items-center justify-center border border-outline-variant/20"
                >
                  Back
                </button>
                <button
                  className="w-2/3 bg-primary-container text-on-primary py-4 px-6 rounded-lg font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-xl">
                        progress_activity
                      </span>
                      Building...
                    </>
                  ) : (
                    <>
                      Complete
                      <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                        check_circle
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-on-surface-variant text-sm">
              Already a member?{' '}
              <Link
                href="/login"
                className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Form Footer Tools */}
          <div className="mt-12 flex justify-center gap-6 text-sm font-semibold text-outline">
            <Link href="/" className="hover:text-on-surface-variant transition-colors">
              Return to Home
            </Link>
            <span className="w-1 h-1 rounded-full bg-outline-variant/50 self-center"></span>
            <Link href="#" className="hover:text-on-surface-variant transition-colors">
              Privacy Policy
            </Link>
            <span className="w-1 h-1 rounded-full bg-outline-variant/50 self-center"></span>
            <Link href="#" className="hover:text-on-surface-variant transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
