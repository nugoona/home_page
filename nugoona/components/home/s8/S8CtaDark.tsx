'use client';

import Link from 'next/link';
import FadeUp from '@/components/motion/FadeUp';
import OccupancyGrid from '@/components/layout/OccupancyGrid';
import { useRevealOnView, RevealHtmlLines } from '@/components/motion/Reveal';
import { cta } from '@/lib/content/home';

/**
 * S8 · CTA — Clone07 "Security by default." 다크 패널 차용 (사장님 확정 2026-07-14).
 *
 * ▣ Clone07 실측 디테일 차용(§8.13 분해→재조립):
 *   - 라이트 배경(#fafafa) + 수직 그리드 라인(#ebebeb) 위에 큰 다크 패널(#0a0a0a).
 *   - 패널 내부 디바이더 #292929(수직 칸 + 수평 2줄), 패널 하단 보더 #292929.
 *   - 헤딩 #ededed·굵기 600·자간 -0.035em / 칸 제목 #ededed 600 / 라벨·설명 #a1a1a1.
 *   - 화살표 원 48px 보더 #2e2e2e + 아이콘 stroke #a1a1a1.
 * ▣ 버튼(사장님: 2~3개, "무료 시작"은 필수 / 요금은 아직 미완성 → 자리만, 텍스트 추후 확정):
 *   - primary = 흰 배경(다크 반전) "무료로 시작하기" → /start
 *   - secondary = 아웃라인(#2e2e2e) "요금 안내"(임시 텍스트 — 추후 확정) → /pricing
 * ▣ 3칸 = cta.sub 3줄 분해(칸 제목·라벨은 임시 — 카피 추후 확정). §8.9 구두점 4종 준수.
 */

const DARK_BG = '#0a0a0a';
const DARK_LINE = '#292929';
const TXT_LIGHT = '#ededed';
const TXT_GRAY = '#a1a1a1';

/* A안(사장님 택1 2026-07-14): 3칸 폐기 — 각주급 문장을 콘텐츠로 승격시킨 것이 어색함의 근본 원인.
   패널 = 헤딩 + 버튼 2개 + 버튼 아래 한 줄 각주(가운뎃점 구분)로 응축. 전문은 /start가 받는다. */
/* 각주 카피 확정(2026-07-15 사장님 — 헤딩이 "카드 등록 없이"를 가져가면서 각주는 응축) */
const FOOTNOTE = '약정 없음 · 계정 연결은 저희가 도와드립니다.';

export default function S8CtaDark() {
  const revealRef = useRevealOnView<HTMLDivElement>();
  /* Grid Occupancy 편입(2026-07-15 검수 — 홈 유일 미편입·임의 수직선 3개 = §8.16-A5 위반이었음).
     다크 패널 = c[2,12]×r[2,7] 병합 칸(보더가 칸 경계선과 이어짐), 주변 = checker 빈 셀. */
  const panel = (
    /* h-full 필수 — 없으면 패널이 칸(5행)을 다 못 채워 아래 빈 띠 발생(사장님 2026-07-15 "아래는 두 칸") */
    <FadeUp className="h-full">
      {/* 좌 헤딩(6/10) / 우 버튼+각주(4/10) — 디바이더가 패널 위 바둑판 세로선(line 8)과 정확히 연결
          (사장님 2026-07-15 "구분선이 위 칸칸이 세로선과 맞아야 해, 연결성 있게").
          우측 4열은 좁아 버튼 = 세로 스택 */}
      <div
        className="relative flex h-full w-full max-md:flex-col max-md:px-6 max-md:py-12"
        style={{ background: DARK_BG, borderBottom: `1px solid ${DARK_LINE}` }}
      >
        <div className="flex w-[60%] items-center px-[48px] max-md:w-full max-md:px-0">
          <h2
            className="text-[clamp(26px,3.3vw,42px)] font-semibold leading-[1.18] tracking-[-0.035em]"
            style={{ color: TXT_LIGHT }}
          >
            <RevealHtmlLines html={cta.title} />
          </h2>
        </div>
        <div
          className="flex w-[40%] flex-col justify-center px-[40px] max-md:mt-8 max-md:w-full max-md:border-0 max-md:px-0"
          style={{ borderLeft: `1px solid ${DARK_LINE}` }}
        >
          <div className="flex flex-col gap-2.5">
            <Link
              href={cta.primaryHref}
              className="inline-flex h-[52px] w-full items-center justify-center bg-white px-6 text-[15px] font-semibold text-[#0a0a0a] transition-colors hover:bg-[#e5e5e5]"
            >
              {cta.primaryText}
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-[52px] w-full items-center justify-center px-6 text-[15px] font-semibold transition-colors hover:border-white/40"
              style={{ border: '1px solid #2e2e2e', color: TXT_LIGHT }}
            >
              요금 안내
            </Link>
          </div>
          <p className="mt-5 text-[14px] leading-[1.6] tracking-[-0.01em] max-md:text-[13px]" style={{ color: TXT_GRAY }}>
            {FOOTNOTE}
          </p>
        </div>
      </div>
    </FadeUp>
  );

  return (
    <section className="relative overflow-hidden bg-[#fafafa]">
      {/* 모바일 — 패널 풀폭 */}
      <div ref={revealRef} data-reveal="wait" className="px-4 py-20 md:hidden">{panel}</div>

      {/* PC — 12열 편입: 패널 = 병합 칸, 주변 = checker */}
      <OccupancyGrid
        cols={12}
        rows={7}
        areas={[{ key: 'panel', c: [2, 12], r: [2, 7], className: 'block' }]}
        checker
        mobile={false}
        render={() => panel}
      />
    </section>
  );
}
