'use client';

/**
 * S12_MapExposure — [/content ⑥ 지도 노출, 정본 A9]
 *
 * 사장님 지적(2026-07-10): "구글 플레이스 관리를 해주는 거 아냐? 저것만 보면 뭔 서비스인지 헷갈려"
 *   → 1차안(네이버 지도만 크게)은 '지도 앱'처럼 보였다. **네이버 플레이스 + 구글 비즈니스를 나란히**
 *     세우고, 어필(= 글 하나가 두 곳에 자동으로 올라간다)을 헤드라인·구조로 못 박는다.
 *
 * 정본 A9 사실:
 *   · 블로그 발행 **성공 시** 네이버 플레이스 소식 · 구글 비즈니스 프로필에 **부가 게시**.
 *   · 그 결과 네이버 지도·플레이스·구글 지도 검색에 가게가 보인다(★지도 소구 — 6채널 목록에 뭉개지 말 것).
 *   · 채널은 한 번 연결 필요. **네이버는 셀프 연결 불가 — 운영자 QR 지원.**
 * ⛔ 금지: 순위·상위노출 보장 / "연결만 하면 바로 다 올라간다" / **"프로필 관리·대행"**(우리는 게시만 한다.
 *    리뷰 답글도 초안만 만들고 등록은 사장님 몫 — A16) / 내부 크론·dry-run 용어.
 *
 * 디자인(DESIGN §8.7): 브라우저 창 껍데기 · 직각선(곡선·화살표 금지, 끝은 accent 점) · 실제 글
 *   · 발행된 글 인용은 명조(--font-quote) · 각주 한 줄 · ⛔면칠 금지(§7-7 — 지도 블록에 색면 칠하지 않는다).
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const QUOTE = { fontFamily: 'var(--font-quote)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = '#0070f3';

function Chrome({ url }: { url?: string }) {
  return (
    <div className="flex items-center gap-2 px-3 h-8 border-b" style={{ borderColor: '#eee', background: '#fafafa' }}>
      <div className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="rounded-dot w-2 h-2" style={{ background: '#d9dce1' }} />)}</div>
      {url && <span className="ml-1 text-[10px] tracking-tight truncate" style={{ ...EN, color: '#9aa0a8' }}>{url}</span>}
    </div>
  );
}

/* 미니 지도 — 직각 도로망(브랜드 문법과 일치). 색면 칠하지 않고 핀으로만 강조.
   M-8: '지도'로 읽히도록 도로 위계(간선 1개 굵게 + 지선 3개)와 도시 블록 면을 더한다. */
