"use client";

/**
 * SVG Path Dot Flow — 순수 SVG 프리미티브 (의존성 0)
 * 기법: SMIL <animateMotion> + <mpath> — 고정 경로 위를 점(에너지)이 흐름 = "데이터가 A→B로".
 * JS 애니메이션 없음(브라우저 네이티브) → hydration 안전·rAF 0. 수집일 2026-07-17.
 * 실전 결합: 카드 = HTML(임의 콘텐츠), 이 SVG를 선 레이어로 오버레이.
 */

const CARD = { fill: "#ffffff", stroke: "#e5e5e5" };

export function SvgPathDotFlow() {
  return (
    <div className="flex w-full items-center justify-center bg-white px-6 py-10">
      <svg viewBox="0 0 800 360" className="h-auto w-full max-w-[720px]" role="img" aria-label="고정된 선 위로 점이 흐르는 데모">
        {/* 고정 연결선(회색) — 셋이 하나로 모이는 구조 */}
        <path id="pdf-p1" d="M220 100 C 380 100, 420 180, 578 180" fill="none" stroke="#e5e5e5" strokeWidth="1.5" />
        <path id="pdf-p2" d="M220 180 L 578 180" fill="none" stroke="#e5e5e5" strokeWidth="1.5" />
        <path id="pdf-p3" d="M220 260 C 380 260, 420 180, 578 180" fill="none" stroke="#e5e5e5" strokeWidth="1.5" />

        {/* 좌측 카드 노드 3개 */}
        {[60, 140, 220].map((y) => (
          <g key={y}>
            <rect x="60" y={y - 20} width="160" height="60" fill={CARD.fill} stroke={CARD.stroke} />
            <rect x="76" y={y - 4} width="60" height="8" fill="#111111" />
            <rect x="76" y={y + 12} width="110" height="5" fill="#d4d4d4" />
          </g>
        ))}

        {/* 우측 수렴 카드 */}
        <rect x="578" y="130" width="170" height="100" fill={CARD.fill} stroke={CARD.stroke} />
        <rect x="596" y="154" width="80" height="10" fill="#111111" />
        <rect x="596" y="178" width="130" height="6" fill="#d4d4d4" />
        <rect x="596" y="192" width="110" height="6" fill="#d4d4d4" />

        {/* 선을 따라 흐르는 점 — SMIL animateMotion */}
        <circle r="4" fill="#0070f3">
          <animateMotion dur="2.8s" repeatCount="indefinite">
            <mpath href="#pdf-p1" />
          </animateMotion>
        </circle>
        {/* begin 음수 = 이미 진행 중 상태로 시작(양수 딜레이는 시작 전 점이 원점 (0,0)에 보임) */}
        <circle r="4" fill="#0070f3">
          <animateMotion dur="2.8s" begin="-0.9s" repeatCount="indefinite">
            <mpath href="#pdf-p2" />
          </animateMotion>
        </circle>
        <circle r="4" fill="#0070f3">
          <animateMotion dur="2.8s" begin="-1.8s" repeatCount="indefinite">
            <mpath href="#pdf-p3" />
          </animateMotion>
        </circle>
      </svg>
    </div>
  );
}
