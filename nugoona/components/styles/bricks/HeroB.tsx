'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { hero } from '@/lib/content/home';

/* ═══════════════════════════════════════════════════════════════
   컨셉: "빔 캔버스 진화" — 사장님 원작(HeroAurora/BeamCanvas) 계승·강화
   경쟁 시안 4개 중 하나. 원작 문법(12×8/6×10 격자·크로스헤어·필름노이즈·순회 빔)은
   그대로 두고, 아래 4가지로 밀도·정밀도·이벤트를 강화한다.
     1) 빔 두 줄기에 제품색(콘텐츠 그린 #2fd46b · 광고 블루 #3e8bff)을 입혀
        "두 제품 회사"를 배경 자체로 암시.
     2) 격자 교차점에 도트, 4코너에 좌표풍 라벨(시스템 표기·범례·LIVE)을 더해
        Vercel/Linear급 정밀 인상.
     3) 빔의 머리가 크로스헤어 코너를 지날 때마다 그 지점이 제품색으로
        반짝이는 "코너 버스트" — 두 제품이 같은 시스템(격자)을 순회하며
        서로 교차하는 이벤트.
     4) 하단 스크롤 유도 트랙 추가.
   ═══════════════════════════════════════════════════════════════ */

interface Pt { x: number; y: number }

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── 그리드 상수 — 원작 12×8 / 6×10 계승. content rect는 "모바일 ≥75%" 규칙에 맞춰 강화 ── */
const D_COLS = 12, D_ROWS = 8;
const DC_R0 = 1, DC_R1 = 6, DC_C0 = 2, DC_C1 = 9; // desktop content: 75%H × 66.7%W
const M_COLS = 6, M_ROWS = 10;
const MC_R0 = 1, MC_R1 = 8, MC_C0 = 1, MC_C1 = 4; // mobile content: 80%H(≥75%) × 66.7%W

const LINE = '1px 0 0 rgba(255,255,255,0.12)';
const BORDER = '0.5px solid rgba(255,255,255,0.12)';

/* bracket calc()에 쓰는 백분율(그리드 상수에서 도출 — 좌표 하드코딩 대신 단일 소스 유지) */
const D_TOP = (DC_R0 / D_ROWS) * 100;        // 12.5
const D_BOTTOM = ((DC_R1 + 1) / D_ROWS) * 100; // 87.5
const D_LEFT = (DC_C0 / D_COLS) * 100;         // 16.667
const D_RIGHT = ((DC_C1 + 1) / D_COLS) * 100;  // 83.333

/* ── 코너 좌표: 크로스헤어 · 빔 루프 · 코너버스트가 공유하는 단일 좌표계(half-cell inset) ── */
const DESK_TL: Pt = { x: 1 / 24, y: 1 / 16 };
const DESK_TR: Pt = { x: 1 - 1 / 24, y: 1 / 16 };
const DESK_BR: Pt = { x: 1 - 1 / 24, y: 1 - 1 / 16 };
const DESK_BL: Pt = { x: 1 / 24, y: 1 - 1 / 16 };
const DESK_LOOP_A: Pt[] = [DESK_TL, DESK_TR, DESK_BR, DESK_BL];
const DESK_LOOP_B: Pt[] = [DESK_BR, DESK_BL, DESK_TL, DESK_TR];

const MOB_TL: Pt = { x: 1 / 12, y: 1 / 20 };
const MOB_TR: Pt = { x: 1 - 1 / 12, y: 1 / 20 };
const MOB_BR: Pt = { x: 1 - 1 / 12, y: 1 - 1 / 20 };
const MOB_BL: Pt = { x: 1 / 12, y: 1 - 1 / 20 };
const MOB_LOOP_A: Pt[] = [MOB_TL, MOB_TR, MOB_BR, MOB_BL];
const MOB_LOOP_B: Pt[] = [MOB_BR, MOB_BL, MOB_TL, MOB_TR];

const GREEN = '47,212,107'; // 콘텐츠
const BLUE = '62,139,255';  // 광고