function MiniMap({ inView, delay }: { inView: boolean; delay: number }) {
  // 간선 1개 — 아래쪽 가로 도로를 굵게(strokeWidth 6)
  const mainRoad = { x1: 0, y1: 82, x2: 112, y2: 82 };
  const mainRoadStyle = { stroke: '#fff', strokeWidth: 6, strokeLinecap: 'butt' as const };
  const mainEdgeStyle = { stroke: '#e4e7ea', strokeWidth: 7.4, strokeLinecap: 'butt' as const };
  // 지선 3개 — 나머지 도로는 얇게(strokeWidth 3)
  // 우리 가게는 (56,54) — 도로가 둘러싼 가운데 블록 안에 놓인다.
  const localRoads = [
    { x1: 0, y1: 26, x2: 112, y2: 26 },
    { x1: 30, y1: 0, x2: 30, y2: 108 },
    { x1: 84, y1: 0, x2: 84, y2: 108 },
  ];
  const localRoadStyle = { stroke: '#fff', strokeWidth: 3, strokeLinecap: 'butt' as const };
  const localEdgeStyle = { stroke: '#e4e7ea', strokeWidth: 4.2, strokeLinecap: 'butt' as const };
  // 도시 블록 면 — 도로가 만드는 칸 일부를 살짝 다른 톤으로 채워 '건물 블록' 느낌
  const blocks = [
    { x: 3, y: 3, w: 24, h: 20 },
    { x: 87, y: 3, w: 22, h: 20 },
    { x: 87, y: 87, w: 22, h: 18 },
  ];
  return (
    <div className="relative w-[112px] shrink-0 self-stretch overflow-hidden max-md:w-[88px]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 108" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden>
        <rect x="0" y="0" width="112" height="108" fill="#f6f7f8" />
        {blocks.map((b, i) => <rect key={`blk${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill="#f0f2f4" />)}
        <line {...mainRoad} {...mainEdgeStyle} />
        {localRoads.map((l, i) => <line key={`e${i}`} {...l} {...localEdgeStyle} />)}
        <line {...mainRoad} {...mainRoadStyle} />
        {localRoads.map((l, i) => <line key={`r${i}`} {...l} {...localRoadStyle} />)}
        <circle cx="14" cy="96" r="1.8" fill="#c3c8ce" />
        <circle cx="98" cy="12" r="1.8" fill="#c3c8ce" />
        <circle cx="16" cy="52" r="1.8" fill="#c3c8ce" />
      </svg>
      {/* 우리 가게 핀 — 도착 순간 드롭(y -8→0 + 스케일) */}
      <motion.span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        initial={{ opacity: 0, y: -8, scale: 0.6 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.32, ease: EASE, delay }}
      >
        <span className="absolute w-5 h-5 rounded-dot" style={{ background: ACCENT, opacity: 0.14 }} />
        <span className="relative w-2.5 h-2.5 rounded-dot" style={{ background: ACCENT, boxShadow: '0 0 0 2px #fff' }} />
      </motion.span>
    </div>
  );
}

/* 채널 결과 창 — 왼쪽 미니 지도 + 오른쪽 가게 정보
   minimal(구글) = 가게명만(글자 0 수준). quote 있으면(네이버) 인용 1줄 + 채널 라벨까지만.
   M-8: 카드 상단(Chrome 아래)에 채널 헤더(점+라벨 12px)를 두어 두 카드의 채널 구분을 명확히 한다. */
function ResultWindow({
  url, dot, headerLabel, channel, quote, inView, delay, arrivalDelay, minimal,
}: { url?: string; dot: string; headerLabel: string; channel?: string; quote?: string; inView: boolean; delay: number; arrivalDelay: number; minimal?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="border bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] md:h-[140px] flex flex-col"
      style={{ borderColor: '#eaeaea' }}
    >
      <Chrome url={minimal ? undefined : url} />
      {/* 채널 헤더 — 도트 흐름 도착 순간 badgePulse 1회 */}
      <div className="flex items-center gap-1.5 px-3 pt-2.5">
        <span
          className="rounded-dot w-1.5 h-1.5 shrink-0"
          style={{ background: dot, color: `${dot}66`, animation: inView ? `badgePulse 0.6s ease-in-out ${arrivalDelay}s 1` : undefined }}
        />
        <span className="text-[12px] font-semibold text-text-primary">{headerLabel}</span>
      </div>
      <div className="flex items-stretch flex-1 min-h-0">
        <MiniMap inView={inView} delay={arrivalDelay + 0.1} />
        <div className="flex-1 min-w-0 p-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="rounded-dot w-1.5 h-1.5 shrink-0" style={{ background: dot }} />
            <span className="text-[13px] font-bold text-text-primary truncate">오늘의 브런치, 성수</span>
          </div>

          {!minimal && quote && (
            <p className="text-[11px] leading-[1.5] mt-2 text-text-body" style={QUOTE}>&ldquo;{quote}&rdquo;</p>
          )}

          {!minimal && channel && (
            <span className="block text-[9px] mt-2 text-text-muted" style={EN}>{channel} · 방금</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* 데스크 직각 fan-out — 글 하나 → 두 채널. 화살표 없이 끝에 accent 점(부모가 그림)
   좌표계: 커넥터는 self-stretch라 높이 = 우측 창 스택 높이. 창 높이 h, 사이 gap g일 때
   창 중심 비율은 25%/75%가 아니라 (h/2)/(2h+g), (h+g+h/2)/(2h+g) = 24%/76%다(실측 확인).
   그래서 두 창 높이를 md:h-[140px]로 고정해 이 비율을 안정시킨다. */
const BRANCH_Y = [48, 152] as const; // = 200 × 24% / 76%
// 도트 흐름(도착 시각) — 선이 다 그려진 뒤 시작해 각 창에 순차 도착. ResultWindow의 badgePulse·MiniMap 핀드롭과 동기.
const FLOW_BEGIN = [1.0, 1.1] as const;
const FLOW_DUR = 0.4;
const FLOW_ARRIVAL = FLOW_BEGIN.map((b) => b + FLOW_DUR); // [1.4, 1.5]

function Fork({ inView }: { inView: boolean }) {
  const S = { stroke: ACCENT, strokeWidth: 1.5, strokeOpacity: 0.5, vectorEffect: 'non-scaling-stroke' as const };
  const stem = { duration: 0.32, ease: EASE } as const;
  const flowPath = (y: number) => `M0,100H30V${y}H64`;
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 200" preserveAspectRatio="none" fill="none">
      <defs>
        {BRANCH_Y.map((y, i) => <path key={i} id={`s12-flow-${i}`} d={flowPath(y)} />)}
      </defs>
      <motion.line x1="0" y1="100" x2="30" y2="100" {...S}
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...stem, delay: 0.3 }} />
      <motion.line x1="30" y1={BRANCH_Y[0]} x2="30" y2={BRANCH_Y[1]} {...S}
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...stem, delay: 0.46 }} />
      {BRANCH_Y.map((y, i) => (
        <motion.line key={y} x1="30" y1={y} x2="64" y2={y} {...S}
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ ...stem, delay: 0.58 + i * 0.07 }} />
      ))}
      {/* 흐르는 도트 — 글 하나가 두 채널로 각각 도착하는 순간 */}
      {inView && BRANCH_Y.map((_, i) => (
        <circle key={`flow${i}`} r="3" fill={ACCENT}>
          <animateMotion dur={`${FLOW_DUR}s`} begin={`${FLOW_BEGIN[i]}s`} fill="freeze" repeatCount="1">
            <mpath href={`#s12-flow-${i}`} />
          </animateMotion>
        </circle>
      ))}
    </svg>
  );
}

