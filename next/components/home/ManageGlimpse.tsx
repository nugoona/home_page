'use client';

import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1200, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const campaigns = [
  { name: 'Summer Sale 2026', platform: 'Meta', roas: 485, on: true },
  { name: 'Brand Awareness', platform: 'Google', roas: 120, on: false },
  { name: 'Retargeting · Warm', platform: 'Meta', roas: 340, on: true },
];

export default function ManageGlimpse() {
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
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '0.08em', ...EN }}>CAMPAIGNS</span>
        <span style={{ fontSize: 10, color: '#ccc', ...EN }}>2 active</span>
      </div>

      {/* Campaign rows */}
      {campaigns.map((c, i) => (
        <div
          key={i}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '22px 28px',
            borderBottom: i < campaigns.length - 1 ? '1px solid #f5f5f5' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              className="rounded-dot"
              style={{ width: 8, height: 8, background: c.on ? '#22c55e' : '#e0e0e0', flexShrink: 0 }}
            />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#171717', ...EN }}>{c.name}</p>
              <p style={{ fontSize: 11, color: '#999', marginTop: 2, ...EN }}>
                {c.platform} · ROAS <CountUp target={c.roas} suffix="%" />
              </p>
            </div>
          </div>
          {/* Toggle */}
          <div
            className="rounded-pill"
            style={{
              width: 40, height: 22, padding: 3,
              background: c.on ? '#22c55e' : '#e0e0e0',
              display: 'flex', alignItems: 'center',
              justifyContent: c.on ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              className="rounded-dot"
              style={{ width: 16, height: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
            />
          </div>
        </div>
      ))}

      {/* NGN Marketer callout */}
      <div style={{
        margin: '0 20px 20px', padding: '20px 24px',
        background: '#fafafa', border: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#0070f3" strokeWidth="1.5" style={{ marginTop: 1, flexShrink: 0 }}>
            <path d="M15 12.5c0 .83-.67 1.5-1.5 1.5h-8L3 16V5.5C3 4.67 3.67 4 4.5 4h9c.83 0 1.5.67 1.5 1.5v7z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#171717', marginBottom: 4 }}>
              그래도 불안하다면
            </p>
            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
              NGN 마케터에게 직접 요청하세요. 캠페인 세팅, 최적화 제안, 성과 리뷰까지.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
