'use client';

/**
 * NewsFlowGraphic — 콘텐츠 /content S5 킬러 상징 그래픽
 * 개념: 5개 매체(네이버·플레이스·인스타·당근·구글)의 노출 동향
 *       → 수렴선 → 앱(NGN) → 아래로 → "글에 반영" 카드.
 * = "노출 방식이 바뀌어도 앱이 매주 따라가 글에 반영한다"를 한눈에.
 *
 * 시각문법(6원칙): 흐린 뼈대(회색) · 개념 요소만 accent(#0070f3) · 수렴선
 *   · useInView 진입 시 pathLength 선 draw · 매체 노드 주기 pulse(=매주 자동 수집)
 *   · 점 흐름. 화려함 금지, 절제. framer-motion + 순수 inline SVG (신규 라이브러리 0).
 * 참고: components/features/DashboardShowcase.tsx의 DataPipelineVisual — 방향만 재의미.
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

/* 팔레트 — 매체·뼈대는 흐리게, 흐름(점·pulse·반영)만 accent */
const ACCENT = '#0070f3';
const LINE = '#d4d4d4'; // 수렴선(흐린 뼈대)
const NODE_STROKE = '#cfcfcf';
const NODE_FILL = '#ffffff';
const SKEL = '#e6e6e6'; // 스켈레톤 텍스트 바
const TXT = '#9a9a9a'; // 흐린 라벨
const DOT = '#bdbdbd'; // 매체 점(평상시)

const MEDIA = ['네이버', '플레이스', '인스타', '당근', '구글'];

/* 진입 시 그려지는 선 */
function DrawLine({ d, inView, delay }: { d: string; inView: boolean; delay: number }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={LINE}
      strokeWidth="1.4"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={inView ? { pathLength: 1, opacity: 1 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay }}
    />
  );
}

