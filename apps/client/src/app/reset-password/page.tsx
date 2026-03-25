"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const resetPassword = useAuthStore(state => state.resetPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      await resetPassword({ token, password });
      setStatus("success");
      // Auto redirect after 3 seconds
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      console.error("Reset password failed:", err);
      setError(err.message || "Failed to reset password. The link may be expired.");
      setStatus("error");
    }
  };

  if (!token && status !== "success") {
    return (
      <div className="bg-error-container/20 border border-error/20 p-8 rounded-2xl text-center space-y-4">
        <span className="material-symbols-outlined text-5xl text-error">link_off</span>
        <h4 className="text-xl font-bold text-on-surface">Invalid Reset Link</h4>
        <p className="text-on-surface-variant">The password reset link is missing or malformed. Please request a new one.</p>
        <Link href="/forgot-password" className="inline-block text-primary font-bold hover:underline">Request New Link</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-10 relative z-10">
      <header>
        <h3 className="font-headline text-4xl font-bold text-on-surface mb-2 tracking-tight">Set New Password</h3>
        <p className="text-on-surface-variant text-lg">Choose a strong, secure password for your clinical workspace.</p>
      </header>

      {status === "success" ? (
        <div className="bg-primary-container/30 border border-primary/20 p-8 rounded-2xl space-y-6 animate-in zoom-in-95 duration-500 text-center">
          <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto text-on-primary-container">
            <span className="material-symbols-outlined text-4xl">verified_user</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-on-surface">Password Updated</h4>
            <p className="text-on-surface-variant font-medium">Your credentials have been successfully restored. Redirecting to login...</p>
          </div>
          <Link href="/login" className="w-full bg-on-surface text-surface-container-lowest py-4 rounded-lg font-bold text-lg flex items-center justify-center">
            Log In Now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-error-container/50 text-on-error-container text-sm p-4 rounded-xl font-medium flex items-start gap-3 border border-error/20 animate-in fade-in slide-in-from-top-2">
              <span className="material-symbols-outlined text-error mt-0.5">warning</span>
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="password">New Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
              <input 
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 text-on-surface placeholder:text-outline/50 tracking-widest" 
                id="password" 
                placeholder="••••••••••••" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={8}
                disabled={status === "loading"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock_reset</span>
              <input 
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 text-on-surface placeholder:text-outline/50 tracking-widest" 
                id="confirmPassword" 
                placeholder="••••••••••••" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                disabled={status === "loading"}
              />
            </div>
          </div>
          
          <button 
            className="w-full bg-primary-container text-on-primary py-4 px-6 rounded-lg font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none" 
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                Resetting...
              </>
            ) : (
              <>
                Update Password
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">security</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPassword() {
  return (
    <main className="flex min-h-screen bg-surface-container-low font-body text-on-surface antialiased overflow-hidden selection:bg-primary-fixed-dim">
      {/* Sidebar - Same as Login/Forgot for consistency */}
      <section className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-on-surface">
        <img 
          alt="Clinical excellence" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZYZfMa0iLKrSy0OKB0M_vjlX3rU_7mrNCPvnsCl0sDK6LNJEp0ALEHGmEM1Bxuc0OKaaPevbfj7kOie1yHkbfmsc1C0ORBXUrj9RTZm_3OE_hEcwZOY-yjZoyxicF1eCQXWPIqRDyEWaVJe7GvizGpEdOC4OBknKEp60HUWbpMY_Fgcflf5AbKQq0dBwXvJ-FQ0M3-UFazbl1AgqqDlSD8LNBqp3WxGpQZqtOTB0jA35S_s6pOhetdZ_LnBxyTCYhT7QoCg_EBd2q" 
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-fixed-dim/90 via-secondary-container/80 to-background/20 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full text-surface-container-lowest">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-2xl">dentistry</span>
            </div>
            <div>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight">DentFlow</h1>
              <p className="text-[10px] uppercase tracking-widest font-bold leading-none mt-0.5 opacity-80">Clinical OS</p>
            </div>
          </Link>
          
          <div className="max-w-md">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md rounded-full border border-white/20">Identity</span>
            <h2 className="font-headline text-5xl font-bold leading-tight mb-6 mt-2">
              Secure <br/>Reset
            </h2>
            <p className="text-xl font-light leading-relaxed mb-10 opacity-90">
              Restoring access to your premium practice management environment with advanced encryption protocols.
            </p>
          </div>
          <div className="text-xs tracking-widest uppercase opacity-60 font-semibold">
            © 2024 DentFlow AI Systems
          </div>
        </div>
      </section>

      <section className="w-full lg:w-7/12 flex items-center justify-center p-8 relative">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none bg-gradient-to-r from-primary to-secondary-container opacity-10 blur-[80px]"></div>
        <Suspense fallback={<div className="animate-pulse flex flex-col gap-4 w-full max-w-md"><div className="h-10 bg-surface-container-highest rounded w-3/4"></div><div className="h-4 bg-surface-container-highest rounded w-1/2"></div><div className="h-40 bg-surface-container-highest rounded mt-8"></div></div>}>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}
