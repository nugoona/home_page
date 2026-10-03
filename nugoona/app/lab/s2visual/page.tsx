"use client";

/* ⚠ 임시 시안 페이지 (2026-07-17 사장님 지시 — 확인 후 삭제 예정)
   /content S2 "검색에 보이려면 게시물이 꾸준히 쌓여야 합니다" 비주얼 3안.
   소스 조합(갤러리 63종 안에서만):
   - 안1 = D7 Card Stack + B13 Dot Pattern
   - 안2 = 쌓인 글 카드 → 검색창 흐름 (A9 Path Dot Flow 기법 재가공)
   - 안3 = 카드가 선으로 그려지며 쌓임 (A8 Line Draw 기법 재가공)
   ⛔ 순위·노출 보장 표현 금지 / 짝퉁 실물(가짜 네이버) 금지 → 중립 검색창+스켈레톤. */

import { CardStack } from "@/components/lab-sources/aceternity/card-stack";
import { DotPattern } from "@/components/lab-sources/magicui/dot-pattern";

const EN = { fontFamily: "var(--font-en)" } as const;
const H = "font-semibold text-text-primary tracking-[-0.03em] leading-[1.15]";

/* ── S2 확정 카피 (lib/content/content.ts buildup 토씨 그대로) ── */
const COPY = {
  heading: (
    <>
      검색에 보이려면
      <br />
      게시물이 꾸준히 쌓여야 합니다
    </>
  ),
  body: "메뉴와 서비스, 실제 경험을 담은 게시물이 쌓일수록 고객이 검색에서 스토어를 발견할 기회도 넓어집니다",
  closing: "그 꾸준함은 누구나 콘텐츠가 이어갑니다",
};

function CopyBlock() {
  return (
    <div>
      <h2 className={`text-[clamp(26px,3.4vw,38px)] ${H}`}>{COPY.heading}</h2>
      <p className="mt-5 max-w-[440px] text-[16px] font-medium leading-[1.6] text-text-body">{COPY.body}</p>
      <p className="mt-4 text-[16px] font-semibold leading-[1.6] text-text-primary">{COPY.closing}</p>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="border-y border-neutral-200 bg-neutral-50 px-8 py-3">
      <span className="font-mono text-[13px] font-semibold text-neutral-500" style={EN}>{label}</span>
    </div>
  );
}

/* ═══════════ 안1 · D7 Card Stack + B13 Dot Pattern ═══════════
   글 카드가 한 장씩 순환하며 쌓이는 스택 — "쌓임" 그 자체. */

const STACK_ITEMS = [
  { id: 0, name: "네이버 블로그", designation: "이번 주 발행", content: <p className="text-[15px] leading-[1.6]">오늘 준비한 메뉴, 재료 손질부터 상 위에 오르기까지의 과정을 담았습니다.</p> },
  { id: 1, name: "플레이스 소식", designation: "이번 주 발행", content: <p className="text-[15px] leading-[1.6]">매장 운영 시간과 새로 바뀐 좌석 배치를 안내드립니다.</p> },
  { id: 2, name: "인스타그램", designation: "이번 주 발행", content: <p className="text-[15px] leading-[1.6]">자주 묻는 질문을 모아 한 번에 정리했습니다.</p> },
  { id: 3, name: "구글 비즈니스", designation: "이번 주 발행", content: <p className="text-[15px] leading-[1.6]">이번 주 매장 준비 과정을 사진과 함께 소개합니다.</p> },
];