/* 매체 노드 — 흐린 점 + accent pulse 링(매주 자동 수집 은유, 순차 발화) */
function MediaNode({ cx, cy, i, inView }: { cx: number; cy: number; i: number; inView: boolean }) {
  return (
    <g>
      {inView && (
        <circle cx={cx} cy={cy} r="3" fill="none" stroke={ACCENT} strokeWidth="1" opacity="0">
          <animate attributeName="r" values="3;10" dur="2.6s" begin={`${0.9 + i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.55;0" dur="2.6s" begin={`${0.9 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={cx} cy={cy} r="4" fill={DOT} opacity="0.18" />
      <circle cx={cx} cy={cy} r="2" fill={DOT} />
    </g>
  );
}

/* ─────────────────────── 데스크톱: 가로 흐름 ─────────────────────── */
function DesktopGraphic({ inView }: { inView: boolean }) {
  const SRC_X = 12, SRC_W = 104, SRC_R = 116;
  const srcYs = [28, 70, 112, 154, 196];
  const NGN_L = 270, NGN_R = 326, NGN_CX = 298, NGN_CY = 112, NGN_BOT = 140;
  const entryYs = [92, 102, 112, 122, 132];
  const turnXs = [196, 212, null, 212, 196] as (number | null)[];
  const DL = 400; // 글 카드 좌변

  const elbowIn = (i: number) => {
    const sy = srcYs[i], ey = entryYs[i], tx = turnXs[i];
    if (tx === null) return `M${SRC_R},${sy}H${NGN_L}`;
    return `M${SRC_R},${sy}H${tx}V${ey}H${NGN_L}`;
  };
  const outPath = `M${NGN_CX},${NGN_BOT}V158H${DL}`; // 앱 → 아래로 → 글카드

  const bodyLines = [
    { y: 102, w: 220 }, { y: 116, w: 198 },
    { y: 130, w: 210, reflect: true }, // ← 이번 주 반영된 문장(accent)
    { y: 144, w: 176 }, { y: 158, w: 152 },
  ];

  return (
    <svg viewBox="0 0 680 240" style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden>
      <defs>
        {srcYs.map((_, i) => <path key={i} id={`nf-ep${i}`} d={elbowIn(i)} />)}
        <path id="nf-ep-out" d={outPath} />
      </defs>

      {/* 수렴선 (진입 draw) */}
      {srcYs.map((_, i) => <DrawLine key={i} d={elbowIn(i)} inView={inView} delay={0.1 + i * 0.08} />)}
      <DrawLine d={outPath} inView={inView} delay={0.7} />

      {/* 매체 노드 */}
      {MEDIA.map((label, i) => (
        <motion.g key={label}
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}>
          <rect x={SRC_X} y={srcYs[i] - 15} width={SRC_W} height="30" fill={NODE_FILL} stroke={NODE_STROKE} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <g transform={`translate(${SRC_X + 16}, 0)`}>
            <MediaNode cx={0} cy={srcYs[i]} i={i} inView={inView} />
          </g>
          <text x={SRC_X + 32} y={srcYs[i] + 4} fontSize="11" fontWeight="600" fill={TXT}>{label}</text>
        </motion.g>
      ))}

      {/* 앱(NGN) 노드 — accent 강조 */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
        style={{ transformOrigin: `${NGN_CX}px ${NGN_CY}px` }}>
        <rect x={NGN_L} y={NGN_CY - 28} width={NGN_R - NGN_L} height="56" fill={NODE_FILL} stroke={ACCENT} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {[-7, 0, 7].map((dy) => [-7, 0, 7].map((dx) => (
          <circle key={`${dx}_${dy}`} cx={NGN_CX + dx} cy={NGN_CY + dy} r="1.5" fill={ACCENT} opacity="0.5" />
        )))}
        <text x={NGN_CX} y={NGN_CY - 34} textAnchor="middle" fontSize="9" fontWeight="700" fill={ACCENT} fontFamily="var(--font-en)">NGN</text>
      </motion.g>

      {/* 글 카드 — 흐린 블로그 글 스켈레톤 + 반영 문장 accent */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.75 }}>
        <rect x={DL} y="44" width="268" height="176" fill={NODE_FILL} stroke="#eaeaea" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        <rect x={DL} y="44" width="268" height="22" fill="#fafafa" stroke="#eaeaea" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        {[0, 1, 2].map((k) => <circle key={k} cx={DL + 14 + k * 9} cy="55" r="2.5" fill="#d4d4d4" />)}
        <text x={DL + 46} y="59" fontSize="8" fontWeight="600" fill={TXT}>블로그 발행</text>

        {/* 반영 배지 (accent) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: EASE, delay: 1.3 }}>
          <rect x={DL + 178} y="50" width="76" height="14" fill={ACCENT} vectorEffect="non-scaling-stroke" />
          <text x={DL + 216} y="60" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">이번 주 반영</text>
        </motion.g>

        {/* 제목 스켈레톤 */}
        <rect x={DL + 16} y="80" width="120" height="9" fill={SKEL} />

        {/* 본문 스켈레톤 (반영 문장만 accent) */}
        {bodyLines.map((ln, k) => (
          ln.reflect ? (
            <g key={k}>
              <rect x={DL + 8} y={ln.y - 4} width="2.5" height="12" fill={ACCENT} />
              <motion.rect x={DL + 16} y={ln.y} width={ln.w} height="6" fill={SKEL}
                animate={inView ? { fill: ACCENT } : {}}
                transition={{ duration: 0.5, ease: EASE, delay: 1.35 }} />
            </g>
          ) : (
            <rect key={k} x={DL + 16} y={ln.y} width={ln.w} height="5" fill={SKEL} />
          )
        ))}
      </motion.g>

      {/* 점 흐름 — 수집(매체→앱) + 반영(앱→글). accent 통일(개념만 컬러) */}
      {inView && srcYs.map((_, i) => (
        <circle key={`d${i}`} r="2.6" fill={ACCENT}>
          <animateMotion dur={`${2 + i * 0.15}s`} repeatCount="indefinite" begin={`${0.9 + i * 0.25}s`}>
            <mpath href={`#nf-ep${i}`} />
          </animateMotion>
        </circle>
      ))}
      {inView && (
        <circle r="2.8" fill={ACCENT}>
          <animateMotion dur="1.5s" repeatCount="indefinite" begin="1.3s">
            <mpath href="#nf-ep-out" />
          </animateMotion>
        </circle>
      )}
    </svg>
  );
}

/* ─────────────────────── 모바일: 세로 흐름 ─────────────────────── */
function MobileGraphic({ inView }: { inView: boolean }) {
  const SW = 58, SH = 28, SY = 8, SM = 8, GAP = 1;
  const srcXs = MEDIA.map((_, i) => SM + i * (SW + GAP));
  const srcCXs = srcXs.map((x) => x + 14); // 점 위치
  const SRC_BOT = SY + SH; // 36
  const NGN_L = 140, NGN_W = 40, NGN_TOP = 104, NGN_H = 40;
  const MX = NGN_L + NGN_W / 2, NGN_CY = NGN_TOP + NGN_H / 2, NGN_BOT = NGN_TOP + NGN_H;
  const entryXs = [146, 153, 160, 167, 174];
  const turnYs = [64, 72, null, 72, 64] as (number | null)[];
  const DT = 182, DL = 10, DW = 300; // 글 카드
  const outPath = `M${MX},${NGN_BOT}V${DT}`;

  const elbowDown = (i: number) => {
    const cx = srcCXs[i], ex = entryXs[i], ty = turnYs[i];
    if (ty === null) return `M${cx},${SRC_BOT}V${NGN_TOP}`;
    return `M${cx},${SRC_BOT}V${ty}H${ex}V${NGN_TOP}`;
  };

  const bodyLines = [
    { y: DT + 56, w: 268 }, { y: DT + 72, w: 244 },
    { y: DT + 88, w: 256, reflect: true },
    { y: DT + 104, w: 224 }, { y: DT + 120, w: 240 }, { y: DT + 136, w: 200 },
  ];

  return (
    <svg viewBox="0 0 320 420" style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden>
      <defs>
        {srcCXs.map((_, i) => <path key={i} id={`nfm-ep${i}`} d={elbowDown(i)} />)}
        <path id="nfm-ep-out" d={outPath} />
      </defs>

      {srcCXs.map((_, i) => <DrawLine key={i} d={elbowDown(i)} inView={inView} delay={0.1 + i * 0.08} />)}
      <DrawLine d={outPath} inView={inView} delay={0.7} />

      {/* 매체 노드 */}
      {MEDIA.map((label, i) => (
        <motion.g key={label}
          initial={{ opacity: 0, y: -8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}>
          <rect x={srcXs[i]} y={SY} width={SW} height={SH} fill={NODE_FILL} stroke={NODE_STROKE} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <MediaNode cx={srcXs[i] + 10} cy={SY + SH / 2} i={i} inView={inView} />
          <text x={srcXs[i] + 20} y={SY + SH / 2 + 3.5} fontSize="8" fontWeight="600" fill={TXT}>{label}</text>
        </motion.g>
      ))}

      {/* 앱(NGN) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
        style={{ transformOrigin: `${MX}px ${NGN_CY}px` }}>
        <rect x={NGN_L} y={NGN_TOP} width={NGN_W} height={NGN_H} fill={NODE_FILL} stroke={ACCENT} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {[-6, 0, 6].map((dy) => [-6, 0, 6].map((dx) => (
          <circle key={`${dx}_${dy}`} cx={MX + dx} cy={NGN_CY + dy} r="1.5" fill={ACCENT} opacity="0.5" />
        )))}
        <text x={NGN_L + NGN_W + 6} y={NGN_CY + 3.5} fontSize="9" fontWeight="700" fill={ACCENT} fontFamily="var(--font-en)">NGN</text>
      </motion.g>

      {/* 글 카드 */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.75 }}>
        <rect x={DL} y={DT} width={DW} height="228" fill={NODE_FILL} stroke="#eaeaea" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        <rect x={DL} y={DT} width={DW} height="24" fill="#fafafa" stroke="#eaeaea" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        {[0, 1, 2].map((k) => <circle key={k} cx={DL + 14 + k * 9} cy={DT + 12} r="2.5" fill="#d4d4d4" />)}
        <text x={DL + 46} y={DT + 15} fontSize="8" fontWeight="600" fill={TXT}>블로그 발행</text>

        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: EASE, delay: 1.3 }}>
          <rect x={DL + DW - 90} y={DT + 5} width="82" height="15" fill={ACCENT} vectorEffect="non-scaling-stroke" />
          <text x={DL + DW - 49} y={DT + 16} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#fff">이번 주 반영</text>
        </motion.g>

        <rect x={DL + 16} y={DT + 34} width="140" height="10" fill={SKEL} />

        {bodyLines.map((ln, k) => (
          ln.reflect ? (
            <g key={k}>
              <rect x={DL + 8} y={ln.y - 5} width="2.5" height="13" fill={ACCENT} />
              <motion.rect x={DL + 16} y={ln.y} width={ln.w} height="7" fill={SKEL}
                animate={inView ? { fill: ACCENT } : {}}
                transition={{ duration: 0.5, ease: EASE, delay: 1.35 }} />
            </g>
          ) : (
            <rect key={k} x={DL + 16} y={ln.y} width={ln.w} height="6" fill={SKEL} />
          )
        ))}
      </motion.g>

      {inView && srcCXs.map((_, i) => (
        <circle key={`md${i}`} r="2.6" fill={ACCENT}>
          <animateMotion dur={`${2 + i * 0.15}s`} repeatCount="indefinite" begin={`${0.9 + i * 0.25}s`}>
            <mpath href={`#nfm-ep${i}`} />
          </animateMotion>
        </circle>
      ))}
      {inView && (
        <circle r="2.8" fill={ACCENT}>
          <animateMotion dur="1.5s" repeatCount="indefinite" begin="1.3s">
            <mpath href="#nfm-ep-out" />
          </animateMotion>
        </circle>
      )}
    </svg>
  );
}

export default function NewsFlowGraphic() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div className="hidden md:block"><DesktopGraphic inView={inView} /></div>
      <div className="md:hidden"><MobileGraphic inView={inView} /></div>
    </div>
  );
}
