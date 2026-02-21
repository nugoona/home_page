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

const kpis = [
  { label: 'Net Revenue', value: 12800000, prefix: '₩', suffix: '', change: 12 },
  { label: 'Ad Spend', value: 2100000, prefix: '₩', suffix: '', change: 0 },
  { label: 'ROAS', value: 340, prefix: '', suffix: '%', change: 8 },
  { label: 'Visitors', value: 3840, prefix: '', suffix: '', change: 23 },
  { label: 'CVR', value: 2.8, prefix: '', suffix: '%', change: 0.3, decimals: 1, changeSuffix: 'p' },
  { label: 'Orders', value: 108, prefix: '', suffix: '건', change: 15 },
];

export default function DashboardGlimpse() {
  return (
    <div
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
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '0.08em', ...EN }}>
          PERFORMANCE SUMMARY
        </span>
        <div style={{ display: 'flex', gap: 14 }}>
          {['Cafe24', 'Meta Ads', 'Google Ads', 'GA4'].map(p => (
            <span key={p} style={{ fontSize: 10, color: '#ccc', ...EN }}>{p}</span>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div
        className="max-sm:!grid-cols-2"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px 24px', padding: '32px 28px' }}
      >
        {kpis.map((kpi) => (
          <div key={kpi.label}>
            <p style={{ fontSize: 10, color: '#bbb', marginBottom: 6, letterSpacing: '0.06em', ...EN }}>
              {kpi.label}
            </p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#171717', letterSpacing: '-0.01em', ...EN }}>
              <CountUp target={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} decimals={kpi.decimals ?? 0} />
            </p>
            {kpi.change !== 0 && (
              <p style={{ fontSize: 11, color: kpi.change > 0 ? '#22c55e' : '#ef4444', marginTop: 4, ...EN }}>
                {kpi.change > 0 ? '▲' : '▼'} {Math.abs(kpi.change)}{kpi.changeSuffix ?? '%'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
