import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security',
  description:
    'DentFlow Security — Learn about our enterprise-grade security architecture, encryption standards, and data protection measures.',
};

const layers = [
  {
    icon: 'dns',
    title: 'Infrastructure Security',
    description:
      'Our infrastructure is hosted on SOC2 Type II certified cloud providers with enterprise-grade physical security, geographic redundancy, and 99.99% uptime SLA.',
  },
  {
    icon: 'vpn_lock',
    title: 'Network Security',
    description:
      'Multi-layered network defense including Web Application Firewall (WAF), DDoS protection, intrusion detection systems, and network segmentation.',
  },
  {
    icon: 'encrypted',
    title: 'Encryption',
    description:
      'AES-256 encryption at rest for all stored data. TLS 1.3 for all data in transit. End-to-end encryption for all PHI and sensitive financial data.',
  },
  {
    icon: 'passkey',
    title: 'Authentication & Access',
    description:
      'Multi-factor authentication (MFA), single sign-on (SSO/SAML), role-based access controls, automatic session management, and IP whitelisting.',
  },
  {
    icon: 'monitoring',
    title: 'Monitoring & Detection',
    description:
      'Real-time threat monitoring, anomaly detection, automated alerting, and 24/7 security operations center (SOC) coverage for all production systems.',
  },
  {
    icon: 'history',
    title: 'Audit & Compliance',
    description:
      'Comprehensive audit logging of all data access and system changes. Immutable logs retained for 7 years. Regular third-party audits and penetration tests.',
  },
];

const practices = [
  'All code undergoes mandatory peer review and automated security scanning before deployment',
  'Dependencies are continuously monitored for known vulnerabilities (CVE tracking)',
  'Secure SDLC with threat modeling integrated into the design phase',
  'Production access requires MFA and is restricted to on-call engineers only',
  'Annual third-party penetration testing by independent security firms',
  'Bug bounty program for responsible vulnerability disclosure',
  'Employee background checks and ongoing security awareness training',
  'Incident response plan tested through quarterly tabletop exercises',
];

export default function SecurityPage() {
  return (
    <article>
      {/* Hero */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary-fixed-dim/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span
              className="material-symbols-outlined text-primary text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              security
            </span>
          </div>
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Security</p>
          <h1 className="text-4xl lg:text-6xl font-extrabold font-headline text-on-surface mb-6 tracking-tight">
            Enterprise-Grade Security
          </h1>
          <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Security is not an afterthought at DentFlow — it&apos;s the foundation of our platform.
            We employ defense-in-depth principles to protect every layer of your data.
          </p>
        </div>
      </section>

      {/* Security Layers */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-12 text-center">
            Multi-Layer Security Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {layers.map((layer) => (
              <div
                key={layer.title}
                className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 hover:shadow-lg transition-shadow"
              >
                <span
                  className="material-symbols-outlined text-primary text-3xl mb-4 block"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {layer.icon}
                </span>
                <h3 className="text-lg font-bold font-headline mb-3">{layer.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {layer.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20 px-6 bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-12 text-center">
            Security Practices
          </h2>
          <div className="space-y-4">
            {practices.map((practice) => (
              <div
                key={practice}
                className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-outline-variant/10"
              >
                <span className="material-symbols-outlined text-secondary text-xl mt-0.5 shrink-0">
                  check_circle
                </span>
                <p className="text-on-surface-variant leading-relaxed">{practice}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Residency */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
              Data Residency
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              All customer data is stored exclusively in data centers located within the United
              States. Enterprise customers may request specific data residency configurations to
              meet regulatory requirements.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              Data backups are encrypted and stored in geographically separate regions to ensure
              business continuity and disaster recovery capabilities with an RPO of less than 1
              hour.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold font-headline">
            Have Security Questions?
          </h2>
          <p className="text-on-surface-variant text-lg">
            Our security team welcomes inquiries. We also provide security questionnaire responses
            and SOC2 reports under NDA.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary text-on-primary px-10 py-4 rounded-2xl font-headline font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            Contact Security Team
          </Link>
        </div>
      </section>
    </article>
  );
}
