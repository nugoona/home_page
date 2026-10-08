'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';
import { RevealLine } from '@/components/motion/Reveal';
import MobileOurWay from './MobileOurWay';

/**
 * 홈 S3 — "말풍선(사장님 확인) + 궤도 자동 처리(앱)" (Clone05 분해·재조립, §8.15)
 * 메시지(home.ts homeV2.ourWay): "어려운 건 앱이 합니다. 확인은 사장님이 합니다."
 *
 * ▣ 소스 = Clone05 "Infrastructure for AI"(사장님 지정 2026-07-14):
 *   - 위 말풍선(다크 sent + 흰 received, iMessage 꼬리, 타이핑 커서) = 확인은 사장님이
 *   - 아래 동심 궤도(dashed/solid/dashed, 중심 화면 밖 + 칩 + 중앙 다크 원·잔물결) = 어려운 건 앱이
 * ▣ 자동 처리 애니(루프): 중앙 원(우리 앱)에서 accent 빔이 처리 요소 칩(계정 연결~검수)으로
 *   순차로 뻗어가 닿으면 체크가 찍힘. 지나간 빔은 옅은 잔광으로 남아 "연결 완료" 누적.
 *   전부 완료 → 3초 유지 → 조용히 리셋 → 반복. prefers-reduced-motion = 완성 상태 고정.
 * ▣ 카피 = S4-2 03 확정 문답 재사용(성과 "보장"이 아니라 측정 보고 — §14 준수).
 * ⛔ 순위·성과 보장 / 파스텔·보라 / 브랜드 로고 짝퉁 / 대시(—)·밑줄 금지(§7·§8.9).
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;
const EN = { fontFamily: 'var(--font-en)' } as const;

const INK = '#171717';
const BORDER = '#ECECEC';
const ACCENT = '#0070f3';

/* ═══════════ 궤도 좌표계 (320 × 300, 궤도·빔·칩 공용) ═══════════
   중앙 원 (160, 255) — 궤도는 동심원 r 117 / 145 / 176 (하단은 패널 밖으로 잘림).
   칩 6개는 좌하 → 우하 부채꼴 스윕(레이더 순서). 좌표 = 칩 중심. */
const CX = 160;
const CY = 255;
const NODES_ADS = [
  { x: 45, y: 235, label: '계정 연결' },
  { x: 58, y: 148, label: '예산 설정' },
  { x: 102, y: 82, label: '타겟 설정' },
  { x: 218, y: 82, label: '소재 확인' },
  { x: 262, y: 148, label: '문구 생성' },
  { x: 275, y: 235, label: '검수' },
];
/* ★2026-09-18 두 앱 공통 버전(개선안 §3.3).
   구 6개는 전부 광고 용어(계정·예산·타겟·소재·문구·검수)라 **콘텐츠 얘기가 없었다.**
   같은 좌표·같은 개수를 쓰되 절반을 콘텐츠 준비로 바꿔 "두 앱 모두 앱이 먼저 준비한다"를 보이게 한다.
   ⛔ 자동화 범위를 넓히지 않는다 — 전부 **준비** 단계이고 결정은 다음 칸(고객 확인)이 받는다. */
/* ★2026-09-19 모바일(MobileOrbit)과 **같은 6항목**으로 통일. 전에는 PC가
   글감 정리·소재 확인·문구 생성·검수라 광고 준비가 사라졌고, 모바일은 예산·타깃이 남아
   같은 구간인데 PC와 휴대폰이 다른 인상을 줬다. 두 앱이 절반씩 보이는 모바일 쪽을 정본으로 삼는다.
   ⛔ 전부 '준비' 단계다. 자동 집행·자동 승인을 뜻하지 않는다(결정은 다음 칸이 받는다) */
const NODES_BOTH = [
  { x: 45, y: 235, label: '자료 정리' },
  { x: 58, y: 148, label: '목표 검색어' },
  { x: 102, y: 82, label: '글감 정리' },
  { x: 218, y: 82, label: '예산 설정' },
  { x: 262, y: 148, label: '타겟 설정' },
  { x: 275, y: 235, label: '소재 확인' },
];
const STEP_MS = 950;
const HOLD_MS = 3200;
const REST_MS = 700;