/* 크로스헤어 백분율(위 코너 좌표와 동일 값 — 시각 요소끼리 정렬시키기 위해 리터럴로 재기입) */
const DESK_CROSS = { top: 6.25, bottom: 93.75, left: 4.1667, right: 95.8333 };
const MOB_CROSS = { top: 5, bottom: 95, left: 8.3333, right: 91.6667 };

/** 폐곡선 위 파라미터 t(0~1)에 대응하는 좌표 */
function ptOnLoop(t: number, c: Pt[]): Pt {
  const n = c.length;
  const lens: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = c[i], b = c[(i + 1) % n];
    lens.push(Math.hypot(b.x - a.x, b.y - a.y));
  }
  const total = lens.reduce((s, l) => s + l, 0);
  let d = (((t % 1) + 1) % 1) * total;
  for (let i = 0; i < n; i++) {
    if (d <= lens[i]) {
      const f = d / lens[i];
      const a = c[i], b = c[(i + 1) % n];
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
    }
    d -= lens[i];
  }
  return c[0];
}

/* ── 격자선 (원작 문법 그대로) ── */
function GridLines({
  cols, rows, r0, r1, c0, c1, mobile,
}: { cols: number; rows: number; r0: number; r1: number; c0: number; c1: number; mobile?: boolean }) {
  return (
    <div className={mobile ? 'grid grid-cols-6 md:hidden' : 'hidden md:grid grid-cols-12'}>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const skipR = row >= r0 && row <= r1 && col >= c0 && col <= c1 - 1;
        const skipB = col >= c0 && col <= c1 && row >= r0 && row <= r1 - 1;
        return (
          <div
            key={i}
            className="aspect-square"
            style={{ boxShadow: skipR ? 'none' : LINE, borderBottom: skipB ? 'none' : BORDER }}
          />
        );
      })}
    </div>
  );
}

