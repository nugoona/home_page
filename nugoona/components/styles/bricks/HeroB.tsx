'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { hero } from '@/lib/content/home';
import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';

/* ═══════════════════════════════════════════════════════════════
   컨셉: "빔 캔버스 진화" — 사장님 원작(HeroAurora/BeamCanvas) 계승·강화
   경쟁 시안 4개 중 하나. 원작 문법(12×8/6×10 격자·크로스헤어·필름노이즈·순회 빔)은
   그대로 두고, 아래 4가지로 밀도·정밀도·이벤트를 강화한다.
     1) 빔 두 줄기에 로고색(콘텐츠 NC #4d9fff · 광고 NA #29d5ff)을 입혀
        "두 제품 회사"를 배경 자체로 암시.
     2) 4코너 십자선(원작 crosshair — 격자 선 교차점에 얹혀 선을 관통) + 좌표풍 라벨.
     3) 빔의 머리가 크로스헤어 코너를 지날 때마다 그 지점이 제품색으로
        반짝이는 "코너 버스트" — 두 제품이 같은 시스템(격자)을 순회하며
        서로 교차하는 이벤트.
     4) 하단 스크롤 유도 트랙 추가.
   ═══════════════════════════════════════════════════════════════ */

interface Pt { x: number; y: number }

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── 그리드 상수 — PC 12×8 = Grid Occupancy(요소별 셀 점유, 사장님 확정 "바로 이거야").
   ★모바일 = 원작 방식 복원(2026-07-14 사장님 "모바일 디자인 망가짐" — 셀 점유를 모바일에
   강제하면 폭 축소·리듬 붕괴 실증 3회). 모바일 = 6×8 배경 격자 + 콘텐츠 rect 통째 skip +
   absolute 중앙 배치(원작 문법). 요소별 점유는 PC 전용. ── */
const D_COLS = 12, D_ROWS = 8;
/* 모바일 = 7행(2026-07-16 GPT PM: Hero 높이 압축 585→455px, 콘텐츠 중앙 덩어리·CTA 아래 여백↓). */
const M_COLS = 6, M_ROWS = 7;
/* 모바일 = 7행(§8.18-H, 2026-07-16 GPT PM 압축). h1/sub/cta 각자 행, 좌우 1칸(c1·c6) checker "빔이 돌 길".
   콘텐츠 c[2,6] 4칸(⛔ 좁은 열 점유 금지지만 4칸 풀폭성은 유지) / r2~r6 → 위 1행·아래 2행 여백.
   h1 = 모바일 전용 24px + 자간 -0.02em(답답함↓·한 줄). (PC clamp 불변.) */
const M_AREAS: GridArea[] = [
  { key: 'h1', c: [2, 6], r: [2, 4] },   // 위 1행 여백 → h1 2행
  { key: 'sub', c: [2, 6], r: [4, 5] },  // 1행
  { key: 'cta', c: [2, 6], r: [5, 6] },  // 1행 — 아래 1행 여백(r6~7)으로 대칭 중앙·CTA 아래 여백 축소
];

const D_AREAS: GridArea[] = [
  { key: 'h1', c: [4, 10], r: [3, 4] },  // 6칸×1행(중심축 line7 대칭)
  { key: 'sub', c: [5, 9], r: [4, 5] },  // 4칸×1행
  { key: 'cta', c: [5, 9], r: [6, 7] },  // 4칸×1행 — 서브와 한 행 띄움(r5 = checker 복귀, 사장님 2026-07-15 "버튼 한 칸 내리고 균형")
];


/* ── 코너 좌표: 크로스헤어 · 빔 루프 · 코너버스트가 공유하는 단일 좌표계.
   원작 HeroAurora와 동일 — 격자 '선 교차점'(1/12·1/8 계열)에 정렬해 십자선이 격자선을 관통한다. ── */
const DESK_TL: Pt = { x: 1 / 12, y: 1 / 8 };
const DESK_TR: Pt = { x: 11 / 12, y: 1 / 8 };
const DESK_BR: Pt = { x: 11 / 12, y: 7 / 8 };
const DESK_BL: Pt = { x: 1 / 12, y: 7 / 8 };
const DESK_LOOP_A: Pt[] = [DESK_TL, DESK_TR, DESK_BR, DESK_BL];
const DESK_LOOP_B: Pt[] = [DESK_BR, DESK_BL, DESK_TL, DESK_TR];

