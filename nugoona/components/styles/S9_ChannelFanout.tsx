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

/* pulse=true면 도착 순간 badgePulse 1회(무한반복 아님) — 3막, 발행 완료 느낌 */
function Dot({ c, pulse, delay = 0 }: { c: string; pulse?: boolean; delay?: number }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-dot shrink-0"
      style={{
        background: c,
        color: `${c}66`,
        animation: pulse ? `badgePulse 0.6s ease-in-out ${delay}s 1` : undefined,
      }}
    />
  );
}

/* 원재료 실사 4장(M-7: 빈 회색 박스 → 실사 — 팬케이크/프렌치토스트/브런치토스트/디저트) */
const PHOTOS = [
  'photo-1567620905732-2d1ec7ab7445',
  'photo-1484723091739-30a097e8f929',
  'photo-1525351484163-7529414344d8',
  'photo-1551024506-0bccd828d307',
] as const;

/* 데스크(44px 고정 인라인 스타일) → 모바일(그리드 셀을 꽉 채우는 정사각형)으로 전환.
   인라인 style은 Tailwind 클래스보다 우선하므로, 모바일에서는 style 자체를 생략한다. */
function PhotoSlot({ src, size = 44 }: { src: string; size?: number }) {
  return (
    <span
      className="block overflow-hidden shrink-0 max-md:!w-full max-md:!h-auto max-md:aspect-square"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/img/unsplash/webp/${src}.webp`} alt="" className="w-full h-full object-cover" />
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

/* 데스크 직각 fan-out — 실측 y좌표(ys)로 그린다. 굵기 균일(non-scaling-stroke), 화살표 없이 끝 점
   2막 연출: 선이 그려진 뒤, 소스→각 채널 경로를 accent 도트가 한 번 흘러가며(animateMotion) 발행을 체감시킨다. */
function FanOutSVG({ inView, h, w, ys }: { inView: boolean; h: number; w: number; ys: number[] }) {
  const stem = { duration: 0.35, ease: EASE } as const;
  const S = { stroke: ACCENT, strokeWidth: 1.5, strokeOpacity: 0.5, vectorEffect: 'non-scaling-stroke' as const };
  const branchX = w * 0.46;
  const midY = h / 2;
  // 도트가 흐를 전체 경로(소스 → 분배점 → 각 채널). 라인 드로잉이 끝나갈 무렵부터 흐르기 시작.
  const flowPath = (y: number) => `M0,${midY}H${branchX}V${y}H${w}`;
  return (
    <>
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" fill="none">
        <defs>
          {ys.map((y, i) => <path key={i} id={`s9-flow-${i}`} d={flowPath(y)} />)}
        </defs>
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
        {/* 흐르는 도트 — 소스에서 각 채널로, 라인이 그려진 직후 순차적으로 1회 흐름 */}
        {inView && ys.map((_, i) => (
          <circle key={`flow${i}`} r="3" fill={ACCENT}>
            <animateMotion dur="0.55s" begin={`${0.85 + i * 0.1}s`} fill="freeze" repeatCount="1">
              <mpath href={`#s9-flow-${i}`} />
            </animateMotion>
          </circle>
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
        {/* 좌: 업로드 사진 4칸 — 1막, 개별 스태거 팝 */}
        <div className="shrink-0 md:self-center max-md:w-full">
          <div className="grid grid-cols-2 gap-1 p-2 border bg-white max-md:w-full max-md:gap-2" style={{ borderColor: BORDER }}>
            {PHOTOS.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
              >
                <PhotoSlot src={src} />
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, ease: EASE, delay: 0.4 }}
            className="text-[10.5px] mt-1.5 text-text-weak text-center"
          >
            오늘 올린 이야기 하나
          </motion.p>
        </div>

        {/* 데스크 커넥터 트랙 — fan-out 선(실측 좌표) */}
        <div ref={trackRef} className="hidden md:block relative w-20 shrink-0 self-stretch">
          {geo && <FanOutSVG inView={inView} h={geo.h} w={geo.w} ys={geo.ys} />}
        </div>

        {/* 우: 채널 3행 */}
        <div className="flex flex-col gap-3 min-w-0 max-md:relative max-md:pl-7 max-md:mt-4">
          {/* 모바일 세로 축(spine) */}
          <span aria-hidden className="md:hidden absolute w-[1.5px]" style={{ left: '6px', top: '4px', bottom: '20px', background: 'rgba(0,112,243,0.5)' }} />
          {ROWS.map((row, i) => {
            // 3막: 채널 행 순차 등장(스태거 0.15) — 도트가 해당 채널에 도착하는 타이밍(0.85+i*0.1+0.55)에 맞춰 점이 badgePulse
            // ⚠ 이 div는 fan-out 선의 실측 기준(rowRefs)이다 — transform(y)을 걸면 측정 시점에 위치가 어긋난다.
            //   그래서 정적 컨테이너는 그대로 두고, 안쪽 콘텐츠만 opacity로 순차 등장시킨다(레이아웃에 영향 없음).
            const rowDelay = 1.1 + i * 0.15;
            const dotArrival = 0.85 + i * 0.1 + 0.55;
            return (
              <div
                key={row.ch}
                ref={(el) => { rowRefs.current[i] = el; }}
                className="relative flex items-start gap-2"
              >
                <MobileTick />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, ease: EASE, delay: rowDelay }}
                  className="flex items-start gap-2"
                >
                  <Dot c={row.c} pulse={inView} delay={dotArrival} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] max-md:text-[12px] font-semibold text-text-primary">{row.ch}</span>
                      <span className="text-[9.5px] px-1.5 py-0.5 border text-text-weak" style={{ ...EN, borderColor: '#eaeaea' }}>{row.form}</span>
                    </div>
                    <p className="text-[13px] max-md:text-[16px] max-md:font-medium text-text-body mt-0.5">
                      {row.body as ReactNode}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: EASE, delay: 1.7 }}
        className="mt-5 text-[11px] max-md:text-[12px] max-md:font-medium text-text-weak"
      >
        이야기는 하나 — 채널마다 그 채널의 형식으로 다시 씁니다.
      </motion.p>
    </div>
  );
}
