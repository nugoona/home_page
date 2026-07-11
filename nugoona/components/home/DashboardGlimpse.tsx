'use client';

import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

function CountUp({ target, prefix = '', suffix = '', decimals = 0 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const dur = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setVal(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  const display = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString('ko-KR');
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

const SOURCES = [
  { label: 'Cafe24', color: '#00b7ff' },
  { label: 'Meta Ads', color: '#1877f2' },
  { label: 'Google Ads', color: '#34a853' },
  { label: 'GA4', color: '#e37400' },
];

const kpis = [
  { label: 'Net Revenue', value: 12800000, prefix: '₩', suffix: '', change: 12 },
  { label: 'Ad Spend', value: 2100000, prefix: '₩', suffix: '', change: 0 },
  { label: 'ROAS', value: 340, prefix: '', suffix: '%', change: 8 },
  { label: 'Visitors', value: 3840, prefix: '', suffix: '', change: 23 },
  { label: 'CVR', value: 2.8, prefix: '', suffix: '%', change: 0.3, decimals: 1, changeSuffix: 'p' },
  { label: 'Orders', value: 108, prefix: '', suffix: '건', change: 15 },
];

export default function DashboardGlimpse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-40px' });
  const [roasPulse, setRoasPulse] = useState(false);

  useEffect(() => {
    if (!inView) return;
    // CountUp(1400ms) 완료 직후 ROAS 델타에 badgePulse 1회
    const t = setTimeout(() => setRoasPulse(true), 1500);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: 760,
        border: '1px solid #eaeaea',
        background: '#fff',
        boxShadow: '0 24px 80px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '18px 28px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.08em', ...EN }}>
          PERFORMANCE SUMMARY
        </span>
        <div style={{ display: 'flex', gap: 14 }}>
          {SOURCES.map(p => (
            <span key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#999', ...EN }}>
              <span className="rounded-dot" style={{ width: 5, height: 5, background: p.color, flexShrink: 0 }} />
              {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div
        className="max-sm:!grid-cols-2 max-sm:!gap-x-3 max-sm:!p-5"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px 24px', padding: '32px 28px' }}
      >
        {kpis.map((kpi) => (
          <div key={kpi.label} className="max-sm:!p-2.5" style={{ background: '#fafafa', border: '1px solid #f0f0f0', padding: '14px 16px' }}>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 6, letterSpacing: '0.08em', ...EN }}>
              {kpi.label}
            </p>
            <p className="max-sm:!text-[16px] whitespace-nowrap" style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', ...EN }}>
              <CountUp target={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} decimals={kpi.decimals ?? 0} />
            </p>
            {kpi.change !== 0 && (
              <p
                style={{
                  fontSize: 11,
                  color: kpi.change > 0 ? '#22c55e' : '#ef4444',
                  marginTop: 4,
                  ...(kpi.label === 'ROAS' && roasPulse ? { animation: 'badgePulse 0.8s ease-out' } : {}),
                  ...EN,
                }}
              >
                {kpi.change > 0 ? '▲' : '▼'} {Math.abs(kpi.change)}{kpi.changeSuffix ?? '%'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
