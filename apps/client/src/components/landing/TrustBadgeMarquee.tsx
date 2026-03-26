'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function TrustBadgeMarquee() {
  return (
    <section className="py-24 px-6 bg-surface-container-lowest overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-primary-container rounded-[2.5rem] p-12 lg:p-20 flex flex-col lg:flex-row gap-16 items-center"
        >
          <div className="lg:w-1/3">
            <h2 className="text-4xl font-extrabold text-on-primary-container leading-tight mb-6 font-headline">
              Trusted by the Best
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex -space-x-3">
                <div className="relative w-12 h-12 rounded-full border-4 border-primary-container overflow-hidden bg-primary/20 z-30">
                  <Image
                    alt="Dentist portrait"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRWXeS7jhEpd944ypJvP9YpjpS6ArNP8ZQHBr7BkvUQxHmzMnezd9nB4v4s1oZrOw4hbnTrU0SQhLzUvQSjnjH6ZO0qyWEDckeo1UdAFWp3_XEoo96lmWAAO0gsqCvS_2ys-_MvHZGa-80UyFvrJ4v7qFD4A1lhc2pOL-v4_RwNawmf8EWcdTDi5HNYweAWceag9Y_80rm-1i9e6KUw0VJTob_iDv9YzC1vEDUUzK9hCoCS37vUX6lsAsSS1iPJXYi49M4W0CtMWVq"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="relative w-12 h-12 rounded-full border-4 border-primary-container overflow-hidden bg-primary/20 z-20">
                  <Image
                    alt="Clinic manager portrait"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9n_5zLsN0RgzxQ2vafB_8SCe1fzE2DwhCVPqDK4aeMiE4iShsFrpoLzEOGD1Ygqv1kJ5fHGMCMKWekDvSLiosQ_35tT54_M4FJm5bF103_4vqTuOAqOh3X9c76MHXVWbhNPrbTOeFpQiy7DYy7VzgUX1UH2vPLIfTnq8FhpBeMP6ebWtr_aapvASnvpuJ32QqBoodFvIJt3vdzPxAeRzNl3CqUYykVenba9dNRe7C0xe7xe3AX4Y8eJeqWq-era3JaujSYiRWP_zW"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="relative w-12 h-12 rounded-full border-4 border-primary-container overflow-hidden bg-primary/20 z-10">
                  <Image
                    alt="Hygienist portrait"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHBK9_5rzPywy7rwZ1VnSK8o3CKxiJ8uzeIi4rphKl0JIO-Ort_5A6BOJ9eXtgtwzy1hwMiBMT6Gtvi3V0Nu16tcDJR75k5ww38sR8odhwiFHAW6wprPF5Tr9luBtYS1NF9-Ra-z8F4aPGGLMkYrITWuosNxjgZUydumJkyd8C6YxLWUKEs1oWlKr8UgcTy9PBFv820dOguIVOnIO6kW-x1NvBCYlYmERGQqONkIlURBoYcAoaihjdwW88MqKzAs120SiP6Lbktl1"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              </div>
              <p className="text-on-primary-container/80 font-medium">
                Used by 500+ practices worldwide
              </p>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 transition-all hover:bg-white/15"
              >
                <p className="text-on-primary-container text-lg mb-6 font-medium italic">
                  "DentFlow saved us 15 hours a week on admin. My staff is happier, and I get to
                  focus on actual surgery."
                </p>
                <div>
                  <p className="font-bold text-on-primary-container">Dr. Sarah Jensen</p>
                  <p className="text-sm text-on-primary-container/70">
                    Principal, Elite Dental Care
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 transition-all hover:bg-white/15"
              >
                <p className="text-on-primary-container text-lg mb-6 font-medium italic">
                  "The transition was seamless. The multi-branch management tool is the best I've
                  seen in 20 years of practice."
                </p>
                <div>
                  <p className="font-bold text-on-primary-container">Marcus Thorne</p>
                  <p className="text-sm text-on-primary-container/70">COO, SmileGroup Ltd</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
