'use client';

/**
 * S9_ChannelFanout — [/content ① 다채널 발행, 정본 A1]
 *
 * 사장님 승인 시안 = `Draft_CoreSet.tsx`의 D1(2026-07-11 2차 제출 — v2 재설계 반영).
 * 구조·카피는 D1 그대로 옮긴다(글자·항목 추가 금지). 이 파일이 하는 일은 D1의 정적 목업에
 * 브랜드 모션(좌 업로드 박스 → 우 채널 3행으로 뻗는 직각 fan-out 선)만 입히는 것.
 *
 * ⚠ 정렬 함정(과거 S11류 재작업 전례): 우측 3행은 본문 길이가 서로 달라(긴 글/해시태그/짧은 소식)
 *   행 높이가 제각각이다. 선의 y좌표를 40/120/200처럼 하드코딩하면 실제 행 중심과 어긋난다.
 *   → ResizeObserver + getBoundingClientRect로 각 행의 실제 렌더 중심을 구해 선을 긋는다
 *     (폰트 로딩(FOUT)으로 인한 높이 변화도 `document.fonts.ready`로 재측정해 보정).
 */

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = '#0070f3';
const BORDER = '#eaeaea';

// SSR에서 useLayoutEffect 경고를 피한다 (클라이언트 전용 측정 훅)
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function Dot({ c }: { c: string }) {
  return <span className="inline-block w-1.5 h-1.5 rounded-dot shrink-0" style={{ background: c }} />;
}

function PhotoSlot({ size = 44 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, background: '#e9ecef' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b7bec6" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" /><circle cx="8.5" cy="9" r="1.6" /><path d="M3 16l5-4 4 3 3-3 6 5" />
      </svg>
    </span>
  );
}

/* 모바일 가지 — 왼쪽 세로축에서 행으로 뻗는 직각선 + accent 점 (화살표 없음, 굵기 통일) */
function MobileTick() {
  return (
    <span aria-hidden className="md:hidden absolute top-1/2 -translate-y-1/2 flex items-center" style={{ left: '-22px' }}>
      <span className="block h-[1.5px] w-[15px]" style={{ background: 'rgba(0,112,243,0.5)' }} />
      <span className="block w-1.5 h-1.5 rounded-dot shrink-0" style={{ background: ACCENT }} />
    </span>
  );
}

/* 데스크 직각 fan-out — 실측 y좌표(ys)로 그린다. 굵기 균일(non-scaling-stroke), 화살표 없이 끝 점 */
function FanOutSVG({ inView, h, w, ys }: { inView: boolean; h: number; w: number; ys: number[] }) {
  const stem = { duration: 0.35, ease: EASE } as const;
  const S = { stroke: ACCENT, strokeWidth: 1.5, strokeOpacity: 0.5, vectorEffect: 'non-scaling-stroke' as const };
  const branchX = w * 0.46;
  const midY = h / 2;
  return (
    <>
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" fill="none">
        {/* 줄기: 좌 업로드 박스 → 분배점 */}
        <motion.line x1={0} y1={midY} x2={branchX} y2={midY} {...S}
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...stem, delay: 0.3 }} />
        {/* 세로 분배: 1행 중심 → 3행 중심 */}
        <motion.line x1={branchX} y1={ys[0]} x2={branchX} y2={ys[2]} {...S}
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...stem, delay: 0.5 }} />
        {/* 3갈래: 각 행 중심으로 */}
        {ys.map((y, i) => (
          <motion.line key={i} x1={branchX} y1={y} x2={w} y2={y} {...S}
            initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...stem, delay: 0.62 + i * 0.08 }} />
        ))}
      </svg>
      {/* 가지 끝 accent 점 — CSS 원(왜곡 없음), 실측 y(px) 그대로 사용 */}
      {ys.map((y, i) => (
        <motion.span
          key={`d${i}`}
          aria-hidden
          className="absolute right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-dot bg-accent"
          style={{ top: `${y}px` }}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.25, ease: EASE, delay: 0.82 + i * 0.08 }}
        />
      ))}
    </>
  );
}

