import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import DashboardGlimpse from '@/components/home/DashboardGlimpse';

const EN = { fontFamily: 'var(--font-en)' } as const;

/**
 * 시안 실험실 (임시) — features의 FeatureRow 골격을 홈 광고 섹션에 적용.
 * Section crossMarks(격자+십자 도형) + 쇼케이스 헤더 + [번호칩 + 디바이더선 + 실목업].
 * 식상한 수치 나열 제거. 방향 확정되면 홈에 이식하고 이 파일 삭제.
 */
export default function Lab() {
  return (
    <main>
      <OuterContainer>
        {/* 쇼케이스 헤더 */}
        <Section crossMarks>
          <div className="py-24 px-12 max-md:py-14 max-md:px-6">
            <div className="max-w-[1080px] mx-auto">
              <p className="text-[12px] font-semibold text-accent tracking-[0.12em] uppercase mb-3" style={EN}>
                누구나 광고
              </p>
              <h2 className="text-[clamp(30px,4.5vw,46px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.12] mb-5">
                광고를 한 화면에서<br />이해하며 운영하세요
              </h2>
              <p className="text-[17px] text-text-body leading-[1.65] max-w-[560px]">
                매출·광고·유입이 흩어져 있으면 뭘 고쳐야 할지 안 보입니다.
                NGN은 한 화면에 모아 사람 말로 읽어 줍니다.
              </p>
            </div>
          </div>
        </Section>

        {/* FeatureRow — 번호칩 + 디바이더선 + 실목업 */}
        <Section>
          <div className="py-20 px-12 max-w-[1080px] mx-auto max-md:py-12 max-md:px-6">
            <div className="grid grid-cols-2 gap-16 items-center max-md:grid-cols-1 max-md:gap-10">
              {/* 좌: 실제 대시보드 목업 */}
              <div className="flex justify-center">
                <DashboardGlimpse />
              </div>

              {/* 우: 번호칩 + 디바이더 + 텍스트 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="w-8 h-8 flex items-center justify-center text-[12px] font-bold text-white bg-[#171717] shrink-0"
                    style={EN}
                  >
                    01
                  </span>
                  <div className="flex-1 h-px bg-border-default" />
                </div>
                <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.25] mb-4">
                  흩어진 성과를<br />한 화면에서 이해합니다
                </h3>
                <p className="text-[15px] text-text-body leading-[1.7] mb-5">
                  쇼핑몰 매출, 메타·구글 광고, 방문자 유입을 하나로 모읍니다.
                  광고가 매출로 이어졌는지, 어디를 고쳐야 하는지 바로 읽힙니다.
                </p>
                <p className="text-[14px] text-text-weak" style={EN}>Cafe24 · Meta · Google · GA4</p>
              </div>
            </div>
          </div>
        </Section>

        {/* FeatureRow 2 — alt 교차 + 번호칩 02 (좌우 반전) */}
        <Section alt>
          <div className="py-20 px-12 max-w-[1080px] mx-auto max-md:py-12 max-md:px-6">
            <div className="grid grid-cols-2 gap-16 items-center max-md:grid-cols-1 max-md:gap-10">
              {/* 좌: 텍스트 (반전) */}
              <div className="max-md:order-2">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="w-8 h-8 flex items-center justify-center text-[12px] font-bold text-white bg-[#171717] shrink-0"
                    style={EN}
                  >
                    02
                  </span>
                  <div className="flex-1 h-px bg-border-default" />
                </div>
                <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-text-primary tracking-[-0.02em] leading-[1.25] mb-4">
                  숫자를 사람 말로<br />풀어 드립니다
                </h3>
                <p className="text-[15px] text-text-body leading-[1.7] mb-5">
                  매월 1일, AI가 지난달 성과를 글로 정리합니다.
                  "무엇이 올랐고 어디를 손봐야 하는지"를 보고서가 아니라 대화로 확인하세요.
                </p>
                <p className="text-[14px] text-text-weak" style={EN}>AI Monthly Report · Chat Control</p>
              </div>

              {/* 우: 목업 (반전) */}
              <div className="flex justify-center max-md:order-1">
                <DashboardGlimpse />
              </div>
            </div>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
