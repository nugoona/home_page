'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';

/* ── Ranking Marquee (Main Left Panel) ────────────────────────── */
const rankingData = [
  { rank: 1, name: '오버사이즈 린넨 블레이저', brand: 'STUDIO TOMBOY', change: 'new', price: '189,000' },
  { rank: 2, name: '와이드 데님 팬츠 (워싱)', brand: 'MUSINSA STANDARD', change: 'up', price: '49,900' },
  { rank: 3, name: '코튼 크루넥 니트', brand: 'UNIQLO U', change: '-', price: '39,900' },
  { rank: 4, name: '플리츠 미디 스커트', brand: 'COS', change: 'up', price: '129,000' },
  { rank: 5, name: '캔버스 토트백 L', brand: 'MARNI', change: 'down', price: '890,000' },
  { rank: 6, name: '스트라이프 오픈카라 셔츠', brand: 'LEMAIRE', change: 'new', price: '520,000' },
  { rank: 7, name: '에센셜 슬림핏 티셔츠', brand: 'AMI', change: '-', price: '185,000' },
  { rank: 8, name: '레더 미니 크로스백', brand: 'MARGE SHERWOOD', change: 'up', price: '298,000' },
  { rank: 9, name: '릴랙스드 트러커 자켓', brand: "LEVI'S", change: 'new', price: '159,000' },
  { rank: 10, name: '볼드 청키 스니커즈', brand: 'NEW BALANCE', change: 'up', price: '139,000' },
  { rank: 11, name: '라운드 선글라스', brand: 'GENTLE MONSTER', change: '-', price: '280,000' },
  { rank: 12, name: '니트 카디건 (오트밀)', brand: 'ARKET', change: 'down', price: '99,000' },
];

function RankBadge({ change }: { change: string }) {
  if (change === 'new') return <span className="text-[8px] font-semibold text-white bg-accent px-1 py-px" style={{ fontFamily: 'var(--font-en)' }}>NEW</span>;
  if (change === 'up') return <span className="text-[8px] text-[#22c55e]">▲</span>;
  if (change === 'down') return <span className="text-[8px] text-[#ef4444]">▼</span>;
  return <span className="text-[8px] text-text-weak">—</span>;
}

function RankingMarquee() {
  return (
    <div className="h-full overflow-hidden relative">
      {/* Fade masks */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

      {/* Scrolling content */}
      <div className="animate-marquee-up">
        {[...rankingData, ...rankingData].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 px-4 border-b border-border-light hover:bg-bg-alt transition-colors">
            <span className="w-6 text-[13px] font-semibold text-text-primary text-right shrink-0" style={{ fontFamily: 'var(--font-en)' }}>
              {item.rank}
            </span>
            <RankBadge change={item.change} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-text-primary truncate">{item.name}</p>
              <p className="text-[10px] text-text-weak" style={{ fontFamily: 'var(--font-en)' }}>{item.brand}</p>
            </div>
            <span className="text-[11px] text-text-body shrink-0" style={{ fontFamily: 'var(--font-en)' }}>₩{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Comparison Panel (Top Right) ─────────────────────────────── */
function ComparisonPanel() {
  const [hovered, setHovered] = useState<'mine' | 'comp' | null>(null);

  return (
    <div className="h-full flex flex-col p-4">
      <p className="text-[10px] font-semibold text-text-weak tracking-[0.08em] uppercase mb-3" style={{ fontFamily: 'var(--font-en)' }}>02 — VS Compare</p>

      <div className="flex-1 flex gap-3">
        {/* My product */}
        <div
          className={`flex-1 border transition-all duration-300 cursor-default flex flex-col ${hovered === 'mine' ? 'border-accent shadow-[0_0_0_1px_#0070f3]' : 'border-border-default'}`}
          onMouseEnter={() => setHovered('mine')}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="aspect-[3/4] bg-[#fafafa] flex items-center justify-center relative">
            <span className="text-[20px] font-semibold text-accent/20" style={{ fontFamily: 'var(--font-en)' }}>MY</span>
            {hovered === 'mine' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 border-2 border-accent" />
            )}
          </div>
          <div className="p-2">
            <p className="text-[10px] font-medium text-text-primary">내 상품 A</p>
            <p className="text-[9px] text-accent font-semibold" style={{ fontFamily: 'var(--font-en)' }}>Rank #3</p>
          </div>
        </div>

        {/* Competitor */}
        <div
          className={`flex-1 border transition-all duration-300 cursor-default flex flex-col ${hovered === 'comp' ? 'border-[#ef4444] shadow-[0_0_0_1px_#ef4444]' : 'border-border-default'}`}
          onMouseEnter={() => setHovered('comp')}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="aspect-[3/4] bg-[#fafafa] flex items-center justify-center relative">
            <span className="text-[20px] font-semibold text-[#ef4444]/20" style={{ fontFamily: 'var(--font-en)' }}>VS</span>
            {hovered === 'comp' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 border-2 border-[#ef4444]" />
            )}
          </div>
          <div className="p-2">
            <p className="text-[10px] font-medium text-text-primary">경쟁 상품</p>
            <p className="text-[9px] text-[#ef4444] font-semibold" style={{ fontFamily: 'var(--font-en)' }}>Rank #1</p>
          </div>
        </div>
      </div>

      <p className="text-[9px] text-text-weak mt-2 text-center">AI가 유사 트렌드 상품을 추천합니다</p>
    </div>
  );
}

/* ── Search Volume Chart (Bottom Right) ───────────────────────── */
function SearchVolumeChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 300;
    const day = Math.round((x / 300) * 30) + 1;
    const value = Math.round(800 + Math.sin(day * 0.3) * 300 + Math.random() * 50);
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, value: `${day}일 · ${value.toLocaleString()}` });
  }, []);

  return (
    <div ref={ref} className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold text-text-weak tracking-[0.08em] uppercase" style={{ fontFamily: 'var(--font-en)' }}>03 — Search Volume</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[8px] text-accent"><span className="w-2 h-0.5 bg-accent inline-block" />내 브랜드</span>
          <span className="flex items-center gap-1 text-[8px] text-text-weak"><span className="w-2 h-0.5 bg-text-weak inline-block" />경쟁사</span>
        </div>
      </div>

      <div className="flex-1 relative" onMouseLeave={() => setTooltip(null)}>
        <svg
          ref={svgRef}
          viewBox="0 0 300 120"
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          style={{ cursor: 'crosshair' }}
        >
          {/* Grid lines */}
          {[0, 30, 60, 90].map((y) => (
            <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#eaeaea" strokeWidth="0.5" />
          ))}

          {/* Competitor line (gray, behind) */}
          <motion.path
            d="M0,75 C30,68 50,82 80,70 C110,58 140,85 170,78 C200,71 230,90 260,80 C280,75 290,85 300,82"
            fill="none"
            stroke="#d0d0d0"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
          />

          {/* My brand line (accent, front) */}
          <motion.path
            d="M0,80 C30,55 50,65 80,35 C110,45 140,25 170,40 C200,20 230,35 260,15 C280,25 290,18 300,22"
            fill="none"
            stroke="#0070f3"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          {/* Gradient fill under my brand line */}
          <motion.path
            d="M0,80 C30,55 50,65 80,35 C110,45 140,25 170,40 C200,20 230,35 260,15 C280,25 290,18 300,22 L300,120 L0,120 Z"
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.5 }}
          />
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0070f3" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0070f3" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none bg-text-primary text-white text-[9px] px-2 py-1 -translate-x-1/2 -translate-y-full"
            style={{ left: tooltip.x, top: tooltip.y - 8, fontFamily: 'var(--font-en)' }}
          >
            {tooltip.value}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 text-[8px] text-text-weak" style={{ fontFamily: 'var(--font-en)' }}>
        <span>1일</span><span>10일</span><span>20일</span><span>30일</span>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────── */
