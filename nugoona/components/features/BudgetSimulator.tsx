'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

function fmt(n: number) {
  return n.toLocaleString('ko-KR');
}

function calc(t: number) {
  const budget = Math.round((5000 + t * 95000) / 1000) * 1000;
  const b = budget / 1000;
  const imp = Math.round(Math.pow(b, 1.8) * 80);
  const clk = Math.round(imp * 0.035);
  const cnv = Math.max(1, Math.round(clk * 0.04));
  return { budget, imp, clk, cnv };
}

const maxMetrics = calc(1);

export default function BudgetSimulator() {
  const [t, setT] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const phaseRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const metrics = calc(t);

  const pImp = Math.max(6, (metrics.imp / maxMetrics.imp) * 100);
  const pClk = Math.max(6, (metrics.clk / maxMetrics.clk) * 100);
  const pCnv = Math.max(6, (metrics.cnv / maxMetrics.cnv) * 100);

  const animate = useCallback(() => {
    phaseRef.current += 0.013;
    setT((Math.sin(phaseRef.current) + 1) / 2);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!isManual) {
      animate();
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isManual, animate]);

  function handleMouseEnter() {
    setIsManual(true);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function handleMouseLeave() {
    phaseRef.current = Math.asin(t * 2 - 1);
    setIsManual(false);
  }

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    setT(parseInt(e.target.value) / 1000);
  }

  const sliderBg = `linear-gradient(to right, #3b82f6 ${t * 100}%, #222 ${t * 100}%)`;

  return (
    <div
      ref={containerRef}
      className="feat-sim relative p-7 max-md:p-5 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Grid dots background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content */}
      <div className="relative z-[1]">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-semibold text-white/25 tracking-[0.1em] uppercase" style={{ fontFamily: 'var(--font-en)' }}>
            Monthly Budget
          </span>
          <span className={`text-[10px] transition-colors duration-300 ${isManual ? 'text-[rgba(59,130,246,0.6)]' : 'text-white/20'}`} style={{ fontFamily: 'var(--font-en)' }}>
            {isManual ? 'Manual' : 'Auto Demo'}
          </span>
        </div>

        {/* Amount */}
        <div className="text-right mb-1.5">
          <span className="text-[28px] max-md:text-[22px] font-semibold text-white tracking-[-0.02em]" style={{ fontFamily: 'var(--font-en)' }}>
            ₩{fmt(metrics.budget)}
          </span>
        </div>

        {/* Slider */}
        <div className="mb-6">
          <input
            type="range"
            min="0"
            max="1000"
            step="1"
            value={Math.round(t * 1000)}
            onChange={handleSliderChange}
            className="feat-sim-slider w-full h-[3px] outline-none cursor-pointer appearance-none"
            style={{ background: sliderBg }}
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2.5 h-[160px] max-md:h-[120px]">
          {[
            { label: '노출', value: metrics.imp, pct: pImp, color: 'blue' as const },
            { label: '클릭', value: metrics.clk, pct: pClk, color: 'indigo' as const },
            { label: '전환', value: metrics.cnv, pct: pCnv, color: 'violet' as const },
          ].map((m) => {
            const gradients = {
              blue: 'linear-gradient(180deg, #3b82f6, #2563eb)',
              indigo: 'linear-gradient(180deg, #6366f1, #4f46e5)',
              violet: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
            };
            const shadows = {
              blue: `0 0 ${8 + m.pct * 0.2}px 2px rgba(59,130,246,${0.2 + m.pct * 0.005})`,
              indigo: `0 0 ${8 + m.pct * 0.2}px 2px rgba(99,102,241,${0.2 + m.pct * 0.005})`,
              violet: `0 0 ${8 + m.pct * 0.2}px 2px rgba(139,92,246,${0.2 + m.pct * 0.005})`,
            };
            const textColors = {
              blue: '#60a5fa',
              indigo: '#818cf8',
              violet: '#a78bfa',
            };
            return (
              <div key={m.label} className="flex flex-col items-center h-full">
                <div className="text-center mb-1.5 shrink-0">
                  <span
                    className="text-[18px] max-md:text-[14px] font-semibold tracking-[-0.01em]"
                    style={{ color: textColors[m.color], fontFamily: 'var(--font-en)' }}
                  >
                    {fmt(m.value)}
                  </span>
                  <p className="text-[10px] text-white/30 mt-0.5">{m.label}</p>
                </div>
                <div className="w-full flex-1 bg-white/[0.03] relative flex items-end overflow-hidden">
                  <div
                    className="w-full min-h-[4px] relative transition-[height] duration-700"
                    style={{
                      height: `${m.pct}%`,
                      background: gradients[m.color],
                      boxShadow: shadows[m.color],
                      transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-white/40" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
