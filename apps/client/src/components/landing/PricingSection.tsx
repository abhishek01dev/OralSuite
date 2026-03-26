'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-5xl font-extrabold font-headline text-on-surface mb-6">
            Scalable Pricing for Every Practice
          </h2>
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="text-sm font-semibold text-on-surface-variant">Monthly</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={isYearly}
                onChange={(e) => setIsYearly(e.target.checked)}
              />
              <div
                className={`w-14 h-7 rounded-full transition-all duration-300 ${isYearly ? 'bg-primary' : 'bg-surface-container-high'}`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white border-none h-5 w-5 rounded-full transition-all duration-300 ${isYearly ? 'translate-x-7' : ''}`}
              ></div>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-on-surface">Yearly</span>
              <motion.span
                animate={{ scale: isYearly ? 1.1 : 1 }}
                className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider rounded"
              >
                Save 20%
              </motion.span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
          {/* Basic */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex flex-col p-10 bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 font-headline">Basic</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-on-surface">
                  ${isYearly ? '159' : '199'}
                </span>
                <span className="text-on-surface-variant font-medium">/mo</span>
              </div>
            </div>
            <ul className="space-y-5 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-lg">check</span> Single
                Practice Access
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-lg">check</span> AI
                Charting Basic
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-lg">check</span>{' '}
                Patient Portal
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors">
              Choose Basic
            </button>
          </motion.div>

          {/* Pro (Featured) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1.05, y: 0 }}
            whileHover={{ scale: 1.08 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative flex flex-col p-10 bg-on-background rounded-[2.5rem] text-white shadow-[0_32px_64px_-16px_rgba(0,82,204,0.3)] border-2 border-primary z-10"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-on-secondary px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl whitespace-nowrap">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 font-headline">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  ${isYearly ? '319' : '399'}
                </span>
                <span className="text-surface-dim/70 font-medium">/mo</span>
              </div>
            </div>
            <ul className="space-y-5 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-sm font-medium">
                <span
                  className="material-symbols-outlined text-secondary text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>{' '}
                Everything in Basic
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span
                  className="material-symbols-outlined text-secondary text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>{' '}
                Advanced AI Note Generator
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span
                  className="material-symbols-outlined text-secondary text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>{' '}
                Practice Analytics Dashboard
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span
                  className="material-symbols-outlined text-secondary text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>{' '}
                Automated Patient Recalls
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-primary-container text-white font-bold shadow-lg hover:shadow-primary/20 transition-all hover:bg-primary-container/90">
              Get Started with Pro
            </button>
          </motion.div>

          {/* Enterprise */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col p-10 bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 font-headline">Enterprise</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-on-surface">Custom</span>
              </div>
            </div>
            <ul className="space-y-5 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-lg">check</span>{' '}
                Multi-Branch Management
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-lg">check</span> Custom
                API Access
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-lg">check</span>{' '}
                Dedicated Account Manager
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl border-2 border-on-surface text-on-surface font-bold hover:bg-on-surface/5 transition-colors">
              Contact Sales
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
