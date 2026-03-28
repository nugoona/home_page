import Link from 'next/link';
import { hero } from '@/lib/content/home';
import BeamCanvas from './BeamCanvas';

/* Desktop: 12 cols × 8 rows, content rows 2-5 cols 2-9 */
const D_COLS = 12, D_ROWS = 8;
const DC_R0 = 2, DC_R1 = 5, DC_C0 = 2, DC_C1 = 9;

/* Mobile: 6 cols × 10 rows, content rows 3-6 cols 1-4 */
const M_COLS = 6, M_ROWS = 10;
const MC_R0 = 3, MC_R1 = 6, MC_C0 = 1, MC_C1 = 4;

const LINE = '1px 0 0 rgba(255,255,255,0.12)';
const BORDER = '0.5px solid rgba(255,255,255,0.12)';

export default function HeroAurora() {
  return (
    <section
      className="vi-hero relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 45%, #0d1525 0%, #060a15 35%, #000 75%)' }}
      data-hero
    >
      {/* ── Mobile grid: 6 cols × 10 rows ── */}
      <div className="grid grid-cols-6 md:hidden">
        {Array.from({ length: M_COLS * M_ROWS }).map((_, i) => {
          const row = Math.floor(i / M_COLS);
          const col = i % M_COLS;
          const skipR = row >= MC_R0 && row <= MC_R1 && col >= MC_C0 && col <= MC_C1 - 1;
          const skipB = col >= MC_C0 && col <= MC_C1 && row >= MC_R0 && row <= MC_R1 - 1;
          return (
            <div
              key={i}
              className="aspect-square"
              style={{
                boxShadow: skipR ? 'none' : LINE,
                borderBottom: skipB ? 'none' : BORDER,
              }}
            />
          );
        })}
      </div>

      {/* ── Desktop grid: 12 cols × 8 rows ── */}
      <div className="hidden md:grid grid-cols-12">
        {Array.from({ length: D_COLS * D_ROWS }).map((_, i) => {
          const row = Math.floor(i / D_COLS);
          const col = i % D_COLS;
          const skipR = row >= DC_R0 && row <= DC_R1 && col >= DC_C0 && col <= DC_C1 - 1;
          const skipB = col >= DC_C0 && col <= DC_C1 && row >= DC_R0 && row <= DC_R1 - 1;
          return (
            <div
              key={i}
              className="aspect-square"
              style={{
                boxShadow: skipR ? 'none' : LINE,
                borderBottom: skipB ? 'none' : BORDER,
              }}
            />
          );
        })}
      </div>

      {/* ── Static crosshairs at 4 corners — mobile (6-col grid) ── */}
      <div className="grid-crosshair-wrap md:hidden">
        <div className="grid-crosshair" style={{ top: 'calc(100% * 1 / 10)', left: 'calc(100% * 1 / 6)' }} />
        <div className="grid-crosshair" style={{ top: 'calc(100% * 1 / 10)', left: 'calc(100% * 5 / 6)' }} />
        <div className="grid-crosshair" style={{ top: 'calc(100% * 9 / 10)', left: 'calc(100% * 1 / 6)' }} />
        <div className="grid-crosshair" style={{ top: 'calc(100% * 9 / 10)', left: 'calc(100% * 5 / 6)' }} />
      </div>

      {/* ── Static crosshairs at 4 corners — desktop (12-col grid) ── */}
      <div className="grid-crosshair-wrap hidden md:block">
        <div className="grid-crosshair" style={{ top: 'calc(100% * 1 / 8)', left: 'calc(100% * 1 / 12)' }} />
        <div className="grid-crosshair" style={{ top: 'calc(100% * 1 / 8)', left: 'calc(100% * 11 / 12)' }} />
        <div className="grid-crosshair" style={{ top: 'calc(100% * 7 / 8)', left: 'calc(100% * 1 / 12)' }} />
        <div className="grid-crosshair" style={{ top: 'calc(100% * 7 / 8)', left: 'calc(100% * 11 / 12)' }} />
      </div>

      {/* ── Film noise (z-0, below beams, no blend mode) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Light beams (canvas — gradient light + L-bend at corners) ── */}
      <BeamCanvas />

      {/* ── Corner brackets — desktop only ── */}
      <div className="hero-bracket hero-bracket--tl hidden md:block" style={{ top: 'calc(100% * 2 / 8)', left: 'calc(100% * 2 / 12)' }} />
      <div className="hero-bracket hero-bracket--tr hidden md:block" style={{ top: 'calc(100% * 2 / 8)', left: 'calc(100% * 10 / 12 - 20px)' }} />
      <div className="hero-bracket hero-bracket--bl hidden md:block" style={{ top: 'calc(100% * 6 / 8 - 20px)', left: 'calc(100% * 2 / 12)' }} />
      <div className="hero-bracket hero-bracket--br hidden md:block" style={{ top: 'calc(100% * 6 / 8 - 20px)', left: 'calc(100% * 10 / 12 - 20px)' }} />

      {/* ── Content ── */}
      <div className="absolute z-[2] flex flex-col items-center justify-center text-center px-6
        inset-x-0 top-[30%] bottom-[30%]
        md:px-0 md:top-[25%] md:bottom-[25%] md:left-[16.667%] md:right-[16.667%]">
        <h1
          className="text-[clamp(26px,5vw,56px)] font-bold tracking-[-0.04em] leading-[1.12] mb-6 text-white"
          dangerouslySetInnerHTML={{ __html: hero.h1 }}
        />
        <p className="text-[clamp(13px,1.8vw,19px)] text-[#d4d4d4] leading-[1.65] tracking-[0.005em] max-w-[460px] mb-11">
          {hero.sub}
        </p>
        <Link
          href={hero.ctaHref}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-pill bg-white text-[#0a0a0a] text-[15px] font-semibold tracking-[-0.01em] no-underline transition-all duration-250 hover:bg-[#e5e5e5] hover:shadow-[0_0_48px_rgba(255,255,255,0.12)]"
        >
          {hero.cta}
          <svg className="w-4 h-4 opacity-50 transition-all duration-250 hover:translate-x-[3px] hover:opacity-80" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
