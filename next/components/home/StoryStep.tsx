'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };
const EASE = [0.16, 1, 0.3, 1] as const;

interface StoryStepProps {
  time: string;
  step: string;
  headline: string;
  subtitle: string;
  dark?: boolean;
  gray?: boolean;
  children: React.ReactNode;
}

export default function StoryStep({
  time, step, headline, subtitle, dark, gray, children,
}: StoryStepProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="max-md:!px-6 max-md:!py-24"
      style={{
        background: dark ? '#0a0a0a' : gray ? '#f7f7f7' : '#ffffff',
        padding: '160px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Giant watermark time ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5, ease: EASE }}
        className="max-md:!text-[clamp(80px,28vw,120px)] max-md:!right-[-8%]"
        style={{
          position: 'absolute',
          top: '50%',
          right: '-2%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(180px, 26vw, 380px)',
          fontWeight: 900,
          color: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
          lineHeight: 0.85,
          letterSpacing: '-0.04em',
          pointerEvents: 'none',
          userSelect: 'none',
          ...EN,
        }}
      >
        {time}
      </motion.div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Step label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: dark ? '#0070f3' : '#0070f3',
              ...EN,
            }}
          >
            {step}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
          className="max-md:!text-[clamp(28px,7vw,40px)]"
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.12,
            color: dark ? '#ffffff' : '#171717',
            margin: '24px 0 24px',
          }}
          dangerouslySetInnerHTML={{ __html: headline }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
          style={{
            fontSize: 18,
            color: dark ? 'rgba(255,255,255,0.5)' : '#666',
            lineHeight: 1.7,
            maxWidth: 540,
            marginBottom: 72,
          }}
        >
          {subtitle}
        </motion.p>

        {/* Card content */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.28 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
