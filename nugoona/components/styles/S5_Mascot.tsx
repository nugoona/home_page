'use client';

/**
 * S5_Mascot — 랜딩용 개념 그래픽 목업 · 스타일⑤ 캐릭터 마스코트(Duolingo형)
 *
 * 개념:  작고 귀여운 "누구나" 캐릭터가 사진을 집어 들고 → 뛰어가 → 검색창에 꽂아준다.
 *        꽂는 순간 검색 결과(노출)가 켜지고, 캐릭터가 폴짝 뛰며 좋아한다. 그리고 다음 사진을 위해
 *        처음으로 돌아가 무한 반복. "누구나 사진 4장이면 검색에 노출된다"를 5초에 이해시키는 친근 톤.
 *
 * 왜 이 스타일:  회로 다이어그램(노드-선)의 정서적 정반대. 각 단계를 캐릭터가 직접 데리고 다니며
 *        얼굴·표정으로 설명 → 친근하고 기억에 남는다. 브랜드명 "누구나"와 결이 맞는다.
 *
 * 시각 규칙:
 *   · 브랜드는 직각·미니멀이지만 캐릭터는 예외적으로 둥근 형태 허용(원·pill). 검색창/UI는 직각 유지.
 *   · accent = #0070f3 포인트. 결과 체크만 초록 최소 사용.
 *   · ⛔ 노드-선 다이어그램 금지. 순수 inline SVG로 캐릭터를 직접 그림(외부 에셋 0, 신규 라이브러리 0).
 *   · framer-motion 하나로 전 동작. 데스크/모바일 반응형(레이아웃 분기).
 *   · useInView 진입 시에만 재생 + prefers-reduced-motion 존중(정지 프레임).
 *
 * 재사용:  <MascotScene cfg={DESKTOP|MOBILE} active /> 로 레이아웃만 바꿔 어디든 이식 가능.
 */

import { useRef } from 'react';
import { motion, useInView, useReducedMotion, type Transition } from 'framer-motion';

/* ─── 팔레트 (캐릭터=accent 계열, UI=흐린 뼈대) ─────────────────────────── */
const ACCENT = '#0070f3'; // 브랜드 accent — 캐릭터 몸통
const ACCENT_DK = '#0356c9'; // 팔·다리·윤곽 그림자
const ACCENT_LT = '#e8f1ff'; // 배 무늬 등 밝은 면
const CHEEK = '#ff9aa8'; // 볼터치(마스코트 예외 — 소량)
const INK = '#1b2740'; // 눈동자·미소
const LINE = '#e2e5ea'; // UI 뼈대 테두리
const FIELD = '#f6f7f9'; // 검색 입력 필드
const TXT = '#9aa1ad'; // 흐린 라벨
const OK = '#12b76a'; // 결과 체크(초록 최소)
const WHITE = '#ffffff';

/* ─── 타임라인: 한 사이클의 정규화 구간(0~1) ──────────────────────────────
 *  t0 대기 → t1 집기시작 → t2 집음 → t3 검색창 도착 → t4 꽂음 → t5 결과+점프 정점
 *  → t6 착지(결과 유지) → t7 리셋(사라지며 처음으로) → t8 대기(사진 리스폰)               */
const T = [0, 0.1, 0.18, 0.48, 0.56, 0.66, 0.76, 0.88, 1] as const;
const LOOP = 6.2; // 초

/* 캐릭터: X=달리기 델타 / Y=집기 살짝+환호 점프 / opacity=리셋 시 페이드 */
const CHAR_Y = [0, 0, -3, 0, 0, -15, 0, 0, 0];
const CHAR_OP = [1, 1, 1, 1, 1, 1, 1, 0, 1];
/* 검색창: 꽂힌 순간 accent 테두리 + 결과 패널 등장 / 플레이스홀더는 반대로 */
const GLOW_OP = [0, 0, 0, 0, 1, 1, 1, 0, 0];
const RESULT_OP = [0, 0, 0, 0, 0, 1, 1, 0, 0];
const PLACE_OP = [1, 1, 1, 1, 0, 0, 0, 1, 1];
/* 사진: 축소되며 검색창에 흡수 */
const PHOTO_OP = [1, 1, 1, 1, 1, 0, 0, 0, 1];
const PHOTO_SC = [1, 1, 1, 1, 0.92, 0.5, 0.5, 1, 1];