export default function S12_MapExposure() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });

  return (
    <div ref={ref} className="w-full">
      <div className="mb-9 max-w-[600px]">
        <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.2] mb-3">
          블로그에 쓴 글이,<br />
          <span className="text-accent">네이버 플레이스·구글 비즈니스</span>에도.
        </h3>
        <p className="text-[14px] max-md:text-[16px] max-md:font-medium text-text-body leading-[1.65]">
          손님이 지도를 켜고 찾을 때, 우리 가게 소식이 이미 거기 올라와 있습니다.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-0 max-w-[900px]">
        {/* 좌: 원인 — 내가 쓴 글 한 편 */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: EASE }}
          className="md:w-[252px] shrink-0 border bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
          style={{ borderColor: '#eaeaea' }}
        >
          <Chrome url="blog.naver.com" />
          <div className="p-3.5">
            <div className="text-[13px] font-bold text-text-primary tracking-[-0.02em] leading-snug mb-2.5 truncate">
              성수동 골목에서 제철 딸기로 여는 아침
            </div>
            <div className="flex items-center gap-1.5 pt-2 border-t" style={{ borderColor: '#f2f2f2' }}>
              <motion.svg
                width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 0.25, ease: EASE, delay: 0.55 }}
              >
                <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
              </motion.svg>
              <span className="text-[10px] font-semibold" style={{ ...EN, color: ACCENT }}>발행됨</span>
            </div>
          </div>
        </motion.div>

        {/* 데스크 커넥터 (fan-out 2갈래) */}
        <div className="hidden md:block relative w-16 self-stretch shrink-0" aria-hidden>
          <Fork inView={inView} />
          {BRANCH_Y.map((y, i) => (
            <motion.span
              key={y}
              className="absolute right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-dot"
              style={{ top: `${(y / 200) * 100}%`, background: ACCENT }}
              initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.22, ease: EASE, delay: FLOW_ARRIVAL[i] }}
            />
          ))}
        </div>

        {/* 모바일 커넥터 */}
        <div className="md:hidden relative h-9 flex flex-col items-center justify-center" aria-hidden>
          <motion.span
            className="block w-[1.5px] flex-1" style={{ background: 'rgba(0,112,243,0.5)', transformOrigin: 'top' }}
            initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}} transition={{ duration: 0.35, ease: EASE, delay: 0.3 }}
          />
          <motion.span
            className="block w-1.5 h-1.5 rounded-dot -mt-px" style={{ background: ACCENT }}
            initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 0.22, ease: EASE, delay: 0.6 }}
          />
        </div>

        {/* 우: 결과 — 두 지도 채널 */}
        <div className="flex-1 md:max-w-[400px] flex flex-col gap-3 min-w-0">
          <ResultWindow
            url="map.naver.com" dot="#03c75a" headerLabel="네이버 플레이스" channel="네이버 플레이스 소식"
            quote="제철 딸기 팬케이크를 시작했어요." inView={inView} delay={0.62} arrivalDelay={FLOW_ARRIVAL[0]}
          />
          <ResultWindow
            dot="#4285f4" headerLabel="Google 비즈니스" minimal
            inView={inView} delay={0.74} arrivalDelay={FLOW_ARRIVAL[1]}
          />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, ease: EASE, delay: 1.7 }}
        className="text-[11px] max-md:text-[12px] max-md:font-medium text-text-weak leading-[1.65] mt-6 max-w-[900px]"
      >
        채널은 <span className="font-medium text-text-body">처음 한 번만 연결</span>합니다. 네이버 연결은 담당자가 함께 진행해 드립니다.
      </motion.p>
    </div>
  );
}