function Plan1() {
  return (
    <section className="relative overflow-hidden bg-white">
      <DotPattern className="absolute inset-0 text-neutral-200 [mask-image:radial-gradient(70%_70%_at_center,white,transparent)]" width={20} height={20} cr={1} />
      <div className="relative mx-auto grid max-w-[1120px] grid-cols-2 items-center gap-12 px-12 py-24 max-md:grid-cols-1 max-md:gap-10 max-md:px-6 max-md:py-16">
        <CopyBlock />
        <div className="flex items-center justify-center py-8">
          <CardStack items={STACK_ITEMS} offset={12} scaleFactor={0.05} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════ 안2 · 쌓인 글 카드 → 검색창 흐름 (A9 기법 재가공) ═══════════
   좌: 쌓인 글 카드 스택 / 우: 중립 검색창(스켈레톤 + 내 글 하이라이트) / 점이 선을 타고 흐름. */

function Plan2Svg() {
  return (
    <svg viewBox="0 0 800 400" className="h-auto w-full max-w-[720px]" role="img" aria-label="쌓인 게시물이 검색 결과로 이어지는 그림">
      {/* 좌측: 쌓인 글 카드 4장 (뒤로 갈수록 위로 살짝 offset = 쌓임) */}
      {[3, 2, 1, 0].map((i) => (
        <g key={i}>
          <rect x={56 + i * 8} y={96 + i * 44} width="200" height="120" fill="#ffffff" stroke="#e5e5e5" />
        </g>
      ))}
      {/* 맨 앞 카드만 콘텐츠 표시 */}
      <rect x="56" y="96" width="200" height="120" fill="#ffffff" stroke="#d4d4d4" />
      <rect x="74" y="118" width="90" height="10" fill="#111111" />
      <rect x="74" y="142" width="150" height="6" fill="#d4d4d4" />
      <rect x="74" y="156" width="130" height="6" fill="#d4d4d4" />
      <rect x="74" y="178" width="56" height="18" fill="#f5f5f5" stroke="#e5e5e5" />
      <text x="84" y="191" fontSize="10" fill="#737373">발행됨</text>

      {/* 흐름 경로 3개 — 카드 스택에서 검색창으로 수렴 */}
      <path id="s2v-p1" d="M264 130 C 380 130, 420 168, 520 168" fill="none" stroke="#e5e5e5" strokeWidth="1.5" />
      <path id="s2v-p2" d="M272 200 C 390 200, 420 200, 520 200" fill="none" stroke="#e5e5e5" strokeWidth="1.5" />
      <path id="s2v-p3" d="M280 268 C 400 268, 420 232, 520 232" fill="none" stroke="#e5e5e5" strokeWidth="1.5" />

      {/* 우측: 중립 검색창 (짝퉁 실물 금지 → 무지 브라우저·스켈레톤) */}
      <rect x="520" y="86" width="236" height="230" fill="#ffffff" stroke="#d4d4d4" />
      <rect x="520" y="86" width="236" height="34" fill="#fafafa" stroke="#e5e5e5" />
      <circle cx="537" cy="103" r="5" fill="none" stroke="#a3a3a3" strokeWidth="1.5" />
      <line x1="541" y1="107" x2="545" y2="111" stroke="#a3a3a3" strokeWidth="1.5" />
      <rect x="554" y="98" width="120" height="9" fill="#e5e5e5" />
      {/* 결과: 스켈레톤 2 + 내 글 1(accent) + 스켈레톤 1 */}
      <rect x="538" y="138" width="160" height="7" fill="#e5e5e5" />
      <rect x="538" y="152" width="120" height="5" fill="#f0f0f0" />
      <rect x="530" y="176" width="216" height="48" fill="#ffffff" stroke="#0070f3" />
      <rect x="544" y="188" width="110" height="8" fill="#111111" />
      <rect x="544" y="204" width="170" height="5" fill="#a3a3a3" />
      <circle cx="738" cy="200" r="3" fill="#0070f3" />
      <rect x="538" y="244" width="150" height="7" fill="#e5e5e5" />
      <rect x="538" y="258" width="130" height="5" fill="#f0f0f0" />
      <rect x="538" y="282" width="140" height="7" fill="#e5e5e5" />

      {/* 흐르는 점 — SMIL animateMotion (begin 음수 = 시작부터 경로 위) */}
      <circle r="4" fill="#0070f3">
        <animateMotion dur="2.8s" repeatCount="indefinite"><mpath href="#s2v-p1" /></animateMotion>
      </circle>
      <circle r="4" fill="#0070f3">
        <animateMotion dur="2.8s" begin="-0.9s" repeatCount="indefinite"><mpath href="#s2v-p2" /></animateMotion>
      </circle>
      <circle r="4" fill="#0070f3">
        <animateMotion dur="2.8s" begin="-1.8s" repeatCount="indefinite"><mpath href="#s2v-p3" /></animateMotion>
      </circle>
    </svg>
  );
}

function Plan2() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1120px] px-12 py-24 max-md:px-6 max-md:py-16">
        <div className="max-w-[560px]">
          <CopyBlock />
        </div>
        <div className="mt-14 flex justify-center max-md:mt-10">
          <Plan2Svg />
        </div>
      </div>
    </section>
  );
}

