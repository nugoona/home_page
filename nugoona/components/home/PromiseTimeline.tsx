'use client';

import FadeUp from '@/components/motion/FadeUp';
import { promise } from '@/lib/content/home';

/**
 * S4 · 회사 약속 = 변화대응·무료 업데이트 (사장님 확정 2026-07-12)
 * "AI 시대엔 완성된 앱이 없다 → 매체 바뀌면 신속 반영, 추가 비용 없이 업데이트."
 * 다크 세로 타임라인(실제 기능 + 대표 가상 날짜). 여백강박 제거 — 텅 빈 대형 섹션 아님.
 * 제품색 = 로고 계승(콘텐츠 NC #4d9fff · 광고 NA #29d5ff). accent(브랜드블루)는 "계속 업데이트" 1곳만.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;
const TAG: Record<string, string> = { 콘텐츠: '#4d9fff', 광고: '#29d5ff' };

export default function PromiseTimeline() {
  return (
    <section className="bg-[#0a0a0a] px-6 py-[120px] max-md:py-20 flex justify-center">
      <div className="w-full max-w-[720px]">
        <FadeUp>
          <p className="mb-5 text-[13px] font-bold tracking-[0.08em] text-accent" style={EN}>
            OUR PROMISE
          </p>
        </FadeUp>
        <FadeUp delay={0.06}>
          <h2
            className="mb-6 text-[clamp(30px,4.6vw,50px)] font-bold text-white tracking-[-0.03em] leading-[1.12]"
            dangerouslySetInnerHTML={{ __html: promise.title }}
          />
        </FadeUp>
        <FadeUp delay={0.12}>
          <div className="mb-16 max-w-[600px] space-y-4">
            {promise.sub.map((para, i) => (
              <p
                key={i}
                className="text-[16px] max-md:text-[14px] leading-[1.55] tracking-[-0.01em] text-white/55"
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}
          </div>
        </FadeUp>

        {/* 세로 타임라인 */}
        <div className="relative pl-7">
          {/* 세로 라인 */}
          <span aria-hidden className="absolute left-[3px] top-2 bottom-9 w-px bg-white/12" />

          <div className="flex flex-col gap-7">
            {promise.log.map((item, i) => (
              <FadeUp key={i} delay={Math.min(0.16 + i * 0.05, 0.5)}>
                <div className="relative">
                  {/* 노드 (제품색) */}
                  <span
                    aria-hidden
                    className="absolute -left-7 top-[7px] w-[7px] h-[7px] rounded-full"
                    style={{ background: TAG[item.product], boxShadow: `0 0 0 3px ${TAG[item.product]}22` }}
                  />
                  <div className="flex items-center gap-2.5">
                    <span className="text-[13px] tabular-nums text-white/40" style={EN}>
                      {item.date}
                    </span>
                    <span className="text-[11px] font-semibold" style={{ color: TAG[item.product] }}>
                      {item.product}
                    </span>
                  </div>
                  <p className="mt-1 text-[15px] leading-[1.5] text-white/85">{item.text}</p>
                </div>
              </FadeUp>
            ))}

            {/* 현재 진행 — accent 1곳 */}
            <FadeUp delay={0.56}>
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute -left-7 top-[6px] w-[9px] h-[9px] rounded-full bg-accent animate-pulse"
                  style={{ boxShadow: '0 0 0 3px rgba(0,112,243,0.25)' }}
                />
                <span className="text-[13px] tabular-nums text-accent" style={EN}>NOW</span>
                <p className="mt-1 text-[15px] leading-[1.5] font-semibold text-white">지금도 계속 업데이트됩니다.</p>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* ── 강조 마무리 — "추가 요금 없이"를 정면으로(섹션 심장) ── */}
        <FadeUp delay={0.66}>
          <div className="mt-14 pt-10 border-t border-white/10">
            <p className="text-[13px] tracking-[0.04em] text-white/45 mb-3">여기까지, 그리고 앞으로도</p>
            <p className="text-[clamp(24px,3.4vw,36px)] font-bold text-white tracking-[-0.02em] leading-[1.3]">
              기존 고객은{' '}
              <span className="relative whitespace-nowrap text-accent">
                추가 요금이 없습니다
                <span aria-hidden className="absolute left-0 -bottom-1 h-[3px] w-full rounded-full bg-accent/35" />
              </span>
              .
            </p>
            <p
              className="mt-4 text-[15px] max-md:text-[14px] leading-[1.55] tracking-[-0.01em] text-white/55 max-w-[520px] md:leading-[1.35]"
              dangerouslySetInnerHTML={{ __html: '한 번 시작한 요금 그대로<br>끝까지 무료 업데이트를 진행합니다.<br>매체가 변하면 콘텐츠도 변해야 합니다.' }}
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
