"use client";

/**
 * SVG Line Draw — 순수 SVG 프리미티브 (의존성 0)
 * 기법: pathLength={1} + stroke-dasharray/stroke-dashoffset 애니메이션으로 "선이 그려짐".
 * 정평 패턴(Jake Archibald 2013 · CSS-Tricks "SVG Line Animation") — 외부 라이브러리 아님.
 * 수집일 2026-07-17. 실전 결합: 카드 = HTML(임의 콘텐츠), 선 = 이 SVG를 오버레이.
 * 좌표를 §8.16 그리드 교차점에 직접 앉힐 수 있는 것이 기성 라이브러리 대비 장점.
 */

const CARD = { fill: "#ffffff", stroke: "#e5e5e5" };

export function SvgLineDraw() {
  return (
    <div className="flex w-full items-center justify-center bg-white px-6 py-10">
      <svg viewBox="0 0 800 360" className="h-auto w-full max-w-[720px]" role="img" aria-label="선이 그려지며 카드를 연결하는 데모">
        <style>{`
          .ld-path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ld-draw 3.6s ease-in-out infinite; }
          .ld-path.ld-d2 { animation-delay: 0.5s; }
          @keyframes ld-draw { 0% { stroke-dashoffset: 1; } 55% { stroke-dashoffset: 0; } 85% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
        `}</style>

        {/* 좌측 카드 노드 */}
        <rect x="40" y="130" width="180" height="100" fill={CARD.fill} stroke={CARD.stroke} />
        <rect x="60" y="152" width="80" height="10" fill="#111111" />
        <rect x="60" y="176" width="140" height="6" fill="#d4d4d4" />
        <rect x="60" y="190" width="120" height="6" fill="#d4d4d4" />

        {/* 우측 카드 노드 2개 */}
        <rect x="580" y="50" width="180" height="100" fill={CARD.fill} stroke={CARD.stroke} />
        <rect x="600" y="72" width="80" height="10" fill="#111111" />
        <rect x="600" y="96" width="140" height="6" fill="#d4d4d4" />
        <rect x="600" y="110" width="120" height="6" fill="#d4d4d4" />

        <rect x="580" y="210" width="180" height="100" fill={CARD.fill} stroke={CARD.stroke} />
        <rect x="600" y="232" width="80" height="10" fill="#111111" />
        <rect x="600" y="256" width="140" height="6" fill="#d4d4d4" />
        <rect x="600" y="270" width="120" height="6" fill="#d4d4d4" />

        {/* 그려지는 연결선 — pathLength=1이라 실측 없이 dasharray 1로 통일 */}
        <path className="ld-path" d="M220 180 C 380 180, 420 100, 580 100" pathLength={1} fill="none" stroke="#0070f3" strokeWidth="1.5" />
        <path className="ld-path ld-d2" d="M220 180 C 380 180, 420 260, 580 260" pathLength={1} fill="none" stroke="#0070f3" strokeWidth="1.5" />

        {/* 접점 도트 */}
        <circle cx="220" cy="180" r="3" fill="#111111" />
        <circle cx="580" cy="100" r="3" fill="#0070f3" />
        <circle cx="580" cy="260" r="3" fill="#0070f3" />
      </svg>
    </div>
  );
}
