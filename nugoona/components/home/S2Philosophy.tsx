'use client';

import FadeUp from '@/components/motion/FadeUp';
import { s2Philosophy as s2 } from '@/lib/content/home';

/**
 * S2 · 공통 철학 (홈 개편 확정 구조) — 5블록 독립 스캐폴드.
 * 블록: Hook → Problem → Turning Point → Solution → Closing (S3_STRUCTURE.md).
 * ⚠️ 카피 미확정: 값이 비면 개발용 Placeholder를 렌더(카피는 PM 작성 대기).
 * ⚠️ 목업 없음(PM 카피 확정 후 결정). 기존 Philosophy.tsx는 삭제하지 않고 비교용으로 보존.
 * 각 블록은 FadeUp·spacing·줄바꿈·모바일을 독립적으로 조절할 수 있게 함수로 분리.
 * 톤·토큰·애니메이션은 기존 철학 섹션 계승(색·디자인 변경 없음).
 */

/* 카피 미확정 블록 표시 — 구조 확인용(실제 카피 아님) */
function Placeholder({ label }: { label: string }) {
  return (
    <span className="inline-block border border-dashed border-border-default px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted/50">
      {label} · 카피 대기
    </span>
  );
}

/* ── Hook — 시대·상황 선언 한 방(1문장). 헤드 스케일. ── */
function Hook() {
  return (
    <FadeUp>
      <div className="mx-auto max-w-[680px] text-center">
        {s2.hook ? (
          <h2
            className="text-[clamp(26px,4.5vw,42px)] font-bold text-text-primary tracking-[-0.03em] leading-[1.3] text-balance"
            dangerouslySetInnerHTML={{ __html: s2.hook }}
          />
        ) : (
          <Placeholder label="Hook" />
        )}
      </div>
    </FadeUp>
  );
}

/* ── Problem — 기존 방식의 한계(2~3문장, 공통). ── */
function Problem() {
  const lines = s2.problem.filter(Boolean);
  return (
    <FadeUp delay={0.06}>
      <div className="mx-auto max-w-[560px]">
        {lines.length ? (
          <div className="space-y-2">
            {lines.map((l, i) => (
              <p
                key={i}
                className="text-[18px] max-md:text-[15px] font-medium text-text-body leading-[1.5] tracking-[-0.01em]"
                dangerouslySetInnerHTML={{ __html: l }}
              />
            ))}
          </div>
        ) : (
          <Placeholder label="Problem" />
        )}
      </div>
    </FadeUp>
  );
}

/* ── Turning Point — "왜 지금"(알고리즘·AI 전환, 2~3문장, 공통). ── */
function TurningPoint() {
  const lines = s2.turningPoint.filter(Boolean);
  return (
    <FadeUp delay={0.06}>
      <div className="mx-auto max-w-[560px]">
        {lines.length ? (
          <div className="space-y-2">
            {lines.map((l, i) => (
              <p
                key={i}
                className="text-[18px] max-md:text-[15px] font-medium text-text-body leading-[1.5] tracking-[-0.01em]"
                dangerouslySetInnerHTML={{ __html: l }}
              />
            ))}
          </div>
        ) : (
          <Placeholder label="Turning Point" />
        )}
      </div>
    </FadeUp>
  );
}

/* ── Solution — 공통 주제문 + 콘텐츠 1 + 광고 1 + 마무리(균형). ── */
function Solution() {
  const { common, content, ad, wrap } = s2.solution;
  const any = common || content || ad || wrap;
  return (
    <FadeUp delay={0.06}>
      <div className="mx-auto max-w-[600px]">
        {any ? (
          <div className="space-y-3">
            {common && (
              <p
                className="text-[20px] max-md:text-[16px] font-semibold text-text-primary leading-[1.4] tracking-[-0.02em]"
                dangerouslySetInnerHTML={{ __html: common }}
              />
            )}
            {content && (
              <p
                className="text-[16px] max-md:text-[14px] text-text-body leading-[1.5] tracking-[-0.01em]"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
            {ad && (
              <p
                className="text-[16px] max-md:text-[14px] text-text-body leading-[1.5] tracking-[-0.01em]"
                dangerouslySetInnerHTML={{ __html: ad }}
              />
            )}
            {wrap && (
              <p
                className="text-[16px] max-md:text-[14px] text-text-body leading-[1.5] tracking-[-0.01em]"
                dangerouslySetInnerHTML={{ __html: wrap }}
              />
            )}
          </div>
        ) : (
          <Placeholder label="Solution (공통·콘텐츠·광고·마무리)" />
        )}
      </div>
    </FadeUp>
  );
}

/* ── Closing — 철학 봉인 한 문장(다음 섹션으로 다리). ── */
function Closing() {
  return (
    <FadeUp delay={0.06}>
      <div className="mx-auto max-w-[560px] text-center">
        {s2.closing ? (
          <p
            className="text-[clamp(20px,2.6vw,28px)] font-semibold text-text-primary leading-[1.35] tracking-[-0.02em] text-balance"
            dangerouslySetInnerHTML={{ __html: s2.closing }}
          />
        ) : (
          <Placeholder label="Closing" />
        )}
      </div>
    </FadeUp>
  );
}

export default function S2Philosophy() {
  return (
    <div className="py-[120px] px-6 max-md:py-16 flex justify-center">
      {/* 블록 간 간격은 여기(gap)에서 독립 조절 — 목업 자리는 아직 비움 */}
      <div className="w-full max-w-[960px] flex flex-col gap-24 max-md:gap-16">
        <Hook />
        <Problem />
        <TurningPoint />
        <Solution />
        <Closing />
      </div>
    </div>
  );
}
