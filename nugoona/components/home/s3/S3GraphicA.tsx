'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

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
const NODES = [
  { x: 45, y: 235, label: '계정 연결' },
  { x: 58, y: 148, label: '예산 설정' },
  { x: 102, y: 82, label: '타겟 설정' },
  { x: 218, y: 82, label: '소재 확인' },
  { x: 262, y: 148, label: '문구 생성' },
  { x: 275, y: 235, label: '검수' },
];
const STEP_MS = 950;
const HOLD_MS = 3200;
const REST_MS = 700;

/* 칩 라인 아이콘 (잉크 획 1.7) */
function NodeIcon({ i }: { i: number }) {
  const s = { stroke: INK, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
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
          <circle cx="12" cy="12" r="0.5" fill={INK} stroke="none" />
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
      style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
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
function OrbitScene({ started, reduce }: { started: boolean; reduce: boolean }) {
  /* step: -1 리셋 / 0~5 처리 중 / 6 완료 유지 */
  const [step, setStep] = useState(reduce ? 6 : -1);

  useEffect(() => {
    if (!started || reduce) return;
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
  }, [started, reduce]);

  return (
    /* viewBox 상단 44 크롭(칩 위 여백 제거) + 배경 카드 없는 오픈 궤도(사장님 2026-07-14) */
    <div className="relative mx-auto w-full" style={{ aspectRatio: '320 / 246' }}>
      {/* 궤도 + 빔 + 중앙 원 (SVG, 320×300 좌표계) */}
      <svg className="absolute left-0 top-0 h-auto w-full" viewBox="0 44 320 246" aria-hidden>
        <defs>
          <linearGradient id="s3-ring-fade" gradientUnits="userSpaceOnUse" x1="160" y1="60" x2="160" y2="290">
            <stop offset="0" stopColor="#d9d9d9" />
            <stop offset="0.75" stopColor="#d9d9d9" />
            <stop offset="1" stopColor="#d9d9d9" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {/* 동심 궤도 3 (Clone05: dashed / solid / dashed) */}
        <circle cx={CX} cy={CY} r="117" fill="none" stroke="url(#s3-ring-fade)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx={CX} cy={CY} r="145" fill="none" stroke="url(#s3-ring-fade)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r="176" fill="none" stroke="url(#s3-ring-fade)" strokeWidth="1" strokeDasharray="4 6" />
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
        <circle cx={CX} cy={CY} r="42" fill="none" stroke="url(#s3-ring-fade)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r="54" fill="none" stroke="url(#s3-ring-fade)" strokeWidth="1" />
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
            <motion.span
              className="relative flex items-center gap-1.5 rounded-[10px] border bg-white px-2.5 py-[7px]"
              initial={false}
              animate={{
                borderColor: active ? ACCENT : '#e5e5e5',
                boxShadow: active ? '0 4px 14px rgba(0,112,243,0.18)' : '0 2px 6px rgba(0,0,0,0.05)',
              }}
              transition={{ duration: 0.25 }}
            >
              <NodeIcon i={i} />
              <span className="whitespace-nowrap text-[11.5px] font-semibold leading-none tracking-[-0.01em] text-text-primary" style={KR}>
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
      <path d="M8 0h24c0 26 14 46 42 64-30 2-52-10-66-32L8 20Z" fill={INK} />
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
        <span className="mb-1.5 block text-right text-[11px] font-medium text-text-weak" style={KR}>
          사장님
        </span>
        <div className="relative rounded-[22px] px-5 py-3.5" style={{ backgroundColor: INK }}>
          <DarkTail />
          <p className="text-[15px] font-semibold leading-[1.45] tracking-[-0.01em] text-white" style={KR}>
            이 광고 지금 잘 되고 있나요?
            {!reduce && (
              <motion.span
                className="ml-1.5 inline-block h-[14px] w-[8px] translate-y-[2px] rounded-[2px] bg-[#4a4a4a]"
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
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
        <span className="mb-1.5 block text-[11px] font-medium text-text-weak" style={KR}>
          광고 도우미
        </span>
        <div className="relative rounded-[22px] bg-white px-5 py-3.5" style={{ border: '1px solid #ececec', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <WhiteTail />
          <p className="text-[14px] font-medium leading-[1.55] tracking-[-0.01em] text-text-body" style={KR}>
            네, 지난주보다 주문이 늘었어요.
            <br />
            광고비 <span className="font-bold" style={{ color: ACCENT }}>1만 원당 3.2명</span>이 장바구니에 담았어요.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function S3GraphicA() {
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { once: true, margin: '-15% 0px' });
  const reduce = !!useReducedMotion();
  const started = inView || reduce;

  /* 패널 공통 스킨 (라운드 카드 + 절제된 도트, edge mask §8.14-6) */
  const panelCls = 'relative w-full overflow-hidden rounded-2xl border border-[#ECECEC] bg-[#FAFAFA]';
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

  return (
    <section className="w-full bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-[1060px] px-5">
        {/* ── 블록 1: 텍스트(좌) + 궤도(우) — PC 지그재그, 모바일 세로 ── */}
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="text-center md:text-left">
            <span className="mb-5 inline-block text-xs font-medium tracking-[0.18em] text-text-muted" style={EN}>
              OUR WAY
            </span>
            <h2
              className="text-[clamp(1.3rem,6.3vw,2.5rem)] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary [text-wrap:balance]"
              style={KR}
            >
              어려운 건 앱이 합니다
            </h2>
            <p className="mt-4 text-[15px] font-medium leading-[1.55] tracking-[-0.01em] text-text-body" style={KR}>
              앱은 준비하고, 설명하고, 다음 일을 알려드립니다.
            </p>
          </div>
          {/* 궤도 (앱이 자동 처리 — Clone05 궤도) — 배경 카드 없이 오픈(사장님 2026-07-14) */}
          <div ref={panelRef} className="relative">
            <OrbitScene started={started} reduce={reduce} />
          </div>
        </div>

        {/* ── 블록 2: 말풍선(좌) + 텍스트(우) — 지그재그 반전 ── */}
        <div className="mt-16 grid items-center gap-10 md:mt-24 md:grid-cols-2 md:gap-14">
          <div className="order-1 text-center md:order-2 md:text-left">
            <h2
              className="text-[clamp(1.3rem,6.3vw,2.5rem)] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary [text-wrap:balance]"
              style={KR}
            >
              확인은 사장님이 합니다
            </h2>
            <p className="mt-4 text-[15px] font-medium leading-[1.55] tracking-[-0.01em] text-text-body" style={KR}>
              사장님은 마지막 확인만 하시면 됩니다.
            </p>
          </div>
          {/* 말풍선 패널 (사장님 확인 — Clone05 말풍선) */}
          <div className="order-2 md:order-1">
            <div className={panelCls}>
              {dotLayer}
              <div className="relative px-5 py-8 sm:px-8">
                <SpeechScene reduce={reduce} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
