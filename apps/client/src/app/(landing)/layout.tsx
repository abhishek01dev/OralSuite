import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface font-body selection:bg-primary-fixed-dim text-on-surface w-full overflow-x-hidden flex flex-col min-h-screen">
      <LandingNavbar />
      <main className="pt-24 flex-grow">{children}</main>
      <LandingFooter />
    </div>
  );
}