/* 칩 라인 아이콘 (다크 칩 위 흰 획 — 사장님 2026-07-15 "태그 다크로") */
function NodeIcon({ i }: { i: number }) {
  const s = { stroke: '#ffffff', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      {i === 0 && (
        <>
          <circle cx="12" cy="8" r="3.4" {...s} />
          <path d="M5 19.5c1.2-3.8 3.7-5.7 7-5.7s5.8 1.9 7 5.7" {...s} />
        </>
      )}
      {i === 1 && (
        <>
          <rect x="3" y="6.5" width="18" height="12" rx="2" {...s} />
          <circle cx="12" cy="12.5" r="2.8" {...s} />
        </>
      )}
      {i === 2 && (
        <>
          <circle cx="12" cy="12" r="7.5" {...s} />
          <circle cx="12" cy="12" r="3.2" {...s} />
          <circle cx="12" cy="12" r="0.5" fill="#ffffff" stroke="none" />
        </>
      )}
      {i === 3 && (
        <>
          <rect x="3.5" y="5" width="17" height="14" rx="2" {...s} />
          <circle cx="8.7" cy="9.7" r="1.5" {...s} />
          <path d="m5.5 16.5 4-4 3 3 3.5-3.5 2.5 2.5" {...s} />
        </>
      )}
      {i === 4 && <path d="M4 7h16M4 12h16M4 17h9" {...s} />}
      {i === 5 && (
        <>
          <circle cx="10.5" cy="10.5" r="5.8" {...s} />
          <path d="m15 15 4.5 4.5" {...s} />
        </>
      )}
    </svg>
  );
}

