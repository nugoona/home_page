'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };
const EASE = [0.16, 1, 0.3, 1] as const;

const schedule = [
  { time: '09:00', label: '확인' },
  { time: '09:05', label: '만들기' },
  { time: '09:10', label: '운영' },
  { time: '09:20', label: '분석' },
  { time: '09:25', label: '정찰' },
  { time: '09:30', label: '완료', end: true },
];

export default function HeroMinimal() {
  return (
    <div
      className="max-md:!px-6 max-md:!pt-28 max-md:!pb-16"
      style={{ padding: '180px 48px 120px', textAlign: 'center', position: 'relative' }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', border: '1px solid #eaeaea',
              fontSize: 12, color: '#666', ...EN,
            }}
          >
            <span className="rounded-dot" style={{ width: 6, height: 6, background: '#22c55e' }} />
            Open Beta
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
          className="max-md:!text-[clamp(36px,9vw,52px)]"
          style={{
            fontSize: 'clamp(48px, 7vw, 76px)', fontWeight: 800,
            color: '#171717', letterSpacing: '-0.04em', lineHeight: 1.08,
            margin: '32px 0 24px',
          }}
        >
          하루{' '}
          <span style={{ color: '#0070f3', ...EN, fontWeight: 800 }}>30</span>
          분이면
          <br />
          됩니다.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
          style={{ fontSize: 18, color: '#666', lineHeight: 1.65, marginBottom: 44 }}
        >
          대행사 없이{' '}
          <span className="max-sm:hidden">— </span>
          <br className="sm:hidden" />
          광고 생성부터 운영·분석까지.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.24 }}
          className="max-sm:flex-col max-sm:items-center"
          style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 64 }}
        >
          <Link
            href="/start"
            className="hover:bg-[#333] transition-colors"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              height: 52, padding: '0 36px',
              background: '#171717', color: '#fff', fontSize: 15, fontWeight: 600,
            }}
          >
            무료로 시작하기
          </Link>
          <Link
            href="/features"
            className="hover:bg-[#fafafa] transition-colors"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              height: 52, padding: '0 36px',
              border: '1px solid #eaeaea', color: '#666', fontSize: 15, fontWeight: 500,
            }}
          >
            기능 살펴보기
          </Link>
        </motion.div>

        {/* Schedule bar — Desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-md:!hidden"
          style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: 0, padding: '20px 0',
            borderTop: '1px solid #eaeaea',
          }}
        >
          {schedule.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <div style={{ width: 48, height: 1, background: '#eaeaea', position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      width: 5, height: 5, background: '#eaeaea',
                    }}
                    className="rounded-dot"
                  />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 56 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'end' in s && s.end ? '#22c55e' : '#0070f3', letterSpacing: '0.02em', ...EN }}>
                  {s.time}
                </span>
                <span style={{ fontSize: 11, color: 'end' in s && s.end ? '#22c55e' : '#999', fontWeight: 'end' in s && s.end ? 600 : 400 }}>
                  {'end' in s && s.end ? '✓ ' : ''}{s.label}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Schedule bar — Mobile (compact) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="md:!hidden"
          style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: 6, padding: '16px 0',
            borderTop: '1px solid #eaeaea', flexWrap: 'wrap',
          }}
        >
          {schedule.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && (
                <span style={{ fontSize: 10, color: '#e0e0e0' }}>—</span>
              )}
              <span style={{
                fontSize: 11, fontWeight: 600, ...EN,
                color: 'end' in s && s.end ? '#22c55e' : '#bbb',
              }}>
                {'end' in s && s.end ? '✓ ' : ''}{s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
