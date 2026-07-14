'use client';

import FadeUp from '@/components/motion/FadeUp';

/**
 * 홈 V2 범용 텍스트 섹션 (WHY·우리의 방식·회사 철학·자산·업데이트 공용).
 * Head + Sub 문단[] + Small(선택). 왼쪽정렬 + 블록 중앙(mx-auto). <br>는 카피에 직접.
 * head만 필요한 섹션(예: S4 섹션헤드)은 body=[]로 넘긴다.
 * 색·토큰·애니메이션은 기존 섹션 계승(디자인 변경 없음).
 */
export default function TextSection({
  head,
  body = [],
  small,
  dark = false,
}: {
  head: string;
  body?: string[];
  small?: string;
  dark?: boolean;
}) {
  const lines = body.filter(Boolean);
  return (
    <div className={`px-6 py-[110px] max-md:py-16 flex justify-center ${dark ? 'bg-[#0a0a0a]' : ''}`}>
      <div className="w-full max-w-[680px]">
        <FadeUp>
          <h2
            className={`text-[clamp(26px,4vw,40px)] font-bold tracking-[-0.03em] leading-[1.25] text-balance ${lines.length || small ? 'mb-8' : ''} ${dark ? 'text-white' : 'text-text-primary'}`}
            dangerouslySetInnerHTML={{ __html: head }}
          />
        </FadeUp>
        {lines.length > 0 && (
          <FadeUp delay={0.08}>
            <div className="max-w-[560px] space-y-4">
              {lines.map((p, i) => (
                <p
                  key={i}
                  className={`text-[16px] max-md:text-[14px] leading-[1.6] tracking-[-0.01em] ${dark ? 'text-white/60' : 'text-text-body'}`}
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              ))}
            </div>
          </FadeUp>
        )}
        {small && (
          <FadeUp delay={0.14}>
            <p
              className={`mt-8 text-[14px] max-md:text-[13px] leading-[1.5] tracking-[-0.01em] ${dark ? 'text-white/45' : 'text-text-weak'}`}
              dangerouslySetInnerHTML={{ __html: small }}
            />
          </FadeUp>
        )}
      </div>
    </div>
  );
}
