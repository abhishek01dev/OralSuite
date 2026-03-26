import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join DentFlow and help build the future of dental practice management. Explore open positions in engineering, design, and more.',
};

const perks = [
  {
    icon: 'health_and_safety',
    title: 'Full Health Coverage',
    desc: 'Medical, dental, and vision for you and your family.',
  },
  { icon: 'savings', title: '401(k) Match', desc: 'Competitive retirement matching up to 4%.' },
  {
    icon: 'laptop_mac',
    title: 'Remote-First',
    desc: 'Work from anywhere with quarterly in-person offsites.',
  },
  {
    icon: 'school',
    title: 'Learning Budget',
    desc: '$2,000/yr for courses, conferences, and books.',
  },
  { icon: 'flight', title: 'Unlimited PTO', desc: 'We trust you to manage your own time off.' },
  { icon: 'child_care', title: 'Parental Leave', desc: '16 weeks paid leave for all new parents.' },
];

const openings = [
  {
    title: 'Senior Full-Stack Engineer',
    team: 'Engineering',
    location: 'Remote (US/Canada)',
    type: 'Full-time',
  },
  {
    title: 'Staff ML Engineer — Clinical AI',
    team: 'AI/ML',
    location: 'San Francisco, CA',
    type: 'Full-time',
  },
  { title: 'Product Designer', team: 'Design', location: 'Remote (US/Canada)', type: 'Full-time' },
  {
    title: 'DevOps / Platform Engineer',
    team: 'Infrastructure',
    location: 'Austin, TX / Remote',
    type: 'Full-time',
  },
  {
    title: 'Customer Success Manager',
    team: 'Customer Success',
    location: 'Remote (US)',
    type: 'Full-time',
  },
  { title: 'Technical Writer', team: 'Product', location: 'Remote (US/Canada)', type: 'Contract' },
];

export default function CareersPage() {
  return (
    <article>
      {/* Hero */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Careers</p>
          <h1 className="text-4xl lg:text-6xl font-extrabold font-headline text-on-surface mb-6 tracking-tight">
            Build the Future of Dental Care
          </h1>
          <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            We&apos;re a team of engineers, designers, and healthcare enthusiasts on a mission to
            modernize one of the world&apos;s largest healthcare verticals. Come build with us.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-12 text-center">
            Why DentFlow?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10"
              >
                <span
                  className="material-symbols-outlined text-primary text-3xl mb-4 block"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {perk.icon}
                </span>
                <h3 className="text-lg font-bold font-headline mb-2">{perk.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-6 bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-12 text-center">
            Open Positions
          </h2>
          <div className="space-y-4">
            {openings.map((job) => (
              <div
                key={job.title}
                className="p-6 bg-surface rounded-2xl border border-outline-variant/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="text-lg font-bold font-headline">{job.title}</h3>
                  <p className="text-sm text-on-surface-variant">
                    {job.team} · {job.location} · {job.type}
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="shrink-0 bg-primary text-on-primary px-6 py-2.5 rounded-xl font-headline font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 text-center"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-on-surface-variant mt-12">
            Don&apos;t see your role?{' '}
            <Link href="/contact" className="text-primary font-bold hover:underline">
              Send us your resume
            </Link>{' '}
            — we&apos;re always looking for exceptional talent.
          </p>
        </div>
      </section>
    </article>
  );
}