/* 완료 체크 뱃지 (칩 우상단 스탬프) — 사장님 2026-07-14 "잘 안 보여" → 크게 */
function DoneBadge({ done, reduce }: { done: boolean; reduce: boolean }) {
  return (
    <motion.span
      className="absolute -right-2.5 -top-2.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white"
      style={{ border: '1px solid #171717' }}
      initial={false}
      animate={done ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
      transition={done && !reduce ? { type: 'spring', stiffness: 500, damping: 22 } : { duration: 0.25 }}
      aria-hidden
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M4.5 12.5 9.5 17.5 19.5 7" stroke="#16a34a" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.span>
  );
}

/* ═══════════ 궤도 장면 — 빔이 칩에 닿으면 체크 (루프) ═══════════ */
function OrbitScene({ started, reduce, uid, both = false }: { started: boolean; reduce: boolean; uid: string; both?: boolean }) {
  /* ★2026-09-18 `both` — 기본 false면 원본 그대로(광고 준비 6항목). true면 콘텐츠 항목이 섞인 공통판 */
  const NODES = both ? NODES_BOTH : NODES_ADS;
  /* step: -1 리셋 / 0~5 처리 중 / 6 완료 유지 */
  const [step, setStep] = useState(-1);

  /* ⛔ reduce 예외 없음 — 절전 폰에서 궤도 애니가 아예 안 돌던 문제(사장님 2026-07-15) → 항상 순회.
     (§8.18-D: reduce로 애니 죽이면 사장님 폰에서 안 보임. 궤도는 순회가 핵심이라 정지=의미 상실.) */
  useEffect(() => {
    if (!started) return;
    let alive = true;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      while (alive) {
        setStep(-1);
        await sleep(REST_MS);
        for (let i = 0; i < NODES.length; i += 1) {
          if (!alive) return;
          setStep(i);
          await sleep(STEP_MS);
        }
        if (!alive) return;
        setStep(6);
        await sleep(HOLD_MS);
      }
    })();
    return () => {
      alive = false;
    };
  }, [started]);

  return (
    /* viewBox 상단 44 크롭(칩 위 여백 제거) + 배경 카드 없는 오픈 궤도(사장님 2026-07-14) */
    <div className="relative mx-auto w-full" style={{ aspectRatio: '320 / 246' }}>
      {/* 궤도 + 빔 + 중앙 원 (SVG, 320×300 좌표계) */}
      <svg className="absolute left-0 top-0 h-auto w-full" viewBox="0 44 320 246" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-ring-fade`} gradientUnits="userSpaceOnUse" x1="160" y1="60" x2="160" y2="290">
            <stop offset="0" stopColor="#d9d9d9" />
            <stop offset="0.75" stopColor="#d9d9d9" />
            <stop offset="1" stopColor="#d9d9d9" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {/* 동심 궤도 3 (Clone05: dashed / solid / dashed) */}
        <circle cx={CX} cy={CY} r="117" fill="none" stroke={`url(#${uid}-ring-fade)`} strokeWidth="1" strokeDasharray="4 6" />
        <circle cx={CX} cy={CY} r="145" fill="none" stroke={`url(#${uid}-ring-fade)`} strokeWidth="1" />
        <circle cx={CX} cy={CY} r="176" fill="none" stroke={`url(#${uid}-ring-fade)`} strokeWidth="1" strokeDasharray="4 6" />
        {/* 빔 — 중앙 원 가장자리 → 칩. 처리 중 = 드로잉, 완료 = 옅은 잔광 */}
        {NODES.map((n, i) => {
          const dx = n.x - CX;
          const dy = n.y - CY;
          const d = Math.hypot(dx, dy);
          const x1 = CX + (dx / d) * 30;
          const y1 = CY + (dy / d) * 30;
          const active = step === i;
          const done = step > i;
          return (
            <motion.line
              key={n.label}
              x1={x1}
              y1={y1}
              x2={n.x}
              y2={n.y}
              stroke={ACCENT}
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={false}
              animate={
                active
                  ? { pathLength: 1, opacity: 1 }
                  : done
                    ? { pathLength: 1, opacity: 0.2 }
                    : { pathLength: 0, opacity: 0 }
              }
              transition={active && !reduce ? { pathLength: { duration: 0.45, ease: 'easeOut' }, opacity: { duration: 0.1 } } : { duration: 0.35 }}
            />
          );
        })}
        {/* 중앙 잔물결 링 + 다크 원(우리 앱) — 잔물결도 하단 fade(오픈 배경에서 잘림 무마) */}
        <circle cx={CX} cy={CY} r="42" fill="none" stroke={`url(#${uid}-ring-fade)`} strokeWidth="1" />
        <circle cx={CX} cy={CY} r="54" fill="none" stroke={`url(#${uid}-ring-fade)`} strokeWidth="1" />
        <circle cx={CX} cy={CY} r="28" fill={INK} />
        {/* ✦ 스파클 (앱 = 일하는 주체) */}
        <path
          d="M160 243c1 4.8 3.7 7.5 8.5 8.5-4.8 1-7.5 3.7-8.5 8.5-1-4.8-3.7-7.5-8.5-8.5 4.8-1 7.5-3.7 8.5-8.5Z"
          fill="#ffffff"
        />
      </svg>

      {/* 처리 요소 칩 (좌표계 % 부착, 칩 크기는 px 고정 = PC에서 궤도만 커져 여유)
          바깥 span = 위치·센터링 전담(framer가 transform을 만지지 않도록 분리) */}
      {NODES.map((n, i) => {
        const active = step === i;
        const done = step > i;
        return (
          <span
            key={n.label}
            className="absolute z-10 block -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(n.x / 320) * 100}%`, top: `${((n.y - 44) / 246) * 100}%` }}
          >
            {/* 칩 = 다크 필(Clone01 검정 필 문법) + 무그림자. active = accent 배경(사장님 2026-07-15 "태그 다크로") */}
            <motion.span
              className="relative flex items-center gap-1.5 rounded-[10px] px-2.5 py-[7px]"
              initial={false}
              animate={{ backgroundColor: active ? ACCENT : '#171717' }}
              transition={{ duration: 0.25 }}
            >
              <NodeIcon i={i} />
              <span className="whitespace-nowrap text-[11.5px] font-semibold leading-none tracking-[-0.01em] text-white" style={KR}>
                {n.label}
              </span>
              <DoneBadge done={done} reduce={reduce} />
            </motion.span>
          </span>
        );
      })}
    </div>
  );
}

/* ═══════════ 말풍선 (Clone05 위 섹션 — 확인은 사장님이) ═══════════ */

/* 다크 말풍선 꼬리 (우하단, sent) — Clone05 DarkTail 축소 이식 */
function DarkTail() {
  return (
    <svg className="absolute -bottom-[13px] right-4" width="34" height="29" viewBox="0 0 80 68" aria-hidden>
      <path d="M8 0h24c0 26 14 46 42 64-30 2-52-10-66-32L8 20Z" fill={ACCENT} />
    </svg>
  );
}

/* 흰 말풍선 꼬리 (좌하단, received) */
function WhiteTail() {
  return (
    <svg className="absolute -bottom-[13px] left-4" width="34" height="27" viewBox="0 0 80 66" aria-hidden>
      <path d="M72 0H44c0 26-12 44-38 62 28 2 48-10 62-30l4-12Z" fill="#ffffff" stroke="#ececec" strokeWidth="2" />
    </svg>
  );
}

