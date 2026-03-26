export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <svg width="48" height="48" viewBox="0 0 256 256" className="animate-pulse text-primary">
            <rect width="256" height="256" rx="64" fill="currentColor" />
            <path
              d="M128 60 C88 60 56 80 56 124 C56 160 81 210 100 210 C116 210 128 170 128 170 C128 170 140 210 156 210 C175 210 200 160 200 124 C200 80 168 60 128 60 Z"
              fill="#ffffff"
            />
            <circle cx="128" cy="110" r="14" fill="currentColor" />
          </svg>
          <div
            className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary"
            style={{ width: 64, height: 64, top: -8, left: -8 }}
          ></div>
        </div>
        <p className="text-sm font-medium text-on-surface-variant animate-pulse font-headline">
          Loading DentFlow...
        </p>
      </div>
    </div>
  );
}
