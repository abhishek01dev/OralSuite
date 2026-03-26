import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150"></div>
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 256 256" className="mx-auto opacity-20">
            <rect width="256" height="256" rx="64" fill="currentColor" />
            <path
              d="M128 60 C88 60 56 80 56 124 C56 160 81 210 100 210 C116 210 128 170 128 170 C128 170 140 210 156 210 C175 210 200 160 200 124 C200 80 168 60 128 60 Z"
              fill="#ffffff"
            />
            <circle cx="128" cy="110" r="14" fill="currentColor" />
          </svg>
        </div>
      </div>

      <h1 className="text-8xl font-extrabold font-headline text-primary/30 mb-4">404</h1>
      <h2 className="text-2xl lg:text-3xl font-bold font-headline text-on-surface mb-4">
        Page Not Found
      </h2>
      <p className="text-on-surface-variant max-w-md mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you
        back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-headline font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          Back to Home
        </Link>
        <Link
          href="/login"
          className="px-8 py-3.5 rounded-xl font-headline font-bold text-sm text-on-surface border border-outline-variant hover:bg-surface-container-low transition-all"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
