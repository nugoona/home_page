'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * 모바일 전용 궤도 — PC OrbitScene(S3GraphicA)과 동일 디자인(사장님 2026-07-15 "PC랑 똑같이, 다르게 할 이유 없다").
 * 다크 칩(#171717, 진행중=accent) + 흰 라인 아이콘 + 우상단 완료 뱃지 + accent 빔 + 동심 궤도 + 중앙 다크 원.
 * 라벨만 새 6개(광고 준비 필수 설정). PC는 공용이라 데스크톱 불변 위해 별도 파일로 둔다.
 * 좌표계 320×246(viewBox "0 44 320 246") — 긴 라벨이 안 삐지게 칩 x를 부채꼴 안쪽으로 조정.
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;
const ACCENT = '#0070f3';
const INK = '#171717';

const CX = 160, CY = 255;
const NODES_ADS = [
  { x: 56, y: 230, label: '광고 계정 연결' },
  { x: 60, y: 150, label: '픽셀·전환 추적' },
  { x: 104, y: 86, label: '캠페인 생성' },
  { x: 216, y: 86, label: '예산·기간 설정' },
  { x: 260, y: 150, label: '타깃 설정' },
  { x: 264, y: 230, label: '소재 규격 확인' },
] as const;
/* ★2026-09-18 두 앱 공통판(개선안 §3.3) — 같은 좌표·개수, 절반을 콘텐츠 준비로.
   ⛔ 전부 '준비' 단계다. 자동 집행·자동 승인을 뜻하지 않는다(결정은 다음 칸이 받는다) */
const NODES_BOTH = [
  { x: 56, y: 230, label: '자료 정리' },
  { x: 60, y: 150, label: '목표 검색어' },
  { x: 104, y: 86, label: '추천 글감' },
  { x: 216, y: 86, label: '예산·기간 설정' },
  { x: 260, y: 150, label: '타깃 설정' },
  { x: 264, y: 230, label: '소재 규격 확인' },
] as const;
const STEP_MS = 900, REST_MS = 700;

/* 완료 뱃지 — 칩 우상단 스탬프(PC DoneBadge 동일: 흰 원 + 검은 테 + 초록 체크) */
function DoneBadge({ done }: { done: boolean }) {
  return (
    <motion.span
      className="absolute -right-2 -top-2 flex h-[19px] w-[19px] items-center justify-center rounded-dot bg-white"
      style={{ border: '1px solid #171717' }}
      initial={false}
      animate={done ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
      transition={done ? { type: 'spring', stiffness: 500, damping: 22 } : { duration: 0.25 }}
      aria-hidden
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M4.5 12.5 9.5 17.5 19.5 7" stroke="#16a34a" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.span>
  );
}

export default function MobileOrbit({ started, both = false }: { started: boolean; both?: boolean }) {
  /* ★2026-09-18 `both` — 기본 false면 원본 홈 출력 그대로 */
  const NODES = both ? NODES_BOTH : NODES_ADS;
  const [step, setStep] = useState(-1); // -1 리셋 / 0~5 진행 / 6 완료

  useEffect(() => {
    if (!started) return;
    let alive = true;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      // 딱 1회 실행(무한 루프 X, 사장님 2026-07-15) → 완료 상태(step 6) 고정 유지
      await sleep(REST_MS);
      for (let i = 0; i < NODES.length; i += 1) {
        if (!alive) return;
        setStep(i);
        await sleep(STEP_MS);
      }
      if (!alive) return;
      setStep(6);
    })();
    return () => { alive = false; };
  }, [started]);

  const uid = 'mob-orbit';

  return (
    <div className="relative mx-auto w-full max-w-[340px]" style={{ aspectRatio: '320 / 246' }} role="img" aria-label="광고에 필요한 필수 설정 6개를 앱이 순차로 처리해 준비를 완료하는 장면">
      {/* 궤도 + 빔 + 중앙 원 (SVG, viewBox 0 44 320 246) */}
      <svg className="absolute left-0 top-0 h-auto w-full" viewBox="0 44 320 246" fill="none" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-fade`} gradientUnits="userSpaceOnUse" x1="160" y1="60" x2="160" y2="290">
            <stop offset="0" stopColor="#cfcfcf" />
            <stop offset="0.75" stopColor="#cfcfcf" />
            <stop offset="1" stopColor="#cfcfcf" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {/* 동심 궤도 3 (dashed / solid / dashed) — 굵게(1.4) */}
        <circle cx={CX} cy={CY} r="117" fill="none" stroke={`url(#${uid}-fade)`} strokeWidth="1.4" strokeDasharray="4 6" />
        <circle cx={CX} cy={CY} r="145" fill="none" stroke={`url(#${uid}-fade)`} strokeWidth="1.4" />
        <circle cx={CX} cy={CY} r="176" fill="none" stroke={`url(#${uid}-fade)`} strokeWidth="1.4" strokeDasharray="4 6" />
        {/* 빔 — 중앙 원 가장자리 → 칩. 처리 중 = 드로잉, 완료 = 옅은 잔광 */}
        {NODES.map((n, i) => {
          const dx = n.x - CX, dy = n.y - CY, d = Math.hypot(dx, dy);
          const x1 = CX + (dx / d) * 30, y1 = CY + (dy / d) * 30;
          const active = step === i;
          const done = step > i || step === 6;
          return (
            <motion.line
              key={n.label}
              x1={x1} y1={y1} x2={n.x} y2={n.y}
              stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round"
              initial={false}
              animate={active ? { pathLength: 1, opacity: 1 } : done ? { pathLength: 1, opacity: 0.22 } : { pathLength: 0, opacity: 0 }}
              transition={active ? { pathLength: { duration: 0.5, ease: 'easeOut' }, opacity: { duration: 0.1 } } : { duration: 0.35 }}
            />
          );
        })}
        {/* 중앙 잔물결 링 2 + 앱 코어. 처리 중 = 다크 원+스파클 / 완료 = accent 원+전체 체크 */}
        <circle cx={CX} cy={CY} r="42" fill="none" stroke={`url(#${uid}-fade)`} strokeWidth="1.4" />
        <circle cx={CX} cy={CY} r="54" fill="none" stroke={`url(#${uid}-fade)`} strokeWidth="1.4" />
        {step === 6 ? (
          <>
            <circle cx={CX} cy={CY} r="30" fill={ACCENT} />
            <path d="M149 256l7 8 15-17" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <circle cx={CX} cy={CY} r="28" fill={INK} />
            <path d="M160 243c1 4.8 3.7 7.5 8.5 8.5-4.8 1-7.5 3.7-8.5 8.5-1-4.8-3.7-7.5-8.5-8.5 4.8-1 7.5-3.7 8.5-8.5Z" fill="#ffffff" />
          </>
        )}
      </svg>

      {/* 처리 칩 — 다크 필(PC 동일). 위치=칩 중심(%), 크기 px 고정 */}
      {NODES.map((n, i) => {
        const active = step === i;
        const done = step > i || step === 6;
        return (
          <span
            key={n.label}
            className="absolute z-10 block -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(n.x / 320) * 100}%`, top: `${((n.y - 44) / 246) * 100}%` }}
          >
            <motion.span
              className="relative flex items-center px-2.5 py-[5px]"
              initial={false}
              animate={{ backgroundColor: active ? ACCENT : INK }}
              transition={{ duration: 0.25 }}
            >
              <span className="whitespace-nowrap text-[10.5px] font-semibold leading-none tracking-[-0.01em] text-white" style={KR}>
                {n.label}
              </span>
              <DoneBadge done={done} />
            </motion.span>
          </span>
        );
      })}
    </div>
  );
}
