'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { solution } from '@/lib/content/home';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

export default function SolutionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="py-[100px] px-12 max-md:py-16 max-md:px-6 flex justify-center">
      <div className="text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="text-[13px] font-semibold text-accent tracking-[0.1em] uppercase mb-6"
            style={EN}
          >
            {solution.label}
          </p>

          <h2
            className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] mb-5"
            dangerouslySetInnerHTML={{ __html: solution.title }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          className="text-[18px] text-text-primary font-light leading-[1.4]"
          dangerouslySetInnerHTML={{ __html: solution.desc }}
        />
      </div>
    </div>
  );
}
