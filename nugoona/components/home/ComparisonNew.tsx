'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };
const EASE = [0.16, 1, 0.3, 1] as const;

const rows = [
  { label: '소요 시간', self: '매일 2-3시간', agency: '대행사에 위임', ngn: '하루 30분' },
  { label: '데이터 확인', self: '4개 플랫폼 따로', agency: '월 1회 보고서', ngn: '실시간 대시보드' },
  { label: '광고 수정', self: '직접 (복잡)', agency: '요청 후 대기', ngn: '직접, 3초' },
  { label: '비용', self: '₩0 (시간 비용)', agency: '월 70-200만원', ngn: '월 9.9만원 정액' },
  { label: '성과 분석', self: '수동 엑셀 정리', agency: 'PDF 보고서', ngn: 'AI 자동 분석' },
  { label: '경쟁사 추적', self: '직접 검색', agency: '미제공', ngn: '자동 수집' },
];

const columns = [
  { key: 'self' as const, title: '직접 운영', sub: '시간이 부족합니다', highlight: false },
  { key: 'agency' as const, title: '대행사', sub: '비싸고 불투명합니다', highlight: false },
  { key: 'ngn' as const, title: 'NGN', sub: '30분이면 됩니다', highlight: true },
];

export default function ComparisonNew() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="max-md:!px-6 max-md:!py-16" style={{ padding: '100px 48px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 12 }}>
            어떤 방법을 선택하시겠습니까?
          </h2>
          <p style={{ fontSize: 15, color: '#666' }}>같은 광고, 다른 방법.</p>
        </motion.div>

        {/* ── Desktop Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="max-md:!hidden"
          style={{ border: '1px solid #eaeaea', background: '#fff', boxShadow: '0 4px 32px rgba(0,0,0,0.04)', overflow: 'hidden' }}
        >
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr', borderBottom: '1px solid #eaeaea' }}>
            <div style={{ padding: '24px 24px' }} />
            {columns.map((col) => (
              <div
                key={col.key}
                style={{
                  padding: '24px 24px',
                  borderLeft: '1px solid #eaeaea',
                  background: col.highlight ? 'rgba(0,112,243,0.03)' : 'transparent',
                }}
              >
                <p style={{ fontSize: 15, fontWeight: 700, color: col.highlight ? '#0070f3' : '#171717', marginBottom: 2 }}>
                  {col.title}
                </p>
                <p style={{ fontSize: 11, color: col.highlight ? '#0070f3' : '#999' }}>{col.sub}</p>
              </div>
            ))}
          </div>

          {/* Data rows */}
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, ease: EASE, delay: 0.3 + i * 0.06 }}
              style={{
                display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr',
                borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none',
              }}
            >
              <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#999' }}>{row.label}</span>
              </div>
              {columns.map((col) => (
                <div
                  key={col.key}
                  style={{
                    padding: '16px 24px',
                    borderLeft: '1px solid #f5f5f5',
                    background: col.highlight ? 'rgba(0,112,243,0.02)' : 'transparent',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <span style={{
                    fontSize: 13,
                    color: col.highlight ? '#171717' : '#666',
                    fontWeight: col.highlight ? 600 : 400,
                  }}>
                    {row[col.key]}
                  </span>
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* ── Mobile Cards ── */}
        <div className="md:!hidden" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: EASE, delay: 0.2 + i * 0.06 }}
              style={{
                border: '1px solid #eaeaea', background: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)', overflow: 'hidden',
              }}
            >
              {/* Row label */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.04em' }}>{row.label}</span>
              </div>
              {/* 3 values side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                {columns.map((col, ci) => (
                  <div
                    key={col.key}
                    style={{
                      padding: '14px 12px',
                      borderLeft: ci > 0 ? '1px solid #f5f5f5' : 'none',
                      background: col.highlight ? 'rgba(0,112,243,0.03)' : 'transparent',
                    }}
                  >
                    <p style={{ fontSize: 9, fontWeight: 600, color: col.highlight ? '#0070f3' : '#bbb', marginBottom: 4, letterSpacing: '0.02em' }}>
                      {col.title}
                    </p>
                    <p style={{
                      fontSize: 12, lineHeight: 1.4,
                      color: col.highlight ? '#171717' : '#666',
                      fontWeight: col.highlight ? 600 : 400,
                    }}>
                      {row[col.key]}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}
          style={{ textAlign: 'center', marginTop: 40 }}
        >
          <Link
            href="/pricing"
            className="hover:gap-3 transition-[gap]"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#0070f3', fontWeight: 500 }}
          >
            요금제 자세히 보기
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
