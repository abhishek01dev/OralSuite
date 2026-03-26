'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const features = [
  {
    tag: 'Documentation Reimagined',
    tagColor: 'text-primary',
    title: 'AI Note Generator',
    description:
      'Stop spending your lunch break writing charts. Our HIPAA-compliant AI listens to your clinical dictation and generates precise, SOAP-compliant notes in seconds.',
    bullets: ['NLP specialized for dental terminology', 'Custom templates for various procedures'],
    bulletIconColor: 'text-secondary',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUK-NhfJG0RWN4w8Ry0esXAAvbtDK4lA-ApYgihWrAtQB7j0AEoCoKV1x9rC7-VTQiYLC4MglyqU6l-YJIbk5DaVeCwUTgST8nF3RW8KnA-Lp969pm6WiKIgFjVThhkZM7uY4iG1iQiY_q5osgD2VMHFVv4VA_ktad6lotSvtf9YjyV61cuBy5ph4liJofZvHqsZ_Zf23owfFmFU0MrwV3JKYJOQQkBY2qSN5-cpBzBfrzXILQamCq1pBUMBISwIvYfyyYy2-K-scd',
    reverse: false,
    glowColor: 'bg-primary/5',
  },
  {
    tag: 'Interactive Care',
    tagColor: 'text-tertiary',
    title: 'Interactive Charting',
    description:
      'A tactile, visual charting experience that patients can understand. Move from archaic grids to high-definition 3D dental mapping.',
    bullets: ['Visual treatment plan presentations', 'Instant X-ray AI interpretation overlays'],
    bulletIconColor: 'text-tertiary',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBw0P963fXGtAguj0rsdgHOryNVIA4eINT_ua1v7ERSw39hlVCLWLxxl6JpOwD5Zk5BO-6LgAJ3jvN4SYKyTX_SsC7c4aTF60wvPcASjpqfoe9FirSWB6nHprYHoAh_F9kghv5maoypRFM38OkfonBUGbjS93RVAQxgXKiVTBqb_awKMfIxEZ2CXtNX2qAftxxPMuSIkP_s3hnP49yVQ6zbXYY0nCue52ijdogtqoKmZcgg6c4NyovLyNcQY_yrBDirf3lufgVtGOQM',
    reverse: true,
    glowColor: 'bg-tertiary/5',
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-32">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`flex flex-col ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}
          >
            <div className="lg:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: feature.reverse ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`${feature.tagColor} font-bold tracking-widest text-sm uppercase`}
              >
                {feature.tag}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight font-headline"
              >
                {feature.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-on-surface-variant leading-relaxed"
              >
                {feature.description}
              </motion.p>
              <motion.ul
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
                  hidden: {},
                }}
              >
                {feature.bullets.map((bullet, i) => (
                  <motion.li
                    key={i}
                    variants={{
                      visible: { opacity: 1, x: 0 },
                      hidden: { opacity: 0, x: -20 },
                    }}
                    className="flex items-center gap-3 text-on-surface font-medium"
                  >
                    <span
                      className={`material-symbols-outlined ${feature.bulletIconColor}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    {bullet}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <motion.div
              className="lg:w-1/2 relative w-full h-[350px] md:h-[450px]"
              initial={{ opacity: 0, scale: 0.9, rotate: feature.reverse ? -2 : 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className={`absolute inset-0 ${feature.glowColor} rounded-full blur-3xl`}></div>
              <div className="absolute inset-0 bg-surface-container-low p-6 rounded-3xl group z-10">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/50 transition-transform duration-700 group-hover:scale-[1.03]">
                  <Image
                    alt={feature.title}
                    className="object-cover"
                    src={feature.image}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Optional overlay glass element for extra detail */}
                <div className="absolute -bottom-6 -right-6 md:bottom-2 md:-left-6 bg-surface/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 opacity-0 md:opacity-100 transform translate-y-4 transition-all duration-500 group-hover:translate-y-0 z-20">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center bg-surface-container`}
                    >
                      <span className={`material-symbols-outlined ${feature.bulletIconColor}`}>
                        magic_button
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold m-0 font-headline">AI Enabled</p>
                      <p className="text-xs text-on-surface-variant m-0">99.9% Accuracy</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
