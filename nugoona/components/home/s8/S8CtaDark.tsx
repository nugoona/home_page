'use client';

import Link from 'next/link';
import FadeUp from '@/components/motion/FadeUp';
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
const FOOTNOTE = '카드 등록·약정 없음 · 기본 정보만 입력 · 계정 연결은 저희가 도와드립니다.';

export default function S8CtaDark() {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] px-6 py-[90px] max-md:px-4 max-md:py-14">
      {/* Clone07 수직 그리드 라인(#ebebeb) — 라이트 배경 위 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {['16.66%', '50%', '83.33%'].map((x) => (
          <span key={x} className="absolute top-0 h-full w-px bg-[#ebebeb]" style={{ left: x }} />
        ))}
      </div>

      <FadeUp>
        <div
          className="relative mx-auto w-full max-w-[1120px]"
          style={{ background: DARK_BG, borderBottom: `1px solid ${DARK_LINE}` }}
        >
          {/* ── 헤딩 + 버튼 + 한 줄 각주 — 조용하고 단단하게(⛔ 선이 텍스트 관통 금지) ── */}
          <div className="relative px-[72px] py-[88px] max-md:px-6 max-md:py-12">
            <h2
              className="text-[clamp(30px,4.6vw,58px)] font-semibold leading-[1.14] tracking-[-0.035em] text-balance"
              style={{ color: TXT_LIGHT }}
              dangerouslySetInnerHTML={{ __html: cta.title }}
            />
            {/* 버튼 2개 — 텍스트는 추후 확정(사장님 2026-07-14) */}
            <div className="mt-10 flex items-center gap-3 max-sm:flex-col max-sm:items-stretch">
              <Link
                href={cta.primaryHref}
                className="inline-flex h-[52px] items-center justify-center bg-white px-8 text-[15px] font-semibold text-[#0a0a0a] transition-colors hover:bg-[#e5e5e5]"
              >
                {cta.primaryText}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-[52px] items-center justify-center px-8 text-[15px] font-semibold transition-colors hover:border-white/40"
                style={{ border: '1px solid #2e2e2e', color: TXT_LIGHT }}
              >
                요금 안내
              </Link>
            </div>
            {/* 한 줄 각주 — 망설임 제거(전문은 /start에서) */}
            <p className="mt-5 text-[14px] leading-[1.6] tracking-[-0.01em] max-md:text-[13px]" style={{ color: TXT_GRAY }}>
              {FOOTNOTE}
            </p>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
