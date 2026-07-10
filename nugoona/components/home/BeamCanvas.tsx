'use client';
import { useEffect, useRef } from 'react';

interface Pt { x: number; y: number }

/** Return a point at parameter t (0–1) along a closed polygon */
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

/* ── Corner sets (fractional coords matching grid crosshairs) ── */
const DESK_A: Pt[] = [
  { x: 1 / 12, y: 1 / 8 },
  { x: 11 / 12, y: 1 / 8 },
  { x: 11 / 12, y: 7 / 8 },
  { x: 1 / 12, y: 7 / 8 },
];
const DESK_B: Pt[] = [
  { x: 11 / 12, y: 7 / 8 },
  { x: 1 / 12, y: 7 / 8 },
  { x: 1 / 12, y: 1 / 8 },
  { x: 11 / 12, y: 1 / 8 },
];
const MOB_A: Pt[] = [
  { x: 1 / 6, y: 1 / 10 },
  { x: 5 / 6, y: 1 / 10 },
  { x: 5 / 6, y: 9 / 10 },
  { x: 1 / 6, y: 9 / 10 },
];

const TRAIL = 60;
const STEP = 0.0009;
const DUR = 14_000;
const DUR_M = 12_000;
const MD = 900;

export default function BeamCanvas() {
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
      // Scale context so we can draw in CSS pixel coords
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);

    function drawBeam(t: number, corners: Pt[]) {
      for (let i = 1; i < TRAIL; i++) {
        const t1 = t - (i - 1) * STEP;
        const t2 = t - i * STEP;
        const p1 = ptOnLoop(t1, corners);
        const p2 = ptOnLoop(t2, corners);

        const frac = 1 - i / TRAIL;
        const alpha = frac ** 1.8 * 0.54;
        const lw = frac * 1.6 + 0.4;

        ctx!.beginPath();
        ctx!.moveTo(p1.x * w, p1.y * h);
        ctx!.lineTo(p2.x * w, p2.y * h);
        ctx!.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx!.lineWidth = lw;
        ctx!.lineCap = 'round';
        ctx!.stroke();
      }
    }

    let start: number | null = null;
    let raf: number;

    function frame(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;

      // Clear in CSS pixel coords (transform handles dpr)
      ctx!.save();
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, cvs!.width, cvs!.height);
      ctx!.restore();

      const isDesk = w >= MD;
      const dur = isDesk ? DUR : DUR_M;
      const tNorm = (elapsed % dur) / dur;

      if (isDesk) {
        drawBeam(tNorm, DESK_A);
        drawBeam(tNorm, DESK_B);
      } else {
        drawBeam(tNorm, MOB_A);
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
    />
  );
}
