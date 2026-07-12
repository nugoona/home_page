'use client';

import FadeUp from '@/components/motion/FadeUp';
import { philosophy } from '@/lib/content/home';
import { RankMock, AdChatMock } from '@/components/styles/bricks/PhilosophyMocks';

/**
 * S3 · 왜 만들었나 (라이트, 롱폼 3막 — 글 주인공 + 목업 지그재그 = 벽돌3 C안 확정)
 * 카피 = home.ts philosophy(축약안 v1). lines[] = 문장 단위 줄바꿈.
 * 2막=콘텐츠 노출 측정(RankMock) · 3막=광고 AI 챗봇(AdChatMock) — 두 제품 균형(§8.7-I 거듦).
 */
const MOCKS: Record<number, { node: React.ReactNode; side: 'left' | 'right' | 'below' } | null> = {
  0: null,
  1: { node: <RankMock />, side: 'right' },
  2: { node: <AdChatMock />, side: 'below' }, // 채팅 UI는 세로로 길어 글 아래 중앙(사장님 2026-07-12)
};

function Body({ title, lines, index }: { title: string; lines: string[]; index: number }) {
  return (
    <div className="max-w-[540px]">
      <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.08em] text-[#0070f3]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="mb-5 text-[clamp(23px,3vw,31px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.25]">
        {title}
      </h3>
      <div className="space-y-1">
        {lines.map((l, i) => (
          <p key={i} className="text-[16px] max-md:text-[15px] text-text-body leading-[1.55]">
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Philosophy() {
  return (
    <div className="py-[120px] px-6 max-md:py-16 flex justify-center">
      <div className="w-full max-w-[960px]">
        <FadeUp>
          <p className="text-[15px] max-md:text-[14px] text-text-weak mb-20 max-md:mb-14">
            {philosophy.opening}
          </p>
        </FadeUp>

        <div className="flex flex-col gap-24 max-md:gap-16">
          {philosophy.acts.map((act, i) => {
            const mock = MOCKS[i];
            const body = <Body title={act.title} lines={act.lines} index={i} />;

            if (!mock) {
              return (
                <FadeUp key={i}>
                  <div className="max-w-[560px]">{body}</div>
                </FadeUp>
              );
            }

            if (mock.side === 'below') {
              return (
                <FadeUp key={i} delay={0.06}>
                  <div className="flex flex-col items-start gap-10 max-md:gap-8">
                    {body}
                    {mock.node}
                  </div>
                </FadeUp>
              );
            }

            return (
              <FadeUp key={i} delay={0.06}>
                <div className="flex items-center justify-start gap-16 max-md:flex-col max-md:items-start max-md:gap-8">
                  {mock.side === 'left' ? (
                    <>
                      {mock.node}
                      {body}
                    </>
                  ) : (
                    <>
                      {body}
                      {mock.node}
                    </>
                  )}
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </div>
  );
}
