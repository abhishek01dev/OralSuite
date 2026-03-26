'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export function LandingNavbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-surface/80 backdrop-blur-md border-outline-variant/20 py-3 shadow-sm'
          : 'bg-surface/0 border-transparent py-5'
      } px-6 md:px-12`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <svg
            width="32"
            height="32"
            viewBox="0 0 256 256"
            className="rounded-lg shadow-sm group-hover:scale-105 transition-transform"
          >
            <rect width="256" height="256" rx="64" fill="#0ea5e9" />
            <path
              d="M128 60 C88 60 56 80 56 124 C56 160 81 210 100 210 C116 210 128 170 128 170 C128 170 140 210 156 210 C175 210 200 160 200 124 C200 80 168 60 128 60 Z"
              fill="#ffffff"
            />
            <circle cx="128" cy="110" r="14" fill="#0ea5e9" />
          </svg>
          <div>
            <h1 className="text-xl font-bold font-headline text-on-surface tracking-tight">
              DentFlow
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold leading-none mt-0.5">
              Clinical OS
            </p>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8 font-manrope font-semibold text-sm">
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors"
            href="/#platform"
          >
            Platform
          </Link>
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors"
            href="/#features"
          >
            Features
          </Link>
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors"
            href="/#trust"
          >
            Trust
          </Link>
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors"
            href="/#pricing"
          >
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            className="hidden md:block text-on-surface-variant hover:text-primary font-manrope font-bold text-sm transition-colors"
            href="/login"
          >
            Sign In
          </Link>
          <Link
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-headline font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            href="/login"
          >
            Book Demo
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
