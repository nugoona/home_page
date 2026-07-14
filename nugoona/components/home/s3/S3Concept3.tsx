'use client';

import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   S3 시안3 — "어려운 건 앱이 맡고, 결정은 사람이 합니다."
   컨셉 = 목업이 아니라 우리 실제 앱 홈 스샷(app-home-mobile.jpg)을 폰에 담고,
   "준비됐어요·확인해 주세요" 블루 카드를 강조 링 + 콜아웃으로 짚는다.
   → 앱이 준비해 둔 것(블루 카드) / 사장님이 탭해서 확인·결정(우측 화살표).
   실화면이라 신뢰(짝퉁 아님 — 우리 앱).

   기법 차용:
   - PhoneScene: 실사 폰 프레임 위 레이어 + 스샷 배치 + 유리 글레어(§8.6 노하우).
   - Clone01: 흰 pill 라벨 + 얇은 border + 다층 부드러운 그림자, 절제.
   - DESIGN §8.14: 다크태그 금지 / 선·글자 또렷(medium+진한색+balance+leading1.5) /
     그림자 다층 / 배경 mask 분리 / 절제=빼기 / 모바일우선(360).
   ═══════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const ACCENT = '#0070f3';

/* 스샷(원본 1080×2113) 대비 % — 블루 카드/화살표 실측 좌표 */
const RING = { left: 3.5, top: 16.4, width: 93, height: 24.6 }; // "준비됐어요" 블루 카드
const ARROW = { left: 79.5, top: 18.6, size: 13 }; // 카드 우측 › (탭해서 확인)

/* 꼬리 달린 콜아웃 pill (흰 배경 + 진한 글자, 다크태그 금지 §8.14-1) */
function Callout({
  num,
  text,
  style,
  tail,
}: {
  num: string;
  text: string;
  style: React.CSSProperties;
  tail: 'down' | 'up';
}) {
  return (
    <div style={{ position: 'absolute', ...style }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '7px 12px 7px 8px',
          background: '#ffffff',
          border: '1px solid #ececec',
          borderRadius: 999,
          // 부드러운 다층 그림자 (§8.14-4)
          boxShadow: '0 8px 20px -8px rgba(0,0,0,0.22), 0 1px 2px rgba(0,0,0,0.06)',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 19,
            height: 19,
            borderRadius: '50%',
            background: num === '1' ? ACCENT : '#171717',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {num}
        </span>
        <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.01em', color: '#171717' }}>
          {text}
        </span>
      </div>
      {/* 방향 꼬리 (대상 지시 — 커넥터선 대신 절제 §8.14-7) */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: tail === 'down' ? 18 : undefined,
          right: tail === 'up' ? 18 : undefined,
          [tail === 'down' ? 'bottom' : 'top']: -5,
          width: 10,
          height: 10,
          background: '#ffffff',
          borderRight: tail === 'down' ? '1px solid #ececec' : 'none',
          borderBottom: tail === 'down' ? '1px solid #ececec' : 'none',
          borderLeft: tail === 'up' ? '1px solid #ececec' : 'none',
          borderTop: tail === 'up' ? '1px solid #ececec' : 'none',
          transform: 'rotate(45deg)',
        }}
      />
    </div>
  );
}

