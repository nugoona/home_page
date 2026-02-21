'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };
const EASE = [0.16, 1, 0.3, 1] as const;

export default function StepDone() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="max-md:!px-6 max-md:!py-24"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
        padding: '160px 48px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Giant watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 2, ease: EASE }}
        className="max-md:!text-[clamp(60px,22vw,100px)]"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(120px, 20vw, 280px)',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.03)',
          lineHeight: 0.85,
          letterSpacing: '-0.04em',
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          ...EN,
        }}
      >
        09:30
      </motion.div>

      <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Completion badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              border: '1px solid rgba(34,197,94,0.3)',
              fontSize: 12,
              color: '#22c55e',
              fontWeight: 600,
              ...EN,
            }}
          >
            <span className="rounded-dot" style={{ width: 6, height: 6, background: '#22c55e' }} />
            COMPLETE
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="max-md:!text-[clamp(28px,7vw,40px)]"
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.12,
            color: '#ffffff',
            margin: '28px 0 24px',
          }}
        >
          단 <span style={{ color: '#0070f3', ...EN }}>30</span>분.
          <br />
          남은 시간은 전략에 집중하세요.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.7,
            marginBottom: 48,
          }}
        >
          데이터 확인, 광고 생성, 운영, 분석, 경쟁사 추적.
          <br />
          대행사 없이, 이 모든 걸 아침에 끝냅니다.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          className="max-sm:!flex-col max-sm:!items-center"
          style={{ display: 'flex', justifyContent: 'center', gap: 12 }}
        >
          <Link
            href="/start"
            className="hover:bg-[#e0e0e0] transition-colors"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              height: 52, padding: '0 36px',
              background: '#fff', color: '#171717', fontSize: 15, fontWeight: 600,
            }}
          >
            무료로 시작하기
          </Link>
          <Link
            href="/pricing"
            className="hover:bg-white/[0.06] hover:border-white/30 transition-colors"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              height: 52, padding: '0 36px',
              border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)',
              fontSize: 15, fontWeight: 500,
            }}
          >
            요금제 보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
