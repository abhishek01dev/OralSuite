import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'DentFlow Privacy Policy — Learn how we collect, use, and protect your personal information and patient data.',
};

export default function PrivacyPage() {
  return (
    <article className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Legal</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-on-surface mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-on-surface-variant">Last Updated: March 1, 2026</p>
        </div>

        {/* Content */}
        <div className="prose-dentflow space-y-12">
          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              1. Introduction
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              DentFlow, Inc. (&quot;DentFlow,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) is committed to protecting the privacy of our users, their dental
              practices, and their patients. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use the DentFlow platform, including
              our web application, APIs, and related services (collectively, the
              &quot;Services&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-lg font-bold font-headline text-on-surface mb-2 mt-6">
              2.1 Account Information
            </h3>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              When you create a DentFlow account, we collect your name, email address, phone number,
              practice name, and billing information. This information is necessary to provide and
              maintain your account.
            </p>
            <h3 className="text-lg font-bold font-headline text-on-surface mb-2">
              2.2 Patient Data (PHI)
            </h3>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              As a dental practice management platform, DentFlow processes Protected Health
              Information (PHI) on behalf of our customers. This data is governed by our Business
              Associate Agreement (BAA) and is subject to HIPAA regulations. We act as a Business
              Associate to your practice.
            </p>
            <h3 className="text-lg font-bold font-headline text-on-surface mb-2">2.3 Usage Data</h3>
            <p className="text-on-surface-variant leading-relaxed">
              We automatically collect usage information such as pages viewed, features used,
              session duration, device type, browser type, and IP address. This data helps us
              improve the platform and troubleshoot issues.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
              <li>To provide, maintain, and improve the DentFlow Services</li>
              <li>To process transactions and send related information</li>
              <li>To send technical notices, updates, security alerts, and support messages</li>
              <li>To respond to your comments, questions, and customer service requests</li>
              <li>To analyze usage trends and improve user experience</li>
              <li>To detect, prevent, and address fraud and security issues</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              4. Data Sharing and Disclosure
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
              <li>
                <strong>Service Providers:</strong> Third-party vendors who help us operate our
                platform (e.g., cloud hosting, payment processing)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, regulation, or legal
                process
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or
                asset sale
              </li>
              <li>
                <strong>With Your Consent:</strong> When you have given us explicit permission
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              5. Data Security
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              We implement industry-standard security measures including AES-256 encryption at rest,
              TLS 1.3 encryption in transit, multi-factor authentication, role-based access
              controls, and continuous security monitoring. Our infrastructure is hosted on SOC2
              Type II certified cloud providers with data center locations in the United States.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              6. Data Retention
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              We retain your account information for as long as your account is active. Patient data
              is retained in accordance with applicable healthcare record retention laws (typically
              7–10 years depending on jurisdiction). Upon account termination, we provide a 90-day
              data export window before securely deleting all associated data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              7. Your Rights
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict our processing of your data</li>
              <li>Request portability of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">8. Contact Us</h2>
            <p className="text-on-surface-variant leading-relaxed">
              If you have questions about this Privacy Policy, please contact our Data Protection
              Officer at <strong>privacy@dentflow.com</strong> or write to: DentFlow Inc., 535
              Mission St, Suite 1400, San Francisco, CA 94105.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
