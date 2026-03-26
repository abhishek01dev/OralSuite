import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about DentFlow — the AI-powered dental practice management platform built by clinicians, for clinicians.',
};

const values = [
  {
    icon: 'favorite',
    title: 'Patient-First Design',
    description:
      'Every feature we build starts with one question: does this improve the patient experience?',
  },
  {
    icon: 'psychology',
    title: 'AI with Purpose',
    description:
      'We harness artificial intelligence not as a buzzword, but as a tool to eliminate administrative burden and enhance clinical accuracy.',
  },
  {
    icon: 'lock',
    title: 'Uncompromising Security',
    description:
      "HIPAA compliance and SOC2 certification aren't checkboxes — they are foundational pillars of everything we build.",
  },
  {
    icon: 'diversity_3',
    title: 'Built by Clinicians',
    description:
      'Our founding team includes practicing dentists who understand the real-world pain points of running a modern dental practice.',
  },
];

const stats = [
  { value: '2,500+', label: 'Dental Practices' },
  { value: '15M+', label: 'Patient Records Managed' },
  { value: '99.99%', label: 'Platform Uptime' },
  { value: '4.9★', label: 'Average Customer Rating' },
];

export default function AboutPage() {
  return (
    <article>
      {/* Hero */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4">About Us</p>
          <h1 className="text-4xl lg:text-6xl font-extrabold font-headline text-on-surface mb-6 tracking-tight">
            Redefining Dental Practice Management
          </h1>
          <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            DentFlow was founded in 2021 with a singular mission: to give dental professionals an
            intelligent operating system that eliminates administrative overhead and lets them focus
            on what matters most — patient care.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl lg:text-4xl font-extrabold font-headline text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-on-surface-variant font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6 bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-8">Our Story</h2>
          <div className="space-y-6 text-on-surface-variant leading-relaxed text-lg">
            <p>
              After years of watching dental teams struggle with fragmented software, drowning in
              paper charts, and losing hours to manual billing, our founding team — a group of
              dentists and software engineers — decided enough was enough.
            </p>
            <p>
              We built DentFlow as the platform we wished existed: one unified system that combines
              AI-powered charting, intelligent scheduling, automated billing, and real-time
              analytics. Today, DentFlow powers thousands of practices across North America, from
              solo practitioners to multi-location DSOs.
            </p>
            <p>
              Our headquarters are in San Francisco, with engineering teams in Austin and Toronto.
              We are backed by leading healthcare-focused venture capital firms and remain
              laser-focused on our mission: making dental care smarter, faster, and more accessible.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-4">
              Our Core Values
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              These principles guide every product decision, every hire, and every customer
              interaction.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-fixed-dim/20 rounded-xl flex items-center justify-center mb-6">
                  <span
                    className="material-symbols-outlined text-primary text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {v.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-headline mb-3">{v.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold font-headline">
            Want to See DentFlow in Action?
          </h2>
          <p className="text-on-surface-variant text-lg">
            Schedule a personalized demo and discover how DentFlow can transform your practice.
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
