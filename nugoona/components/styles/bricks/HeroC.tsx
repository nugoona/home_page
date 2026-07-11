'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import BrowserFrame from '@/components/ui/BrowserFrame';

/**
 * HeroC — "실물이 주인공" 시안
 * 헤드라인 아래에서 두 실물 화면(네이버 검색결과 · 광고 대시보드)이
 * 겹쳐 쌓인 채 순차로 살아 움직이며 "뭘 해주는 회사인지"를 3초 안에 증명한다.
 * 라이트 기반(실물 화면이 살도록) + 모노크롬·블루 악센트, 네이버 그린은 검색 목업 문맥만 허용.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const EN = { fontFamily: 'var(--font-en)' } as const;
const QUERY = '성수동 브런치 카페';

function CountUp({
  active,
  target,
  prefix = '',
  suffix = '',
  duration = 1200,
}: {
  active: boolean;
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setVal(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  const display = Math.round(val).toLocaleString('ko-KR');
  return (
    <span style={EN}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function HeroC() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const started = useRef(false);

  const [typed, setTyped] = useState('');
  const [resultsIn, setResultsIn] = useState(false);
  const [dashIn, setDashIn] = useState(false);
  const [kpiActive, setKpiActive] = useState(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const typeStart = setTimeout(() => {
      let i = 0;
      const typeId = setInterval(() => {
        i++;
        setTyped(QUERY.slice(0, i));
        if (i >= QUERY.length) {
          clearInterval(typeId);
          setTimeout(() => setResultsIn(true), 260);
          setTimeout(() => {
            setDashIn(true);
            setTimeout(() => setKpiActive(true), 380);
          }, 900);
        }
      }, 55);
    }, 500);

    return () => clearTimeout(typeStart);
  }, [inView]);

  const typing = typed.length < QUERY.length;

  return (
    <section className="relative bg-white border-b border-border-default overflow-hidden" data-hero>
      {/* 배경 텍스처 — 모노크롬 도트그리드 (여백 방치 방지, 파스텔 면칠 없음) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: 'radial-gradient(circle, #eaeaea 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.4) 40%, #ffffff 100%)' }}
      />

      <div
        ref={ref}
        className="relative mx-auto max-w-[1200px] px-12 py-20 max-md:px-6 max-md:py-14
          grid md:grid-cols-[minmax(0,440px)_1fr] gap-16 items-center
          md:min-h-[76vh] max-md:min-h-0"
      >
        {/* ── 좌측: 카피 ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-left max-md:text-center"
        >
          <h1
            className="text-[clamp(28px,4.6vw,52px)] font-bold tracking-[-0.03em] leading-[1.14] text-text-primary mb-6"
            dangerouslySetInnerHTML={{
              __html: '<span class="text-accent">누구나</span> 마케팅하는 시대',
            }}
          />
          <p className="text-[16px] md:text-[18px] font-medium text-text-body leading-[1.65] max-w-[420px] mb-9 max-md:mx-auto">
            광고도 노출도<span className="comma">,</span> 한 화면에서 이해하고 직접 운영합니다.
          </p>
          <Link
            href="/start"
            className="btn-gradient-dark inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold tracking-[-0.01em] transition-all duration-250 hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
          >
            무료로 시작하기
            <svg
              className="w-4 h-4 opacity-70 transition-transform duration-250 group-hover:translate-x-[3px]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M6 4l4 4-4 4" />
            </svg>
          </Link>
        </motion.div>

        {/* ── 우측: 실물 화면 스택 ── */}
        <div className="relative w-full max-w-[440px] mx-auto md:mx-0 md:ml-auto pb-20 pr-8 max-md:pb-16 max-md:pr-6 max-md:max-w-[320px]">
          {/* 카드1 — 네이버 검색 결과 (앞, 메인) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="relative z-10 w-full"
            style={{ boxShadow: '0 28px 70px rgba(0,0,0,0.14), 0 6px 20px rgba(0,0,0,0.06)' }}
          >
            <BrowserFrame url="search.naver.com" alt>
              <div className="p-4 h-full flex flex-col bg-white max-md:p-3.5">
                {/* 검색창 — 타이핑 */}
                <div className="flex items-center gap-2 px-3 py-2 border-2 border-[#03c75a] mb-3">
                  <span className="text-[12px] text-text-primary flex-1 truncate" style={EN}>
                    {typed}
                    {typing && (
                      <span
                        className="inline-block w-[1px] h-[12px] bg-[#03c75a] ml-0.5 align-middle"
                        style={{ animation: 'pulse 1s infinite' }}
                      />
                    )}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#03c75a" strokeWidth="1.75">
                    <circle cx="7" cy="7" r="4.5" />
                    <path d="M11 11l3 3" strokeLinecap="round" />
                  </svg>
                </div>

                {/* 결과 */}
                <div className="flex flex-col gap-2 flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={resultsIn ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="relative border border-accent bg-accent-bg px-3.5 py-2.5"
                  >
                    <span
                      className="absolute top-2.5 right-2.5 text-[9px] font-semibold text-white bg-accent px-1.5 py-0.5"
                      style={EN}
                    >
                      MY STORE
                    </span>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="rounded-dot w-1.5 h-1.5 bg-accent" />
                      <span className="text-[13px] font-semibold text-text-primary">오늘의 브런치, 성수</span>
                    </div>
                    <p className="text-[11px] text-text-weak leading-snug">
                      성수동 · 브런치 카페 · 리뷰 214
                    </p>
                  </motion.div>

                  {['○○ 카페', '△△ 브런치하우스'].map((name, i) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0 }}
                      animate={resultsIn ? { opacity: 0.55 } : {}}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.12 + i * 0.1 }}
                      className="border border-border-light px-3.5 py-2.5"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="rounded-dot w-1.5 h-1.5 bg-[#ccc]" />
                        <span className="text-[12px] font-medium text-text-muted">{name}</span>
                      </div>
                      <span className="block h-1 w-3/4 bg-[#ededed]" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </BrowserFrame>
          </motion.div>

          {/* 카드2 — 광고 대시보드 (뒤, 우하단 오프셋) */}
          <motion.div
            initial={{ opacity: 0, y: 30, x: 10 }}
            animate={dashIn ? { opacity: 1, y: 0, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute z-0 -bottom-1 -right-1 w-[64%] max-md:w-[68%]"
            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.12), 0 4px 14px rgba(0,0,0,0.05)' }}
          >
            <BrowserFrame url="ads.nugoona.co.kr">
              <div className="p-3.5 h-full flex flex-col justify-center gap-2.5 bg-white max-md:p-3">
                <span
                  className="text-[9px] font-semibold text-text-muted tracking-[0.08em] uppercase mb-0.5"
                  style={EN}
                >
                  Ad Performance
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-border-light bg-bg-alt px-2.5 py-2">
                    <p className="text-[9px] text-text-muted mb-1" style={EN}>ROAS</p>
                    <p className="text-[16px] font-bold text-text-primary leading-none" style={EN}>
                      <CountUp active={kpiActive} target={340} suffix="%" />
                    </p>
                    <p className="text-[10px] mt-1" style={{ color: '#22c55e', ...EN }}>▲ 8%</p>
                  </div>
                  <div className="border border-border-light bg-bg-alt px-2.5 py-2">
                    <p className="text-[9px] text-text-muted mb-1" style={EN}>방문자</p>
                    <p className="text-[16px] font-bold text-text-primary leading-none" style={EN}>
                      <CountUp active={kpiActive} target={3840} />
                    </p>
                    <p className="text-[10px] mt-1" style={{ color: '#22c55e', ...EN }}>▲ 23%</p>
                  </div>
                </div>
                <div className="border border-border-light bg-bg-alt px-2.5 py-2">
                  <p className="text-[9px] text-text-muted mb-1" style={EN}>매출</p>
                  <p className="text-[16px] font-bold text-text-primary leading-none" style={EN}>
                    <CountUp active={kpiActive} target={12800000} prefix="₩" />
                  </p>
                </div>
              </div>
            </BrowserFrame>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
