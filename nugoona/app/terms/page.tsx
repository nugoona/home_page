import type { Metadata } from 'next';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';

export const metadata: Metadata = {
  title: '이용약관',
  description: '누구나컴퍼니(NGN) 서비스 이용약관 — 서비스 범위, 요금, 계정과 채널 연동, 책임, 해지.',
};

/**
 * 이용약관 — 외부 API 심사 요건(표준 수준: 서비스 범위·책임·해지).
 * 요건 정본 = docs/_handoff-review-requirements.md. 요금 조항 = CEO 확정(2026-07-20) 반영:
 * 월 정액·첫 달 무료·가입 시점 요금 유지(grandfathering). 성과 비보장 조항 = 정직 원칙(측정·표시만).
 */

const H = 'text-[17px] font-bold text-text-primary tracking-[-0.01em] mt-10 mb-3';
const P = 'text-[14px] text-[#444] leading-[1.75] mb-3';
const LI = 'text-[14px] text-[#444] leading-[1.75]';

export default function TermsPage() {
  return (
    <main>
      <OuterContainer>
        <Section noBorder>
          <div className="max-w-[760px] mx-auto py-20 px-6 max-md:py-14">
            <h1 className="text-[clamp(28px,4vw,40px)] font-bold text-text-primary tracking-[-0.03em] mb-3">
              이용약관
            </h1>
            <p className="text-[14px] text-text-weak mb-2">시행일: 2026년 9월 5일</p>

            <h2 className={H}>제1조 (목적)</h2>
            <p className={P}>
              본 약관은 누구나컴퍼니(이하 &ldquo;회사&rdquo;)가 제공하는 &ldquo;누구나 콘텐츠&rdquo; 및
              &ldquo;누구나 광고&rdquo; 서비스(이하 &ldquo;서비스&rdquo;)의 이용 조건과 회사·이용자 간의
              권리·의무를 정함을 목적으로 합니다.
            </p>

            <h2 className={H}>제2조 (서비스의 내용)</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
              <li className={LI}>
                <b>누구나 콘텐츠</b>: 이용자가 업로드한 사진·메모를 바탕으로 AI가 콘텐츠를 생성하고, 이용자의
                승인 후 이용자가 연결하고 사용 권한을 받은 채널에 발행을 대행하는 서비스. 기본 유료 상품은
                네이버 블로그 운영을 중심으로 하며, 이용 가능한 다른 채널은 심사와 계정 상태에 따라 달라질 수 있음
              </li>
              <li className={LI}>
                <b>누구나 광고</b>: 이용자의 쇼핑몰 매출·방문·광고 데이터를 통합 조회하고, 이용자가 광고를
                직접 제작·게시·관리하도록 돕는 도구형 서비스
              </li>
            </ul>

            <h2 className={H}>제3조 (요금)</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
              <li className={LI}>서비스 요금은 월 정액이며, 요금표는 요금 페이지에 게시합니다.</li>
              <li className={LI}>가입 후 첫 30일은 무료이며, 무료 기간에는 결제 수단 등록을 요구하지 않습니다.</li>
              <li className={LI}>
                가입 시점의 요금은 이용 기간 동안 유지됩니다. 신규 가입 요금이 조정되더라도 기존 이용자에게
                소급 적용되지 않습니다.
              </li>
              <li className={LI}>광고비는 이용자가 광고 매체(Meta·Google)에 직접 결제하며, 회사는 광고비에 대한 수수료를 받지 않습니다.</li>
            </ul>

            <h2 className={H}>제4조 (계정 및 채널 연동)</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
              <li className={LI}>이용자는 본인 소유의 계정·채널만 연결해야 하며, 연동 정보의 관리 책임은 이용자에게 있습니다.</li>
              <li className={LI}>이용자는 언제든지 서비스 내 설정 또는 각 플랫폼의 계정 설정에서 연동을 해제할 수 있습니다.</li>
            </ul>

            <h2 className={H}>제5조 (회사의 의무와 책임의 한계)</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
              <li className={LI}>회사는 서비스를 안정적으로 제공하기 위해 노력합니다.</li>
              <li className={LI}>
                콘텐츠의 발행·게재 여부와 검색 노출 순위, 광고 게재·성과는 각 플랫폼(네이버·Meta·Google 등)의
                정책과 알고리즘에 따라 결정되며, 회사는 특정 순위·노출량·매출 등의 성과를 약속하지 않습니다.
                서비스는 현황을 측정해 보여드릴 뿐입니다.
              </li>
              <li className={LI}>
                각 플랫폼의 정책 변경·장애 등 회사가 통제할 수 없는 사유로 발생한 발행 실패·지연에 대해
                회사는 책임을 지지 않되, 확인되는 즉시 이용자에게 알립니다.
              </li>
            </ul>

            <h2 className={H}>제6조 (이용자의 의무)</h2>
            <p className={P}>
              이용자는 타인의 권리를 침해하거나 법령·각 플랫폼 정책에 위반되는 콘텐츠의 생성·발행을 요청해서는
              안 되며, 위반으로 발생하는 책임은 이용자에게 있습니다.
            </p>

            <h2 className={H}>제7조 (해지 및 환불)</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
              <li className={LI}>이용자는 언제든지 해지할 수 있으며, 해지 시 다음 결제일부터 요금이 청구되지 않습니다.</li>
              <li className={LI}>이미 결제된 기간의 요금은 관계 법령이 정한 경우를 제외하고 일할 환불되지 않습니다.</li>
              <li className={LI}>계정과 자료의 삭제는 개인정보처리방침의 계정 및 자료 삭제 요청 절차에 따라 신청할 수 있습니다.</li>
            </ul>

            <h2 className={H}>제8조 (약관의 변경)</h2>
            <p className={P}>
              회사가 약관을 변경하는 경우 시행 7일 전(이용자에게 불리한 변경은 30일 전)부터 공지합니다.
            </p>

            <h2 className={H}>제9조 (문의)</h2>
            <p className={P}>
              서비스·약관에 관한 문의: 누구나컴퍼니 (대표 최우현) · oscar@nugoona.co.kr · 010-2781-4543
            </p>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
