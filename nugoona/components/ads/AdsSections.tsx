'use client';

/* /ads 섹션 실물 모음 — ContentSections.tsx와 같은 역할(페이지 = 조립, 여기 = 장면).
   진입 정본 = DESIGN §8.15·§8.16·§8.17. */

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ChatMock } from '@/components/features/ChatbotShowcase';
import { Marquee } from '@/components/lab-sources/magicui/marquee';
import { DataPipelineVisual, DataPipelineVisualMobile } from '@/components/features/DashboardShowcase';
import { AnimatedBeam } from '@/components/lab-sources/magicui/animated-beam';
import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';
import { Eyebrow } from '@/components/content/ContentSections';
import FadeUp from '@/components/motion/FadeUp';
import { dashboard, adcanvas, market, multiStore, report, evolve, empathy, onboarding, chatbot, catalog as ctl } from '@/lib/content/ads';

const EN = { fontFamily: 'var(--font-en)' } as const;

/* Clone01 실측(§8.13 — "베셀 소스 디자인대로", 사장님 2026-07-18):
   무대 #FAFAFA + 도트 30px #EAEAEA / 카드 흰+1px #EDEDED+그림자 0 1px 2px 0.03 /
   주인공 강조 = 1.5px #171717 테두리(그림자 없음) / 커넥터 1.7~2px 끝 fade / 라벨 필 흰·검정 */
const C_BORDER = '#EDEDED';
const C_SHADOW = '0 1px 2px rgba(0,0,0,0.03)';

/* ═══════════ 3 · 제품의 답 — 1-4-1 다이어그램(사장님 확정 2026-07-18):
   [누구나 광고] → 4모듈(대시보드·애드캔버스·트렌드·월간 리포트) → 다시 [AI 챗봇]이 잇는다.
   레퍼런스 = Vercel Provider fallback(= 갤러리 Clone01) — 실측값 차용. 빔 = 갤러리 A4 AnimatedBeam.
   설명 = 다이어그램 아래 캡션 열(Vercel 실물 문법) — 문구는 각 모듈 전용 섹션 확정 헤딩 재사용(새 문구 0). ═══════════ */

/* 레퍼런스 색 곡선 = PC 복원(사장님 2026-07-18 "버셀 소스 돌려내" — 모바일 축만 조잡했던 것.
   모바일 = 선 0, 배치가 흐름을 말함) */
const FLOW = ['#3b82f6', '#e5484d', '#f5a623', '#2bbf9e'] as const;

/* 모듈 글리프 — 직선·직각 문법 */
const G_ATTRS = { fill: 'none', stroke: '#525252', strokeWidth: 1.6, strokeLinecap: 'square', strokeLinejoin: 'miter' } as const;
const MODULES: { key: string; label: string; caption: string; glyph: React.ReactNode }[] = [
  {
    key: 'dashboard', label: '대시보드', caption: dashboard.heading,
    glyph: <svg viewBox="0 0 24 24" {...G_ATTRS} className="h-[22px] w-[22px] md:h-[26px] md:w-[26px]" aria-hidden><path d="M3.5 3.5v17h17" /><path d="M8 20.5v-6M12.5 20.5V9M17 20.5v-9" strokeWidth="2" /></svg>,
  },
  {
    key: 'adcanvas', label: '애드캔버스', caption: adcanvas.heading,
    glyph: <svg viewBox="0 0 24 24" {...G_ATTRS} className="h-[22px] w-[22px] md:h-[26px] md:w-[26px]" aria-hidden><rect x="3.5" y="3.5" width="17" height="17" /><path d="M3.5 15.5 9 10l4.5 4.5 3-3 4 4" /><circle cx="15.5" cy="8" r="1.6" /></svg>,
  },
  {
    key: 'trend', label: '트렌드', caption: market.heading,
    glyph: <svg viewBox="0 0 24 24" {...G_ATTRS} className="h-[22px] w-[22px] md:h-[26px] md:w-[26px]" aria-hidden><path d="M3.5 18.5 9 13l3.5 3.5 8-8" /><path d="M15.5 8.5h5v5" /></svg>,
  },
  {
    key: 'report', label: '월간 리포트', caption: report.heading,
    glyph: <svg viewBox="0 0 24 24" {...G_ATTRS} className="h-[22px] w-[22px] md:h-[26px] md:w-[26px]" aria-hidden><rect x="4.5" y="3.5" width="15" height="17" /><path d="M8 8.5h8M8 12h8M8 15.5h5" /></svg>,
  },
];

/** 3번 장면 — 1-4-1: [누구나 광고] →선1→ [4모듈 그룹(2×2)] →선1→ [AI 챗봇].
    선 = 딱 2개(사장님 2026-07-18 "선 최소화, 전선마냥" 반려 — Clone01 실측도 카드 6개에 커넥터 3개).
    1-4-1 구조는 선이 아니라 배치가 말한다. */
