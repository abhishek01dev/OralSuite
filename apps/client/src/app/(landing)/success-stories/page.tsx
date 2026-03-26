import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Success Stories',
  description:
    'See how dental practices across North America are transforming their operations with DentFlow.',
};

const stories = [
  {
    practice: 'Bright Smile Family Dentistry',
    location: 'Austin, TX',
    quote:
      'DentFlow cut our administrative time by 60%. Our front desk staff went from drowning in paperwork to focusing on welcoming patients.',
    author: 'Dr. Sarah Mitchell',
    role: 'Practice Owner',
    metric: '60%',
    metricLabel: 'Less Admin Time',
    icon: 'schedule',
  },
  {
    practice: 'Pacific Coast Dental Group',
    location: 'San Diego, CA',
    quote:
      'The AI note generation alone saves each of our 12 dentists over an hour per day. That translates directly into more patients and higher revenue.',
    author: 'Dr. James Chen',
    role: 'Chief Clinical Officer',
    metric: '12hrs',
    metricLabel: 'Saved Daily Across Team',
    icon: 'edit_note',
  },
  {
    practice: 'Maple Leaf Dental',
    location: 'Toronto, ON',
    quote:
      "We migrated from Dentrix in under 3 weeks with zero data loss. The DentFlow team handled everything — it was the smoothest software transition we've ever done.",
    author: 'Dr. Priya Sharma',
    role: 'Managing Partner',
    metric: '3 wks',
    metricLabel: 'Full Migration',
    icon: 'swap_horiz',
  },
  {
    practice: 'Summit Dental Partners',
    location: 'Denver, CO',
    quote:
      'Real-time analytics across our 8 locations give us visibility we never had before. We identified underperforming chairs and increased utilization by 35%.',
    author: 'Mark Thompson',
    role: 'COO',
    metric: '35%',
    metricLabel: 'Higher Chair Utilization',
    icon: 'analytics',
  },
  {
    practice: 'Harmony Pediatric Dentistry',
    location: 'Orlando, FL',
    quote:
      'Parents love the automated appointment reminders and the patient portal. No-shows dropped from 18% to under 4% within the first month.',
    author: 'Dr. Lisa Rodriguez',
    role: 'Founder',
    metric: '<4%',
    metricLabel: 'No-Show Rate',
    icon: 'notifications_active',
  },
  {
    practice: 'Downtown Dental Studio',
    location: 'Chicago, IL',
    quote:
      "DentFlow's billing module eliminated our insurance claim errors. We went from a 12% denial rate to less than 2%. The ROI paid for the software in the first quarter.",
    author: 'Rachel Kim',
    role: 'Office Manager',
    metric: '<2%',
    metricLabel: 'Claim Denial Rate',
    icon: 'paid',
  },
];

export default function SuccessStoriesPage() {
  return (
    <article>
      {/* Hero */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
            Success Stories
          </p>
          <h1 className="text-4xl lg:text-6xl font-extrabold font-headline text-on-surface mb-6 tracking-tight">
            Real Results from Real Practices
          </h1>
          <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            From solo practitioners to multi-location DSOs, dental teams are achieving measurable
            outcomes with DentFlow.
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.practice}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-8 flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-fixed-dim/20 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    {story.icon}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-extrabold font-headline text-primary">
                    {story.metric}
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                    {story.metricLabel}
                  </p>
                </div>
              </div>
              <blockquote className="text-on-surface-variant leading-relaxed italic flex-grow mb-6">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <div className="border-t border-outline-variant/10 pt-4">
                <p className="font-bold text-on-surface">{story.author}</p>
                <p className="text-sm text-on-surface-variant">
                  {story.role} — {story.practice}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">{story.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold font-headline">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-on-surface-variant text-lg">
            Join thousands of dental professionals who have transformed their practice with
            DentFlow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/book-demo"
              className="inline-block bg-primary text-on-primary px-10 py-4 rounded-2xl font-headline font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              Book a Demo
            </Link>
            <Link
              href="/login"
              className="inline-block px-10 py-4 rounded-2xl font-headline font-bold text-lg text-on-surface border border-outline-variant hover:bg-surface-container-low transition-all"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