/* 빔 루프 코너 = 그리드 선 교차점(6×7 라인 = 1/7·6/7 — 그리드 행 변경 시 반드시 동기화 §8.16-D2) */
const MOB_TL: Pt = { x: 1 / 6, y: 1 / 7 };
const MOB_TR: Pt = { x: 5 / 6, y: 1 / 7 };
const MOB_BR: Pt = { x: 5 / 6, y: 6 / 7 };
const MOB_BL: Pt = { x: 1 / 6, y: 6 / 7 };
const MOB_LOOP_A: Pt[] = [MOB_TL, MOB_TR, MOB_BR, MOB_BL];
const MOB_LOOP_B: Pt[] = [MOB_BR, MOB_BL, MOB_TL, MOB_TR];

const BEAM_NC = '77,159,255'; // 콘텐츠 빔 = NC 로고색 밝은블루 #4d9fff (옛 그린 #2fd46b 폐기 2026-07-12)
const BEAM_NA = '41,213,255'; // 광고 빔 = NA 로고색 시안 #29d5ff (옛 임의블루 #3e8bff 폐기)


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

/* ── 빔 캔버스: 두 줄기(NC 블루·NA 시안) + 헤드 글로우 + 코너 버스트 ── */
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
        drawBeam(tNorm, DESK_LOOP_A, BEAM_NC);
        drawBeam((tNorm + 0.5) % 1, DESK_LOOP_B, BEAM_NA);
      } else {
        drawBeam(tNorm, MOB_LOOP_A, BEAM_NC);
        drawBeam((tNorm + 0.5) % 1, MOB_LOOP_B, BEAM_NA);
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

/* 히어로 카피 계약 — 홈(home.ts hero) 구조. /content 등 다른 페이지가 같은 형태로 주입한다. */
type HeroContent = { h1: string; sub: string; cta: string; ctaHref: string };

/* content·areas를 주입받되 기본값 = 홈(불변). 홈 호출부 <HeroB /> 는 인자 없이 그대로 동작. */
export default function HeroB({
  content = hero,
  deskAreas = D_AREAS,
  mobAreas = M_AREAS,
}: { content?: HeroContent; deskAreas?: GridArea[]; mobAreas?: GridArea[] } = {}) {
  /* 콘텐츠 면 렌더 — 카피·색·애니 불변. mb 마진 제거(간격 = 그리드 행이 담당) */
  const renderContent = (key: string) => {
    if (key === 'h1') {
      return (
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="px-2 text-center text-[clamp(28px,5.4vw,60px)] font-bold tracking-[-0.04em] leading-[1.1] text-white max-md:whitespace-nowrap max-md:text-[24px] max-md:tracking-[-0.02em] [&_.text-accent]:text-[#4d9fff]"
          dangerouslySetInnerHTML={{ __html: content.h1 }}
        />
      );
    }
    if (key === 'sub') {
      return (
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="max-w-[300px] px-3 text-center text-[15px] font-medium leading-[1.5] tracking-[-0.01em] text-balance text-[#e4e4e4] md:max-w-[460px] md:text-[clamp(14px,1.8vw,18px)] md:font-normal md:text-[#d4d4d4]"
          dangerouslySetInnerHTML={{ __html: content.sub }}
        />
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
      >
        <Link
          href={content.ctaHref}
          className="rounded-pill inline-flex items-center gap-2 px-8 py-3.5 max-md:px-9 bg-white text-[#0a0a0a] text-[15px] font-semibold tracking-[-0.02em] no-underline transition-all duration-250 hover:bg-[#eaeaea] hover:shadow-[0_0_48px_rgba(255,255,255,0.12)]"
        >
          {content.cta}
          <svg className="w-4 h-4 opacity-50 transition-all duration-250 hover:translate-x-[3px] hover:opacity-80" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </Link>
      </motion.div>
    );
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 45%, #0d1525 0%, #060a15 35%, #000 75%)' }}
      data-hero
    >
      {/* ── PC: Occupancy 격자 12×8 — h1·sub·cta가 요소별 셀 점유(확정 "바로 이거야") ── */}
      <OccupancyGrid cols={D_COLS} rows={D_ROWS} areas={deskAreas} tone="dark" checker mobile={false} className="z-[2]" render={renderContent} />

      {/* ── 모바일: 풀폭 행 분할(h1/sub/cta) — 사이 가로선으로 중간 그리드 유지(실기기 교정 2026-07-15) ── */}
      <OccupancyGrid
        cols={M_COLS}
        rows={M_ROWS}
        areas={mobAreas}
        tone="darkFaint"
        checker
        mobile
        className="z-[2]"
        render={renderContent}
      />

      {/* ── 필름 노이즈 ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── 빔: NC 블루(콘텐츠) + NA 시안(광고) 순회 + 코너 버스트 ── */}
      <HeroBeams />

      {/* 모서리 디테일(코너 라벨·LIVE·SCROLL 트랙·크로스헤어·브래킷) 전부 제거 — 사장님 2026-07-14 */}
    </section>
  );
}