export function AdsAnswerScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const na = useRef<HTMLDivElement>(null);
  const bot = useRef<HTMLSpanElement>(null);
  /* 빔 도킹 앵커(2026-07-20 사장님 "컬러선과 카드가 맞물리지 않아"):
     AnimatedBeam은 ref 사각형의 "중심"으로 선을 꽂는다 → 카드가 넓어지면 곡선이 좌변을 통과할 때
     이미 카드 세로 범위 밖(실측: 좌변 x에서 y가 카드 아래)이라 허공에서 끊겨 보임.
     해법 = 폭 0 앵커를 카드 가장자리(좌변/우변 중앙)에 두고 거기에 도킹 — 폭이 바뀌어도 항상 맞물림 */
  const naOut = useRef<HTMLSpanElement>(null);
  const botIn = useRef<HTMLSpanElement>(null);
  const mi0 = useRef<HTMLSpanElement>(null);
  const mi1 = useRef<HTMLSpanElement>(null);
  const mi2 = useRef<HTMLSpanElement>(null);
  const mi3 = useRef<HTMLSpanElement>(null);
  const mo0 = useRef<HTMLSpanElement>(null);
  const mo1 = useRef<HTMLSpanElement>(null);
  const mo2 = useRef<HTMLSpanElement>(null);
  const mo3 = useRef<HTMLSpanElement>(null);
  const modIn = [mi0, mi1, mi2, mi3];
  const modOut = [mo0, mo1, mo2, mo3];

  return (
    <div className="w-full max-w-[980px]">
      {/* 무대 = Clone01 실측(#FAFAFA + 도트 30px) — 흰 바탕 부유 금지 교훈 */}
      <div
        ref={containerRef}
        className="relative flex w-full items-center justify-between px-8 py-12 max-md:flex-col max-md:items-center max-md:gap-0 max-md:px-6 max-md:py-9"
        style={{
          background: '#FAFAFA',
          backgroundImage: 'radial-gradient(circle, #EAEAEA 1px, transparent 1.4px)',
          backgroundSize: '30px 30px',
          border: `1px solid ${C_BORDER}`,
        }}
        role="img"
        aria-label="누구나 광고의 네 모듈을 AI 챗봇이 잇는 구조"
      >
        {/* 1 · 누구나 광고 (출발) */}
        <div ref={na} className="relative z-10 shrink-0 self-center">
          <span ref={naOut} aria-hidden className="absolute right-0 top-1/2 h-0 w-0" />
          <div className="flex items-center gap-2.5 bg-white px-4 py-3 md:px-5 md:py-3.5" style={{ border: `1px solid ${C_BORDER}`, boxShadow: C_SHADOW }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/brand/ad/symbol.svg" alt="" className="h-[26px] w-[26px] md:h-[31px] md:w-[31px]" />
            <span className="text-[13.5px] font-bold tracking-[-0.01em] text-text-primary md:text-[15px]">누구나 광고</span>
          </div>
        </div>

        {/* 4 · 모듈 카드 — 사장님 확정(2026-07-18): 정사각 아이콘 박스(흰) 분리 + 텍스트부 다크모드.
            설명은 카드 안(각 모듈 전용 섹션 확정 헤딩 재사용) */}
        {/* 모바일 커넥터 상단 — NA → 그룹 카드. 2026-07-19 사장님 "파란 세로선+도트 = 과정 의미 없는 장식"
            → 확정 화살 문법(CtVArrow)으로 교체(콘텐츠 페이지와 통일) */}
        <span aria-hidden className="md:hidden"><CtVArrow /></span>

        {/* 1×4 세로 한 줄(사장님 "2×2 말고 1×4") · 아이콘-다크 블록 밀착(gap 0).
            모바일 = 4모듈을 하나의 그룹 카드로 묶음(선은 중앙 세로 2개면 충분 — 사장님 안) */}
        <div className="relative z-10 flex shrink-0 flex-col gap-3 max-md:w-full max-md:max-w-[320px] max-md:border max-md:border-[#EDEDED] max-md:bg-white max-md:p-3">
          {/* (BorderBeam 테두리 빛 = 제거 — 사장님 2026-07-19 "애니 이상해": 카드 하단 잔상처럼 보임) */}
          {MODULES.map((m, i) => (
            <div key={m.key} className="relative flex items-stretch">
              <span ref={modIn[i]} aria-hidden className="absolute left-0 top-1/2 h-0 w-0" />
              <span ref={modOut[i]} aria-hidden className="absolute right-0 top-1/2 h-0 w-0" />
              {/* 정사각 아이콘 박스(별도) — 회색 배경(사장님 2026-07-19 "흰색 말고 회색") */}
              {/* 아이콘 박스 배경 = PC 흰색(사장님 2026-07-20). 모바일 = 기존 회색 유지 */}
              <span className="flex h-[68px] w-[68px] shrink-0 items-center justify-center bg-[#F2F2F2] md:h-[78px] md:w-[78px] md:bg-white" style={{ border: `1px solid ${C_BORDER}`, boxShadow: C_SHADOW }}>
                {m.glyph}
              </span>
              {/* 텍스트부 = 다크모드. 위계 역전(사장님 2026-07-19 "이름보다 서브 내용이 중요"):
                  설명 문장 = 메인(크고 흰색) / 모듈명 = 보조 라벨(작고 흐림).
                  PC = 카드 폭 확장 + 캡션 한 줄·글자 확대(사장님 2026-07-20 "글자 잘 안 보여, 한 줄로") */}
              <span className="flex h-[68px] w-[196px] min-w-0 flex-col justify-center bg-[#171717] px-3.5 max-md:flex-1 md:h-[78px] md:w-[400px] md:px-5">
                <span className="block text-[10.5px] font-semibold leading-[1.3] tracking-[0.01em] text-white/75 md:text-[12px] md:text-white/80">{m.label}</span>
                <span className="mt-1 block text-[12.5px] font-bold leading-[1.35] tracking-[-0.01em] text-white md:whitespace-nowrap md:text-[15.5px]">{m.caption}</span>
              </span>
            </div>
          ))}
        </div>

        {/* 모바일 커넥터 하단 — 그룹 카드 → AI 챗봇(동일 화살 문법) */}
        <span aria-hidden className="md:hidden"><CtVArrow /></span>

        {/* 1 · AI 챗봇 — 테두리 박스 폐기(사장님 "테두리가 텍스트까지 감싸지 마") = 다크 정사각 + 밖 라벨.
            ref = 아이콘 사각에만(래퍼에 달면 수렴점이 라벨 쪽으로 쏠림 — 사장님 "선이 만나는 중심이 아니다" 교정) */}
        <div className="z-10 shrink-0 self-center">
          <div className="flex flex-col items-center gap-2.5">
            <span ref={bot} className="relative flex h-[56px] w-[56px] items-center justify-center bg-[#171717] md:h-[64px] md:w-[64px]" style={{ boxShadow: C_SHADOW }}>
              <span ref={botIn} aria-hidden className="absolute left-0 top-1/2 h-0 w-0" />
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="square" strokeLinejoin="miter" className="h-6 w-6 md:h-7 md:w-7" aria-hidden>
                <path d="M3.5 4.5h17v12h-9l-5 4v-4h-3v-12Z" />
                <path d="M7.5 9h9M7.5 12h5.5" />
              </svg>
            </span>
            <span className="text-[13px] font-bold tracking-[-0.01em] text-text-primary md:text-[14px]">AI 챗봇</span>
          </div>
        </div>

        {/* PC 곡선 = 레퍼런스 복원(NA→모듈 색 4 / 모듈→챗봇 회색 4). 모바일 = 선 0(배치가 흐름).
            도킹 = 가장자리 앵커(NA 우변 → 카드 좌변 / 카드 우변 → 챗봇 좌변) — 선끝이 카드에 정확히 맞물림 */}
        {modIn.map((m, i) => (
          <AnimatedBeam key={`in-${i}`} className="max-md:hidden" containerRef={containerRef} fromRef={naOut} toRef={m} curvature={[46, 16, -16, -46][i]} pathColor={FLOW[i]} pathOpacity={0.55} pathWidth={2.5} gradientStartColor={FLOW[i]} gradientStopColor={FLOW[i]} duration={3.6} delay={i * 0.35} />
        ))}
        {modOut.map((m, i) => (
          /* out 곡률 = in의 부호 반전(끝점이 가장자리로 노출되며 실측 — 같은 부호면 시작점 위로 솟는 S자 꼬임) */
          <AnimatedBeam key={`out-${i}`} className="max-md:hidden" containerRef={containerRef} fromRef={m} toRef={botIn} curvature={[-46, -16, 16, 46][i]} pathColor="#C9C9C9" pathOpacity={0.7} pathWidth={1.5} gradientStartColor="#0070f3" gradientStopColor="#4d9fff" duration={3.6} delay={1.4 + i * 0.35} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════ 2+4 통합 · 걱정 마세요(공감→해결) — 얽힌 연결망 리마스터(2026-07-18 사장님 진단 합의):
   원작 = 홈 보존 S2Concept1 TangleDiagram(불변). /ads 버전 = Clone01 문법으로 리마스터 —
   ①선 15→11(얽힘 7→3)·전부 끝 fade·도킹 정돈 ②라벨 = 흰 칩 승격(Clone01 엣지 라벨 실측: 흰 필+테두리+미세 그림자)
   ③칩=노드(원 제거 — 선이 칩에 도킹) ④무대 = Clone01(#FAFAFA+도트 30px, 1-4-1 섹션과 짝) ⑤선 1.6px(모바일 뭉개짐 해소) ═══════════ */

const T_VW = 680;
const T_VH = 560;
const T_C = { x: 340, y: 286 } as const;

/* 칩 노드 — 균등 배치(사장님 2026-07-18 "태그 간격 동일하게"): 45° 등간격 × 타원(rx235·ry190),
   12시·6시는 비워 허브 숨통. 좌표 = 340+235cos(22.5+45k)°, 286+190sin(...) 계산값 */
const T_NODES: { label: string; x: number; y: number; w: number }[] = [
  { label: '광고 계정', x: 250, y: 110, w: 118 },
  { label: '전환 추적', x: 430, y: 110, w: 118 },
  { label: '계정 연결', x: 557, y: 213, w: 118 },
  { label: '사업자 인증', x: 557, y: 359, w: 134 },
  { label: '예산·입찰', x: 430, y: 462, w: 122 },
  { label: '정산', x: 250, y: 462, w: 86 },
  { label: '광고 용어', x: 123, y: 359, w: 118 },
  { label: '채널 연결', x: 123, y: 213, w: 118 },
];
/* (얽힘 곡선·점선 흐름 애니 = 전부 폐기 — 사장님 2026-07-18 "곡선 굳이? 더 지저분·애니 이상".
   순수 방사 직선 8가닥만 — 방사+칩 8개로 "챙길 게 많다"는 충분히 전달) */

/** /ads 얽힌 연결망(리마스터) — uid 필수(중복 렌더 defs 충돌 방지).
    pc = PC 전용 강화(2026-07-20 사장님 "투박하고 애니 잘 안 보여"): ①등장 모션(선 그리기 스태거+칩 팝인 —
    구글 칩·pathLength 검증 문법 재사용, ⚠SVG 내부 whileInView 불가 → 래퍼 useInView) ②잔물결 확대 2겹
    ③칩 그림자 또렷·선 대비 상향. 모바일(pc 미지정) = 기존 원형 그대로 */
export function AdsTangle({ uid, pc }: { uid: string; pc?: boolean }) {
  const reduce = !!useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, margin: '-80px' });
  const on = !pc || inView;
  return (
    <div
      ref={rootRef}
      className="relative h-full w-full"
      style={{
        background: '#FAFAFA',
        backgroundImage: 'radial-gradient(circle, #EAEAEA 1px, transparent 1.4px)',
        backgroundSize: '30px 30px',
        border: '1px solid #EDEDED',
      }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${T_VW} ${T_VH}`} preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden>
        <defs>
          <filter id={`${uid}-chip`} x="-40%" y="-60%" width="180%" height="220%">
            <feDropShadow dx="0" dy="2" stdDeviation={pc ? 2 : 3} floodColor="#0f172a" floodOpacity={pc ? 0.12 : 0.07} />
          </filter>
          <filter id={`${uid}-hub`} x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#0f172a" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* ① 중심 → 칩 방사선 — 얇은 단색 hairline(사장님 "선 굵고 이상" → 1px·그라디언트 폐기).
            PC = 진입 시 중앙에서 그려지는 스태거(등장 모션) */}
        {T_NODES.map((n, i) =>
          pc ? (
            <motion.line
              key={`s${i}`}
              x1={T_C.x} y1={T_C.y} x2={n.x} y2={n.y}
              stroke="#171717" strokeOpacity={0.34} strokeWidth={1}
              initial={{ pathLength: 0 }}
              animate={on ? { pathLength: 1 } : {}}
              transition={reduce ? { duration: 0 } : { duration: 0.5, ease: 'easeOut', delay: 0.12 + i * 0.06 }}
            />
          ) : (
            <line key={`s${i}`} x1={T_C.x} y1={T_C.y} x2={n.x} y2={n.y} stroke="#171717" strokeOpacity={0.28} strokeWidth={1} />
          )
        )}

        {/* ② 칩 노드 — Clone01 엣지 라벨 문법(흰 필+1px 테두리+미세 그림자).
            PC = 팝인 스태거(y 슬라이드+페이드, 선 그리기와 릴레이) 후 **고정**(사장님 2026-07-20
            "텍스트 태그는 고정" — 부유 폐기, 움직임은 잔물결·등장만). 모바일 = 기존 부유 유지 */}
        {T_NODES.map((n, i) => (
          <motion.g
            key={`n${i}`}
            initial={pc ? { opacity: 0, y: 8 } : undefined}
            animate={pc ? (on ? { opacity: 1, y: 0 } : {}) : undefined}
            transition={reduce ? { duration: 0 } : { duration: 0.4, ease: 'easeOut', delay: 0.3 + i * 0.07 }}
          >
            <motion.g
              animate={reduce || pc ? undefined : { y: [0, i % 2 === 0 ? -3 : 3, 0] }}
              transition={{ repeat: Infinity, duration: 4.5 + (i % 4) * 0.9, ease: 'easeInOut', delay: i * 0.35 }}
            >
              <rect x={n.x - n.w / 2} y={n.y - 19} width={n.w} height={38} fill="#FFFFFF" stroke="#E3E3E3" strokeWidth={1} filter={`url(#${uid}-chip)`} />
              <circle cx={n.x - n.w / 2 + 20} cy={n.y} r={4} fill="#818a96" />
              <text x={n.x - n.w / 2 + 34} y={n.y + 1} dominantBaseline="central" fontSize={18} fontWeight={600} fill="#333a45" style={{ fontFamily: 'var(--font-kr)' }}>
                {n.label}
              </text>
            </motion.g>
          </motion.g>
        ))}

        {/* ④ 중앙 허브 — 다크 원 + 사람(직접 다 연결해야 했던 사장님, 원작 계승) + ripple */}
        <circle cx={T_C.x} cy={T_C.y} r={56} fill="none" stroke="#e2e5e9" strokeWidth={1} />
        {/* ripple — ⚠항상 렌더(조건부 렌더 금지: reduce-motion 기기에서 서버 HTML≠클라 = hydration 에러 실증
            2026-07-18 사장님 실기기 "-circle" diff). reduce면 애니만 정지.
            PC = 크게 2겹 시차(pc prop은 SSR/CSR 동일하므로 겹 수 분기는 hydration 무해) */}
        {(pc ? [0, 1.5] : [0]).map((d) => (
          <motion.circle
            key={`rp${d}`}
            cx={T_C.x} cy={T_C.y} fill="none" stroke="#171717" strokeWidth={pc ? 1.3 : 1}
            initial={{ r: 46, opacity: 0 }}
            animate={reduce ? { opacity: 0 } : { r: [46, pc ? 126 : 72], opacity: [pc ? 0.42 : 0.35, 0] }}
            transition={reduce ? undefined : { repeat: Infinity, duration: pc ? 3.0 : 3.2, ease: 'easeOut', repeatDelay: pc ? 0 : 1.2, delay: d }}
          />
        ))}
        <circle cx={T_C.x} cy={T_C.y} r={44} fill="#171717" filter={`url(#${uid}-hub)`} />
        <g transform={`translate(${T_C.x - 16.8}, ${T_C.y - 16.8}) scale(1.4)`} stroke="#ffffff" strokeWidth={1.7} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </g>
      </svg>
    </div>
  );
}


/** 온보딩(탱글) PC = §8.16 2단(2026-07-20 ④): 좌 헤딩 레일+캡션 흡수 | 우 탱글 확대.
    모바일 = page.tsx 기존(중앙 640 + 아래 캡션) 불변. uid 별도(이중 렌더 defs 충돌 방지 §8.16-D1) */
const TG_AREAS: GridArea[] = [
  { key: 'tg-rail', c: [1, 6], r: [1, 6], className: 'flex items-center' },
  { key: 'tg-stage', c: [6, 13], r: [1, 6], className: 'flex items-center justify-center' },
];
export function AdsTangleGrid() {
  return (
    <div className="mx-auto hidden w-full max-w-[1200px] md:block">
      <OccupancyGrid
        cols={12}
        rows={5}
        areas={TG_AREAS}
        mobile={false}
        render={(key) =>
          key === 'tg-rail' ? (
            <div className="px-8 lg:px-12">
              <Eyebrow label="Onboarding" />
              <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.04em] leading-[1.26] text-balance text-text-primary">{empathy.heading}</h2>
              {/* (캡션 "시작을 어렵게 만든 건…" = 삭제 — 사장님 2026-07-20, PC·모바일 공통) */}
              <p className="mt-4 max-w-[460px] text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-balance text-[#4f4f4f] md:leading-[1.35]">{onboarding.body}</p>
            </div>
          ) : (
            <div className="relative aspect-[680/560] w-full max-w-[600px]">
              <AdsTangle uid="ads-tangle-pc" pc />
            </div>
          )
        }
      />
    </div>
  );
}

/* ═══════════ 5 · 애드캔버스 — "URL 하나가 광고가 되는 원리" 변환 파이프라인 v2(사장님 교정 2026-07-18):
   ①서브문구가 곧 제목(기능명 라벨 폐기) ②03 = AI 문구 "생성 원리"(상세페이지 정보→AI→문구, 근거 B9:
   상품 정보·랜딩을 읽어 작성, 가격 JSON-LD 자동, 후킹+서브 2줄) ③그룹 2개 분리 = 메타 / 구글 검색광고.
   구글 4단계 근거 = B11(SPEC_ADCANVAS_GOOGLE): Easy Mode URL만 → 헤드라인15·설명4(바이트 실시간)
   → 키워드 포함 체크·정책 위반 자동 검출 → Ad Strength 4단계 확인 후 게시.
   ⛔ "Ad Strength=순위 보장" 금지(구성 품질 지표일 뿐) ═══════════ */

const UW = (id: string) => `/img/unsplash/webp/${id}.webp`;
const CV_IMGS = {
  dress: UW('photo-1496747611176-843222e1e57c'),
  shirt: UW('photo-1558171813-4c088753af8f'),
  denim: UW('photo-1541099649105-f69ad21f3246'),
};

/** 단계 헤드 — 번호 필 + 문장형 제목(서브문구 승격, 2줄 허용 → min-h로 화살 기준선 통일) */
function CvStep({ n, label }: { n: string; label: string }) {
  return (
    <p className="mb-2.5 flex min-h-[40px] items-start gap-2 max-md:min-h-0">
      <span className="mt-px flex h-[18px] shrink-0 items-center bg-[#171717] px-1.5 text-[10px] font-bold leading-none tracking-[0.04em] text-white md:h-[20px] md:text-[11px]" style={EN}>{n}</span>
      <span className="text-[12.5px] font-bold leading-[1.4] tracking-[-0.01em] text-text-primary md:text-[14.5px]">{label}</span>
    </p>
  );
}

/** 가로 커넥터 — S4 문법 이식(2026-07-20 PC 최적화 ①): 56px 그리드 셀을 화살이 꽉 채움(양끝 5px).
    center = 카드 영역 세로 중앙(헤드 50px 오프셋 — 메타 그룹, 사장님 2026-07-20 "화살은 카드 중간에").
    기본 = 첫 목업(URL 바) 축(구글 그룹 — 01 카드가 짧아 행 중앙이면 허공). 모바일 숨김 */
function CvArrow({ center }: { center?: boolean }) {
  /* 2026-07-20 사장님 "누구나 콘텐츠 빌드업의 화살(동그라미 포함)로" — /content S2ConnectorH 정본 이식:
     흰 원 44px 무보더 + 선명한 그림자 2겹(blur 2/8, §8.14) + 채운 삼각 */
  const btn = (
    <span className="rounded-dot flex h-11 w-11 items-center justify-center bg-white" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.12)' }}>
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><line x1="1" y1="6" x2="10" y2="6" stroke="#171717" strokeWidth="1.6" /><path d="M10 1.2L17 6l-7 4.8z" fill="#171717" /></svg>
    </span>
  );
  return center ? (
    <div className="hidden items-center justify-center self-stretch pt-[50px] md:flex" aria-hidden>{btn}</div>
  ) : (
    <div className="mt-[52px] hidden justify-center self-start md:flex" aria-hidden>{btn}</div>
  );
}

/* 그룹 헤드 로고 — 공식 아이콘 재현(§7-7 예외 판례, AdsHeroOrbit LOGOS 발췌 확대판).
   인스타 defs id = "cvh-ig" 1벌(AdsCanvasFlow는 페이지 1회 렌더 — PC/모바일 같은 DOM이라 중복 없음) */
const CV_LOGOS = {
  facebook: (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path fill="#fff" d="M15.6 15.1l.5-3.2h-3.1V9.8c0-.9.4-1.7 1.8-1.7h1.4V5.3s-1.3-.2-2.5-.2c-2.5 0-4.2 1.5-4.2 4.3v2.4H6.7v3.2h2.8V23a11 11 0 0 0 3.5 0v-7.9h2.6Z" />
    </svg>
  ),
  insta: (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <defs>
        <radialGradient id="cvh-ig" cx="0.27" cy="1.08" r="1.3">
          <stop offset="0" stopColor="#fdf497" /><stop offset="0.09" stopColor="#fdd663" /><stop offset="0.45" stopColor="#fd5949" /><stop offset="0.6" stopColor="#d6249f" /><stop offset="0.9" stopColor="#7638fa" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="5.4" fill="url(#cvh-ig)" />
      <g fill="none" stroke="#fff" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="4" /><circle cx="12" cy="12" r="3.2" /></g>
    </svg>
  ),
  google: (
    <svg width="27" height="27" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1C3.25 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.29v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l4.01-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.61l4.01 3.1C6.23 6.87 8.88 4.77 12 4.77z" />
    </svg>
  ),
} as const;

/** 그룹 래퍼 — 매체 헤더 밴드 통합(안1, 사장님 택1 2026-07-19): 무대 상단에
    [매체 브랜드 컬러 보더 3px + 흰 헤더 밴드(로고·매체명·문구)] — 매체 구분이 글자가 아니라 구조.
    메타 = #1877F2 단색 / 구글 = 4색 등분 스트라이프(파스텔 면칠 아님 — 3px 보더라 §7-7 무관) */
function CvGroup({ logos, tag, note, accent, cols, children }: { logos: React.ReactNode; tag: string; note: string; accent: string; cols: string; children: React.ReactNode }) {
  return (
    <div>
      {/* 상단 바 = 검정 1px(사장님 2026-07-19 — 매체 컬러 바 폐기 → 가장 얇은 검은 바.
          accent(매체색)는 복원 대비 prop 보존: <div className="h-[3px]" style={{ background: accent }} /> */}
      {/* Vercel 문법 최종(사장님 2026-07-19 "합치니 조잡" 진단): 밴드·컬러 바·배경 전부 폐기 —
          박스가 아니라 여백이 구분한다. 매체 구분 = 큰 로고 + 큰 제목 한 줄, 장식 0.
          (accent prop = 컬러 바 이력 보존용 미사용) */}
      {void accent}
      <div className="mb-7 flex items-center gap-3.5 max-md:mb-5 max-md:flex-wrap max-md:gap-x-2.5 max-md:gap-y-1.5">
        <span className="flex shrink-0 items-center gap-2">{logos}</span>
        <span className="text-[24px] font-bold tracking-[-0.02em] text-text-primary max-md:text-[19px]">{tag}</span>
        <span className="mt-[5px] text-[14px] font-medium text-text-weak max-md:mt-[3px] max-md:text-[12.5px]">{note}</span>
      </div>
      {/* 무대 = PC S4 그리드(카드 열 1fr + 화살 열 56px — 카드가 무대 좌우 경계에 스냅, 화살이 사이를 꽉 채움).
          모바일 = 기존 세로 스택 그대로(flex-wrap + w-full) */}
      <div
        className={`relative flex flex-wrap items-start justify-center gap-x-4 gap-y-7 px-4 py-7 md:grid md:gap-0 md:px-7 md:py-9 ${cols}`}
        style={{
          background: '#FAFAFA',
          backgroundImage: 'radial-gradient(circle, #EAEAEA 1px, transparent 1.4px)',
          backgroundSize: '30px 30px',
          border: `1px solid ${C_BORDER}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** 목업 안 미니 라벨행(좌 라벨 · 우 수치) — 영문 UI 계열 */
function CvMeta({ l, r }: { l: string; r: string }) {
  return (
    <span className="flex items-baseline justify-between">
      <span className="text-[8.5px] font-bold uppercase tracking-[0.06em] text-[#666]" style={EN}>{l}</span>
      <span className="text-[8.5px] font-medium text-[#666]" style={EN}>{r}</span>
    </span>
  );
}

export function AdsCanvasFlow() {
  return (
    <div className="flex w-full max-w-[980px] flex-col gap-24 max-md:gap-16">
      {/* ── 그룹 1 · 메타 광고 ── */}
      <CvGroup accent="#1877F2" cols="md:grid-cols-[1fr_56px_1fr_56px_1fr]" logos={<>{CV_LOGOS.facebook}{CV_LOGOS.insta}</>} tag="메타 광고" note="상품 사진이 인스타 광고가 됩니다">
        {/* 3스텝 재설계(사장님 2026-07-19 "기계적 삭제 반려" → 원칙 통일: 과정은 좁게, 완성 실물은 크게.
            구 4스텝의 AI 버튼·방식 3줄·6썸 = 과정 설명이라 데모의 몫, 증거(완성 문구·인스타 실물)는 확대) */}
        {/* 01 · URL — PC 폭 = 그리드 1fr(카드 크기 통일·경계 스냅, 2026-07-20 ①).
            구 상품 페이지 미니 실물 = 삭제(사장님 2026-07-20 "상세페이지처럼 보여 더 헷갈려").
            URL 창 = 02 카드 세로 중앙 정렬(self-stretch + flex-1 중앙) */}
        <div className="min-w-0 max-md:w-full md:flex md:flex-col md:self-stretch">
          <CvStep n="01" label="상품 페이지 주소만 넣으면 시작됩니다" />
          <div className="md:flex md:min-h-0 md:flex-1 md:items-center">
            <div className="flex items-center gap-1.5 bg-white p-2 md:w-full md:p-2.5" style={{ border: `1px solid ${C_BORDER}`, boxShadow: C_SHADOW }}>
              <span className="min-w-0 flex-1 truncate text-[10.5px] font-medium text-text-weak md:text-[12px]" style={EN}>myshop.com/summer-dress</span>
              <span className="flex h-[24px] shrink-0 items-center bg-[#0070f3] px-2 text-[10px] font-bold text-white md:h-[26px] md:px-2.5 md:text-[11.5px]">가져오기</span>
            </div>
          </div>
        </div>

        <CvArrow center />

        {/* 02 · 사진 선택 + 문구(과정 통합) */}
        <div className="min-w-0 max-md:w-full">
          <CvStep n="02" label="사진을 고르고, AI가 문구를 씁니다" />
          <div className="bg-white p-2.5" style={{ border: `1px solid ${C_BORDER}`, boxShadow: C_SHADOW }}>
            {/* PC = 스켈레톤 바 대신 실제 라벨(2026-07-20 ⑥' 02 카드 채움 — §7-7 스켈레톤 나열 경계).
                모바일 = 기존 스켈레톤 불변 */}
            <div className="mb-2 space-y-1.5 md:hidden">
              <div className="h-[7px] w-4/5 bg-[#EBEBEB]" />
              <div className="h-[7px] w-3/5 bg-[#EBEBEB]" />
            </div>
            <p className="mb-2 hidden items-baseline justify-between md:flex">
              <span className="text-[10.5px] font-bold tracking-[0.02em] text-[#666]">수집된 사진 6장</span>
              <span className="text-[9.5px] font-medium text-[#999]">광고에 쓸 사진을 고르세요</span>
            </p>
            {/* 미리보기 = PC 6장(사장님 2026-07-20 — 같은 원피스 시리즈 6컷: 기존 3 + bench·fabric·대표컷).
                모바일 = 기존 3장 불변(추가 3장 hidden md:block) */}
            <div className="grid grid-cols-3 gap-1.5">
              {(['/img/ads/dress-walk.webp', '/img/ads/dress-balcony.webp', '/img/ads/dress-wear.webp', '/img/unsplash/webp/photo-1496747611176-843222e1e57c.webp', '/img/ads/dress-bench.webp', '/img/ads/dress-fabric.webp'] as const).map((src, i) => (
                <span key={src} className={`relative block aspect-square overflow-hidden ${i >= 3 ? 'hidden md:block' : ''}`} style={{ border: i === 1 ? '1.5px solid #0070f3' : `1px solid ${C_BORDER}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  {i === 1 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center bg-[#0070f3]">
                      <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="square"><path d="M3 8.5l3.2 3L13 5" /></svg>
                    </span>
                  )}
                </span>
              ))}
            </div>
            <p className="mb-1 mt-2.5 flex items-center gap-1.5">
              <span className="flex h-[14px] items-center bg-[#171717] px-1 text-[8px] font-bold text-white md:h-[16px] md:px-1.5 md:text-[9px]" style={EN}>AI</span>
              <span className="text-[9px] font-bold tracking-[0.02em] text-[#666] md:text-[10.5px]">AI가 쓴 문구</span>
              <span className="ml-auto hidden text-[9.5px] font-medium text-[#999] md:block">후보 중 선택</span>
            </p>
            {/* PC = 선택 표시(사진 선택과 같은 파란 보더+체크 문법 — 인라인 보더 위 오버레이) */}
            <div className="relative bg-[#FAFAFA] p-2 md:p-2.5" style={{ border: `1px solid ${C_BORDER}` }}>
              <span aria-hidden className="pointer-events-none absolute inset-0 hidden border-[1.5px] border-[#0070f3] md:block" />
              <span className="absolute right-1 top-1 hidden h-4 w-4 items-center justify-center bg-[#0070f3] md:flex">
                <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="square"><path d="M3 8.5l3.2 3L13 5" /></svg>
              </span>
              <p className="break-keep text-[10px] font-bold leading-[1.5] text-[#171717] md:text-[11.5px]">바람이 통하는 린넨 소재, 올여름 가장 시원한 선택이에요 ☀️</p>
              <p className="mt-1 break-keep text-[10px] font-medium leading-[1.5] text-text-body md:text-[11.5px]">휴가룩으로 좋은 플로럴 랩 원피스, 얼리버드 기간에만 30% 할인가로 만나보세요</p>
            </div>
            {/* PC 전용 · 비선택 후보(카드 덩치 = 03과 균형, 사장님 2026-07-20 "내용 첨부해서 늘려줘") */}
            <div className="mt-1.5 hidden bg-[#FAFAFA] p-2.5 md:block" style={{ border: `1px solid ${C_BORDER}` }}>
              <p className="break-keep text-[11.5px] font-bold leading-[1.5] text-[#171717]">여름 휴가룩 고민 끝, 플로럴 랩 원피스 하나면 충분해요</p>
              <p className="mt-1 break-keep text-[11.5px] font-medium leading-[1.5] text-text-body">움직일 때마다 살랑이는 실루엣, 지금 주문하면 얼리버드 30% 할인</p>
            </div>
          </div>
        </div>

        <CvArrow center />

        {/* 03 · 완성 실물(주인공) */}
        <div className="min-w-0 max-md:w-full">
          <CvStep n="03" label="완성된 광고를 확인하고 게시합니다" />
          <div className="bg-white max-md:mx-auto max-md:max-w-[250px]" style={{ border: `1px solid ${C_BORDER}`, boxShadow: C_SHADOW }}>
            <div className="flex items-center gap-1.5 px-2 py-1.5">
              <span className="rounded-dot flex h-[18px] w-[18px] shrink-0 items-center justify-center bg-[#0070f3] text-[9px] font-bold text-white" style={EN}>M</span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[9.5px] font-bold text-[#171717]" style={EN}>myshop_official</span>
                <span className="text-[8px] text-[#666]" style={EN}>Sponsored</span>
              </span>
              <span className="text-[10px] tracking-[1px] text-[#666]">···</span>
            </div>
            <span className="relative block aspect-square overflow-hidden bg-[#fafafa]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/ads/dress-balcony.webp" alt="" className="h-full w-full object-cover" loading="lazy" />
            </span>
            <span className="flex items-center justify-between border-b px-2 py-[7px]" style={{ borderColor: '#efefef' }}>
              <span className="text-[9.5px] font-semibold text-[#0095f6]">지금 쇼핑하기</span>
              <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#0095f6" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M6 3.5l4.5 4.5L6 12.5" /></svg>
            </span>
            <span className="flex items-center gap-2.5 px-2 pb-0.5 pt-1.5">
              <svg className="h-[15px] w-[15px]" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4" aria-hidden><path d="M8 13.5S2.5 10.2 2.5 6.3A3.3 3.3 0 018 4.2a3.3 3.3 0 015.5 2.1c0 3.9-5.5 7.2-5.5 7.2z" strokeLinejoin="round" strokeLinecap="round" /></svg>
              <svg className="h-[15px] w-[15px]" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4" aria-hidden><path d="M2 3h12v7H6l-3 3V10H2V3z" strokeLinejoin="round" strokeLinecap="round" /></svg>
              <svg className="h-[15px] w-[15px]" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4" aria-hidden><path d="M2 8l12-5-4 12-2.5-5L2 8z" strokeLinejoin="round" strokeLinecap="round" /></svg>
              <svg className="ml-auto h-[15px] w-[15px]" viewBox="0 0 16 16" fill="none" stroke="#171717" strokeWidth="1.4" aria-hidden><path d="M3.5 2h9v12L8 11l-4.5 3V2z" strokeLinejoin="round" strokeLinecap="round" /></svg>
            </span>
            <p className="px-2 pt-1 text-[9.5px] font-bold text-[#171717]">좋아요 1,248개</p>
            <p className="px-2 pb-2 pt-0.5 text-[9.5px] leading-[1.4] text-[#171717]">
              <span className="font-bold" style={EN}>myshop_official</span> 바람이 통하는 린넨 소재, 올여름 가장 시원한… <span className="text-[#666]">더 보기</span>
            </p>
          </div>
        </div>
      </CvGroup>

      {/* ── 그룹 2 · 구글 검색광고 — 2스텝 압축(텍스트 다이어트 처방1, 사장님 확정 2026-07-19:
           구 4스텝(바이트 카운터·설명문 칩·체크리스트)은 데모의 몫으로. 메타 그룹과 반복 느낌 해소) ── */}
      <CvGroup accent="linear-gradient(90deg,#4285F4 0%,#4285F4 25%,#EA4335 25%,#EA4335 50%,#FBBC05 50%,#FBBC05 75%,#34A853 75%,#34A853 100%)" cols="md:grid-cols-[1fr_56px_1fr]" logos={CV_LOGOS.google} tag="구글 검색광고" note="같은 원리로, 검색에 보일 문장을 만듭니다">
        {/* 새 01 · URL → 키워드 발굴 — 실코드 근거(2026-07-19 실측, 스펙 md보다 정확):
            Easy Mode generateAd()가 URL→/ai-suggestions 호출, 응답 recommended_keywords 15~20개.
            백엔드 프롬프트(google_ads_ai_service.py) "상위 5~6개가 반드시 headlines에 원문 그대로 포함".
            UI 원문 "이 키워드가 헤드라인에 포함되면 검색 결과에서 굵게 표시됩니다" = 02 SERP 볼드의 근거 */}
        {/* PC = 두 카드 높이 강제 동일(사장님 2026-07-20 "01·02 폭 같아야" — self-stretch + 카드 flex-1) */}
        <div className="min-w-0 max-md:w-full md:flex md:flex-col md:self-stretch">
          <CvStep n="01" label="URL을 넣으면 키워드부터 찾습니다" />
          <div className="bg-white p-2.5 md:flex-1" style={{ border: `1px solid ${C_BORDER}`, boxShadow: C_SHADOW }}>
            <div className="flex items-center gap-1.5 bg-[#FAFAFA] p-1.5 md:p-2" style={{ border: `1px solid ${C_BORDER}` }}>
              <span className="min-w-0 flex-1 truncate text-[10.5px] font-medium text-text-weak md:text-[12.5px]" style={EN}>myshop.com</span>
              <span className="flex h-[22px] shrink-0 items-center bg-[#0070f3] px-2 text-[10px] font-bold text-white md:h-[26px] md:px-2.5 md:text-[11.5px]">분석</span>
            </div>
            <p className="mb-1 mt-2.5 flex items-center gap-1.5 md:mb-1.5 md:mt-3">
              <span className="flex h-[14px] items-center bg-[#171717] px-1 text-[8px] font-bold text-white md:h-[16px] md:px-1.5 md:text-[9px]" style={EN}>AI</span>
              <span className="text-[9px] font-bold tracking-[0.02em] text-[#666] md:text-[10.5px]">찾아낸 키워드</span>
            </p>
            <div className="flex flex-wrap gap-1 md:gap-1.5">
              {['린넨 원피스', '여름 원피스', '휴가룩'].map((k, i) => (
                <motion.span key={k} className="flex h-[22px] items-center bg-[#FAFAFA] px-2 text-[10px] font-semibold text-[#333] md:h-[27px] md:px-2.5 md:text-[11.5px]" style={{ border: `1px solid ${C_BORDER}` }} initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.25, ease: 'easeOut', delay: 0.35 + i * 0.16 }}>{k}</motion.span>
              ))}
              {/* 키워드 보강 — 실제 응답은 15~20개(실코드 근거 위 주석). 모바일도 동일 표시(사장님 2026-07-20) */}
              {['여름 휴가 코디', '린넨 소재', '원피스 추천'].map((k, i) => (
                <motion.span key={k} className="flex h-[22px] items-center bg-[#FAFAFA] px-2 text-[10px] font-semibold text-[#333] md:h-[27px] md:px-2.5 md:text-[11.5px]" style={{ border: `1px solid ${C_BORDER}` }} initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.25, ease: 'easeOut', delay: 0.83 + i * 0.16 }}>{k}</motion.span>
              ))}
              <motion.span className="flex h-[22px] items-center px-1.5 text-[10px] font-semibold text-[#8B939C] md:h-[27px] md:text-[11px]" style={EN} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.25, delay: 1.35 }}>+12</motion.span>
            </div>
            {/* PC 전용 · 헤드라인 반영 리스트(2026-07-20 사장님 "01 카드 내용 채워 02와 유사하게" —
                근거 = 실코드: 백엔드 프롬프트 "상위 5~6개가 반드시 headlines에 원문 그대로 포함",
                UI 원문 "이 키워드가 헤드라인에 포함되면 검색 결과에서 굵게 표시됩니다") */}
            {/* 모바일에도 표시(사장님 2026-07-20 — 구 PC 전용 해제) */}
            <div className="mt-3 border-t border-[#F0F0F0] pt-2.5">
              <p className="flex items-baseline justify-between">
                <span className="text-[10.5px] font-bold tracking-[0.02em] text-[#666]">헤드라인에 담길 키워드</span>
                <span className="text-[9.5px] font-medium text-[#999]">상위 키워드 자동 반영</span>
              </p>
              <div className="mt-1.5 space-y-[5px]">
                {['린넨 원피스', '여름 원피스', '휴가룩'].map((k) => (
                  <p key={k} className="flex items-center gap-2 bg-[#FAFAFA] px-2.5 py-[6px]" style={{ border: `1px solid ${C_BORDER}` }}>
                    <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center bg-[#22a06b]">
                      <svg width="8" height="8" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="square"><path d="M3 8.5l3.2 3L13 5" /></svg>
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-[#333]">{k}</span>
                    <span className="shrink-0 text-[9.5px] font-medium text-[#999]">문구에 포함</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <CvArrow center />

        {/* 새 02 · 점검 통과 → 완성 미리보기(SERP) + Ad Strength */}
        <div className="min-w-0 max-md:w-full md:flex md:flex-col md:self-stretch">
          <CvStep n="02" label="키워드를 담은 문구로 광고가 완성됩니다" />
          <div className="space-y-2 bg-white p-2.5 md:flex-1" style={{ border: `1px solid ${C_BORDER}`, boxShadow: C_SHADOW }}>
            {/* 실제 구글 SERP 광고 구조 그대로 */}
            <div className="bg-white px-2.5 py-2 md:px-3 md:py-2.5" style={{ border: `1px solid ${C_BORDER}` }}>
              <p className="text-[8.5px] font-bold text-[#202124] md:text-[10px]">스폰서</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="rounded-dot flex h-[16px] w-[16px] shrink-0 items-center justify-center bg-[#f1f3f4] text-[7.5px] font-bold text-[#5f6368] md:h-[20px] md:w-[20px] md:text-[9px]" style={{ ...EN, border: '1px solid #ecedef' }}>M</span>
                <span className="flex min-w-0 flex-col leading-none">
                  <span className="text-[8.5px] font-medium text-[#202124] md:text-[10px]" style={EN}>myshop</span>
                  <span className="mt-[2px] truncate text-[7.5px] text-[#5f6368] md:text-[9px]" style={EN}>https://myshop.com</span>
                </span>
              </div>
              <p className="mt-1 text-[11.5px] leading-[1.35] text-[#1a0dab] md:text-[14px]">여름 <b className="font-semibold">린넨 원피스</b> - 얼리버드 30% 할인</p>
              <p className="mt-0.5 text-[9.5px] leading-[1.45] text-[#4d5156] md:text-[11.5px]">시원한 <b className="font-semibold text-[#4d5156]">린넨</b> 소재로 여름을 준비하세요.</p>
            </div>
            {/* 키워드 포함 확인(§4.6 키워드 연동 실물) */}
            <p className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center bg-[#22a06b] md:h-[18px] md:w-[18px]">
                <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="square"><path d="M3 8.5l3.2 3L13 5" /></svg>
              </span>
              <span className="text-[10.5px] font-medium text-text-body md:text-[12px]">키워드 ‘린넨 원피스’가 문구에 들어갔습니다</span>
            </p>
            {/* Ad Strength 4기준 채점 해부(안1, 사장님 2026-07-19 "빙산의 일각 오해 걱정" 대응) —
                기준명 4개 = SPEC_ADCANVAS_GOOGLE §4.5 원문(각 25점). 순위 보장 아님(구성 품질 지표) */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-[#666] md:text-[10.5px]" style={EN}>Ad Strength</span>
                <span className="text-[10px] font-bold text-[#22a06b] md:text-[11.5px]" style={EN}>Excellent</span>
              </div>
              <div className="mt-1.5 space-y-[5px] md:space-y-[7px]">
                {[
                  { k: '헤드라인 수', v: 100 },
                  { k: '설명문 수', v: 100 },
                  { k: '다양성', v: 80 },
                  { k: '키워드 포함', v: 100 },
                ].map((r, i) => (
                  <div key={r.k} className="flex items-center gap-2">
                    <span className="w-[62px] shrink-0 text-[8.5px] font-medium text-[#666] md:w-[80px] md:text-[10.5px]">{r.k}</span>
                    <span className="relative h-[4px] min-w-0 flex-1 bg-[#F0F0F0] md:h-[5px]">
                      {/* 차오르는 채점 바(전수조사 애니 2026-07-20 — 채점한다는 로직을 동작으로) */}
                      <motion.span className="absolute inset-y-0 left-0 bg-[#0070f3]" initial={{ width: 0 }} whileInView={{ width: `${r.v}%` }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, ease: 'easeOut', delay: 0.2 + i * 0.12 }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CvGroup>
    </div>
  );
}

/* ═══════════ 6 · AI 챗봇 — 예전 다크 챗 목업 원작 그대로(사장님 2026-07-18 "다크버전 그대로 갖고 와").
   원작 = ChatbotShowcase.ChatMock(다크 #111 · 말풍선 4개 · 예산 변경 카드 · "자동 집행 아님" 명시) ═══════════ */
export function AdsChatScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div ref={ref} className="mx-auto w-full max-w-[600px]">
      <ChatMock active={inView} />
    </div>
  );
}

/** 챗봇 PC = §8.16 2단(2026-07-20 ⑤): 좌 헤딩 레일 | 우 다크 챗. 모바일 = 기존 불변 */
const CH_AREAS: GridArea[] = [
  { key: 'ch-rail', c: [1, 6], r: [1, 7], className: 'flex items-center' },
  { key: 'ch-stage', c: [6, 13], r: [1, 7], className: 'flex items-center justify-center' },
];
export function AdsChatGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div ref={ref} className="mx-auto hidden w-full max-w-[1200px] md:block">
      <OccupancyGrid
        cols={12}
        rows={6}
        areas={CH_AREAS}
        mobile={false}
        render={(key) =>
          key === 'ch-rail' ? (
            <div className="px-8 lg:px-12">
              <Eyebrow label="AI Chat" />
              <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.04em] leading-[1.26] text-balance text-text-primary">{chatbot.heading}</h2>
              <p className="mt-4 max-w-[460px] text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-balance text-[#4f4f4f] md:leading-[1.35]">{chatbot.body}</p>
            </div>
          ) : (
            <div className="w-full max-w-[600px] px-4">
              <ChatMock active={inView} />
            </div>
          )
        }
      />
    </div>
  );
}

/* ═══════════ 7 · 대시보드 — 기존 파이프라인 목업 원작 그대로(사장님 2026-07-18 "기존 거 꽤 괜찮아").
   원작 = DashboardShowcase.DataPipelineVisual(5소스→NGN→대시보드 미니: 매출바·방문자선·KPI·ROAS) ═══════════ */
export function AdsDashScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div ref={ref} className="w-full">
      <div className="hidden md:block"><DataPipelineVisual isActive={inView} /></div>
      <div className="block md:hidden"><DataPipelineVisualMobile isActive={inView} /></div>
      {/* "데모 화면" 공통 라벨(콜드 리드 지적 대응 — 원작 문법 유지) */}
      <p className="mt-2 pr-2 text-right text-[11px] text-text-weak max-md:text-[12px]">데모 화면 · 예시 데이터</p>
    </div>
  );
}

/* ═══════════ 6.5 · 메타 카탈로그 자동 광고 — 순환 루프(시안1 v8 확정, 사장님 2026-07-19 "이걸로 조립").
   구성 = 루프(01 9시→04 6시 시계방향) ↓ 텍스트 바 ↓ 실제 제품 세트 패널(SPEC Step1 우측 문법) — 수직 한 선.
   카피 = ads.ts catalog(GPT 대안2 조합, 사장님 낙점 토씨 그대로) ═══════════ */

const CT_PRODUCTS = [
  { name: '플로럴 랩 원피스', img: `/img/unsplash/webp/photo-1496747611176-843222e1e57c.webp` },
  { name: '크림 프린지 니트', img: `/img/unsplash/webp/photo-1434389677669-e08b4cac3105.webp` },
  { name: '샴브레이 셔츠', img: `/img/unsplash/webp/photo-1558171813-4c088753af8f.webp` },
  { name: '디스트로이드 스키니 데님', img: `/img/unsplash/webp/photo-1541099649105-f69ad21f3246.webp` },
] as const;
const CT_POS = ['left-0 top-1/2 -translate-y-1/2', 'left-1/2 top-0 -translate-x-1/2', 'right-0 top-1/2 -translate-y-1/2', 'bottom-0 left-1/2 -translate-x-1/2'] as const;

/** 수직 화살(아래 방향) */
function CtVArrow() {
  /* 2026-07-19 사장님 "버셀 스타일 깔끔한 화살표로" → Geist 문법(채운 삼각 폐기, 스트로크 V 화살촉) */
  return (
    <div className="flex h-10 items-center justify-center" aria-hidden>
      {/* PC = 짧은 선+채운 삼각(2026-07-20 전 페이지 통일) / 모바일 = 가는 라인(기존) */}
      <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className="hidden md:block"><line x1="7" y1="1" x2="7" y2="11" stroke="#171717" strokeWidth="1.6" /><path d="M1.8 11h10.4L7 19z" fill="#171717" /></svg>
      <svg width="12" height="21" viewBox="0 0 12 21" fill="none" className="md:hidden"><path d="M6 1v18.6M1.5 15.5L6 20l4.5-4.5" stroke="#171717" strokeWidth="1.1" /></svg>
    </div>
  );
}

export function AdsCatalogScene({ uid = 'ct' }: { uid?: string }) {
  /* 사분원 화살 4개 — 노드 사이 구간만(노드와 안 겹침), 시계방향 */
  const pt = (a: number): [number, number] => [172 + 132 * Math.cos((a * Math.PI) / 180), 152 + 112 * Math.sin((a * Math.PI) / 180)];
  const arc = (a1: number, a2: number) => {
    const [x1, y1] = pt(a1); const [x2, y2] = pt(a2);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}A132 112 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };
  /* 세트 썸 10칸 = 전부 다른 상품(사장님 2026-07-19 "모두 다른 의류" — 기존 4종 + 신규 6종 다운로드) */
  const setThumbs = [
    CT_PRODUCTS[0], CT_PRODUCTS[1], CT_PRODUCTS[2],
    { name: '가죽 재킷', img: '/img/ads/set-1.webp' },
    { name: '베이식 티셔츠', img: '/img/ads/set-2.webp' },
    CT_PRODUCTS[3],
    { name: '셔츠 코디 세트', img: '/img/ads/set-3.webp' },
    { name: '슬랙스 코디', img: '/img/ads/set-4.webp' },
    { name: '폴디드 티 5색', img: '/img/ads/set-5.webp' },
    { name: '봄버 재킷', img: '/img/ads/set-6.webp' },
  ];
  return (
    /* PC 통확대 = zoom(내부 비례 유지 — 사장님 2026-07-20 "목업 크게, 글자 안 보여") */
    <div
      className="relative flex items-center justify-center gap-8 px-8 py-10 max-md:flex-col max-md:gap-0 max-md:px-4 max-md:py-8 md:[zoom:1.28]"
      style={{
        background: '#FAFAFA',
        backgroundImage: 'radial-gradient(circle, #EAEAEA 1px, transparent 1.4px)',
        backgroundSize: '30px 30px',
        border: `1px solid ${C_BORDER}`,
      }}
    >
      {/* 순환 루프 — 01 9시 시작, 시계방향. 모바일 = 같은 원형을 축소(zoom 0.88 → 303px ≤ 390-여백)
          (구 세로 4스텝 접기 = 폐기, 사장님 2026-07-20 "PC 버전이 더 나아") */}
      <div className="relative h-[304px] w-[344px] shrink-0 max-md:[zoom:0.88]">
        <svg className="absolute inset-0" viewBox="0 0 344 304" fill="none" aria-hidden>
          <defs>
            <marker id={`${uid}-arw`} viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0.5 0L7.43 4 0.5 8z" fill="#171717" />
            </marker>
          </defs>
          {[arc(-68, -24), arc(22, 68), arc(112, 158), arc(202, 248)].map((d) => (
            <path key={d} d={d} stroke="#171717" strokeWidth="1.1" markerEnd={`url(#${uid}-arw)`} />
          ))}
        </svg>
        <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 bg-[#171717] px-3.5 py-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="square" className="h-[16px] w-[16px]" aria-hidden>
            <path d="M20 6.5A9.5 9.5 0 1 0 21.5 12" /><path d="M21.5 4v4.5H17" />
          </svg>
          <span className="text-center text-[10px] font-bold leading-[1.3] text-white">매일<br />자동 반복</span>
        </span>
        {ctl.loop.map((n, i) => (
          <span key={n.label} className={`absolute ${CT_POS[i]} flex min-h-[84px] w-[132px] flex-col items-center justify-center bg-white px-2 py-2 text-center`} style={{ border: `1px solid ${C_BORDER}`, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
            <span className="block text-[8.5px] font-bold text-[#0070f3]" style={EN}>{`0${i + 1}`}</span>
            <span className="mt-1 block text-[11.5px] font-bold leading-[1.3] tracking-[-0.01em] text-[#171717]">{n.label}</span>
            <span className="mt-0.5 block text-[9px] font-medium text-[#666]">{n.sub}</span>
          </span>
        ))}
      </div>
      {/* 루프 → [텍스트바+패널] — PC 가로 화살 / 모바일 세로(2026-07-20 PC 개편: 무대 눕히기, 세로 1100px 해소) */}
      <div className="hidden shrink-0 md:block" aria-hidden>
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none"><line x1="1" y1="7" x2="13" y2="7" stroke="#171717" strokeWidth="1.6" /><path d="M13 1.8L21 7l-8 5.2z" fill="#171717" /></svg>
      </div>
      <span className="md:hidden"><CtVArrow /></span>
      <div className="flex shrink-0 flex-col items-center max-md:w-full">
      <div className="w-[260px] bg-white px-4 py-3 text-center max-md:w-full" style={{ border: `1px solid ${C_BORDER}`, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
        <p className="text-[11.5px] font-medium leading-[1.55] tracking-[-0.01em] text-text-body">
          {ctl.bridge[0]}<br />
          <b className="font-bold text-[#171717]">최근 잘 팔린 상품</b>이 반영됩니다.
        </p>
      </div>
      <CtVArrow />
      {/* 실제 제품 세트 패널(SPEC Step1 우측: 세트명 + 상품 수 + 썸네일 그리드 5열) */}
      <div className="w-[320px] max-w-full bg-white" style={{ border: `1px solid ${C_BORDER}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div className="border-b border-[#f0f0f0] px-3.5 py-2.5">
          <p className="flex items-center justify-between">
            <span className="text-[8.5px] font-bold uppercase tracking-[0.07em] text-[#666]" style={EN}>Product Set</span>
            <span className="flex items-center gap-1">
              <span className="rounded-dot h-1.5 w-1.5 bg-[#22c55e]" />
              <span className="text-[8.5px] font-bold text-[#22a06b]" style={EN}>LIVE</span>
            </span>
          </p>
          <p className="mt-1 text-[13px] font-bold tracking-[-0.01em] text-[#171717]">{ctl.panel.name}</p>
          <p className="mt-0.5 text-[9.5px] font-medium text-[#666]">{ctl.panel.meta}</p>
        </div>
        <div className="grid grid-cols-5 gap-1 p-3">
          {setThumbs.map((p, i) => (
            <span key={i} className="relative block aspect-square overflow-hidden" style={{ border: i < 3 ? '1.5px solid #0070f3' : `1px solid ${C_BORDER}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
              {i < 3 && (
                <span className="absolute left-0 top-0 flex h-[11px] items-center bg-[#0070f3] px-[3px] text-[6.5px] font-bold text-white" style={EN}>{i + 1}</span>
              )}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-[#f0f0f0] px-3.5 py-2">
          <span className="flex h-[16px] shrink-0 items-center bg-[#171717] px-1.5 text-[7.5px] font-bold text-white" style={EN}>AD</span>
          <span className="text-[9.5px] font-medium text-text-body">{ctl.panel.caption}</span>
        </div>
      </div>
      </div>
    </div>
  );
}

/* (구 AdsCatalogGrid 좌 레일 2단 = 폐기 2026-07-20 사장님 "꾸역꾸역 한 줄에 넣지 말고
   대시보드처럼 위 텍스트 + 아래 목업" — page.tsx가 WRAP+SectionHead 문법으로 직접 조립) */

/* ═══════════ 8 · 월간 리포트 — v2(사장님 교정 2026-07-19): 헤더 = 톤앤매너 다크(#171717,
   원본 적갈색 모사 폐기) / 좌측 차례 패널 삭제(복잡 — 분량 증명은 마퀴+메타 줄) /
   고정 컷 = 지도 ⑥ '이번 달 목표와 할 일'(페이블 판단 채택: 헤딩 "다음 할 일" 정합, 매출 하락 숫자는 소구 약함.
   카드 구조 = SPEC 섹션9 실물: 아이콘+제목+본문. ⚠데모 스냅샷 원문은 GCS라 레포에 없음 — 본문은 데모 결) /
   섹션 넘버링 제거 / 나머지 5개 섹션 = 수직 마퀴(magicui) ═══════════

   ★2026-09-18 9섹션 → 6섹션 전면 교정 (사장님 낙점 "1번 = 정직하게 6개로")
   【왜】구 값(9개 섹션 · "오전 7시 5분" · "여덟 개 섹션")은 옛 SPEC 기준이고 실제 앱과 다르다.
     근거 = ngn_dashboard/.ngn-map/stage-6-report.json
       · 구성 = **6개 영역** #460 지난달 매출 / #461 손님이 어디서 와서 어떻게 샀나 /
         #462 어떤 상품이 잘됐나 / #463 광고 성과 / #464 시장에서 뭐가 팔리나(29CM) /
         #465 이번 달 목표와 할 일. **#466 = 7~9번은 읽기·쓰기 모두 거부.**
       · 시각 = #470 1일 06:00 숫자 합치기 → #471 06:20 스냅샷(해설 없음) →
         #472 **16:00 AI 해설 붙여 완성**(업체당 약 10분). **오전 7시 5분은 어디에도 없다.**
   【통합 방식】구 9개를 지도 6개에 합쳤다 — 유입채널+구매여정 → ② / 시장트렌드+시장비교 → ⑤ /
     익월목표+액션플랜 → ⑥(고정 컷). 마퀴 = ①~⑤ 5장, 고정 컷 = ⑥.
   ⚠ 앱이 또 바뀌면 여기도 바뀌어야 한다. 이 주석의 지도 번호부터 다시 읽을 것. */

/* ★2026-09-18 6개로 갱신 — 화면 미사용(아래 `void RPT_TOC`)이지만 되살릴 때 옛 8개가 나가면 안 된다.
   지도 stage-6-report.json #460~#465 순서 그대로. */
const RPT_TOC = ['지난달 매출', '손님 유입과 구매 여정', '어떤 상품이 잘됐나', '광고 성과', '시장에서 뭐가 팔리나', '이번 달 목표와 할 일'];
/* 마퀴 미니(액션 플랜 제외 8개) — 실물 시각물 실루엣 + 우측 AI 박스(전 섹션 2열 문법 반복 증명) */
/* 마퀴 미니 8장 — 스켈레톤 폐기(사장님 2026-07-19 "정상 리포트로"): 실수치·실차트·실상품·AI 한 줄.
   수치 정합 = 매출 34,055,000·주문 610(Sales01Card)·ROAS 641%(DashMini)·시나리오(ActionPlan) */
const RPT_MINI: { t: string; ai: string; body: React.ReactNode }[] = [
  {
    t: '지난달 매출', ai: '매출은 줄었지만 광고 효율은 좋아졌어요.',
    body: (
      <div className="grid grid-cols-3 gap-[3px]">
        {[['매출', '₩34.0M', '#dc3545', '▼6.9%'], ['주문', '610건', '#dc3545', '▼1.6%'], ['ROAS', '641%', '#28a745', '▲38%p']].map(([l, v, c, d]) => (
          <div key={l} className="border border-[#F0F0F0] px-1 py-[3px]">
            <p className="text-[6px] text-[#868E96]">{l}</p>
            <p className="text-[7.5px] font-bold text-[#212529]" style={EN}>{v}</p>
            <p className="text-[5.5px] font-bold" style={{ color: c as string, fontFamily: 'var(--font-en)' }}>{d}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    /* 구 '주요 유입 채널' + '고객 방문·구매 여정' 통합 = 지도 ②(#461 손님이 어디서 와서 어떻게 샀나) */
    t: '손님 유입과 구매 여정', ai: '인스타 유입은 늘었는데 장바구니 이탈도 늘었어요.',
    body: (
      <div className="space-y-[3px]">
        <div className="flex bg-[#003366] px-1 py-[2px] text-[5.5px] font-bold text-white"><span className="flex-1">채널</span><span className="w-7 text-right">유입수</span><span className="w-6 text-right">비중</span></div>
        {[['네이버 검색', '4,120', '33%'], ['인스타그램', '3,610', '29%']].map(([c, n, r]) => (
          <div key={c} className="flex border-b border-[#F5F5F5] px-1 py-[2px] text-[6px] text-[#495057]"><span className="flex-1">{c}</span><span className="w-7 text-right" style={EN}>{n}</span><span className="w-6 text-right" style={EN}>{r}</span></div>
        ))}
        {/* 막대 색 = §8.17 팔레트로 교정(구 #8b5cf6 보라·#ec4899 핑크 = 색 3개 원칙 위반) */}
        {[['유입', '12,400', 92, '#1e293b'], ['장바구니', '980', 56, '#9fb6d4'], ['주문', '610', 30, '#0070f3']].map(([l, n, w, c]) => (
          <div key={l as string} className="flex items-center gap-1">
            <span className="w-[26px] shrink-0 text-[5.5px] text-[#868E96]">{l}</span>
            <span className="h-[7px]" style={{ width: `${w}%`, background: c as string, opacity: 0.75 }} />
            {/* nowrap = 좁은 칸에서 "12,400"이 두 줄로 깨지던 것 수정(2026-09-18 실측) */}
            <span className="whitespace-nowrap text-[5.5px] text-[#495057]" style={EN}>{n}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    t: '어떤 상품이 잘됐나', ai: '린넨 원피스가 구매·조회 모두 1위예요.',
    body: (
      <div className="space-y-[3px]">
        {[['린넨 원피스', 90], ['프린지 니트', 64], ['샴브레이 셔츠', 46]].map(([n, w]) => (
          <div key={n as string} className="flex items-center gap-1">
            <span className="w-[34px] shrink-0 truncate text-[5.5px] text-[#495057]">{n}</span>
            <span className="h-[6px] bg-[#9fb6d4]" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    /* 지도 ④(#463 광고 성과). 구 '시장 트렌드 확인'은 아래 '시장에서 뭐가 팔리나'로 합쳤다 */
    t: '광고 성과', ai: '영상 소재의 효율이 이미지보다 높아요.',
    body: (
      <div className="space-y-[2px]">
        {[['1', '여름 신상 15초 영상', '812%'], ['2', '원피스 단품 이미지', '641%'], ['3', '룩북 캐러셀', '397%']].map(([r, n, v]) => (
          <div key={r as string} className="flex items-center gap-1 border-b border-[#F5F5F5] py-[2px] text-[6px]">
            <span className="flex h-[8px] w-[8px] items-center justify-center bg-[#003366]/20 text-[5px] font-bold text-[#003366]" style={EN}>{r}</span>
            <span className="min-w-0 flex-1 truncate text-[#495057]">{n}</span>
            <span className="font-bold text-[#0070f3]" style={EN}>{v}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    /* 구 '시장 트렌드 확인' + '시장과 자사몰 비교' 통합 = 지도 ⑤(#464 시장에서 뭐가 팔리나, 29CM) */
    t: '시장에서 뭐가 팔리나', ai: '여름 원피스가 빠르게 오르고 있어요. 우리가 8% 저렴해요.',
    body: (
      <div className="space-y-[3px]">
        <div className="grid grid-cols-5 gap-[3px]">
          {['/img/ads/set-7.webp', '/img/ads/set-9.webp', '/img/ads/set-8.webp', '/img/ads/set-10.webp', '/img/unsplash/webp/photo-1434389677669-e08b4cac3105.webp'].map((im) => (
            <span key={im} className="relative block aspect-square overflow-hidden bg-[#fafafa]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im} alt="" className="h-full w-full object-cover" loading="lazy" />
            </span>
          ))}
        </div>
        <div className="flex border-b border-[#F5F5F5] px-1 py-[2px] text-[6px] text-[#495057]"><span className="flex-1 text-[#868E96]">평균가</span><span className="w-9 text-right" style={EN}>₩42,000</span><span className="w-9 text-right font-bold" style={EN}>₩38,600</span></div>
      </div>
    ),
  },
  /* 구 '익월 목표·시장 전망'은 고정 컷(RPT_PLAN = 지도 ⑥ 이번 달 목표와 할 일)에 흡수해 삭제 */
];
/* 텍스트 다이어트 처방2(2026-07-19): 모바일 = 첫 문장만(b2는 max-md:hidden). PC 카피 불변 */
const RPT_PLAN = [
  { icon: '🎯', title: '‘린넨 원피스’ 예산 집중', b1: '이번 달 ROAS가 가장 높았던 상품입니다.', b2: ' 다음 달 광고 예산을 20% 더 배정해 성수기 수요를 잡으세요.' },
  { icon: '🛒', title: '장바구니 이탈 회복', b1: '담김은 늘었지만 주문 전환이 줄었습니다.', b2: ' 이탈 고객 리타겟팅 광고를 켜 두세요.' },
];

/* 스탯 칩 3 — 모바일(가로)과 PC 레일(세로)이 공유하는 데이터
   ★2026-09-18 "9개의 섹션" → "6개의 섹션"(사장님 낙점 1안). 근거 = stage-6-report.json
   #460~#465 = 6개 영역 / #466 = 7~9번은 읽기·쓰기 모두 거부. 용어 = "섹션"(사장님 2026-07-20) */
const RPT_CHIPS = ['매월 1일 자동 도착', '6개의 섹션', '모든 섹션에 AI 분석'];

/** 리포트 사이드바 실물 — 모바일 원형(AdsReportScene)과 PC 2단(AdsReportGrid)이 공유(2026-07-20 ②) */
function RptSidebar({ inView, reduce }: { inView: boolean; reduce: boolean }) {
  const typed = RPT_PLAN[0].b1 + RPT_PLAN[0].b2;
  const b1Len = RPT_PLAN[0].b1.length;
  return (
        <div className="w-[440px] max-w-full bg-white" style={{ border: `1px solid ${C_BORDER}`, boxShadow: '0 6px 24px rgba(0,0,0,0.09)' }}>
          <div className="flex items-center justify-between bg-[#171717] px-4 py-3">
            <div>
              <p className="flex items-center gap-2 text-[12.5px] font-bold text-white">
                2026. 6 월간 리포트
                <span className="ads-pulse flex h-[14px] items-center bg-[#0070f3] px-1.5 text-[7.5px] font-bold text-white" style={EN}>NEW</span>
              </p>
              {/* ★2026-09-18 "오전 7시 5분" 삭제 — 근거 없음. 지도 #470~#472 = 1일 06:00 집계 ·
                  06:20 스냅샷(해설 없음) · 16:00 AI 해설 붙여 완성(업체당 약 10분). 시각을 약속하지 않는다 */}
              <p className="mt-0.5 text-[9px] font-medium text-white/70">매월 1일 업데이트</p>
            </div>
            <span className="text-[10px] font-medium text-white/65">데모 화면</span>
          </div>
          <div className="p-4">
            {/* 고정 컷 = 지도 ⑥(#465). 제목을 지도 영역명에 맞춤 — 구 "전략 액션 플랜"은 옛 SPEC 용어 */}
            <p className="text-[12px] font-bold tracking-[-0.01em] text-[#171717]">이번 달 목표와 할 일 <span className="ml-1 text-[9.5px] font-medium text-[#666]">이것부터 하세요</span></p>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {RPT_PLAN.map((c, ci) => (
                <div key={c.title} className="border border-[#eeeeee] bg-white p-2.5">
                  <p className="flex items-center gap-1.5 border-b border-[#f0f0f0] pb-1.5">
                    <span className="text-[13px] leading-none">{c.icon}</span>
                    <span className="text-[10.5px] font-bold leading-[1.3] tracking-[-0.01em] text-[#171717]">{c.title}</span>
                  </p>
                  <p className="mt-1.5 min-h-[52px] text-[9.5px] font-medium leading-[1.6] text-[#495057] max-md:min-h-0">
                    {ci === 0 ? (
                      <>
                        {typed.split('').map((ch, i) => (
                          <motion.span key={i} className={i >= b1Len ? 'max-md:hidden' : undefined} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={reduce ? { duration: 0 } : { duration: 0, delay: 0.7 + i * 0.05 }}>{ch}</motion.span>
                        ))}
                        <motion.span aria-hidden className="ml-[2px] inline-block h-[10px] w-[1.5px] bg-[#171717]/60 align-middle" animate={reduce ? { opacity: 0.5 } : { opacity: [1, 0, 1] }} transition={reduce ? undefined : { repeat: Infinity, duration: 1.1, ease: 'linear' }} />
                      </>
                    ) : (
                      <>
                        {c.b1}
                        <span className="max-md:hidden">{c.b2}</span>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
            {/* AI 분석 문법 각주 — 실물(#003366 좌보더) */}
            <div className="mt-2 border-l-[3px] border-[#003366] bg-[#F8F9FA] px-3 py-2">
              {/* 고정 컷 1개(이번 달 목표와 할 일) + 도는 카드 5개 = 6개. "여덟 개"는 구 9섹션 시절 값 */}
              <p className="text-[9.5px] font-medium leading-[1.6] text-[#495057]"><b className="font-bold text-[#003366]">AI 분석</b> — 아래 섹션의 숫자를 모두 읽고 내린 결론입니다.</p>
            </div>
            {/* 나머지 8개 장 — 수직 마퀴(분량 증명).
                2026-07-20 사장님 "페이드 싫음 → 선명한 그림자로": 흰 그라디언트 페이드 2개 폐기,
                고정 컷이 마퀴 위에 드리우는 또렷한 inset 그림자 + 상하 헤어라인 경계 */}
            <div className="lab-sources-scope relative mt-2 h-[190px] overflow-hidden border-y border-[#ececec]">
              {/* 32s → 24s : 카드가 8→5개로 줄어 같은 속도를 유지하려면 한 바퀴도 짧아져야 한다 */}
              <Marquee vertical className="h-full p-0 [--duration:24s] [--gap:0.5rem]">
                {RPT_MINI.map((m) => (
                  <div key={m.t} className="grid grid-cols-[1fr_86px] gap-1.5">
                    <div className="border border-[#f0f0f0] bg-white p-2">
                      <p className="mb-1.5 text-[9px] font-bold text-[#003366]">{m.t}</p>
                      {m.body}
                    </div>
                    <div className="border-l-2 border-[#003366]/60 bg-[#F8F9FA] p-1.5">
                      <p className="text-[7.5px] font-bold text-[#003366]/70">AI 분석</p>
                      <p className="mt-1 text-[6.5px] font-medium leading-[1.55] text-[#495057]">{m.ai}</p>
                    </div>
                  </div>
                ))}
              </Marquee>
              <div aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 5px 6px -4px rgba(0,0,0,0.16), inset 0 -5px 6px -4px rgba(0,0,0,0.16)' }} />
            </div>
          </div>
        </div>
  );
}

export function AdsReportScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="w-full max-w-[980px]">
      <div
        className="relative flex justify-center px-8 py-12 max-md:px-4 max-md:py-8"
        style={{
          background: '#FAFAFA',
          backgroundImage: 'radial-gradient(circle, #EAEAEA 1px, transparent 1.4px)',
          backgroundSize: '30px 30px',
          border: `1px solid ${C_BORDER}`,
        }}
      >
        <RptSidebar inView={inView} reduce={!!reduce} />
      </div>
      {/* 스탯 칩 3 — 소구 정보를 주석이 아니라 디자인 요소로(사장님 2026-07-19) */}
      <div className="relative -mt-6 flex justify-center gap-2 pb-2 max-md:flex-wrap max-md:gap-1.5">
        {RPT_CHIPS.map((t) => (
          <span key={t} className="flex h-[34px] items-center gap-2 border bg-white px-4 text-[12.5px] font-bold tracking-[-0.01em] text-text-primary max-md:h-[30px] max-md:px-3 max-md:text-[11px]" style={{ borderColor: C_BORDER, boxShadow: C_SHADOW }}>
            <span className="rounded-dot h-[6px] w-[6px] shrink-0 bg-[#0070f3]" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 리포트 PC = §8.16 Grid Occupancy 2단(2026-07-20 ② — 세로 벽돌 해소):
    12열×6행, 좌 헤딩 레일+스탯 칩 세로 c[1,5] | 우 목업 확대 c[5,13].
    목업 확대 = [zoom](내부 비례 유지 — §8.18 역방향 함정 회피). 모바일 = AdsReportScene 원형 불변 */
/* 목업 +30%(사장님 2026-07-20 "섹션 폭 늘어나도 좋으니") — zoom 1.15→1.5, 그리드 1200→1320·6→7행 */
const RPT_AREAS: GridArea[] = [
  { key: 'rpt-rail', c: [1, 5], r: [1, 8], className: 'flex items-center' },
  { key: 'rpt-stage', c: [5, 13], r: [1, 8], className: 'flex items-center justify-center' },
];
export function AdsReportGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = !!useReducedMotion();
  return (
    <div ref={ref} className="mx-auto hidden w-full max-w-[1320px] md:block">
      <OccupancyGrid
        cols={12}
        rows={7}
        areas={RPT_AREAS}
        mobile={false}
        render={(key) =>
          key === 'rpt-rail' ? (
            <div className="px-8 lg:px-12">
              <Eyebrow label="Report" />
              <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.04em] leading-[1.26] text-balance text-text-primary">{report.heading}</h2>
              <p className="mt-4 max-w-[460px] text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-balance text-[#4f4f4f] md:leading-[1.35]">{report.body}</p>
              {/* 스탯 칩 3 = 레일 세로 스택(승인 계획 ②) */}
              <div className="mt-8 flex w-fit flex-col gap-2.5">
                {RPT_CHIPS.map((t) => (
                  <span key={t} className="flex h-[36px] items-center gap-2 border bg-white px-4 text-[13px] font-bold tracking-[-0.01em] text-text-primary" style={{ borderColor: C_BORDER, boxShadow: C_SHADOW }}>
                    <span className="rounded-dot h-[6px] w-[6px] shrink-0 bg-[#0070f3]" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6">
              <div
                className="flex w-full items-center justify-center py-7"
                style={{
                  background: '#FAFAFA',
                  backgroundImage: 'radial-gradient(circle, #EAEAEA 1px, transparent 1.4px)',
                  backgroundSize: '30px 30px',
                  border: `1px solid ${C_BORDER}`,
                }}
              >
                <div className="[zoom:1.5]"><RptSidebar inView={inView} reduce={reduce} /></div>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}

/* (RPT_TOC = 차례 데이터 보존 — 좌측 패널 부활 대비) */
void RPT_TOC;


/* ═══════════ 9 · 시장 흐름 — 자기 설명하는 2×2 실물 카드(안A, 사장님 2026-07-19 "하부 섹션
   각각이 뭔지 보여줘라" — 이미지 나열 반려). 카드 = [제목+한 줄] + 그 기능의 실물 미니어처:
   ①베스트 랭킹 = 순위 리스트 3행(썸·순위·델타) ②경쟁 비교 = 우리 상품 ↔ 시장 유사 상품 매칭(B6 실물:
   관련도순 추천) ③검색량 = 30일 라인 2선(우리/경쟁) ④촬영 레퍼런스 = 이미지 벤치마크 그리드(§6.6).
   ⛔이미지+아이콘 나열 금지 — 미니어처는 전부 실제 UI 형태 ═══════════ */

/* 실물 데이터(SPEC_TREND §4.3~4.6 재현): 변동 색 = 스펙 원문(급상승 #ef4444 · 신규 #22c55e · 하락 #3b82f6),
   "자사" 배지 = 스펙 원문 보라 그라데이션 → §7-7 금지라 다크 필 재해석(촬영 레퍼런스 선례) */
/* 이미지 = 라벨 없는 스톡만(사장님 2026-07-20 "실제 상호 이미지 금지" — set-1(리바이스)·set-6 폐기),
   브랜드 = 전부 가공명, 자사 = "누구나 어패럴"(사장님 지정) */
const MK_RANK = [
  { r: 1, img: '/img/unsplash/webp/photo-1485968579580-b6d095142e6e.webp', brand: '어반노트', name: '체크 셔츠 재킷', price: '₩89,000', d: '+3', c: '#ef4444', mine: false },
  { r: 2, img: '/img/unsplash/webp/photo-1434389677669-e08b4cac3105.webp', brand: '누구나 어패럴', name: '크림 프린지 니트', price: '₩59,000', d: 'NEW', c: '#22c55e', mine: true },
  { r: 3, img: '/img/unsplash/webp/photo-1523381210434-271e8be1f52b.webp', brand: '코튼무드', name: '피그먼트 코튼 티셔츠', price: '₩29,000', d: '▼1', c: '#3b82f6', mine: false },
];
const MK_TABS = ['전체', '원피스', '니트웨어', '아우터'];
const MK_FILTERS = [
  { k: '전체', c: '#171717' },
  { k: '급상승', c: '#ef4444' },
  { k: '신규진입', c: '#22c55e' },
  { k: '순위하락', c: '#3b82f6' },
];
const MK_QUERIES = [
  { r: 1, q: '린넨 원피스', imp: '12,400', ctr: '3.2%', clicks: '398' },
  { r: 2, q: '여름 원피스 추천', imp: '8,910', ctr: '2.1%', clicks: '187' },
  { r: 3, q: '누구나 어패럴', imp: '4,120', ctr: '6.8%', clicks: '280' },
];

/* 다크 실물 창 팔레트 — 실기기 트렌드 페이지(hub.css 다크 테마) 근사. §7-8 저대비 금지: 본문 흰 85/55 이상 */
const TR_D = { bg: '#131316', card: 'rgba(255,255,255,0.045)', line: 'rgba(255,255,255,0.09)' };

export function AdsMarketScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const CARD_HEAD = (t: string, d: string) => (
    <div className="mb-4">
      <p className="text-[15px] font-bold tracking-[-0.01em] text-text-primary">{t}</p>
      <p className="mt-0.5 text-[12.5px] font-medium leading-[1.5] text-text-weak">{d}</p>
    </div>
  );
  return (
    <div ref={ref} className="w-full">
      {/* ═══ ① 주간 베스트 랭킹 = PC 트렌드 페이지 실물 재현(2026-07-20 사장님 "실기기 UI만 못해" →
          실기기 리서치: next trend/[platform]/page.tsx 실코드 — 필터바(카테고리 칩+타입 도트 3)·주간 행·
          상품 카드(이미지 위 N위 배지+▲변동 배지+MY BRAND 태그, 브랜드/상품명/N위←M위/가격)·
          우측 "인사이트" 사이드바(키워드/자사몰/경쟁사 탭 + Material/Mood 분석 카드). 다크 테마 = 실물 유지) ═══ */}
      <div className="overflow-hidden" style={{ background: TR_D.bg, border: '1px solid #E3E3E3', boxShadow: '0 6px 24px rgba(0,0,0,0.09)' }}>
        {/* 필터 바 — 좌 카테고리 칩 / 우 트렌드 타입 3(도트 색 = 실물: 급상승 빨강·신규 초록·하락 파랑) */}
        <div className="flex flex-wrap items-center gap-1.5 border-b px-4 py-2.5" style={{ borderColor: TR_D.line }}>
          {MK_TABS.map((t, i) => (
            <span key={t} className={`flex h-[24px] items-center px-2.5 text-[11px] font-semibold ${i === 0 ? 'bg-white text-[#131316]' : 'text-white/55'}`} style={i === 0 ? undefined : { border: `1px solid ${TR_D.line}` }}>{t}</span>
          ))}
          <span className="ml-auto flex items-center gap-1 max-md:hidden">
            {MK_FILTERS.slice(1).map((f, i) => (
              <span key={f.k} className={`flex h-[24px] items-center gap-1.5 px-2 text-[10.5px] font-semibold ${i === 0 ? 'text-white' : 'text-white/45'}`} style={i === 0 ? { border: '1px solid rgba(255,255,255,0.25)' } : undefined}>
                <span className="rounded-dot h-[6px] w-[6px] shrink-0" style={{ background: f.c }} />
                {f.k}
              </span>
            ))}
          </span>
        </div>
        {/* 주간 정보 행 — 실물 weekrow(수집 주기 = 스펙 §4.1 매주 월요일) */}
        <div className="flex items-center justify-between px-4 py-2 text-[10.5px] font-medium text-white/45">
          <span>29CM · 7월 2주차 · 마지막 갱신 7.14</span>
          <span>매주 월요일 자동 수집</span>
        </div>
        {/* 본문 = 좌 상품 카드 그리드 | 우 인사이트 사이드바 */}
        <div className="flex max-md:block">
          <div className="grid flex-1 grid-cols-3 gap-2.5 p-4 pt-1 max-md:grid-cols-3 max-md:gap-1.5 max-md:p-3">
            {MK_RANK.map((it, i) => (
              <div key={it.r} className="overflow-hidden" style={{ background: TR_D.card, border: `1px solid ${it.mine ? 'rgba(77,159,255,0.55)' : TR_D.line}` }}>
                <span className="relative block aspect-[3/4] overflow-hidden bg-[#26262b]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.img} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute left-1.5 top-1.5 flex h-[18px] items-center bg-white px-1.5 text-[10px] font-bold text-[#131316]">{it.r}위</span>
                  <span className="absolute right-1.5 top-1.5 flex h-[18px] items-center px-1.5 text-[9.5px] font-bold text-white" style={{ background: it.c, fontFamily: 'var(--font-en)' }}>{it.d}</span>
                  {it.mine && <span className="absolute bottom-1.5 left-1.5 flex h-[16px] items-center bg-[#0070f3] px-1.5 text-[8px] font-bold tracking-[0.04em] text-white" style={EN}>MY BRAND</span>}
                </span>
                <div className="px-2.5 py-2">
                  <p className="truncate text-[9.5px] font-medium text-white/50">{it.brand}</p>
                  <p className="mt-0.5 truncate text-[11.5px] font-bold text-white/90">{it.name}</p>
                  {/* 변동 메타 — 실물 "N위 ← M위"의 ← 가 흐릿(사장님 2026-07-20) → 지난주 → 이번주 방향 +
                      확정 화살 문법(짧은 선+채운 삼각) 미니로 재디자인, 대비 70% */}
                  {/* ⚠ 모바일(390)에서 카드가 좁아 "₩89,000"이 "₩89 / ,000"으로 깨지던 것 수정(2026-09-18 실측).
                      nowrap만 걸면 이번엔 순위 화살표와 겹친다 — 한 줄에 둘 다 들어갈 폭이 없다.
                      그래서 모바일은 세로로 쌓고(순위 위 / 가격 아래), PC는 기존 좌우 배치 그대로 둔다. */}
                  <p className="mt-1 flex items-center justify-between gap-1.5 max-md:flex-col max-md:items-start max-md:gap-0.5">
                    {it.d === 'NEW' ? (
                      <span className="min-w-0 text-[9.5px] font-semibold text-white/70">신규 진입</span>
                    ) : (
                      <span className="flex min-w-0 items-center gap-[5px] text-[10px] font-semibold text-white/70" style={EN}>
                        {it.r + (it.d.startsWith('+') ? 3 : -1)}위
                        <svg width="13" height="8" viewBox="0 0 13 8" aria-hidden className="shrink-0"><line x1="0.5" y1="4" x2="7" y2="4" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.2" /><path d="M7 1.2L12.4 4 7 6.8z" fill="#ffffff" fillOpacity="0.7" /></svg>
                        <span className="text-white">{it.r}위</span>
                      </span>
                    )}
                    <span className="shrink-0 whitespace-nowrap text-[11px] font-bold text-white" style={EN}>{it.price}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* 인사이트 사이드바(실물: 키워드/자사몰/경쟁사 탭 + AI 분석 리포트 Material/Mood) */}
          <div className="w-[236px] shrink-0 border-l max-md:w-full max-md:border-l-0 max-md:border-t" style={{ borderColor: TR_D.line }}>
            <div className="flex items-center justify-between px-3.5 pb-2 pt-3">
              <span className="text-[12px] font-bold text-white">인사이트</span>
              <span className="flex h-[14px] items-center bg-[#171717] px-1.5 text-[7.5px] font-bold text-white" style={{ ...EN, border: '1px solid rgba(255,255,255,0.25)' }}>AI</span>
            </div>
            <div className="flex gap-1 px-3.5">
              {['키워드', '자사몰', '경쟁사'].map((t, i) => (
                <span key={t} className={`flex h-[21px] items-center px-2 text-[10px] font-semibold ${i === 0 ? 'bg-white text-[#131316]' : 'text-white/50'}`} style={i === 0 ? undefined : { border: `1px solid ${TR_D.line}` }}>{t}</span>
              ))}
            </div>
            <div className="space-y-2 p-3.5">
              <div className="p-2.5" style={{ background: TR_D.card, border: `1px solid ${TR_D.line}` }}>
                <p className="text-[9px] font-bold uppercase tracking-[0.06em] text-white/70" style={EN}>Material Trend</p>
                <p className="mt-1 text-[10px] font-medium leading-[1.55] text-white/60">린넨·시어서커처럼 통기성 좋은 소재가 상위권을 지키고 있어요.</p>
              </div>
              <div className="p-2.5" style={{ background: TR_D.card, border: `1px solid ${TR_D.line}` }}>
                <p className="text-[9px] font-bold uppercase tracking-[0.06em] text-white/70" style={EN}>Mood &amp; Style</p>
                <p className="mt-1 text-[10px] font-medium leading-[1.55] text-white/60">화이트·크림 톤의 미니멀 리조트 룩이 강세예요.</p>
              </div>
              {/* 자사몰 진입 미니(실물 MY BRAND 섹션 — 자사 상품이 베스트에 들면 자동 표시) */}
              <div className="p-2.5" style={{ background: TR_D.card, border: '1px solid rgba(77,159,255,0.4)' }}>
                <p className="text-[9px] font-bold uppercase tracking-[0.06em] text-[#4d9fff]" style={EN}>My Brand</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="relative block h-[34px] w-[28px] shrink-0 overflow-hidden bg-[#26262b]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/img/unsplash/webp/photo-1434389677669-e08b4cac3105.webp" alt="" className="h-full w-full object-cover" loading="lazy" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[10px] font-bold text-white/90">크림 프린지 니트</span>
                    <span className="block text-[9.5px] font-medium text-white/55">니트웨어 2위 신규 진입</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* (창 아래 회색 캡션 = 삭제 — 사장님 2026-07-20 "작은 글씨는 빼거나 디자인하거나" 공통 원칙.
          정보는 목업 실물이 이미 말함: 주간 행 "매주 월요일 자동 수집" + MY BRAND 강조) */}

      {/* ═══ 보조 3기능 = 실물 트렌드 하위 페이지 1:1(이미지 벤치마크 · 네이버 검색량 · 구글 서치콘솔) ═══ */}
      <div className="mt-5 grid grid-cols-3 gap-4 max-md:grid-cols-1">
        {/* ② AI 이미지 벤치마크(스펙 §6: 자사 베스트 탭 → AI 키워드 → 유사 이미지 그리드) */}
        <div className="bg-white p-5" style={{ border: '1px solid #ECECEC' }}>
          {CARD_HEAD(market.items[1].title, market.items[1].desc)}
          <div className="flex items-center gap-1.5">
            <span className="flex h-[22px] items-center gap-1 bg-[#171717] px-2 text-[10px] font-bold text-white"><span style={EN}>1</span> 린넨 원피스</span>
            <span className="flex h-[22px] items-center gap-1 px-2 text-[10px] font-semibold text-[#666]" style={{ border: '1px solid #ECECEC' }}><span style={EN}>2</span> 프린지 니트</span>
          </div>
          <p className="mb-1.5 mt-2.5 flex items-center gap-1.5">
            <span className="flex h-[14px] items-center bg-[#171717] px-1 text-[8px] font-bold text-white" style={EN}>AI</span>
            <span className="text-[9px] font-bold tracking-[0.02em] text-[#666]">추출한 키워드</span>
          </p>
          <div className="mb-2.5 flex flex-wrap gap-1">
            {['wrap dress', 'linen', 'floral'].map((k) => (
              <span key={k} className="flex h-[19px] items-center bg-[#FAFAFA] px-1.5 text-[9.5px] font-semibold text-[#333]" style={{ ...EN, border: '1px solid #ECECEC' }}>{k}</span>
            ))}
          </div>
          {/* 모바일도 4×1(사장님 2026-07-20 "2×2는 너무 커") */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* 순위 배지 = 다크 창 랭킹 카드와 동일 문법(흰 필+검정 N위 — 사장님 2026-07-20 "찌그러졌어" 재디자인) */}
            {[
              { img: '/img/ads/set-7.webp', rank: '1위', pf: '29CM', likes: '2,481' },
              { img: '/img/ads/set-9.webp', rank: '3위', pf: 'Ably', likes: '1,904' },
              { img: '/img/ads/set-8.webp', rank: '6위', pf: '29CM', likes: '1,527' },
              { img: '/img/ads/set-10.webp', rank: '9위', pf: 'Ably', likes: '983' },
            ].map((it) => (
              <div key={it.img} className="bg-white" style={{ border: '1px solid #ECECEC' }}>
                <span className="relative block aspect-[3/4] overflow-hidden bg-[#fafafa]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.img} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute left-1 top-1 flex h-[16px] items-center bg-white px-1.5 text-[9px] font-bold text-[#131316]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.18)' }}>{it.rank}</span>
                </span>
                <p className="flex items-center justify-between px-1.5 py-1">
                  <span className="text-[7px] font-bold text-[#333]" style={EN}>{it.pf}</span>
                  <span className="flex items-center gap-0.5 text-[6.5px] text-[#666]" style={EN}>
                    <svg width="7" height="7" viewBox="0 0 16 16" fill="none" stroke="#666" strokeWidth="1.6" aria-hidden><path d="M8 13.5S2.5 10.2 2.5 6.3A3.3 3.3 0 018 4.2a3.3 3.3 0 015.5 2.1c0 3.9-5.5 7.2-5.5 7.2z" strokeLinejoin="round" strokeLinecap="round" /></svg>
                    {it.likes}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ③ 네이버 검색량(스펙 §7.3~7.4: 30일 추이 + 월간 브랜드 비교, 자사 강조) */}
        <div className="bg-white p-5" style={{ border: '1px solid #ECECEC' }}>
          {CARD_HEAD(market.items[2].title, market.items[2].desc)}
          <div className="border border-[#F0F0F0] p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#333]"><span className="h-[3px] w-[14px] bg-[#0070f3]" />누구나 어패럴</span>
              <span className="text-[9.5px] text-[#666]" style={EN}>최근 30일</span>
            </div>
            <svg className="mt-2 h-[64px] w-full" viewBox="0 0 300 84" fill="none" preserveAspectRatio="none" aria-hidden>
              {[21, 42, 63].map((y) => <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#F3F4F6" strokeWidth="1" />)}
              <path d="M0 66C25 62 40 66 62 60C88 53 102 56 128 50C152 45 168 49 192 41C214 34 232 38 254 28C272 20 288 21 300 16L300 84L0 84Z" fill="#0070f3" opacity="0.05" />
              <motion.path d="M0 66C25 62 40 66 62 60C88 53 102 56 128 50C152 45 168 49 192 41C214 34 232 38 254 28C272 20 288 21 300 16" stroke="#0070f3" strokeWidth="2.2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={reduce ? { duration: 0 } : { duration: 1.2, ease: 'easeOut', delay: 0.3 }} />
              <circle cx="300" cy="16" r="3" fill="#0070f3" />
            </svg>
            <div className="mt-1 flex justify-between text-[8.5px] text-[#868E96]" style={EN}><span>6.19</span><span>7.3</span><span>7.18</span></div>
          </div>
          <div className="mt-2 space-y-1.5">
            {[
              { r: 1, n: '누구나 어패럴', v: '34,200', mine: true },
              { r: 2, n: '어반노트', v: '28,800', mine: false },
            ].map((b) => (
              <p key={b.r} className="flex items-center gap-2 border border-[#F0F0F0] px-2.5 py-[7px]">
                <span className="w-[10px] shrink-0 text-[11px] font-bold text-[#171717]" style={EN}>{b.r}</span>
                <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-[#333]">{b.n}</span>
                {b.mine && <span className="flex h-[15px] shrink-0 items-center bg-[#171717] px-1.5 text-[8px] font-bold text-white">자사</span>}
                <span className="shrink-0 text-[11px] font-bold text-[#171717]" style={EN}>{b.v}</span>
              </p>
            ))}
          </div>
          <p className="mt-2 text-[10px] font-medium text-[#999]">월간 검색량 · PC와 모바일을 나눠 봅니다</p>
        </div>

        {/* ④ 구글 검색 유입(스펙 §7.2 서치콘솔: 검색어·노출·CTR·클릭, 최근 28일) */}
        <div className="bg-white p-5" style={{ border: '1px solid #ECECEC' }}>
          {CARD_HEAD(market.items[3].title, market.items[3].desc)}
          <div className="space-y-1.5">
            {MK_QUERIES.map((q) => (
              <div key={q.r} className="flex items-center gap-2.5 border border-[#F0F0F0] px-2.5 py-[8px]">
                <span className="w-[10px] shrink-0 text-[11px] font-bold text-[#171717]" style={EN}>{q.r}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11.5px] font-semibold text-[#333]">{q.q}</span>
                  <span className="mt-0.5 block text-[9.5px] font-medium text-[#999]" style={EN}>노출 {q.imp} · CTR {q.ctr}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[13px] font-bold text-[#0070f3]" style={EN}>{q.clicks}</span>
                  <span className="block text-[8.5px] font-medium text-[#999]">클릭</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] font-medium text-[#999]">구글 서치콘솔 · 최근 28일</p>
        </div>
      </div>
    </div>
  );
}


/* ═══════════ 10 · 판매채널(Stores) v2 — "로우 데이터 → 인사이트"(사장님 재정의 2026-07-19:
   단순 시각화는 메리트 없음 — 엑셀이 못 하는 것 = ①기간 자르기 ②채널 갈라 보기 ③추이 인사이트).
   좌 = 로우 데이터 시트(날짜|판매처|매출 그대로 쌓임) → 우 = 분석 화면(기간 셀렉트 + 채널 필터 칩
   자동 순환 + 월별×채널 그룹 바차트 하이라이트 + 인사이트 문장 교체 — 리포트 AI 문법) ═══════════ */

const ST_RAW = [
  ['6/03', '무신사', '420,000'],
  ['6/03', '지그재그', '285,000'],
  ['6/04', '29CM', '152,000'],
  ['6/05', '무신사', '610,000'],
  ['6/05', '에이블리', '98,000'],
  ['6/06', '지그재그', '330,000'],
  ['6/07', '29CM', '204,000'],
];
/* 채널 팔레트 = 모노+블루(§7 — 파스텔·보라 금지) */
const ST_CH = [
  { name: '무신사', c: '#171717', vals: [34, 33, 32, 31, 30, 29] },
  { name: '지그재그', c: '#0070f3', vals: [12, 14, 17, 20, 24, 28] },
  { name: '29CM', c: '#4d9fff', vals: [8, 10, 12, 14, 18, 24] }, // 급상승 — 인사이트 문장과 정합
  { name: '에이블리', c: '#9AA3AD', vals: [6, 7, 8, 9, 10, 12] },
];
const ST_INSIGHT: Record<string, string> = {
  전체: '29CM 매출 비중이 빠르게 오르고 있어요.',
  지그재그: '지그재그가 3개월 연속 오르고 있어요.',
  무신사: '무신사 비중이 조금씩 줄고 있어요.',
};
const ST_CYCLE = ['전체', '지그재그', '무신사'];

export function AdsStoresScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const [sel, setSel] = React.useState(0);
  React.useEffect(() => {
    if (!inView || reduce) return;
    const t = setInterval(() => setSel((v) => (v + 1) % ST_CYCLE.length), 2000); // 순환 가속(사장님 2026-07-20 "더 빠르게")
    return () => clearInterval(t);
  }, [inView, reduce]);
  const active = ST_CYCLE[sel];
  return (
    /* 전폭 + PC 통확대(사장님 2026-07-20 "카드 키워줘, 좌우 여백 과다" — 구 max-w-980 해제 + zoom) */
    <div ref={ref} className="w-full">
      {/* PC = S4 그리드(패널 1fr 스냅 + 56px 화살 꽉, 2026-07-20 ⑥). 모바일 = 기존 세로 스택 불변 */}
      <div
        className="relative flex items-center justify-center gap-6 px-8 py-11 max-md:flex-col max-md:gap-5 max-md:px-4 max-md:py-8 md:grid md:grid-cols-[1fr_56px_1fr] md:gap-0 md:[zoom:1.18]"
        style={{
          background: '#FAFAFA',
          backgroundImage: 'radial-gradient(circle, #EAEAEA 1px, transparent 1.4px)',
          backgroundSize: '30px 30px',
          border: `1px solid ${C_BORDER}`,
        }}
      >
        {/* 좌 · 로우 데이터 시트(정리 안 된 기록 그대로) */}
        <div className="w-[360px] max-w-full shrink-0 bg-white md:w-auto md:min-w-0" style={{ border: `1px solid ${C_BORDER}`, boxShadow: '0 4px 14px rgba(0,0,0,0.07)' }}>
          <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: C_BORDER }}>
            <svg width="13" height="17" viewBox="0 0 16 20" aria-hidden>
              <path d="M10 0H2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-6-6z" fill="#0F9D58" />
              <path d="M10 0v6h6" fill="#87CEAC" />
              <path d="M4 9h8v7H4z" fill="#fff" />
              <path d="M4 11.3h8M4 13.6h8M7 9v7" stroke="#0F9D58" strokeWidth="0.9" />
            </svg>
            <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-[#333]">판매 기록</span>
            <span className="text-[8.5px] text-[#666]" style={EN}>Google Sheets</span>
          </div>
          <div className="grid grid-cols-[44px_1fr_1fr] text-[9.5px]">
            {['날짜', '판매처', '매출'].map((h) => (
              <span key={h} className="border-b border-r border-[#E8EAED] bg-[#F8F9FA] px-2 py-[4px] font-bold text-[#202124]">{h}</span>
            ))}
            {ST_RAW.map((r, i) => (
              <React.Fragment key={i}>
                <span className="border-b border-r border-[#E8EAED] px-2 py-[4px] text-[#5f6368]" style={EN}>{r[0]}</span>
                <span className="border-b border-r border-[#E8EAED] px-2 py-[4px] text-[#202124]">{r[1]}</span>
                <span className="border-b border-r border-[#E8EAED] px-2 py-[4px] text-right text-[#202124]" style={EN}>{r[2]}</span>
              </React.Fragment>
            ))}
          </div>
          <p className="px-3 py-2 text-[9px] font-medium text-[#666]">쌓인 기록 그대로 — 적기만 하면 됩니다</p>
        </div>

        {/* 화살(확정 문법) — PC = 56px 셀 꽉(양끝 5px) */}
        <div className="shrink-0 max-md:rotate-90 md:flex md:items-center md:justify-center md:self-stretch" aria-hidden>
          <svg width="56" height="14" viewBox="0 0 56 14" fill="none" className="hidden md:block"><line x1="5" y1="7" x2="43" y2="7" stroke="#171717" strokeWidth="1.6" /><path d="M43 1.8L51 7l-8 5.2z" fill="#171717" /></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none" className="md:hidden"><path d="M1 6h22.6M19.5 1.5L24 6l-4.5 4.5" stroke="#171717" strokeWidth="1.1" /></svg>
        </div>

        {/* 우 · 분석 화면 — 엑셀이 못 하는 것들(기간·필터·추이·인사이트) */}
        <div className="w-[360px] max-w-full shrink-0 bg-white md:w-auto md:min-w-0" style={{ border: `1px solid ${C_BORDER}`, boxShadow: '0 4px 14px rgba(0,0,0,0.07)' }}>
          <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: C_BORDER }}>
            <span className="text-[11px] font-bold text-[#171717]">판매채널 분석</span>
            <span className="text-[8.5px] text-[#666]">데모 화면</span>
          </div>
          <div className="px-3 pt-2.5">
            {/* 컨트롤 — 기간 셀렉트 + 채널 필터 칩(자동 순환) */}
            <div className="flex items-center gap-1.5">
              <span className="flex h-[22px] items-center gap-1 border border-[#E5E5E5] px-2 text-[9.5px] font-medium text-[#333]">
                최근 3개월
                <svg width="7" height="5" viewBox="0 0 8 5" fill="none" stroke="#999" strokeWidth="1.2" aria-hidden><path d="M1 1l3 3 3-3" /></svg>
              </span>
              <span className="flex gap-1">
                {ST_CYCLE.map((c) => (
                  <span key={c} className={`flex h-[22px] items-center px-2 text-[9.5px] font-semibold transition-colors duration-300 ${active === c ? 'bg-[#171717] text-white' : 'border border-[#E5E5E5] text-[#666]'}`}>{c}</span>
                ))}
              </span>
            </div>
            {/* 월별 × 채널 그룹 바차트 */}
            <div className="mt-3 border border-[#F0F0F0] p-2.5">
              <div className="flex items-end justify-between gap-1.5" style={{ height: 88 }}>
                {[3, 4, 5].map((m) => (
                  <div key={m} className="flex flex-1 items-end justify-center gap-[4px]">
                    {ST_CH.map((ch) => {
                      const dimmed = active !== '전체' && active !== ch.name;
                      return (
                        <motion.span
                          key={ch.name}
                          className="w-[13px] transition-opacity duration-300"
                          style={{ background: ch.c, opacity: dimmed ? 0.18 : 1, transformOrigin: 'bottom' }}
                          initial={{ scaleY: 0 }}
                          animate={inView ? { scaleY: 1 } : {}}
                          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: 'easeOut', delay: 0.2 + m * 0.06 }}
                        >
                          <span className="block" style={{ height: ch.vals[m] * 2.4 }} />
                        </motion.span>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-1 flex justify-between px-1 text-[8.5px] text-[#868E96]" style={EN}>
                {['4월', '5월', '6월'].map((m) => <span key={m} className="flex-1 text-center">{m}</span>)}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 border-t border-[#F5F5F5] pt-1.5">
                {ST_CH.map((ch) => (
                  <span key={ch.name} className="flex items-center gap-1 text-[8.5px] font-medium text-[#666]">
                    <span className="h-[7px] w-[7px]" style={{ background: ch.c }} />
                    {ch.name}
                  </span>
                ))}
              </div>
            </div>
            {/* 인사이트 — 다크 필 라벨 + 담백 텍스트(사장님 2026-07-19: 좌보더+회색 배경 = 전형적 AI 악센트 바 폐기) */}
            <div className="mb-3 mt-2.5 flex items-center gap-2 bg-[#171717] px-3 py-2">
              <span className="shrink-0 text-[9.5px] font-bold text-[#4d9fff]">인사이트</span>
              <p className="min-h-[16px] text-[11px] font-semibold leading-[1.5] text-white">{ST_INSIGHT[active]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════ 12 · 진화 — Ripple 무대(사장님 2026-07-19 "허술, 로고+애니메이션으로 재미있게. 유성 금지").
   갤러리 소스 = magicui Ripple(확장 파동 — "계속 더해진다" 은유) + ads-float 부유(히어로 검증 문법).
   매체 로고 = §7-7 공식 로고 재현 예외(TikTok·Pinterest·카카오·네이버 — 성과 API 공식 제공 4종 리서치 확정) ═══════════ */

const EV_MEDIA: { key: string; x: number; y: number; node: React.ReactNode }[] = [
  /* 링 위 정좌표(중앙 기준 px — r95 안링 · r145 바깥링, 대각 45° 배치. 사장님 2026-07-19 "궤도 확실하게") */
  {
    key: 'tiktok', x: -67, y: -67, // r95 · 135°
    node: (
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="11" fill="#010101" />
        <path fill="#fff" d="M16.6 8.2a3.6 3.6 0 0 1-2.1-2.4V5.4h-2.1v8a1.9 1.9 0 1 1-1.9-1.9c.2 0 .4 0 .5.1V9.4a4 4 0 1 0 3.5 4V10c.7.5 1.6.8 2.6.8V8.6c-.2 0-.4 0-.5-.4z" />
      </svg>
    ),
  },
  {
    key: 'pinterest', x: 103, y: -103, // r145 · 45°
    node: (
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="11" fill="#E60023" />
        <path fill="#fff" d="M12.2 5.5c-3.6 0-5.5 2.4-5.5 5 0 1.2.5 2.3 1.5 2.7.2.1.3 0 .4-.2l.2-.7c0-.2 0-.3-.1-.4-.4-.4-.6-1-.6-1.7 0-2 1.5-3.6 3.9-3.6 2.1 0 3.3 1.3 3.3 3 0 2.3-1 4.2-2.5 4.2-.8 0-1.4-.7-1.2-1.5l.6-2.3c.2-.7 0-1.4-.7-1.4-.6 0-1.1.6-1.1 1.5 0 .5.2.9.2.9l-.9 3.7c-.2 1-.1 2.2 0 2.4h.2c.1-.1 1-1.2 1.3-2.3l.4-1.7c.3.5.9.9 1.7.9 2.2 0 3.7-2 3.7-4.7 0-2-1.7-3.8-4.3-3.8z" />
      </svg>
    ),
  },
  {
    key: 'kakao', x: -103, y: 103, // r145 · 225°
    node: (
      <span className="flex h-[28px] w-[28px] items-center justify-center bg-[#FEE500]" style={{ borderRadius: 7 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#191919" d="M12 5c-4.4 0-8 2.7-8 6 0 2.1 1.4 3.9 3.5 5l-.9 3.2c0 .2.2.4.4.3l3.8-2.3c.4 0 .8.1 1.2.1 4.4 0 8-2.7 8-6.1S16.4 5 12 5z" />
        </svg>
      </span>
    ),
  },
  {
    key: 'naver', x: 67, y: 67, // r95 · 315°
    node: (
      <span className="flex h-[28px] w-[28px] items-center justify-center bg-[#03c75a]">
        <svg width="14" height="14" viewBox="0 0 12 12" fill="#fff" aria-hidden><path d="M1.5 1h3.2l2 3.4V1h3.8v10H7.3L5.3 7.6V11H1.5z" /></svg>
      </span>
    ),
  },
];

export function AdsEvolveScene() {
  /* 반원 구도(사장님 2026-07-19): NA(원형)가 하단 중앙, 궤도는 위로 반원만(히어로 하단 잘림 문법의 반전).
     위성 = 좌우 대칭 균등 각도(안링 ±45° · 바깥링 ±18°) — 링 교대 지그재그 */
  /* 바깥링 r145 위 4개 완전 균등(반원 180° 5등분 = 36° 간격: 36·72·108·144°) — 좌우 대칭 */
  const SATS: { key: number; x: number; y: number }[] = [
    { key: 2, x: -117, y: -85 },  // 카카오 · 144°
    { key: 0, x: -45, y: -138 },  // 틱톡 · 108°
    { key: 3, x: 45, y: -138 },   // 네이버 · 72°
    { key: 1, x: 117, y: -85 },   // 핀터레스트 · 36°
  ];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="lab-sources-scope relative h-[240px] w-full overflow-hidden bg-white max-md:h-[210px]" style={{ border: `1px solid ${C_BORDER}` }}>
      {/* 파동 — framer 단일 타임라인(사장님 2026-07-19 "싱크 안 맞아": CSS Ripple(2s)과 위성(2.7s)이
          다른 시계였음 → 파동 반지름 40→168px linear 2.4s, r145 도달 ≈ t+1.97s에 위성이 일제히 튐. 주기 3.0s 공통) */}
      <div className="absolute bottom-[34px] left-1/2" aria-hidden>
        <motion.span
          className="absolute block rounded-dot"
          style={{ width: 80, height: 80, marginLeft: -40, marginTop: -40, border: '1.5px solid #B9C0C9' }}
          animate={{ scale: [1, 4.2], opacity: [0.55, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'linear', repeatDelay: 0.6 }}
        />
      </div>
      {/* 궤도 중심 = 하단 중앙(NA 위치) */}
      <div className="absolute bottom-[34px] left-1/2" aria-hidden>
        <svg className="absolute -translate-x-1/2 -translate-y-1/2" width="340" height="340" viewBox="0 0 340 340" fill="none">
          <circle cx="170" cy="170" r="95" stroke="#D9DDE3" strokeWidth="1" strokeDasharray="3 5" />
          <circle cx="170" cy="170" r="145" stroke="#E4E7EB" strokeWidth="1" />
        </svg>
        {/* 위성 4 — 반원 위 좌우 대칭 */}
        {SATS.map((sPos, i) => {
          const m = EV_MEDIA[sPos.key];
          return (
            <div key={m.key} className="absolute" style={{ transform: `translate(calc(-50% + ${sPos.x}px), calc(-50% + ${sPos.y}px))` }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.16 }}
              >
                {/* 파동 리듬 펄스 — reduce 분기 제거(사장님 기기 = 시스템 모션 줄이기 → 분기가 정지 원인이었음 2026-07-19).
                    장식 모션이라 항상 동작 */}
                <motion.span
                  className="block"
                  animate={{ scale: [1, 1.18, 1], y: [0, -9, 0] }}
                  transition={{ repeat: Infinity, duration: 0.85, ease: 'easeOut', delay: 1.97, repeatDelay: 2.15 }}
                >
                  <span className="flex h-[58px] w-[58px] items-center justify-center bg-white" style={{ border: '1px solid #E0E3E8', boxShadow: '0 5px 14px rgba(0,0,0,0.1)', borderRadius: '50%' }}>
                    {m.node}
                  </span>
                </motion.span>
              </motion.div>
            </div>
          );
        })}
        {/* 중앙(하단) = NA 로고 — 원형(사장님 "동그라미로") */}
        <span className="absolute flex h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-white" style={{ border: `1px solid ${C_BORDER}`, boxShadow: '0 8px 22px rgba(0,0,0,0.1)', borderRadius: '50%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/brand/ad/symbol.svg" alt="누구나 광고" className="h-[38px] w-[38px]" />
        </span>
      </div>
    </div>
  );
}

/** 진화 로그 한 건 — New Media / Update (page.tsx 원형 발췌, PC 레일 공용) */
function EvLog({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div>
      <p className="flex items-center gap-2.5">
        <span className="flex h-[20px] shrink-0 items-center bg-[#171717] px-1.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-white" style={EN}>{tag}</span>
        <span className="text-[15px] font-bold tracking-[-0.01em] text-text-primary">{title}</span>
      </p>
      <p className="mt-1.5 text-[13.5px] font-medium leading-[1.6] text-text-weak">{body}</p>
    </div>
  );
}

/** 진화 PC = §8.16 2단(2026-07-20 ③): 좌 헤딩+New Media·Update 로그 레일 | 우 반원 460.
    모바일 = page.tsx 기존 세로 흐름 불변(md:hidden 분기) */
const EV_AREAS: GridArea[] = [
  { key: 'ev-rail', c: [1, 6], r: [1, 5], className: 'flex items-center' },
  { key: 'ev-stage', c: [6, 13], r: [1, 5], className: 'flex items-center justify-center' },
];
export function AdsEvolveGrid() {
  return (
    <div className="mx-auto hidden w-full max-w-[1200px] md:block">
      <OccupancyGrid
        cols={12}
        rows={4}
        areas={EV_AREAS}
        mobile={false}
        render={(key) =>
          key === 'ev-rail' ? (
            <div className="px-8 lg:px-12">
              <Eyebrow label="Evolve" />
              <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.04em] leading-[1.26] text-balance text-text-primary">{evolve.heading}</h2>
              <p className="mt-4 max-w-[460px] text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-balance text-[#4f4f4f] md:leading-[1.35]">{evolve.body}</p>
              <div className="mt-8 max-w-[440px] space-y-5">
                <EvLog tag="New Media" title={evolve.cards[0].title} body={evolve.cards[0].body} />
                <div className="border-t border-[#ECECEC] pt-5">
                  <EvLog tag="Update" title={evolve.cards[1].title} body={evolve.cards[1].body} />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-[400px] [zoom:1.15]"><AdsEvolveScene /></div>
          )
        }
      />
    </div>
  );
}
