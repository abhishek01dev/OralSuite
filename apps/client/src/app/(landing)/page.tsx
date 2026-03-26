'use client';
import Link from 'next/link';
import { AnimatedHero } from '@/components/landing/AnimatedHero';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { TrustBadgeMarquee } from '@/components/landing/TrustBadgeMarquee';
import { PricingSection } from '@/components/landing/PricingSection';

export default function LandingPage() {
  return (
    <>
      <AnimatedHero />

      {/* Value Proposition snippet */}
      <section id="platform" className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-extrabold font-headline text-on-surface mb-4">
              Precision Meets Intelligence
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Built for clinicians who demand accuracy and operators who prioritize growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-10 bg-surface-container-lowest rounded-2xl transition-all hover:translate-y-[-8px]">
              <div className="w-14 h-14 bg-primary-fixed-dim/30 rounded-xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-primary text-3xl">biotech</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 font-headline">Clinical Precision</h3>
              <p className="text-on-surface-variant leading-relaxed">
                AI-assisted diagnostics and charting that reduces human error and improves patient
                outcomes through predictive modeling.
              </p>
            </div>
            <div className="group p-10 bg-surface-container-lowest rounded-2xl transition-all hover:translate-y-[-8px]">
              <div className="w-14 h-14 bg-secondary-container/30 rounded-xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-secondary text-3xl">
                  auto_awesome
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 font-headline">Smart Automation</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Instant note generation and automated follow-ups that reclaim up to 15 hours of
                administrative time per week.
              </p>
            </div>
            <div className="group p-10 bg-surface-container-lowest rounded-2xl transition-all hover:translate-y-[-8px]">
              <div className="w-14 h-14 bg-tertiary-fixed-dim/30 rounded-xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-tertiary text-3xl">
                  trending_up
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 font-headline">Business Growth</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Comprehensive multi-branch analytics to optimize chair-time, patient retention, and
                clinical profitability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div id="features">
        <FeatureShowcase />
      </div>
      <div id="trust">
        <TrustBadgeMarquee />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-on-surface mb-4 font-headline">
              Frequently Asked Questions
            </h2>
            <p className="text-on-surface-variant">
              Everything you need to know about getting started with DentFlow.
            </p>
          </div>
          <div className="space-y-4">
            <details
              className="group bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 cursor-pointer"
              open
            >
              <summary className="flex items-center justify-between font-bold text-lg list-none font-headline">
                Is it HIPAA compliant?
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <p className="mt-4 text-on-surface-variant leading-relaxed">
                Absolutely. DentFlow is fully HIPAA compliant and SOC2 Type II certified. We use
                end-to-end encryption for all patient data, and our AI systems are designed to
                process information without retaining personal health identifiers (PHI) in
                unencrypted training sets.
              </p>
            </details>
            <details className="group bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-lg list-none font-headline">
                Can I migrate my data from Open Dental or Eaglesoft?
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <p className="mt-4 text-on-surface-variant leading-relaxed">
                Yes, our dedicated implementation team handles full data migration from all major
                dental practice management software including Open Dental, Eaglesoft, Dentrix, and
                more. We ensure your patient records, clinical charts, and historical data are moved
                safely and accurately.
              </p>
            </details>
            <details className="group bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-lg list-none font-headline">
                How long does onboarding take?
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <p className="mt-4 text-on-surface-variant leading-relaxed">
                The average onboarding process takes between 14 and 21 days. This includes software
                setup, data migration, and comprehensive training for your clinical and
                administrative staff. We provide onsite training for Enterprise customers and live
                virtual sessions for Basic and Pro plans.
              </p>
            </details>
            <details className="group bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-lg list-none font-headline">
                Do you offer a free trial?
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <p className="mt-4 text-on-surface-variant leading-relaxed">
                Yes! We offer a 14-day full-access free trial. You can explore all the Pro features,
                including the AI Note Generator and interactive charting, with a sample database to
                see exactly how it will transform your daily workflow.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-surface-bright border-t border-outline-variant/10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight font-headline">
            Transform Your Practice Today
          </h2>
          <p className="text-xl text-on-surface-variant">
            Join the dental revolution. High-precision care starts with high-precision software.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/login"
              className="bg-primary-container text-on-primary px-10 py-5 rounded-2xl font-headline font-bold text-xl shadow-xl active:scale-95 transition-all text-center"
            >
              Start 14-Day Free Trial
            </Link>
            <Link
              href="/book-demo"
              className="px-10 py-5 rounded-2xl font-headline font-bold text-xl text-on-surface border border-outline-variant hover:bg-surface-container-low transition-all text-center"
            >
              Book a Demo
            </Link>
          </div>
          <div className="pt-8">
            <p className="text-sm font-medium text-on-surface-variant flex items-center justify-center gap-2">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                security
              </span>
              HIPAA Compliant &amp; SOC2 Certified Data Protection
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
