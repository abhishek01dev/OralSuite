import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with DentFlow. Reach our sales, support, or partnerships team via email, phone, or our office locations.',
};

const channels = [
  {
    icon: 'mail',
    title: 'Email Us',
    primary: 'hello@dentflow.com',
    secondary: 'support@dentflow.com',
    label: 'General inquiries & technical support',
  },
  {
    icon: 'call',
    title: 'Call Us',
    primary: '+1 (888) 336-8356',
    secondary: 'Mon–Fri, 8 AM – 6 PM EST',
    label: 'Speak directly with our team',
  },
  {
    icon: 'location_on',
    title: 'Visit Us',
    primary: '535 Mission St, Suite 1400',
    secondary: 'San Francisco, CA 94105',
    label: 'Our headquarters',
  },
];

export default function ContactPage() {
  return (
    <article>
      {/* Hero */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Contact</p>
          <h1 className="text-4xl lg:text-6xl font-extrabold font-headline text-on-surface mb-6 tracking-tight">
            We&apos;d Love to Hear from You
          </h1>
          <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Whether you&apos;re exploring DentFlow for your practice, need technical support, or
            want to discuss a partnership — our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {channels.map((ch) => (
            <div
              key={ch.title}
              className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-primary-fixed-dim/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span
                  className="material-symbols-outlined text-primary text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {ch.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold font-headline mb-4">{ch.title}</h3>
              <p className="text-on-surface font-medium">{ch.primary}</p>
              <p className="text-on-surface-variant text-sm mt-1">{ch.secondary}</p>
              <p className="text-xs text-on-surface-variant mt-3">{ch.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-16 px-6 bg-surface-container-lowest">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold font-headline text-on-surface mb-6">
            Support Hours
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-surface rounded-2xl border border-outline-variant/10">
              <p className="font-bold font-headline text-on-surface mb-1">Standard Support</p>
              <p className="text-sm text-on-surface-variant">Mon – Fri, 8 AM – 6 PM EST</p>
            </div>
            <div className="p-6 bg-surface rounded-2xl border border-outline-variant/10">
              <p className="font-bold font-headline text-on-surface mb-1">Priority Support</p>
              <p className="text-sm text-on-surface-variant">Mon – Sat, 7 AM – 10 PM EST</p>
            </div>
            <div className="p-6 bg-surface rounded-2xl border border-outline-variant/10">
              <p className="font-bold font-headline text-on-surface mb-1">Enterprise</p>
              <p className="text-sm text-on-surface-variant">24/7 Dedicated Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold font-headline">
            Prefer a Live Walkthrough?
          </h2>
          <p className="text-on-surface-variant text-lg">
            Book a personalized demo and our team will show you exactly how DentFlow fits your
            practice.
          </p>
          <Link
            href="/book-demo"
            className="inline-block bg-primary text-on-primary px-10 py-4 rounded-2xl font-headline font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            Book a Demo
          </Link>
        </div>
      </section>
    </article>
  );
}