/* 같은 이야기 하나 → 채널마다 같은 볼드 문구가 반복되는 한 줄 본문 (D1 그대로) */
const ROWS = [
  { ch: '네이버 블로그', c: '#03c75a', form: '긴 글', body: <>오늘 들여온 <b>제철 딸기</b>로 <b>팬케이크</b>를 구웠어요. 창가 자리에 앉으면…</> },
  { ch: '인스타그램', c: '#e1306c', form: '사진+해시태그', body: <><b>제철 딸기 팬케이크</b> — #성수동브런치 #제철카페</> },
  { ch: '페이스북', c: '#1877f2', form: '짧은 소식', body: <><b>제철 딸기 팬케이크</b>, 이번 주부터 시작합니다.</> },
] as const;

export default function S9_ChannelFanout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-12%' });

  const trackRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [geo, setGeo] = useState<{ h: number; w: number; ys: number[] } | null>(null);

  useIsoLayoutEffect(() => {
    function measure() {
      const track = trackRef.current;
      if (!track) return;
      const trackRect = track.getBoundingClientRect();
      if (trackRect.height === 0) return; // 모바일(hidden)일 땐 측정 스킵
      const ys = rowRefs.current.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2 - trackRect.top;
      });
      setGeo({ h: trackRect.height, w: trackRect.width, ys });
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    rowRefs.current.forEach((el) => el && ro.observe(el));
    window.addEventListener('resize', measure);
    // 폰트(Pretendard) 로드 후 줄바꿈이 바뀔 수 있어 재측정
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  return (
    <div ref={sectionRef} className="w-full">
      {/* 헤드라인 */}
      <div className="mb-8 max-w-[560px]">
        <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.2]">
          같은 이야기 하나가,<br />채널마다 <span className="text-accent">그 채널답게</span>.
        </h3>
      </div>

      {/* 시각화 */}
      <div className="flex flex-col md:flex-row md:items-stretch gap-0">
        {/* 좌: 업로드 사진 4칸 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="shrink-0 md:self-center"
        >
          <div className="grid grid-cols-2 gap-1 p-2 border bg-white" style={{ borderColor: BORDER }}>
            {[0, 1, 2, 3].map((i) => <PhotoSlot key={i} />)}
          </div>
          <p className="text-[10.5px] mt-1.5 text-text-weak text-center">오늘 올린 이야기 하나</p>
        </motion.div>

        {/* 데스크 커넥터 트랙 — fan-out 선(실측 좌표) */}
        <div ref={trackRef} className="hidden md:block relative w-20 shrink-0 self-stretch">
          {geo && <FanOutSVG inView={inView} h={geo.h} w={geo.w} ys={geo.ys} />}
        </div>

        {/* 우: 채널 3행 */}
        <div className="flex flex-col gap-3 min-w-0 max-md:relative max-md:pl-7 max-md:mt-4">
          {/* 모바일 세로 축(spine) */}
          <span aria-hidden className="md:hidden absolute w-[1.5px]" style={{ left: '6px', top: '4px', bottom: '20px', background: 'rgba(0,112,243,0.5)' }} />
          {ROWS.map((row, i) => (
            <div
              key={row.ch}
              ref={(el) => { rowRefs.current[i] = el; }}
              className="relative flex items-start gap-2"
            >
              <MobileTick />
              <Dot c={row.c} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-text-primary">{row.ch}</span>
                  <span className="text-[9.5px] px-1.5 py-0.5 border text-text-weak" style={{ ...EN, borderColor: '#eaeaea' }}>{row.form}</span>
                </div>
                <motion.p
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.55 + i * 0.1 }}
                  className="text-[13px] text-text-body mt-0.5"
                >
                  {row.body as ReactNode}
                </motion.p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: EASE, delay: 1.0 }}
        className="mt-5 text-[11px] text-text-weak"
      >
        이야기는 하나 — 채널마다 그 채널의 형식으로 다시 씁니다.
      </motion.p>
    </div>
  );
}
