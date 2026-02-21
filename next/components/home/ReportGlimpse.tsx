'use client';

import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

const insights = [
  '상품 A의 전환율이 전월 대비 3.2배 상승했습니다. 현재 광고비 비중이 전체의 8%로 낮아, 해당 상품 광고비 증액을 권장합니다.',
  'Instagram 유입이 전체 방문자의 48%를 차지하며, 전월 대비 12%p 증가했습니다. Google 검색 유입은 소폭 감소하여 키워드 재점검이 필요합니다.',
];

function TypeWriter({ text, active, delay = 0 }: { text: string; active: boolean; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const started = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    let i = 0;
    const timeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length && intervalRef.current) clearInterval(intervalRef.current);
      }, 18);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, text, delay]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && displayed.length > 0 && (
        <span style={{ opacity: 0.4, animation: 'pulse 1s infinite' }}>|</span>
      )}
    </span>
  );
}

export default function ReportGlimpse() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      style={{
        maxWidth: 760,
        border: '1px solid rgba(255,255,255,0.1)',
        background: '#fff',
        boxShadow: '0 24px 80px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '20px 28px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#0070f3', letterSpacing: '0.06em', marginBottom: 2, ...EN }}>AI MONTHLY REPORT</p>
          <p style={{ fontSize: 12, color: '#999' }}>2026년 1월 분석 리포트</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#22c55e" strokeWidth="1.5">
            <path d="M3 7l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 10, color: '#22c55e', ...EN }}>Generated</span>
        </div>
      </div>

      {/* Insights */}
      <div style={{ padding: '24px 28px' }}>
        {insights.map((text, i) => (
          <div
            key={i}
            style={{
              padding: '16px 0',
              borderBottom: i < insights.length - 1 ? '1px solid #f5f5f5' : 'none',
            }}
          >
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.8 }}>
              {inView ? <TypeWriter text={text} active={inView} delay={600 + i * 2400} /> : ''}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 28px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#bbb" strokeWidth="1.2">
          <circle cx="6" cy="6" r="3" />
          <path d="M6 4v2l1.5 1" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 10, color: '#bbb', ...EN }}>Powered by Gemini AI · 매월 1일 자동 생성</span>
      </div>
    </div>
  );
}