/* ── 교차점 도트: content rect 내부(텍스트 아래)는 생략 — 정밀 인상 강화 ── */
function GridDots({
  cols, rows, r0, r1, c0, c1, mobile,
}: { cols: number; rows: number; r0: number; r1: number; c0: number; c1: number; mobile?: boolean }) {
  const pts: { top: number; left: number }[] = [];
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const interior = row > r0 && row < r1 + 1 && col > c0 && col < c1 + 1;
      if (interior) continue;
      pts.push({ top: (row / rows) * 100, left: (col / cols) * 100 });
    }
  }
  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${mobile ? 'md:hidden' : 'hidden md:block'}`}>
      {pts.map((p, i) => (
        <span
          key={i}
          className="rounded-dot absolute bg-white/[0.14]"
          style={{ top: `${p.top}%`, left: `${p.left}%`, width: 3, height: 3, marginTop: -1.5, marginLeft: -1.5 }}
        />
      ))}
    </div>
  );
}

/* ── 빔 캔버스: 그린/블루 두 줄기 + 헤드 글로우 + 코너 버스트 ── */
function HeroBeams() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;

    function resize() {
      const dpr = devicePixelRatio || 1;
      const r = cvs!.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cvs!.width = w * dpr;
      cvs!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);

    const TRAIL = 60;
    const STEP = 0.0009;
    const BURST_R = 46;

    function drawBeam(t: number, corners: Pt[], rgb: string) {
      for (let i = 1; i < TRAIL; i++) {
        const t1 = t - (i - 1) * STEP;
        const t2 = t - i * STEP;
        const p1 = ptOnLoop(t1, corners);
        const p2 = ptOnLoop(t2, corners);

        const frac = 1 - i / TRAIL;
        const alpha = frac ** 1.8 * 0.56;
        const lw = frac * 1.7 + 0.4;

        ctx!.beginPath();
        ctx!.moveTo(p1.x * w, p1.y * h);
        ctx!.lineTo(p2.x * w, p2.y * h);
        ctx!.strokeStyle = `rgba(${rgb},${alpha})`;
        ctx!.lineWidth = lw;
        ctx!.lineCap = 'round';
        ctx!.stroke();
      }

      // 헤드 글로우
      const head = ptOnLoop(t, corners);
      const hx = head.x * w, hy = head.y * h;
      const glow = ctx!.createRadialGradient(hx, hy, 0, hx, hy, 13);
      glow.addColorStop(0, `rgba(${rgb},0.75)`);
      glow.addColorStop(1, `rgba(${rgb},0)`);
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(hx, hy, 13, 0, Math.PI * 2);
      ctx!.fill();

      // 코너 버스트: 헤드가 코너(크로스헤어) 근처를 지날 때 반짝임
      for (const c of corners) {
        const cx = c.x * w, cy = c.y * h;
        const d = Math.hypot(hx - cx, hy - cy);
        if (d < BURST_R) {
          const s = (1 - d / BURST_R) ** 2;
          const burst = ctx!.createRadialGradient(cx, cy, 0, cx, cy, BURST_R);
          burst.addColorStop(0, `rgba(${rgb},${0.5 * s})`);
          burst.addColorStop(1, `rgba(${rgb},0)`);
          ctx!.fillStyle = burst;
          ctx!.beginPath();
          ctx!.arc(cx, cy, BURST_R, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    let start: number | null = null;
    let raf: number;
    const DUR = 15_000, DUR_M = 12_500, MD = 900;

    function frame(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;

      ctx!.save();
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, cvs!.width, cvs!.height);
      ctx!.restore();

      const isDesk = w >= MD;
      const dur = isDesk ? DUR : DUR_M;
      const tNorm = (elapsed % dur) / dur;

      if (isDesk) {
        drawBeam(tNorm, DESK_LOOP_A, GREEN);
        drawBeam((tNorm + 0.5) % 1, DESK_LOOP_B, BLUE);
      } else {
        drawBeam(tNorm, MOB_LOOP_A, GREEN);
        drawBeam((tNorm + 0.5) % 1, MOB_LOOP_B, BLUE);
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />;
}

/* ── 4코너 좌표풍 라벨 ── */
function CornerLabel({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div
      className={`absolute z-[3] pointer-events-none select-none text-[11px] tracking-[0.16em] uppercase text-white/35 ${className}`}
      style={{ fontFamily: 'var(--font-en)' }}
    >
      {children}
    </div>
  );
}

export default function HeroB() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 45%, #0d1525 0%, #060a15 35%, #000 75%)' }}
      data-hero
    >
      {/* ── 격자 — 모바일 6×10 / 데스크톱 12×8 (원작 계승) ── */}
      <GridLines cols={M_COLS} rows={M_ROWS} r0={MC_R0} r1={MC_R1} c0={MC_C0} c1={MC_C1} mobile />
      <GridLines cols={D_COLS} rows={D_ROWS} r0={DC_R0} r1={DC_R1} c0={DC_C0} c1={DC_C1} />

      {/* ── 교차점 도트 (강화 포인트 ②) ── */}
      <GridDots cols={M_COLS} rows={M_ROWS} r0={MC_R0} r1={MC_R1} c0={MC_C0} c1={MC_C1} mobile />
      <GridDots cols={D_COLS} rows={D_ROWS} r0={DC_R0} r1={DC_R1} c0={DC_C0} c1={DC_C1} />

      {/* ── 크로스헤어 — 빔 루프 코너와 동일 좌표(코너버스트가 여기서 터짐) ── */}
      <div className="absolute inset-0 z-[3] pointer-events-none md:hidden">
        <div className="grid-crosshair" style={{ top: `${MOB_CROSS.top}%`, left: `${MOB_CROSS.left}%` }} />
        <div className="grid-crosshair" style={{ top: `${MOB_CROSS.top}%`, left: `${MOB_CROSS.right}%` }} />
        <div className="grid-crosshair" style={{ top: `${MOB_CROSS.bottom}%`, left: `${MOB_CROSS.left}%` }} />
        <div className="grid-crosshair" style={{ top: `${MOB_CROSS.bottom}%`, left: `${MOB_CROSS.right}%` }} />
      </div>
      <div className="absolute inset-0 z-[3] pointer-events-none hidden md:block">
        <div className="grid-crosshair" style={{ top: `${DESK_CROSS.top}%`, left: `${DESK_CROSS.left}%` }} />
        <div className="grid-crosshair" style={{ top: `${DESK_CROSS.top}%`, left: `${DESK_CROSS.right}%` }} />
        <div className="grid-crosshair" style={{ top: `${DESK_CROSS.bottom}%`, left: `${DESK_CROSS.left}%` }} />
        <div className="grid-crosshair" style={{ top: `${DESK_CROSS.bottom}%`, left: `${DESK_CROSS.right}%` }} />
      </div>

      {/* ── 필름 노이즈 ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── 빔: 그린(콘텐츠) + 블루(광고) 순회 + 코너 버스트 (강화 포인트 ①③) ── */}
      <HeroBeams />

      {/* ── 코너 브래킷 — 데스크톱만 (content rect 경계 표시) ── */}
      <div className="hero-bracket hero-bracket--tl hidden md:block" style={{ top: `${D_TOP}%`, left: `${D_LEFT}%` }} />
      <div className="hero-bracket hero-bracket--tr hidden md:block" style={{ top: `${D_TOP}%`, left: `calc(${D_RIGHT}% - 20px)` }} />
      <div className="hero-bracket hero-bracket--bl hidden md:block" style={{ top: `calc(${D_BOTTOM}% - 20px)`, left: `${D_LEFT}%` }} />
      <div className="hero-bracket hero-bracket--br hidden md:block" style={{ top: `calc(${D_BOTTOM}% - 20px)`, left: `calc(${D_RIGHT}% - 20px)` }} />

      {/* ── 4코너 라벨: 시스템 표기 · 그리드 · 두 제품 범례 · LIVE (강화 포인트 ②) ── */}
      <CornerLabel className="top-4 left-4 md:top-6 md:left-6">NUGOONA — SYSTEM</CornerLabel>
      <CornerLabel className="top-4 right-4 md:top-6 md:right-6 text-right">
        <span className="md:hidden">GRID 06×10</span>
        <span className="hidden md:inline">GRID 12×08</span>
      </CornerLabel>
      <CornerLabel className="bottom-4 left-4 md:bottom-6 md:left-6">
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-dot inline-block" style={{ width: 6, height: 6, background: '#2fd46b' }} />
            콘텐츠
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-dot inline-block" style={{ width: 6, height: 6, background: '#3e8bff' }} />
            광고
          </span>
        </span>
      </CornerLabel>
      <CornerLabel className="bottom-4 right-4 md:bottom-6 md:right-6 text-right">
        <span className="inline-flex items-center gap-1.5">
          <motion.span
            className="rounded-dot inline-block"
            style={{ width: 6, height: 6, background: '#fff' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: EASE }}
          />
          LIVE
        </span>
      </CornerLabel>

      {/* ── 콘텐츠 — 카피 불변 ── */}
      <div
        className="absolute z-[2] flex flex-col items-center justify-center text-center px-6
        inset-x-0 top-[10%] bottom-[10%]
        md:px-0 md:top-[12.5%] md:bottom-[12.5%] md:left-[16.667%] md:right-[16.667%]"
      >
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-[clamp(28px,5.4vw,60px)] font-bold tracking-[-0.04em] leading-[1.1] mb-6 text-white"
          dangerouslySetInnerHTML={{ __html: hero.h1 }}
        />
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="text-[16px] font-medium md:text-[clamp(14px,1.8vw,18px)] md:font-normal text-[#d4d4d4] leading-[1.65] tracking-[0.005em] max-w-[460px] mb-11"
        >
          {hero.sub}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        >
          <Link
            href={hero.ctaHref}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0a0a0a] text-[15px] font-semibold tracking-[-0.02em] no-underline transition-all duration-250 hover:bg-[#eaeaea] hover:shadow-[0_0_48px_rgba(255,255,255,0.12)]"
          >
            {hero.cta}
            <svg className="w-4 h-4 opacity-50 transition-all duration-250 hover:translate-x-[3px] hover:opacity-80" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* ── 스크롤 유도 트랙 (강화 포인트 ④) ── */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[3%] md:bottom-[4%] z-[3] flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[11px] tracking-[0.25em] uppercase text-white/35" style={{ fontFamily: 'var(--font-en)' }}>
          Scroll
        </span>
        <div className="relative w-px h-7 overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <motion.div
            className="absolute left-0 top-0 w-px h-2.5"
            style={{ background: 'rgba(255,255,255,0.9)' }}
            animate={{ y: [-10, 28] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: EASE }}
          />
        </div>
      </div>
    </section>
  );
}
