import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'DentFlow Terms of Service — Read the terms and conditions governing your use of the DentFlow platform.',
};

export default function TermsPage() {
  return (
    <article className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Legal</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-on-surface mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-on-surface-variant">Effective Date: March 1, 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              By accessing or using the DentFlow platform (&quot;Services&quot;), you agree to be
              bound by these Terms of Service (&quot;Terms&quot;). If you are using the Services on
              behalf of a dental practice or organization, you represent that you have the authority
              to bind that entity to these Terms. If you do not agree to these Terms, do not use the
              Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              2. Description of Services
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              DentFlow provides a cloud-based dental practice management platform that includes
              practice analytics, AI-assisted clinical charting, appointment scheduling, patient
              management, billing, inventory tracking, and related tools. Access to specific
              features depends on your subscription plan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              3. Account Registration
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              To use DentFlow, you must create an account and provide accurate, complete, and
              current information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring all users within your practice comply with these Terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              4. Subscription and Billing
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              DentFlow is offered on a subscription basis. By subscribing, you agree to pay the
              applicable fees for your chosen plan. Subscriptions auto-renew unless cancelled at
              least 30 days before the renewal date.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
              <li>All fees are quoted in USD and are non-refundable except as required by law</li>
              <li>We may change pricing with 60 days&apos; written notice</li>
              <li>
                Overdue amounts accrue interest at 1.5% per month or the maximum rate permitted by
                law
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              5. Acceptable Use
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
              <li>
                Use the Services for any unlawful purpose or in violation of healthcare regulations
              </li>
              <li>Attempt to gain unauthorized access to any portion of the Services</li>
              <li>Interfere with or disrupt the integrity or performance of the Services</li>
              <li>Reverse engineer, decompile, or disassemble the Services</li>
              <li>Use the Services to transmit viruses, malware, or other harmful code</li>
              <li>Resell, sublicense, or redistribute the Services without written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              6. Data Ownership
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              You retain all ownership rights to the data you input into DentFlow, including patient
              records. DentFlow does not claim any ownership of your data. We process your data
              solely to provide the Services and as described in our Privacy Policy and Business
              Associate Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              The DentFlow platform, including its code, design, features, documentation, and
              trademarks, is the exclusive property of DentFlow, Inc. Your subscription grants you a
              limited, non-exclusive, non-transferable license to use the Services during the
              subscription term.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DENTFLOW SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE
              SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE FEES PAID BY YOU IN THE TWELVE (12)
              MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              9. Termination
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              Either party may terminate these Terms with 30 days&apos; written notice. We may
              suspend or terminate your access immediately if you breach these Terms. Upon
              termination, you will have 90 days to export your data. After that period, we will
              securely delete all your data from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              10. Governing Law
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of the State of
              California, without regard to conflict of law principles. Any disputes shall be
              resolved in the state or federal courts located in San Francisco County, California.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">11. Contact</h2>
            <p className="text-on-surface-variant leading-relaxed">
              For questions about these Terms, contact us at <strong>legal@dentflow.com</strong> or
              write to: DentFlow Inc., 535 Mission St, Suite 1400, San Francisco, CA 94105.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
