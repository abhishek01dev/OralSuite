'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ApiClient } from '@repo/shared';

// Define the form schema matching our backend DTO
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please provide a valid email address'),
  phone: z.string().max(50).optional(),
  description: z.string().min(10, 'Please describe your practice needs').max(2000),
});

type FormData = z.infer<typeof formSchema>;

export default function BookDemoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setApiError(null);

    const client = new ApiClient('/api/v1');

    try {
      await client.post<{ data: unknown }>('/demo-requests', data);
      setIsSuccess(true);
      // Wait 3 seconds then return to home
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : 'An error occurred while submitting your request.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <article className="py-32 px-6 min-h-[70vh] flex flex-col items-center justify-center bg-surface-container-low">
        <div className="max-w-md w-full text-center p-12 bg-surface rounded-3xl border border-outline-variant/10 shadow-xl shadow-primary/5 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-primary-fixed-dim/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span
              className="material-symbols-outlined text-primary text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <h1 className="text-3xl font-extrabold font-headline text-on-surface mb-4">
            Request Received!
          </h1>
          <p className="text-on-surface-variant leading-relaxed">
            Thank you for your interest in DentFlow. One of our practice specialists will be in
            touch within 1 business day to schedule your personalized demo.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="py-20 px-6 min-h-screen bg-surface-container-low">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left Column — Copy */}
        <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
          <div>
            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
              Book a Demo
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-on-surface mb-6 tracking-tight">
              See DentFlow in Action
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Discover how our AI-powered platform can eliminate administrative burden, streamline
              your billing, and help you focus on what really matters — your patients.
            </p>
          </div>

          <div className="space-y-6 pt-8 border-t border-outline-variant/10">
            <h3 className="font-bold font-headline text-xl">What to expect:</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-on-surface-variant">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-sm">
                    rocket_launch
                  </span>
                </div>
                A brief conversation to understand your practice&apos;s unique challenges.
              </li>
              <li className="flex items-start gap-4 text-on-surface-variant">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-sm">
                    desktop_windows
                  </span>
                </div>
                A live, personalized walkthrough of the DentFlow platform.
              </li>
              <li className="flex items-start gap-4 text-on-surface-variant">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-sm">timeline</span>
                </div>
                Pricing details and a custom ROI analysis for your practice.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column — Form */}
        <div className="bg-surface rounded-3xl p-8 lg:p-10 shadow-2xl shadow-primary/5 border border-outline-variant/10 animate-in slide-in-from-right-8 duration-700 delay-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-bold text-on-surface">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                {...register('name')}
                id="name"
                placeholder="Dr. Sarah Mitchell"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-bold text-on-surface">
                Work Email <span className="text-error">*</span>
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                placeholder="sarah@brightsmile.com"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-bold text-on-surface">
                Phone Number
              </label>
              <input
                {...register('phone')}
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="description" className="text-sm font-bold text-on-surface">
                How can we help? <span className="text-error">*</span>
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                placeholder="Tell us a bit about your practice and what you're looking for..."
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
              {errors.description && (
                <p className="text-error text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            {apiError && (
              <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-headline font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Submitting...
                </>
              ) : (
                'Request Demo'
              )}
            </button>
            <p className="text-xs text-center text-on-surface-variant">
              By submitting this form, you agree to our{' '}
              <a href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </article>
  );
}