/* ─── 레이아웃 설정 (재사용 — 이 객체만 바꾸면 어디든 이식) ──────────────── */
type Cfg = {
  vb: string;
  ground: number;
  char: { x: number; y: number; run: number };
  photo: { stack: [number, number]; carry: [number, number]; approach: [number, number]; slot: [number, number] };
  bar: { x: number; y: number; w: number; h: number };
  panel: { x: number; y: number; w: number; h: number };
  font: { lg: number; md: number; sm: number };
};

const DESKTOP: Cfg = {
  vb: '0 0 640 300',
  ground: 236,
  char: { x: 110, y: 190, run: 190 },
  photo: { stack: [80, 214], carry: [140, 150], approach: [330, 150], slot: [470, 150] },
  bar: { x: 372, y: 122, w: 234, h: 50 },
  panel: { x: 372, y: 184, w: 234, h: 64 },
  font: { lg: 13, md: 11, sm: 9 },
};

const MOBILE: Cfg = {
  vb: '0 0 360 300',
  ground: 236,
  char: { x: 46, y: 180, run: 120 },
  photo: { stack: [40, 206], carry: [82, 144], approach: [202, 144], slot: [268, 146] },
  bar: { x: 196, y: 118, w: 150, h: 46 },
  panel: { x: 196, y: 176, w: 150, h: 52 },
  font: { lg: 12, md: 9.5, sm: 8.5 },
};

/* animate 프롭 헬퍼: 재생 중이면 키프레임, 아니면 정지 프레임(첫 값) */
function play<V extends number>(active: boolean, frames: readonly V[]) {
  return active ? [...frames] : frames[0];
}
const loopTr = (extra?: Partial<Transition>): Transition => ({
  duration: LOOP,
  times: [...T],
  ease: 'easeInOut',
  repeat: Infinity,
  repeatType: 'loop',
  ...extra,
});

/* ─────────────────────── 캐릭터 (로컬 원점 = 몸통 중심) ─────────────────── */
function Mascot({ active }: { active: boolean }) {
  // 다리 스텝(항상 경쾌하게 · 독립 루프)
  const step = (phase: number): Transition => ({
    duration: 0.34,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'reverse',
    delay: phase,
  });
  const legStyle = (ox: number) => ({ transformBox: 'fill-box' as const, transformOrigin: `${ox}px 0px` });

  return (
    <g>
      {/* 다리 (뒤에서 앞으로 저으며 달리기) */}
      <motion.rect
        x={-11} y={26} width={7} height={16} rx={3.5} fill={ACCENT_DK}
        style={legStyle(-7.5)}
        animate={{ rotate: active ? [16, -16] : 0 }}
        transition={step(0)}
      />
      <motion.rect
        x={4} y={26} width={7} height={16} rx={3.5} fill={ACCENT_DK}
        style={legStyle(7.5)}
        animate={{ rotate: active ? [-16, 16] : 0 }}
        transition={step(0.17)}
      />
      {/* 발 */}
      <ellipse cx={-7.5} cy={43} rx={6} ry={3} fill={INK} />
      <ellipse cx={7.5} cy={43} rx={6} ry={3} fill={INK} />

      {/* 몸통 (둥근 blob) + 배 무늬 */}
      <rect x={-21} y={-16} width={42} height={46} rx={17} fill={ACCENT} />
      <ellipse cx={0} cy={8} rx={12} ry={15} fill={ACCENT_LT} />

      {/* 뒤팔(사진 뒤) */}
      <path d="M14 -12 Q26 -26 31 -40" stroke={ACCENT_DK} strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.85} />

      {/* 머리 */}
      <g>
        {/* 안테나(귀여움 포인트) */}
        <line x1={0} y1={-54} x2={0} y2={-62} stroke={ACCENT_DK} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={0} cy={-64} r={3.5} fill={ACCENT} stroke={WHITE} strokeWidth={1.5} />
        <circle cx={0} cy={-36} r={21} fill={ACCENT} />
        {/* 볼터치 */}
        <circle cx={-13} cy={-30} r={4} fill={CHEEK} opacity={0.6} />
        <circle cx={13} cy={-30} r={4} fill={CHEEK} opacity={0.6} />
        {/* 눈 (진행 방향=오른쪽 응시) + 깜빡임 */}
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={{ scaleY: active ? [1, 1, 0.1, 1, 1] : 1 }}
          transition={{ duration: 4.4, times: [0, 0.9, 0.94, 0.98, 1], ease: 'easeInOut', repeat: Infinity }}
        >
          <circle cx={-7} cy={-38} r={6} fill={WHITE} />
          <circle cx={9} cy={-38} r={6} fill={WHITE} />
          <circle cx={-5} cy={-37} r={3} fill={INK} />
          <circle cx={11} cy={-37} r={3} fill={INK} />
          <circle cx={-4} cy={-38.5} r={1} fill={WHITE} />
          <circle cx={12} cy={-38.5} r={1} fill={WHITE} />
        </motion.g>
        {/* 미소 */}
        <path d="M-6 -27 Q1 -20 8 -27" stroke={INK} strokeWidth={2.5} strokeLinecap="round" fill="none" />
      </g>

      {/* 앞팔(사진을 든 손) */}
      <path d="M14 -10 Q26 -28 30 -40" stroke={ACCENT} strokeWidth={7.5} strokeLinecap="round" fill="none" />
      <circle cx={30} cy={-40} r={5} fill={ACCENT_LT} stroke={ACCENT_DK} strokeWidth={1.5} />
    </g>
  );
}

