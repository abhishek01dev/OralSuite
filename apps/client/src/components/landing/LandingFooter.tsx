'use client';

import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 pt-20 pb-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 256 256" className="rounded-md">
              <rect width="256" height="256" rx="64" fill="#0ea5e9" />
              <path
                d="M128 60 C88 60 56 80 56 124 C56 160 81 210 100 210 C116 210 128 170 128 170 C128 170 140 210 156 210 C175 210 200 160 200 124 C200 80 168 60 128 60 Z"
                fill="#ffffff"
              />
              <circle cx="128" cy="110" r="14" fill="#0ea5e9" />
            </svg>
            <span className="text-xl font-bold font-headline text-on-surface tracking-tight">
              DentFlow
            </span>
          </Link>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            The intelligent clinical operating system for modern dental practices. Automate notes,
            optimize scheduling, and scale your growth securely.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-on-surface mb-4 font-headline uppercase tracking-wider text-xs">
            Product
          </h3>
          <ul className="space-y-3 text-sm text-on-surface-variant font-medium">
            <li>
              <Link href="/#features" className="hover:text-primary transition-colors">
                AI Note Generator
              </Link>
            </li>
            <li>
              <Link href="/#platform" className="hover:text-primary transition-colors">
                Interactive Charting
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="hover:text-primary transition-colors">
                Pricing Options
              </Link>
            </li>
            <li>
              <Link href="/book-demo" className="hover:text-primary transition-colors">
                Book a Demo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-on-surface mb-4 font-headline uppercase tracking-wider text-xs">
            Company
          </h3>
          <ul className="space-y-3 text-sm text-on-surface-variant font-medium">
            <li>
              <Link href="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/success-stories" className="hover:text-primary transition-colors">
                Success Stories
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-primary transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-on-surface mb-4 font-headline uppercase tracking-wider text-xs">
            Legal
          </h3>
          <ul className="space-y-3 text-sm text-on-surface-variant font-medium">
            <li>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/hipaa" className="hover:text-primary transition-colors">
                HIPAA Compliance
              </Link>
            </li>
            <li>
              <Link href="/security" className="hover:text-primary transition-colors">
                Security
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-outline-variant/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-on-surface-variant font-medium">
          &copy; {new Date().getFullYear()} DentFlow Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <a href="#" className="hover:text-primary transition-colors">
            <span className="sr-only">Twitter</span>
            <span className="material-symbols-outlined text-xl">language</span>
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <span className="sr-only">LinkedIn</span>
            <span className="material-symbols-outlined text-xl">work</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
