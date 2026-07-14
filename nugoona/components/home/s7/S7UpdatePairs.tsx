'use client';

import FadeUp from '@/components/motion/FadeUp';
import { homeV2 } from '@/lib/content/home';

/**
 * S7 · 업데이트 "매체가 바뀌면, 앱도 바뀝니다" — 변화→대응 페어 타임라인 (사장님 택1 2026-07-14, 구성①).
 *
 * ▣ 개선(사장님 2026-07-14 2차): 왼쪽 변화 설명·화살표 제거 — **Clone02 FeeRow 문법의 미니멀 로그**
 *   (hairline rows: 날짜 | 기능 | 제품색 점+제품명). 인과는 헤드 카피가 담당, 로그는 증거만. 촘촘·짧게.
 *   끝 = NOW 펄스("지금도 계속") → 마무리 = "기존 고객은 추가 비용이 없습니다"(accent 밑줄).
 * ▣ 계승: PromiseTimeline(확정 자산)의 제품색(NC #4d9fff / NA #29d5ff)·NOW 펄스·마무리 강조.
 *   다크 리듬 유지(S6 라이트 → S7 다크 → S8 라이트). FadeUp = 스크롤 진입 시 순차 등장(유지).
 * ▣ 제품명 = 정식 표기 "누구나 콘텐츠"/"누구나 광고"(임의 축약 금지 — 사장님 2026-07-14).
 * ⛔ 특정사 비난·순위·성과 보장 없음(변화 문구는 일반화). 카피 = home.ts homeV2.update (토씨 유지).
 */

const EN = { fontFamily: 'var(--font-en)' } as const;
const TAG: Record<string, string> = { '누구나 콘텐츠': '#4d9fff', '누구나 광고': '#29d5ff' };

export default function S7UpdatePairs() {
  const { head, body, pairs } = homeV2.update; // 마무리 문장 = update.small 토씨(accent 강조를 위해 JSX 분절)
  return (
    <section
      className="relative overflow-hidden px-6 py-[100px] max-md:py-16 flex justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d1525 0%, #070b16 48%, #000 100%)' }}
    >
      {/* 도트 배경 (별도 레이어 + mask — §8.14-6) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(60%_55%_at_50%_42%,#000_18%,transparent_88%)]"
      />

      <div className="relative w-full max-w-[760px]">
        <FadeUp>
          <h2
            className="mb-6 text-[clamp(28px,4.2vw,46px)] font-bold text-white tracking-[-0.03em] leading-[1.18] text-balance"
            dangerouslySetInnerHTML={{ __html: head }}
          />
        </FadeUp>
        <FadeUp delay={0.06}>
          <div className="mb-10 max-w-[560px]">
            {body.map((p, i) => (
              <p
                key={i}
                className="text-[16px] max-md:text-[14px] leading-[1.55] tracking-[-0.01em] text-white/55"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>
        </FadeUp>

        {/* ── 업데이트 로그 — Vercel Clone02 FeeRow 문법 재조립(hairline rows, 촘촘·미니멀) ── */}
        <div className="max-w-[620px] divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {pairs.map((p, i) => (
            <FadeUp key={p.done} delay={Math.min(0.08 + i * 0.04, 0.3)}>
              <div className="flex items-center gap-4 py-3.5 max-md:gap-3">
                <span className="w-[64px] shrink-0 text-[13px] tabular-nums text-white/40" style={EN}>
                  {p.date}
                </span>
                <p className="flex-1 text-[15px] max-md:text-[14px] font-medium leading-[1.45] tracking-[-0.01em] text-white/90">
                  {p.done}
                </p>
                <span className="flex shrink-0 items-center gap-1.5">
                  <span aria-hidden className="h-[6px] w-[6px] rounded-full" style={{ background: TAG[p.product] }} />
                  <span className="text-[12px] font-medium tracking-[-0.01em] text-white/50 max-md:hidden">{p.product}</span>
                </span>
              </div>
            </FadeUp>
          ))}

          {/* NOW — accent 1곳 */}
          <FadeUp delay={0.32}>
            <div className="flex items-center gap-4 py-3.5 max-md:gap-3">
              <span className="w-[64px] shrink-0 text-[13px] font-semibold tracking-[0.06em] text-accent" style={EN}>
                NOW
              </span>
              <p className="flex-1 text-[15px] max-md:text-[14px] font-semibold leading-[1.45] text-white">
                고객에게 필요한 기능을 계속 업데이트합니다.
              </p>
              <span
                aria-hidden
                className="h-[8px] w-[8px] shrink-0 animate-pulse rounded-full bg-accent"
                style={{ boxShadow: '0 0 0 3px rgba(0,112,243,0.25)' }}
              />
            </div>
          </FadeUp>
        </div>

        {/* ── 마무리 — 추가 비용 없음 (카피 토씨 유지, accent 밑줄 강조) ── */}
        <FadeUp delay={0.52}>
          <div className="mt-12 pt-2">
            {/* §8.9 구두점·장식 금지: 대형 문구 밑줄·끝 마침표 없음(accent 색만) */}
            <p className="text-[clamp(20px,2.8vw,28px)] font-bold leading-[1.35] tracking-[-0.02em] text-white">
              새로운 기능에도
              <br />
              기존 고객은 <span className="whitespace-nowrap text-accent">추가 비용이 없습니다</span>
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
