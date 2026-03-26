'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Player } from '@remotion/player';
import { DemoVideo } from '@/remotion/DemoVideo';

export function AnimatedHero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-secondary-container text-on-secondary-container rounded-full"
            >
              Next-Gen Dental OS
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl lg:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-8 font-headline"
            >
              The Future of Dentistry is{' '}
              <span className="text-primary italic relative">
                AI-Powered
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-2 bg-primary/20 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8, ease: 'circOut' }}
                  style={{ originX: 0 }}
                />
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-on-surface-variant mb-10 max-w-lg leading-relaxed"
            >
              Experience clinical precision and administrative ease. Automate your notes, optimize
              your schedule, and grow your practice with our intelligent operating system.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/login"
                className="bg-primary-container text-on-primary px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 text-center"
              >
                Get Started Free
              </Link>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-headline font-bold text-lg text-primary hover:bg-surface-container-low transition-all group"
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                  play_circle
                </span>
                Watch Demo
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative lg:h-[600px] h-[400px] flex items-center justify-center w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-tertiary-container/10 blur-3xl -z-10 rounded-full scale-110 animate-pulse-slow"></div>
            <div className="relative bg-surface-container-lowest p-4 rounded-2xl shadow-2xl border border-outline-variant/10 w-full h-full overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 -skew-x-12 z-20"></div>
              <Image
                alt="DentFlow AI Dashboard Interface"
                className="rounded-xl shadow-sm object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeHrvVR9khIDcngWqV0LVGVT2jt_n_xaCTyhbRRukpJFLzFxm4nikO2bMUvjTOu4aF2Bz1lmIxAL8oAPpYCwL2KaPW-XftDrl8G2XOhTjTFsQubiR_3M7tYq6NCn79mLuE3XkUBoTZ0Xrn-DU7WXaK0HWFDi1h4YVvf29Hl7oEX0mgo77LsY5-nq54rbkk3UCiIyvG8SwGYJ5p-4JNETw1bBedIeEogNl8g8AcmIg5yMtJpoT_DRkap9DbRHatCp9TuduuYaHTpemk"
                fill
                unoptimized
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video bg-surface rounded-3xl shadow-2xl overflow-hidden border border-white/10"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                aria-label="Close demo video"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="w-full h-full bg-surface-container-lowest">
                <Player
                  component={DemoVideo}
                  durationInFrames={300}
                  compositionWidth={1920}
                  compositionHeight={1080}
                  fps={30}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  controls
                  autoPlay
                  loop
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
