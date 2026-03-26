import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'HIPAA Compliance',
  description:
    'DentFlow is fully HIPAA compliant. Learn about our administrative, physical, and technical safeguards for protecting patient health information.',
};

const safeguards = [
  {
    icon: 'admin_panel_settings',
    title: 'Administrative Safeguards',
    items: [
      'Designated Privacy and Security Officers',
      'Comprehensive workforce training program',
      'Risk analysis conducted annually',
      'Documented policies and procedures',
      'Business Associate Agreements (BAAs) with all sub-processors',
      'Incident response and breach notification procedures',
    ],
  },
  {
    icon: 'shield',
    title: 'Technical Safeguards',
    items: [
      'AES-256 encryption for data at rest',
      'TLS 1.3 encryption for data in transit',
      'Multi-factor authentication (MFA)',
      'Role-based access controls (RBAC)',
      'Automatic session timeout and lockout',
      'Comprehensive audit logging of all PHI access',
    ],
  },
  {
    icon: 'domain',
    title: 'Physical Safeguards',
    items: [
      'SOC2 Type II certified data centers',
      'Biometric access controls at facilities',
      'Redundant power and cooling systems',
      'Geographic data center redundancy',
      '24/7 facility monitoring and surveillance',
      'Secure media disposal procedures',
    ],
  },
];

export default function HipaaPage() {
  return (
    <article>
      {/* Hero */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-16 h-16 bg-secondary-container/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span
              className="material-symbols-outlined text-secondary text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
          </div>
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
            Compliance
          </p>
          <h1 className="text-4xl lg:text-6xl font-extrabold font-headline text-on-surface mb-6 tracking-tight">
            HIPAA Compliance
          </h1>
          <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            DentFlow is fully compliant with the Health Insurance Portability and Accountability Act
            (HIPAA). We implement comprehensive administrative, technical, and physical safeguards
            to protect your patients&apos; Protected Health Information (PHI).
          </p>
        </div>
      </section>

      {/* BAA Section */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              Business Associate Agreement (BAA)
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              DentFlow executes a HIPAA-compliant Business Associate Agreement with every customer.
              The BAA defines our responsibilities as a Business Associate and ensures that all PHI
              processed through our platform is handled in compliance with HIPAA regulations.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              Our BAA covers the Privacy Rule, Security Rule, and Breach Notification Rule.
              Enterprise customers may request a customized BAA through their account manager.
            </p>
          </div>
        </div>
      </section>

      {/* Safeguards */}
      <section className="py-20 px-6 bg-surface-container-lowest">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-12 text-center">
            Our HIPAA Safeguards
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {safeguards.map((sg) => (
              <div
                key={sg.title}
                className="p-8 bg-surface rounded-2xl border border-outline-variant/10"
              >
                <span
                  className="material-symbols-outlined text-primary text-3xl mb-4 block"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {sg.icon}
                </span>
                <h3 className="text-xl font-bold font-headline mb-4">{sg.title}</h3>
                <ul className="space-y-3">
                  {sg.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-secondary text-base mt-0.5 shrink-0">
                        check_circle
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold font-headline text-on-surface mb-8">
            Certifications &amp; Audits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
              <p className="text-2xl font-extrabold font-headline text-primary mb-2">SOC2</p>
              <p className="text-sm text-on-surface-variant">Type II Certified</p>
            </div>
            <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
              <p className="text-2xl font-extrabold font-headline text-primary mb-2">HIPAA</p>
              <p className="text-sm text-on-surface-variant">Fully Compliant</p>
            </div>
            <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
              <p className="text-2xl font-extrabold font-headline text-primary mb-2">Annual</p>
              <p className="text-sm text-on-surface-variant">Third-Party Penetration Tests</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold font-headline">
            Questions About Compliance?
          </h2>
          <p className="text-on-surface-variant text-lg">
            Our compliance team is available to discuss HIPAA requirements, review our BAA, or
            address any security concerns.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary text-on-primary px-10 py-4 rounded-2xl font-headline font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            Contact Compliance Team
          </Link>
        </div>
      </section>
    </article>
  );
}
