'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { comparison } from '@/lib/content/home';
import GridDivider from '@/components/ui/GridDivider';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

const tiers = [
  {
    label: '200만',
    context: '월 광고비 200만원일 때',
    agency: '20~30만원', agencySub: '수수료 10~15%',
    ngn: '3.9만원', ngnUnit: '/월',
    saving: '최대 26만원 절감',
  },
  {
    label: '500만',
    context: '월 광고비 500만원일 때',
    agency: '50~75만원', agencySub: '수수료 10~15%',
    ngn: '9.9만원', ngnUnit: '/월',
    saving: '최대 65만원 절감',
  },
  {
    label: '1,000만',
    context: '월 광고비 1,000만원일 때',
    agency: '100~150만원', agencySub: '수수료 10~15%',
    ngn: '9.9만원', ngnUnit: '/월',
    saving: '최대 140만원 절감',
  },
  {
    label: '5,000만',
    context: '월 광고비 5,000만원일 때',
    agency: '500~750만원', agencySub: '수수료 10~15%',
    ngn: '29.9만원', ngnUnit: '/월',
    saving: '최대 720만원 절감',
  },
];

const features = [
  { label: '광고 제작', agency: '대행사가 제작', ngn: 'AI 자동 생성' },
  { label: '성과 리포트', agency: '월 1회 보고서', ngn: '실시간 대시보드' },
  { label: '광고 조정', agency: '대행사에 요청', ngn: '직접 실시간 조정', ngnPremium: 'NGN 마케터가 광고 조정' },
];

export default function ROIComparison() {
  const [selected, setSelected] = useState(0);
  const [animDone, setAnimDone] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);
  const tier = tiers[selected];

  /* Scroll-triggered: 200만→5,000만 then stop */
  const runEntrance = useCallback(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    let step = 0;
    const go = () => {
      setSelected(step);
      step++;
      if (step < tiers.length) {
        setTimeout(go, 800);
      } else {
        setAnimDone(true);
      }
    };
    go();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) runEntrance(); },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [runEntrance]);

  function onTabClick(i: number) {
    if (!animDone) return;
    setSelected(i);
  }

  return (
    <div>
      <GridDivider />
      <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-[5fr_7fr]">
        {/* Left: Text */}
        <div className="pt-[100px] pb-14 px-12 max-md:py-16 max-md:px-6 flex flex-col justify-center items-center">
          <p
            className="text-[clamp(80px,14vw,140px)] font-semibold tracking-[-0.05em] leading-none mb-6 text-text-primary"
            style={EN}
          >
            0%
          </p>
          <p className="text-[18px] leading-[1.65] max-w-[400px]">
            <strong className="font-semibold text-text-primary">
              {comparison.headline}
            </strong>
            {' '}
            <span
              className="font-semibold text-text-primary"
              dangerouslySetInnerHTML={{ __html: comparison.sub }}
            />
          </p>
        </div>

        {/* Right: Interactive Cards */}
        <div className="relative md:border-l md:border-border-default py-16 px-12 max-md:pb-16 max-md:px-6 flex flex-col justify-center">
          {/* Context + Saving */}
          <div className="border-t border-b border-border-default py-6 mb-6 max-md:text-center">
            <p className="text-[30px] font-semibold md:whitespace-nowrap max-md:text-[22px]">
              <span className="text-text-primary">{tier.context}</span>
              {tier.saving && (
                <>
                  <span className="text-text-weak mx-2">·</span>
                  <span className="text-accent">{tier.saving}</span>
                </>
              )}
            </p>
          </div>

          {/* Tier Buttons */}
          <div className="flex gap-2 flex-wrap mb-6">
            {tiers.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onTabClick(i)}
                className={`px-4 py-2 text-[13px] font-semibold border transition-colors duration-300 ${
                  selected === i
                    ? 'bg-text-primary text-white border-text-primary'
                    : 'bg-white text-text-body border-border-default'
                } ${animDone && selected !== i ? 'cursor-pointer hover:bg-bg-alt' : 'cursor-default'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Agency Card — consistent light bg, red-toned price */}
            <div className="border border-border-default bg-[#f5f5f5] p-5">
              <p className="text-[12px] font-semibold text-text-body mb-4">기존 대행사</p>
              <p className="text-[28px] font-semibold tracking-[-0.02em] leading-none mb-1 text-[#dc2626]" style={EN}>
                {tier.agency}
              </p>
              <p className="text-[12px] text-text-body">{tier.agencySub}</p>
            </div>

            {/* NGN Card */}
            <div className="border border-[#171717] bg-[#0a0a0a] p-5">
              <p className="text-[12px] text-white font-semibold mb-4" style={EN}>NGN</p>
              <p className="text-[28px] font-semibold text-accent tracking-[-0.02em] leading-none mb-1" style={EN}>
                {tier.ngn}<span className="text-[14px] font-medium text-white">{tier.ngnUnit}</span>
              </p>
              <p className="text-[12px] text-white">월정액</p>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="border border-border-default divide-y divide-border-light">
            {features.map((f, i) => {
              const isPremium = selected === 3;
              const ngnText = isPremium && f.ngnPremium ? f.ngnPremium : f.ngn;
              return (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr] items-center">
                  <div className="px-4 py-3">
                    <p className="text-[12px] font-semibold text-text-primary">{f.label}</p>
                  </div>
                  <div className="px-4 py-3 border-l border-border-light">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] text-[#c07070]">✕</span>
                      <p className="text-[12px] text-text-body">{f.agency}</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-l border-border-light bg-[#fafafa]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] text-accent">✓</span>
                      <p className="text-[12px] text-text-primary font-medium">{ngnText}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