export default function S3Concept3() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* 배경 = 별도 absolute 레이어(도트 그리드 + 가장자리 mask, §8.14-6) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ececec 1px, transparent 1.4px)',
          backgroundSize: '28px 28px',
          backgroundPosition: '14px 8px',
          WebkitMaskImage: 'radial-gradient(120% 100% at 50% 40%, #000 45%, transparent 82%)',
          maskImage: 'radial-gradient(120% 100% at 50% 40%, #000 45%, transparent 82%)',
        }}
      />

      <div className="relative mx-auto max-w-[1080px] px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-[1.05fr_0.95fr] gap-12 md:gap-10 items-center">
        {/* ── 좌: 카피 (앱 ↔ 사람 이분) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span
            className="inline-block text-[12px] font-semibold tracking-[0.02em] mb-5"
            style={{ color: ACCENT }}
          >
            실제 앱 화면
          </span>
          <h2
            className="text-text-primary font-bold tracking-[-0.03em] leading-[1.2] text-[clamp(26px,3.6vw,40px)] mb-7"
            style={{ textWrap: 'balance' } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: '어려운 건 앱이 맡고,<br>결정은 사람이 합니다.' }}
          />

          {/* 두 갈래: 파란 = 앱이 하는 일 / 검은 = 사장님이 하는 일 */}
          <div className="flex flex-col gap-5 max-w-[440px]">
            <div className="flex gap-3.5">
              <span
                aria-hidden
                className="mt-[7px] shrink-0"
                style={{ width: 9, height: 9, borderRadius: '50%', background: ACCENT }}
              />
              <div>
                <div className="text-[13px] font-semibold mb-1" style={{ color: ACCENT }}>
                  앱이 하는 일
                </div>
                <p
                  className="text-text-body text-[15.5px] max-md:text-[14px] leading-[1.5] tracking-[-0.01em]"
                  style={{ textWrap: 'balance' } as React.CSSProperties}
                >
                  앱은 준비하고, 설명하고, 다음 일을 알려줍니다.
                </p>
              </div>
            </div>
            <div className="flex gap-3.5">
              <span
                aria-hidden
                className="mt-[7px] shrink-0"
                style={{ width: 9, height: 9, borderRadius: '50%', background: '#171717' }}
              />
              <div>
                <div className="text-[13px] font-semibold text-text-primary mb-1">사장님이 하는 일</div>
                <p
                  className="text-text-body text-[15.5px] max-md:text-[14px] leading-[1.5] tracking-[-0.01em]"
                  style={{ textWrap: 'balance' } as React.CSSProperties}
                >
                  무엇을 보여주고 어디에 사용할지는 사장님이 직접 결정합니다.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 우: 실제 앱 스샷 + 강조 링/콜아웃 ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="flex justify-center md:justify-end min-w-0"
        >
          <div
            className="relative w-full max-w-[360px]"
            style={{ filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.16))' }}
          >
            {/* 스샷 박스 (실사 폰 느낌 — 검은 1px + 라운드, §8.6 모바일 노하우) */}
            <div
              className="relative overflow-hidden bg-white"
              style={{ borderRadius: 30, border: '1px solid #111' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/shots/content/app-home-mobile.jpg"
                alt="누구나 콘텐츠 앱 홈 — '준비됐어요·확인해 주세요' 1년치 글 주제 카드"
                className="block w-full"
              />

              {/* 오버레이 레이어 (스샷 안쪽 — 밖으로 안 넘침) */}
              <div className="absolute inset-0 pointer-events-none">
                {/* 블루 카드 강조 링 (accent border + 다층 glow, §8.14-2·4) */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${RING.left}%`,
                    top: `${RING.top}%`,
                    width: `${RING.width}%`,
                    height: `${RING.height}%`,
                    borderRadius: 20,
                    border: `2.5px solid ${ACCENT}`,
                    boxShadow:
                      '0 0 0 4px rgba(0,112,243,0.12), 0 12px 30px -8px rgba(0,112,243,0.35)',
                  }}
                />

                {/* 카드 우측 › 강조 원 (탭해서 확인) */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${ARROW.left}%`,
                    top: `${ARROW.top}%`,
                    width: `${ARROW.size}%`,
                    aspectRatio: '1 / 1',
                    borderRadius: '50%',
                    border: `2.5px solid ${ACCENT}`,
                    boxShadow: '0 0 0 4px rgba(0,112,243,0.14)',
                  }}
                />

                {/* 콜아웃1 — 앱이 준비 (카드 위, 꼬리 아래) */}
                <Callout
                  num="1"
                  text="앱이 준비해 둡니다"
                  tail="down"
                  style={{ top: '6.2%', left: '5%' }}
                />

                {/* 콜아웃2 — 사장님이 확인·결정 (카드 아래, 꼬리 위) */}
                <Callout
                  num="2"
                  text="확인·결정은 사장님"
                  tail="up"
                  style={{ top: '43.5%', right: '4%' }}
                />
              </div>

              {/* 화면 앞 유리 글레어 (§8.6) */}
              <span
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(122deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 14%, rgba(255,255,255,0) 34%)',
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
