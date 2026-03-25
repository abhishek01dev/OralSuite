"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="bg-surface font-body selection:bg-primary-fixed-dim text-on-surface w-full overflow-x-hidden flex flex-col min-h-screen">
      <nav className="fixed w-full z-50 transition-all duration-300 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined">dentistry</span>
            </div>
            <div>
              <h1 className="text-xl font-bold font-headline text-on-surface">DentFlow</h1>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold leading-none mt-0.5">Clinical OS</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 font-manrope font-semibold text-sm">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Platform</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Solutions</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Pricing</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Resources</a>
          </div>
          <div className="flex items-center gap-4">
            <Link className="hidden md:block text-on-surface-variant hover:text-primary font-manrope font-bold text-sm transition-colors" href="/login">Sign In</Link>
            <Link className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-headline font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95" href="/login">Book Demo</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 flex-grow">
        {/* Hero Section */}
        <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-secondary-container text-on-secondary-container rounded-full">Next-Gen Dental OS</span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-8 font-headline">
                The Future of Dentistry is <span className="text-primary italic">AI-Powered</span>
              </h1>
              <p className="text-xl text-on-surface-variant mb-10 max-w-lg leading-relaxed">
                Experience clinical precision and administrative ease. Automate your notes, optimize your schedule, and grow your practice with our intelligent operating system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login" className="bg-primary-container text-on-primary px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 text-center">
                  Get Started Free
                </Link>
                <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-headline font-bold text-lg text-primary hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-tertiary-container/10 blur-3xl -z-10 rounded-full scale-110"></div>
              <div className="relative bg-surface-container-lowest p-4 rounded-2xl shadow-2xl border border-outline-variant/10">
                <img alt="DentFlow AI Dashboard Interface" className="rounded-xl shadow-sm w-full h-full object-cover" data-alt="Modern clinical dental dashboard with AI analytics charts" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeHrvVR9khIDcngWqV0LVGVT2jt_n_xaCTyhbRRukpJFLzFxm4nikO2bMUvjTOu4aF2Bz1lmIxAL8oAPpYCwL2KaPW-XftDrl8G2XOhTjTFsQubiR_3M7tYq6NCn79mLuE3XkUBoTZ0Xrn-DU7WXaK0HWFDi1h4YVvf29Hl7oEX0mgo77LsY5-nq54rbkk3UCiIyvG8SwGYJ5p-4JNETw1bBedIeEogNl8g8AcmIg5yMtJpoT_DRkap9DbRHatCp9TuduuYaHTpemk" />
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-24 px-6 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-extrabold font-headline text-on-surface mb-4">Precision Meets Intelligence</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Built for clinicians who demand accuracy and operators who prioritize growth.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-10 bg-surface-container-lowest rounded-2xl transition-all hover:translate-y-[-8px]">
                <div className="w-14 h-14 bg-primary-fixed-dim/30 rounded-xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-primary text-3xl">biotech</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-headline">Clinical Precision</h3>
                <p className="text-on-surface-variant leading-relaxed">AI-assisted diagnostics and charting that reduces human error and improves patient outcomes through predictive modeling.</p>
              </div>
              <div className="group p-10 bg-surface-container-lowest rounded-2xl transition-all hover:translate-y-[-8px]">
                <div className="w-14 h-14 bg-secondary-container/30 rounded-xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-secondary text-3xl">auto_awesome</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-headline">Smart Automation</h3>
                <p className="text-on-surface-variant leading-relaxed">Instant note generation and automated follow-ups that reclaim up to 15 hours of administrative time per week.</p>
              </div>
              <div className="group p-10 bg-surface-container-lowest rounded-2xl transition-all hover:translate-y-[-8px]">
                <div className="w-14 h-14 bg-tertiary-fixed-dim/30 rounded-xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-tertiary text-3xl">trending_up</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-headline">Business Growth</h3>
                <p className="text-on-surface-variant leading-relaxed">Comprehensive multi-branch analytics to optimize chair-time, patient retention, and clinical profitability.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-32">
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-6">
                <div className="text-primary font-bold tracking-widest text-sm uppercase">Documentation Reimagined</div>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight font-headline">AI Note Generator</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Stop spending your lunch break writing charts. Our HIPAA-compliant AI listens to your clinical dictation and generates precise, SOAP-compliant notes in seconds. 
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-on-surface font-medium">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    NLP specialized for dental terminology
                  </li>
                  <li className="flex items-center gap-3 text-on-surface font-medium">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Custom templates for various procedures
                  </li>
                </ul>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="relative bg-surface-container-low p-6 rounded-3xl">
                  <img alt="AI Note Generation Interface" className="rounded-2xl shadow-lg border border-white/50" data-alt="Close up of AI writing dental clinical notes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUK-NhfJG0RWN4w8Ry0esXAAvbtDK4lA-ApYgihWrAtQB7j0AEoCoKV1x9rC7-VTQiYLC4MglyqU6l-YJIbk5DaVeCwUTgST8nF3RW8KnA-Lp969pm6WiKIgFjVThhkZM7uY4iG1iQiY_q5osgD2VMHFVv4VA_ktad6lotSvtf9YjyV61cuBy5ph4liJofZvHqsZ_Zf23owfFmFU0MrwV3JKYJOQQkBY2qSN5-cpBzBfrzXILQamCq1pBUMBISwIvYfyyYy2-K-scd" />
                </div>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="lg:w-1/2 space-y-6">
                <div className="text-tertiary font-bold tracking-widest text-sm uppercase">Interactive Care</div>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight font-headline">Interactive Charting</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  A tactile, visual charting experience that patients can understand. Move from archaic grids to high-definition 3D dental mapping.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-on-surface font-medium">
                    <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Visual treatment plan presentations
                  </li>
                  <li className="flex items-center gap-3 text-on-surface font-medium">
                    <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Instant X-ray AI interpretation overlays
                  </li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="relative bg-surface-container-low p-6 rounded-3xl">
                  <img alt="3D Dental Charting Interface" className="rounded-2xl shadow-lg border border-white/50" data-alt="Interactive 3D dental chart with patient data" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw0P963fXGtAguj0rsdgHOryNVIA4eINT_ua1v7ERSw39hlVCLWLxxl6JpOwD5Zk5BO-6LgAJ3jvN4SYKyTX_SsC7c4aTF60wvPcASjpqfoe9FirSWB6nHprYHoAh_F9kghv5maoypRFM38OkfonBUGbjS93RVAQxgXKiVTBqb_awKMfIxEZ2CXtNX2qAftxxPMuSIkP_s3hnP49yVQ6zbXYY0nCue52ijdogtqoKmZcgg6c4NyovLyNcQY_yrBDirf3lufgVtGOQM" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section className="py-24 px-6 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto">
            <div className="bg-primary-container rounded-[2.5rem] p-12 lg:p-20 flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/3">
                <h2 className="text-4xl font-extrabold text-on-primary-container leading-tight mb-6 font-headline">Trusted by the Best</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex -space-x-3">
                    <img className="w-12 h-12 rounded-full border-4 border-primary-container object-cover" data-alt="Dentist portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRWXeS7jhEpd944ypJvP9YpjpS6ArNP8ZQHBr7BkvUQxHmzMnezd9nB4v4s1oZrOw4hbnTrU0SQhLzUvQSjnjH6ZO0qyWEDckeo1UdAFWp3_XEoo96lmWAAO0gsqCvS_2ys-_MvHZGa-80UyFvrJ4v7qFD4A1lhc2pOL-v4_RwNawmf8EWcdTDi5HNYweAWceag9Y_80rm-1i9e6KUw0VJTob_iDv9YzC1vEDUUzK9hCoCS37vUX6lsAsSS1iPJXYi49M4W0CtMWVq" />
                    <img className="w-12 h-12 rounded-full border-4 border-primary-container object-cover" data-alt="Clinic manager portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9n_5zLsN0RgzxQ2vafB_8SCe1fzE2DwhCVPqDK4aeMiE4iShsFrpoLzEOGD1Ygqv1kJ5fHGMCMKWekDvSLiosQ_35tT54_M4FJm5bF103_4vqTuOAqOh3X9c76MHXVWbhNPrbTOeFpQiy7DYy7VzgUX1UH2vPLIfTnq8FhpBeMP6ebWtr_aapvASnvpuJ32QqBoodFvIJt3vdzPxAeRzNl3CqUYykVenba9dNRe7C0xe7xe3AX4Y8eJeqWq-era3JaujSYiRWP_zW" />
                    <img className="w-12 h-12 rounded-full border-4 border-primary-container object-cover" data-alt="Hygienist portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHBK9_5rzPywy7rwZ1VnSK8o3CKxiJ8uzeIi4rphKl0JIO-Ort_5A6BOJ9eXtgtwzy1hwMiBMT6Gtvi3V0Nu16tcDJR75k5ww38sR8odhwiFHAW6wprPF5Tr9luBtYS1NF9-Ra-z8F4aPGGLMkYrITWuosNxjgZUydumJkyd8C6YxLWUKEs1oWlKr8UgcTy9PBFv820dOguIVOnIO6kW-x1NvBCYlYmERGQqONkIlURBoYcAoaihjdwW88MqKzAs120SiP6Lbktl1" />
                  </div>
                  <p className="text-on-primary-container/80 font-medium">Used by 500+ practices worldwide</p>
                </div>
              </div>
              <div className="lg:w-2/3">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                    <p className="text-on-primary-container text-lg mb-6 font-medium italic">"DentFlow saved us 15 hours a week on admin. My staff is happier, and I get to focus on actual surgery."</p>
                    <div>
                      <p className="font-bold text-on-primary-container">Dr. Sarah Jensen</p>
                      <p className="text-sm text-on-primary-container/70">Principal, Elite Dental Care</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                    <p className="text-on-primary-container text-lg mb-6 font-medium italic">"The transition was seamless. The multi-branch management tool is the best I've seen in 20 years of practice."</p>
                    <div>
                      <p className="font-bold text-on-primary-container">Marcus Thorne</p>
                      <p className="text-sm text-on-primary-container/70">COO, SmileGroup Ltd</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-24 px-6 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-extrabold font-headline text-on-surface mb-6">Scalable Pricing for Every Practice</h2>
              {/* Monthly / Yearly Toggle */}
              <div className="flex items-center justify-center gap-4 mb-10">
                <span className="text-sm font-semibold text-on-surface-variant">Monthly</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" checked={isYearly} onChange={(e) => setIsYearly(e.target.checked)} />
                  <div className={`w-14 h-7 rounded-full transition-all duration-300 ${isYearly ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white border-none h-5 w-5 rounded-full transition-all duration-300 ${isYearly ? 'translate-x-7' : ''}`}></div>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-on-surface">Yearly</span>
                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider rounded">Save 20%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
              {/* Basic */}
              <div className="flex flex-col p-10 bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-sm transition-all hover:shadow-md">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 font-headline">Basic</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-on-surface">${isYearly ? '159' : '199'}</span>
                    <span className="text-on-surface-variant font-medium">/mo</span>
                  </div>
                </div>
                <ul className="space-y-5 mb-10 flex-grow">
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-lg">check</span>
                    Single Practice Access
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-lg">check</span>
                    AI Charting Basic
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-lg">check</span>
                    Patient Portal
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors">Choose Basic</button>
              </div>
              {/* Pro (Featured) */}
              <div className="relative flex flex-col p-10 bg-on-background rounded-[2.5rem] text-white shadow-[0_32px_64px_-16px_rgba(0,82,204,0.3)] border-2 border-primary scale-105 z-10 transition-all">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-on-secondary px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl whitespace-nowrap">Most Popular</div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 font-headline">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">${isYearly ? '319' : '399'}</span>
                    <span className="text-surface-dim/70 font-medium">/mo</span>
                  </div>
                </div>
                <ul className="space-y-5 mb-10 flex-grow">
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Everything in Basic
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Advanced AI Note Generator
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Practice Analytics Dashboard
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Automated Patient Recalls
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl bg-primary-container text-white font-bold shadow-lg hover:shadow-primary/20 transition-all hover:bg-primary-container/90">Get Started with Pro</button>
              </div>
              {/* Enterprise */}
              <div className="flex flex-col p-10 bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-sm transition-all hover:shadow-md">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 font-headline">Enterprise</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-on-surface">Custom</span>
                  </div>
                </div>
                <ul className="space-y-5 mb-10 flex-grow">
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-lg">check</span>
                    Multi-Branch Management
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-lg">check</span>
                    Custom API Access
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-lg">check</span>
                    Dedicated Account Manager
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl border-2 border-on-surface text-on-surface font-bold hover:bg-on-surface/5 transition-colors">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 bg-surface-container-lowest">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-on-surface mb-4 font-headline">Frequently Asked Questions</h2>
              <p className="text-on-surface-variant">Everything you need to know about getting started with DentFlow.</p>
            </div>
            <div className="space-y-4">
              <details className="group bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 cursor-pointer" open>
                <summary className="flex items-center justify-between font-bold text-lg list-none font-headline">
                  Is it HIPAA compliant?
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="mt-4 text-on-surface-variant leading-relaxed">
                  Absolutely. DentFlow is fully HIPAA compliant and SOC2 Type II certified. We use end-to-end encryption for all patient data, and our AI systems are designed to process information without retaining personal health identifiers (PHI) in unencrypted training sets.
                </p>
              </details>
              <details className="group bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 cursor-pointer">
                <summary className="flex items-center justify-between font-bold text-lg list-none font-headline">
                  Can I migrate my data from Open Dental or Eaglesoft?
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="mt-4 text-on-surface-variant leading-relaxed">
                  Yes, our dedicated implementation team handles full data migration from all major dental practice management software including Open Dental, Eaglesoft, Dentrix, and more. We ensure your patient records, clinical charts, and historical data are moved safely and accurately.
                </p>
              </details>
              <details className="group bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 cursor-pointer">
                <summary className="flex items-center justify-between font-bold text-lg list-none font-headline">
                  How long does onboarding take?
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="mt-4 text-on-surface-variant leading-relaxed">
                  The average onboarding process takes between 14 and 21 days. This includes software setup, data migration, and comprehensive training for your clinical and administrative staff. We provide onsite training for Enterprise customers and live virtual sessions for Basic and Pro plans.
                </p>
              </details>
              <details className="group bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 cursor-pointer">
                <summary className="flex items-center justify-between font-bold text-lg list-none font-headline">
                  Do you offer a free trial?
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="mt-4 text-on-surface-variant leading-relaxed">
                  Yes! We offer a 14-day full-access free trial. You can explore all the Pro features, including the AI Note Generator and interactive charting, with a sample database to see exactly how it will transform your daily workflow.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 bg-surface-bright border-t border-outline-variant/10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight font-headline">Transform Your Practice Today</h2>
            <p className="text-xl text-on-surface-variant">Join the dental revolution. High-precision care starts with high-precision software.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/login" className="bg-primary-container text-on-primary px-10 py-5 rounded-2xl font-headline font-bold text-xl shadow-xl active:scale-95 transition-all text-center">Start 14-Day Free Trial</Link>
              <button className="px-10 py-5 rounded-2xl font-headline font-bold text-xl text-on-surface border border-outline-variant hover:bg-surface-container-low transition-all">Book a Demo</button>
            </div>
            <div className="pt-8">
              <p className="text-sm font-medium text-on-surface-variant flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                HIPAA Compliant & SOC2 Certified Data Protection
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 mt-auto bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold font-headline text-blue-900 dark:text-blue-100 mb-4">DentFlow</div>
            <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-[200px]">© 2024 DentFlow AI. Precision in every practice.</p>
          </div>
          <div>
            <h4 className="font-headline font-bold text-blue-900 dark:text-blue-100 text-sm mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a className="font-body text-xs font-medium text-slate-500 hover:underline decoration-blue-500/30 transition-colors" href="#">Features</a></li>
              <li><a className="font-body text-xs font-medium text-slate-500 hover:underline decoration-blue-500/30 transition-colors" href="#">Pricing</a></li>
              <li><a className="font-body text-xs font-medium text-slate-500 hover:underline decoration-blue-500/30 transition-colors" href="#">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-blue-900 dark:text-blue-100 text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a className="font-body text-xs font-medium text-slate-500 hover:underline decoration-blue-500/30 transition-colors" href="#">About Us</a></li>
              <li><a className="font-body text-xs font-medium text-slate-500 hover:underline decoration-blue-500/30 transition-colors" href="#">Contact</a></li>
              <li><a className="font-body text-xs font-medium text-slate-500 hover:underline decoration-blue-500/30 transition-colors" href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-blue-900 dark:text-blue-100 text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a className="font-body text-xs font-medium text-slate-500 hover:underline decoration-blue-500/30 transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="font-body text-xs font-medium text-slate-500 hover:underline decoration-blue-500/30 transition-colors" href="#">Terms of Service</a></li>
              <li><a className="font-body text-xs font-medium text-slate-500 hover:underline decoration-blue-500/30 transition-colors" href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