export default function TrendShowcase() {
  return (
    <>
      {/* Intro */}
      <Section id="trend" crossMarks>
        <div className="py-20 px-12 max-md:py-12 max-md:px-6">
          <FadeUp>
            <div className="max-w-[1080px] mx-auto">
              <p className="text-[12px] font-semibold text-accent tracking-[0.1em] uppercase mb-3" style={{ fontFamily: 'var(--font-en)' }}>Trend</p>
              <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.15] mb-4">
                경쟁사 베스트셀러를<br />매주 자동으로 추적합니다
              </h2>
              <p className="text-[17px] text-text-body leading-[1.6] mb-6">
                29CM, Ably의 카테고리별 베스트 상품 순위 변동. 급상승·신규진입 상품을 자동 감지합니다.
              </p>
              <Link href="/start" className="inline-flex items-center gap-2 text-[14px] text-accent font-medium hover:gap-3 transition-[gap] duration-150">
                Trend 시작하기
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Bento Grid */}
      <Section>
        <div className="py-16 px-12 max-md:py-12 max-md:px-6">
          <FadeUp>
            <div className="max-w-[1080px] mx-auto grid grid-cols-[2fr_1fr] grid-rows-[1fr_1fr] gap-4 h-[560px] max-md:grid-cols-1 max-md:grid-rows-none max-md:h-auto max-md:gap-4">
              {/* Main: Ranking Marquee */}
              <div className="row-span-2 border border-border-default bg-white overflow-hidden max-md:h-[400px]">
                <div className="px-4 py-3 border-b border-border-default flex items-center justify-between bg-bg-alt">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-text-weak tracking-[0.08em] uppercase" style={{ fontFamily: 'var(--font-en)' }}>01</span>
                    <span className="text-[12px] font-semibold text-text-primary">주간 베스트 100</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[9px] px-2 py-0.5 border border-accent text-accent font-medium" style={{ fontFamily: 'var(--font-en)' }}>29CM</span>
                    <span className="text-[9px] px-2 py-0.5 border border-border-default text-text-weak" style={{ fontFamily: 'var(--font-en)' }}>Ably</span>
                  </div>
                </div>
                <RankingMarquee />
              </div>

              {/* Top Right: Comparison */}
              <div className="border border-border-default bg-white overflow-hidden max-md:h-[300px]">
                <ComparisonPanel />
              </div>

              {/* Bottom Right: Search Volume */}
              <div className="border border-border-default bg-white overflow-hidden max-md:h-[250px]">
                <SearchVolumeChart />
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
