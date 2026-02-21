import type { Metadata } from 'next';
import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import CounterUp from '@/components/motion/CounterUp';

export const metadata: Metadata = {
  title: '소개',
  description: 'NGN은 누구나컴퍼니가 만든 이커머스 광고·분석 플랫폼입니다. 대행사 없이도 누구나 광고를 만들고, 성과를 확인하고, 경쟁사를 분석할 수 있습니다.',
};

const stats = [
  { value: 5, suffix: '개', label: '플랫폼 통합' },
  { value: 12, suffix: '+', label: '대시보드 위젯' },
  { value: 6, suffix: '종', label: '광고 유형 지원' },
  { value: 9, suffix: '개', label: 'AI 분석 섹션' },
];

export default function AboutPage() {
  return (
    <main>
      <OuterContainer>
        {/* Hero */}
        <Section crossMarks>
          <div className="py-24 px-12 text-center max-md:py-16 max-md:px-6">
            <FadeUp>
              <p className="text-[12px] font-semibold text-accent tracking-[0.1em] uppercase mb-4" style={{ fontFamily: 'var(--font-en)' }}>
                About NGN
              </p>
              <h1 className="text-[clamp(32px,5vw,52px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] mb-6 max-w-[720px] mx-auto">
                대행사 없이도,<br />누구나 광고를 할 수 있어야 합니다
              </h1>
              <p className="text-[17px] text-text-body leading-[1.7] max-w-[560px] mx-auto">
                NGN은 이커머스 사업자가 직접 광고를 만들고 운영하며 데이터 기반으로 의사결정할 수 있도록 돕는 플랫폼입니다.
              </p>
            </FadeUp>
          </div>
        </Section>

        {/* Stats */}
        <Section alt>
          <div className="py-16 px-12 max-md:py-12 max-md:px-6">
            <FadeUp>
              <div className="grid grid-cols-4 gap-5 max-w-[960px] mx-auto max-md:grid-cols-2 max-sm:grid-cols-1">
                {stats.map((s, i) => (
                  <div key={i} className="border border-border-default p-8 text-center">
                    <p className="text-[clamp(36px,5vw,48px)] font-semibold text-text-primary mb-2" style={{ fontFamily: 'var(--font-en)' }}>
                      <CounterUp target={s.value} suffix={s.suffix} />
                    </p>
                    <p className="text-[14px] text-text-body">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Vision */}
        <Section crossMarks>
          <div className="py-20 px-12 max-md:py-14 max-md:px-6">
            <FadeUp>
              <div className="max-w-[720px] mx-auto">
                <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.2] mb-8">
                  우리가 만드는 것
                </h2>
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-[18px] font-semibold text-text-primary mb-2">AdCanvas</h3>
                    <p className="text-[15px] text-text-body leading-[1.65]">
                      상품 URL 하나로 메타·구글 광고를 만들고 관리합니다. 복잡한 광고 관리자 없이, 원클릭으로.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-text-primary mb-2">Dashboard</h3>
                    <p className="text-[15px] text-text-body leading-[1.65]">
                      카페24 매출, 광고 성과, 방문자 데이터를 하나의 화면에서 실시간으로 확인합니다. AI가 매달 사업을 분석합니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-text-primary mb-2">Trend</h3>
                    <p className="text-[15px] text-text-body leading-[1.65]">
                      29CM, Ably의 베스트셀러를 매주 자동으로 수집합니다. 경쟁사 동향을 놓치지 않습니다.
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Company info */}
        <Section alt>
          <div className="py-16 px-12 max-md:py-12 max-md:px-6">
            <FadeUp>
              <div className="max-w-[720px] mx-auto">
                <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.2] mb-6">
                  누구나컴퍼니
                </h2>
                <p className="text-[15px] text-text-body leading-[1.7] mb-6">
                  누구나컴퍼니는 이커머스 사업자를 위한 기술 도구를 만듭니다.
                  광고 대행에 의존하지 않고, 사업자 스스로가 데이터를 보고 결정할 수 있는 환경을 만들고 있습니다.
                </p>
                <div className="flex flex-col gap-2 text-[13px] text-text-weak">
                  <p>사업자등록번호: 376-05-02792</p>
                  <p>이메일: contact@nugoona.co.kr</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* CTA */}
        <Section noBorder>
          <div className="py-20 px-12 text-center max-md:py-16 max-md:px-6"
            style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #151515 100%)' }}
          >
            <FadeUp>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-white tracking-[-0.02em] mb-3">
                지금 시작하면 첫 달 무료
              </h2>
              <p className="text-[15px] text-white/50 mb-10">선착순 10개 업체 한정</p>
              <Link href="/start" className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-white text-text-primary border border-white hover:bg-[#e0e0e0] transition-all">
                무료로 시작하기
              </Link>
            </FadeUp>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