/* ═══════════ 안3 · 카드가 선으로 그려지며 하나씩 쌓임 (A8 기법 재가공) ═══════════
   카드 4장이 테두리가 그려지며 순차로 나타남 = "쌓이는 중" 진행형. 절제 최상. */

function Plan3Svg() {
  /* rect 둘레를 pathLength=1로 통일해 dashoffset 애니로 "그려짐".
     각 카드 = 테두리 draw → 내용 fade-in, 순차 딜레이. 전체 루프. */
  const cards = [
    { x: 80, y: 60 },
    { x: 300, y: 100 },
    { x: 520, y: 60 },
    { x: 300, y: 240 },
  ];
  return (
    <svg viewBox="0 0 800 420" className="h-auto w-full max-w-[720px]" role="img" aria-label="게시물 카드가 하나씩 그려지며 쌓이는 그림">
      <style>{`
        .p3-border { stroke-dasharray: 1; stroke-dashoffset: 1; animation: p3-draw 8s ease-in-out infinite; }
        .p3-fill { opacity: 0; animation: p3-show 8s ease-in-out infinite; }
        @keyframes p3-draw {
          0% { stroke-dashoffset: 1; } 12% { stroke-dashoffset: 0; }
          88% { stroke-dashoffset: 0; opacity: 1; } 96% { opacity: 0; } 100% { stroke-dashoffset: 1; opacity: 0; }
        }
        @keyframes p3-show {
          0%, 10% { opacity: 0; } 16% { opacity: 1; }
          88% { opacity: 1; } 96%, 100% { opacity: 0; }
        }
      `}</style>
      {cards.map((c, i) => (
        <g key={i}>
          <rect
            className="p3-border"
            style={{ animationDelay: `${i * 0.9}s` }}
            x={c.x} y={c.y} width="200" height="120"
            pathLength={1} fill="none" stroke="#0070f3" strokeWidth="1.5"
          />
          <g className="p3-fill" style={{ animationDelay: `${i * 0.9}s` }}>
            <rect x={c.x} y={c.y} width="200" height="120" fill="#ffffff" stroke="#e5e5e5" />
            <rect x={c.x + 18} y={c.y + 22} width="90" height="10" fill="#111111" />
            <rect x={c.x + 18} y={c.y + 46} width="150" height="6" fill="#d4d4d4" />
            <rect x={c.x + 18} y={c.y + 60} width="130" height="6" fill="#d4d4d4" />
            <rect x={c.x + 18} y={c.y + 82} width="56" height="18" fill="#f5f5f5" stroke="#e5e5e5" />
            <text x={c.x + 28} y={c.y + 95} fontSize="10" fill="#737373">발행됨</text>
          </g>
        </g>
      ))}
      {/* 연결선(고정 회색) — 쌓인 카드들이 한 흐름임을 표시 */}
      <path d="M280 120 L 300 140" fill="none" stroke="#d4d4d4" strokeWidth="1.5" />
      <path d="M500 160 L 520 140" fill="none" stroke="#d4d4d4" strokeWidth="1.5" />
      <path d="M400 220 L 400 240" fill="none" stroke="#d4d4d4" strokeWidth="1.5" />
    </svg>
  );
}

function Plan3() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1120px] grid-cols-2 items-center gap-12 px-12 py-24 max-md:grid-cols-1 max-md:gap-10 max-md:px-6 max-md:py-16">
        <CopyBlock />
        <Plan3Svg />
      </div>
    </section>
  );
}

export default function S2VisualLab() {
  return (
    <main className="bg-white">
      <div className="border-b border-neutral-200 px-8 py-5">
        <h1 className="text-[15px] font-bold text-neutral-900">/content S2 비주얼 시안 3안 (임시 — 확인 후 삭제)</h1>
        <p className="mt-1 font-mono text-[12px] text-neutral-500" style={EN}>
          안1 = D7 Card Stack + B13 Dot Pattern · 안2 = A9 Path Dot Flow 재가공 · 안3 = A8 Line Draw 재가공
        </p>
      </div>
      <Divider label="안1 · 글 카드가 한 장씩 쌓이는 스택 (D7 + B13)" />
      <Plan1 />
      <Divider label="안2 · 쌓인 글 → 검색에서 발견 흐름 (A9 재가공)" />
      <Plan2 />
      <Divider label="안3 · 카드가 그려지며 하나씩 쌓임 (A8 재가공)" />
      <Plan3 />
      <div className="h-24" />
    </main>
  );
}
