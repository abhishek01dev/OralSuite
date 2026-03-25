"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const forgotPassword = useAuthStore(state => state.forgotPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      await forgotPassword(email);
      setStatus("success");
    } catch (err: any) {
      console.error("Forgot password failed:", err);
      setError(err.message || "Failed to send reset link. Please try again.");
      setStatus("error");
    }
  };

  return (
    <main className="flex min-h-screen bg-surface-container-low font-body text-on-surface antialiased overflow-hidden selection:bg-primary-fixed-dim">
      
      {/* Visual / Branding Sidebar */}
      <section className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-on-surface">
        <img 
          alt="Modern clinical architecture" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZYZfMa0iLKrSy0OKB0M_vjlX3rU_7mrNCPvnsCl0sDK6LNJEp0ALEHGmEM1Bxuc0OKaaPevbfj7kOie1yHkbfmsc1C0ORBXUrj9RTZm_3OE_hEcwZOY-yjZoyxicF1eCQXWPIqRDyEWaVJe7GvizGpEdOC4OBknKEp60HUWbpMY_Fgcflf5AbKQq0dBwXvJ-FQ0M3-UFazbl1AgqqDlSD8LNBqp3WxGpQZqtOTB0jA35S_s6pOhetdZ_LnBxyTCYhT7QoCg_EBd2q" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-tertiary/90 via-secondary-container/70 to-background/20 backdrop-blur-[2px]"></div>
        
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
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md rounded-full border border-white/20">Security</span>
            <h2 className="font-headline text-5xl font-bold leading-tight mb-6 mt-2">
              Recover your <br/>workspace
            </h2>
            <p className="text-xl font-light leading-relaxed mb-10 opacity-90">
              Identity verification and secure credential restoration for the DentFlow clinical ecosystem.
            </p>
          </div>
          <div className="text-xs tracking-widest uppercase opacity-60 font-semibold">
            © 2024 DentFlow AI Systems
          </div>
        </div>
      </section>
      
      {/* Auth Form Side */}
      <section className="w-full lg:w-7/12 flex items-center justify-center p-8 relative">
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none bg-gradient-to-r from-tertiary to-secondary-container opacity-10 blur-[80px]"></div>
        
        <div className="w-full max-w-md space-y-10 relative z-10">
          <header>
            <h3 className="font-headline text-4xl font-bold text-on-surface mb-2 tracking-tight">Forgot password?</h3>
            <p className="text-on-surface-variant text-lg">Enter your email and we'll send you a recovery link.</p>
          </header>

          {status === "success" ? (
            <div className="bg-primary-container/30 border border-primary/20 p-8 rounded-2xl space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto text-on-primary-container">
                <span className="material-symbols-outlined text-4xl">mark_email_read</span>
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-xl font-bold text-on-surface">Check your inbox</h4>
                <p className="text-on-surface-variant font-medium">
                  We've sent reset instructions to <span className="text-primary font-bold">{email}</span> if it matches an existing account.
                </p>
              </div>
              <Link 
                href="/login" 
                className="w-full bg-on-surface text-surface-container-lowest py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="bg-error-container/50 text-on-error-container text-sm p-4 rounded-xl font-medium flex items-start gap-3 border border-error/20 animate-in fade-in slide-in-from-top-2">
                  <span className="material-symbols-outlined text-error mt-0.5">warning</span>
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 text-on-surface placeholder:text-outline/50" 
                    id="email" 
                    placeholder="dr.smith@dentoflow.com" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
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
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Sending link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                  </>
                )}
              </button>
              
              <div className="text-center pt-2">
                <Link href="/login" className="text-sm font-bold text-primary hover:underline decoration-2 underline-offset-4 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