function SpeechScene({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative">
      {/* 사장님 질문 (다크 sent, 우측 정렬) — 타이핑 커서 깜빡(Clone05 문법) */}
      <motion.div
        className="relative ml-auto w-fit max-w-[86%]"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="mb-1.5 block text-right text-[11px] font-medium text-[#b7bcc4]" style={KR}>
          고객님
        </span>
        <div className="relative rounded-[22px] px-5 py-3.5" style={{ backgroundColor: ACCENT }}>
          <DarkTail />
          <p className="text-[15px] font-semibold leading-[1.45] tracking-[-0.01em] text-white" style={KR}>
            설정은 이제 다 끝난 거야?
            <br />
            소재만 고르면 돼?
            {/* ⚠항상 렌더(조건부 렌더 = reduce-motion 기기에서 hydration 에러 — 2026-07-18 /ads 실증) */}
            {(
              <motion.span
                className="ml-1.5 inline-block h-[14px] w-[8px] translate-y-[2px] rounded-[2px] bg-white/45"
                animate={reduce ? { opacity: 0.45 } : { opacity: [1, 0.15, 1] }}
                transition={reduce ? undefined : { repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                aria-hidden
              />
            )}
          </p>
        </div>
      </motion.div>

      {/* 앱 답변 (흰 received, 좌측) — 측정 보고(보장 아님) */}
      <motion.div
        className="relative mt-5 w-fit max-w-[92%]"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.25 }}
      >
        {/* AI 답변 표식 — 봇 아이콘(S42 챗 목업과 동일 문법, "카톡 오해" 방지 — 사장님 2026-07-15) */}
        <span className="mb-1.5 flex items-center gap-1.5">
          <span className="rounded-dot flex h-[24px] w-[24px] shrink-0 items-center justify-center bg-[#334155]">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="4" y="8" width="16" height="11" rx="3" />
              <path d="M12 5v3" />
              <circle cx="12" cy="4" r="1" fill="#ffffff" stroke="none" />
              <circle cx="9.5" cy="13" r="1" fill="#ffffff" stroke="none" />
              <circle cx="14.5" cy="13" r="1" fill="#ffffff" stroke="none" />
            </svg>
          </span>
          <span className="text-[11px] font-medium text-[#b7bcc4]" style={KR}>
            광고 도우미
          </span>
        </span>
        <div className="relative rounded-[22px] bg-white px-5 py-3.5" style={{ border: '1px solid #ececec', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <WhiteTail />
          <p className="text-[14px] font-medium leading-[1.55] tracking-[-0.01em] text-text-body" style={KR}>
            네. 광고 준비는 모두 끝났습니다.
            <br />
            소재를 고르면 바로 시작할 수 있어요.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function S3GraphicA({ both = false }: { both?: boolean } = {}) {
  /* ★2026-09-18 `both` — 기본 false면 원본 홈 출력 그대로.
     true면 궤도 칩 절반이 콘텐츠 준비로 바뀐다(개선안 §3.3 "두 앱 공통 흐름"). /home2에서만 켠다 */
  const panelRef = useRef<HTMLElement>(null);
  const inView = useInView(panelRef, { once: true, margin: '-15% 0px' });
  /* ⚠️ useReducedMotion은 서버 false / 절전 모드 폰 true → hydration mismatch(실기기 "1 Issue" 실증 2026-07-15).
     마운트 후에만 반영해 서버·클라 첫 렌더를 일치시킨다. */
  const reduceRaw = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && !!reduceRaw;
  const started = inView || reduce;

  /* 채팅 카드 배경 도트 레이어(§8.14-6 edge mask) */
  const dotLayer = (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(circle, #ECECEC 1px, transparent 1.4px)',
        backgroundSize: '30px 30px',
        backgroundPosition: '10px 10px',
        WebkitMaskImage: 'radial-gradient(ellipse 94% 96% at 50% 50%, #000 60%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 94% 96% at 50% 50%, #000 60%, transparent 100%)',
      }}
    />
  );

  /* Grid Occupancy 편입(2026-07-15, §8.16): 지그재그 유지 — 블록1(레일+궤도) / 블록2(말풍선+레일) */
  const rail1 = (
    <div className="px-8 py-10 lg:px-12">
      <span className="mb-6 flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
          <path d="M13 8c.7 3.4 2.6 5.3 6 6-3.4.7-5.3 2.6-6 6-.7-3.4-2.6-5.3-6-6 3.4-.7 5.3-2.6 6-6Z" fill="#333333" />
        </svg>
        <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#555555]" style={EN}>
          Our Way
        </span>
      </span>
      <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.28] tracking-[-0.04em] text-text-primary" style={KR}>
        <RevealLine>어려운 건 앱이 합니다</RevealLine>
      </h2>
      <p className="mt-5 text-[17px] font-medium leading-[1.55] tracking-[-0.01em] text-[#4f4f4f] md:leading-[1.35]" style={KR}>
        {/* ★2026-10-08 대본 합의안① — 홈은 콘텐츠·광고를 함께 파는 자리인데 이 문장만 광고를 말했다.
            both 분기를 폐지해 어디서 쓰든 같은 문장을 쓴다(모바일 MobileOurWay 와도 같다).
            both 는 궤도 항목(OrbitScene)에만 남는다. */}
        콘텐츠도 광고도, 복잡한 준비를 앱이 먼저 처리합니다
      </p>
      {/* 처리 항목 체크 리스트 삭제 — 우측 궤도 칩과 중복(사장님 2026-07-15 "텍스트 일괄 없애줘 체크 표시도") */}
    </div>
  );

  /* rail2("사장님은…")·speechBlock(다크 패널) 폐기(2026-07-16): 모바일 = MobileOurWay(§8.18-F) / PC 채팅 = 아래 chatCell 밝은 카드. 호칭도 "고객님"으로 이관. */

  const orbitBlock = (
    <div className="relative w-full px-6 py-6">
      <OrbitScene started={started} reduce={reduce} uid="s3d" both={both} />
    </div>
  );

  /* PC 하단 = 히어로 문법 v2(사장님 2026-07-15 "목업은 칸칸이 사이에 쏙 / 화살표 네모 없애고 칸에 / 텍스트도"):
     각 요소가 칸 정수 개를 개별 점유. 채팅 = 회색 면이 칸을 꽉 채움(필요시 키움), 화살표 = 아이콘만, 주변 = checker */
  /* 채팅 칸 = 위 궤도와 동일 디자인 언어(밝은 dotLayer 카드) — 검은 배너 제거로 'AI 대화'가 먼저 읽힘(GPT PM 2026-07-16).
     말풍선(사용자 accent·도우미 흰)이 주인공, 배경은 제품 UI 카드처럼 떠 있는 밝은 면 */
  const chatCell = (
    <div className="flex h-full w-full items-center px-8 py-8">
      <div className="relative w-full overflow-hidden rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] px-7 py-8 shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
        {dotLayer}
        <div className="relative">
          <SpeechScene reduce={reduce} />
        </div>
      </div>
    </div>
  );
  const arrowCell = (
    <svg aria-hidden width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
  const textCell = (
    <h2 className="px-6 text-center text-[clamp(1.5rem,2.5vw,2.1rem)] font-bold leading-[1.3] tracking-[-0.04em] text-text-primary" style={KR}>
      확인은 고객님이 합니다
    </h2>
  );

  /* 블록2 경계 = line 8(위 블록 line 6과 확실히 다르게 — "1칸 차이는 오차로 보임" 검수) */
  /* 하단 = 히어로 문법 v2: 채팅 5열×4행 / 화살표 1열×2행(채팅 세로 중심 공유) / 텍스트 4열×2행.
     미점유(r7 여백 행·c1·c12 열·화살표/텍스트 위아래) = 1×1 checker 바둑판 */
  const D_AREAS: GridArea[] = [
    { key: 'rail1', c: [1, 6], r: [1, 7], className: 'flex items-center' },
    { key: 'orbit', c: [6, 13], r: [1, 7], className: 'flex items-center justify-center' },
    { key: 'chat', c: [2, 7], r: [8, 12], className: 'block' },
    { key: 'arrow', c: [7, 8], r: [9, 11], className: 'flex items-center justify-center' },
    { key: 'text2', c: [8, 12], r: [9, 11], className: 'flex items-center justify-center' },
  ];
  const renderD = (key: string) =>
    key === 'rail1' ? rail1 : key === 'orbit' ? orbitBlock : key === 'chat' ? chatCell : key === 'arrow' ? arrowCell : textCell;

  return (
    <section ref={panelRef} className="w-full bg-bg">
      {/* 모바일 — /lab/ourway에서 확정된 한 흐름(2026-07-15). PC와 별개(md:hidden).
           배경 = Vercel Surface2 #fafafa(스샷 실측) → 흰 카드(텍스트바·채팅창) 대비로 가독성↑ */}
      <div className="bg-[#fafafa] px-6 py-20 md:hidden">
        <MobileOurWay both={both} />
      </div>

      {/* PC — 칸 지그재그 + 하단 히어로식 checker */}
      <OccupancyGrid cols={12} rows={12} areas={D_AREAS} checker mobile={false} render={renderD} />
    </section>
  );
}