/* ─────────────────────── 사진(폴라로이드) — 로컬 원점 중심 ──────────────── */
function Photo() {
  return (
    <g>
      <rect x={-17} y={-20} width={34} height={40} rx={2} fill={WHITE} stroke={LINE} strokeWidth={1.5} />
      {/* 사진 이미지 영역 — 미니 풍경(산+해)으로 "사진"임을 즉시 읽힘 */}
      <rect x={-13} y={-16} width={26} height={24} fill={ACCENT_LT} />
      <circle cx={5} cy={-10} r={3.5} fill={ACCENT} />
      <path d="M-13 8 L-4 -4 L2 3 L8 -6 L13 2 L13 8 Z" fill={ACCENT} opacity={0.6} />
      {/* 폴라로이드 하단 여백 */}
      <rect x={-13} y={11} width={17} height={4} fill={FIELD} />
    </g>
  );
}

/* ─────────────────────── 검색창 + 결과 패널 (직각·미니멀 유지) ──────────── */
function SearchArea({ cfg, active }: { cfg: Cfg; active: boolean }) {
  const { bar, panel, font } = cfg;
  const cy = bar.y + bar.h / 2;
  const mg = bar.x + 22; // 돋보기 중심

  return (
    <g>
      {/* 검색창 프레임 (직각) */}
      <rect x={bar.x} y={bar.y} width={bar.w} height={bar.h} rx={2} fill={WHITE} stroke={LINE} strokeWidth={1.5} />
      {/* 돋보기 */}
      <circle cx={mg} cy={cy} r={7} fill="none" stroke={TXT} strokeWidth={2} />
      <line x1={mg + 5} y1={cy + 5} x2={mg + 11} y2={cy + 11} stroke={TXT} strokeWidth={2} strokeLinecap="round" />
      {/* 플레이스홀더 (꽂기 전) */}
      <motion.text
        x={mg + 20} y={cy + font.md / 3} fontSize={font.md} fontWeight={600} fill={TXT}
        style={{ fontFamily: 'var(--font-kr)' }}
        animate={{ opacity: play(active, PLACE_OP) }}
        transition={loopTr()}
      >
        사진을 넣어 보세요
      </motion.text>

      {/* 꽂힌 순간: accent 테두리 강조 */}
      <motion.rect
        x={bar.x} y={bar.y} width={bar.w} height={bar.h} rx={2}
        fill="none" stroke={ACCENT} strokeWidth={2}
        animate={{ opacity: play(active, GLOW_OP) }}
        transition={loopTr()}
      />

      {/* 결과 패널 (사진→검색 노출) — 꽂힌 뒤 등장 */}
      <motion.g
        animate={active ? { opacity: RESULT_OP, y: [8, 8, 8, 8, 8, 0, 0, 8, 8] } : { opacity: 0, y: 8 }}
        transition={loopTr()}
      >
        <rect x={panel.x} y={panel.y} width={panel.w} height={panel.h} rx={2} fill={WHITE} stroke={LINE} strokeWidth={1.5} />
        {/* 결과 썸네일(꽂은 사진) */}
        <rect x={panel.x + 12} y={panel.y + 12} width={panel.h - 24} height={panel.h - 24} rx={2} fill={ACCENT_LT} stroke={LINE} strokeWidth={1} />
        <circle cx={panel.x + 12 + (panel.h - 24) * 0.62} cy={panel.y + 12 + (panel.h - 24) * 0.34} r={4} fill={ACCENT} />
        <path
          d={`M${panel.x + 15} ${panel.y + panel.h - 16} l7 -9 l5 5 l7 -8 l3 4 v8 Z`}
          fill={ACCENT} opacity={0.55}
        />
        {/* 결과 텍스트 라인 */}
        <rect x={panel.x + panel.h - 4} y={panel.y + 16} width={panel.w - panel.h - 40} height={font.sm} rx={1.5} fill="#d8dbe1" />
        <rect x={panel.x + panel.h - 4} y={panel.y + 16 + font.sm + 6} width={(panel.w - panel.h) * 0.5} height={font.sm - 1} rx={1.5} fill="#e6e8ec" />
        {/* 노출 완료 배지(초록 최소) */}
        <g transform={`translate(${panel.x + panel.w - 30}, ${panel.y + panel.h - 22})`}>
          <circle cx={0} cy={0} r={9} fill={OK} />
          <path d="M-4 0 l3 3 l5 -6" stroke={WHITE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <text
          x={panel.x + panel.h - 4} y={panel.y + panel.h - 18} fontSize={font.sm} fontWeight={700} fill={OK}
          style={{ fontFamily: 'var(--font-kr)' }}
        >
          검색 노출 완료
        </text>
      </motion.g>

      {/* 결과 등장 스파클(작은 accent 반짝) */}
      <motion.g
        animate={{ opacity: play(active, RESULT_OP), scale: active ? [0.4, 0.4, 0.4, 0.4, 0.4, 1.1, 1, 0.4, 0.4] : 0.4 }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        transition={loopTr()}
      >
        <g transform={`translate(${bar.x + bar.w - 16}, ${bar.y - 6})`} fill={ACCENT}>
          <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" />
        </g>
      </motion.g>
    </g>
  );
}

/* ─────────────────────── 한 장면(Scene) — 재사용 단위 ──────────────────── */
function MascotScene({ cfg, active }: { cfg: Cfg; active: boolean }) {
  const { char, photo, ground } = cfg;
  const photoX = [photo.stack[0], photo.carry[0], photo.carry[0], photo.approach[0], photo.slot[0], photo.slot[0], photo.slot[0], photo.stack[0], photo.stack[0]];
  const photoY = [photo.stack[1], photo.carry[1], photo.carry[1], photo.carry[1], photo.slot[1], photo.slot[1], photo.slot[1], photo.stack[1], photo.stack[1]];
  const charX = [0, 0, 0, char.run, char.run, char.run, char.run, 0, 0];

  return (
    <svg viewBox={cfg.vb} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="캐릭터가 사진을 검색창에 넣어 노출시키는 모습">
      {/* 바닥선 */}
      <line x1={0} y1={ground} x2={cfg.vb.split(' ')[2]} y2={ground} stroke={LINE} strokeWidth={1.5} />

      {/* 검색창 + 결과 */}
      <SearchArea cfg={cfg} active={active} />

      {/* 캐릭터 (기준 위치 → 달리기 델타 → 환호 점프) */}
      <g transform={`translate(${char.x}, ${char.y})`}>
        <motion.g
          animate={{ x: play(active, charX), opacity: play(active, CHAR_OP) }}
          transition={loopTr()}
        >
          {/* 그림자(달리기 따라 이동하되 점프엔 안 뜸) */}
          <ellipse cx={0} cy={ground - char.y} rx={26} ry={5} fill={INK} opacity={0.1} />
          <motion.g
            animate={{ y: play(active, CHAR_Y) }}
            transition={loopTr()}
          >
            <Mascot active={active} />
          </motion.g>
        </motion.g>
      </g>

      {/* 사진 (바닥→손→검색창으로 이동·흡수) */}
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={false}
        animate={{
          x: play(active, photoX),
          y: play(active, photoY),
          opacity: play(active, PHOTO_OP),
          scale: play(active, PHOTO_SC),
        }}
        transition={loopTr()}
      >
        <Photo />
      </motion.g>
    </svg>
  );
}

/* ─────────────────────── 공개 컴포넌트 ─────────────────────────────────── */
export default function S5Mascot() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });
  const reduced = useReducedMotion();
  const active = inView && !reduced;

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div className="hidden md:block">
        <MascotScene cfg={DESKTOP} active={active} />
      </div>
      <div className="md:hidden">
        <MascotScene cfg={MOBILE} active={active} />
      </div>
    </div>
  );
}
