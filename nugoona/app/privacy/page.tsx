import type { Metadata } from 'next';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '누구나컴퍼니(NGN) 개인정보처리방침 — 수집 항목, 이용 목적, 보유 기간, 처리위탁, 이용자 권리.',
};

/**
 * 개인정보처리방침 — 외부 API 심사 4종(구글 GBP·메타 App Review·네이버·카카오) 공통 요건.
 * 요건 정본 = docs/_handoff-review-requirements.md (2026-07-21 Upload 세션 핸드오프).
 * 원칙: 로그인 없이 접근되는 일반 HTML(크롤러 가독) / 실제 수집·처리 사실만 서술(미구현 서술 금지) /
 *       URL(/privacy)은 심사 제출 후 변경 금지.
 */

const H = 'text-[17px] font-bold text-text-primary tracking-[-0.01em] mt-10 mb-3';
const P = 'text-[14px] text-[#444] leading-[1.75] mb-3';
const LI = 'text-[14px] text-[#444] leading-[1.75]';

export default function PrivacyPage() {
  return (
    <main>
      <OuterContainer>
        <Section noBorder>
          <div className="max-w-[760px] mx-auto py-20 px-6 max-md:py-14">
            <h1 className="text-[clamp(28px,4vw,40px)] font-bold text-text-primary tracking-[-0.03em] mb-3">
              개인정보처리방침
            </h1>
            <p className="text-[14px] text-text-weak mb-2">시행일: 2026년 9월 5일</p>
            <p className={P}>
              누구나컴퍼니(이하 &ldquo;회사&rdquo;)는 &ldquo;누구나 콘텐츠&rdquo;(upload.nugoona.co.kr)와
              &ldquo;누구나 광고&rdquo; 서비스(이하 &ldquo;서비스&rdquo;)를 제공하며, 개인정보 보호법 등 관련
              법령을 준수합니다. 본 방침은 회사가 어떤 정보를 수집하고, 왜 수집하며, 어떻게 보관·파기하는지를
              설명합니다.
            </p>

            <h2 className={H}>1. 수집하는 개인정보 항목</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
              <li className={LI}>
                <b>회원 정보</b>: 이메일, 이름(또는 닉네임) — 회원 가입·로그인(네이버·카카오·구글 소셜 로그인
                포함) 시 수집합니다.
              </li>
              <li className={LI}>
                <b>채널 연동 정보</b>: 인스타그램·페이스북 페이지 연동 정보 및 액세스 토큰, 구글 비즈니스
                프로필 연동 정보 및 리프레시 토큰, 네이버 블로그 발행을 위한 세션 정보 — 이용자가 각 채널
                연결에 동의할 때 수집합니다.
              </li>
              <li className={LI}>
                <b>광고·성과 연동 정보</b>(누구나 광고): Meta·Google 광고 계정 연동 토큰, 쇼핑몰(카페24)·Google
                애널리틱스(GA4) 연동 정보 — 성과 조회와 광고 게시를 위해 이용자가 연결할 때 수집합니다.
              </li>
              <li className={LI}>
                <b>콘텐츠 자료</b>: 이용자가 업로드한 사진, 메모, 음성 메모 — 콘텐츠 생성을 위해 수집합니다.
              </li>
            </ul>

            <h2 className={H}>2. 수집·이용 목적</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
              <li className={LI}>업로드한 사진·메모를 바탕으로 한 콘텐츠(글·이미지) 생성</li>
              <li className={LI}>
                이용자가 연결하고 사용 권한을 승인한 채널에 이용자를 대신한 콘텐츠 발행
              </li>
              <li className={LI}>광고 제작·게시와 매출·광고 성과 데이터의 조회·리포트 제공</li>
              <li className={LI}>회원 관리, 고객 문의 응대, 서비스 공지</li>
            </ul>

            <h2 className={H}>3. 보유·이용 기간</h2>
            <p className={P}>
              회원 탈퇴 또는 채널 연동 해제 시 해당 정보(연동 토큰 포함)를 지체 없이 파기합니다. 다만
              전자상거래 등에서의 소비자 보호에 관한 법률 등 관계 법령에 따라 보존이 필요한 정보는 법령이
              정한 기간 동안 보관 후 파기합니다.
            </p>

            <h2 className={H}>4. 파기 절차 및 방법</h2>
            <p className={P}>
              전자적 파일 형태의 정보는 복구할 수 없는 방법으로 영구 삭제하며, 그 외 기록물은 분쇄 또는
              소각합니다.
            </p>

            <h2 className={H}>5. 처리위탁 및 제3자 전송</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
              <li className={LI}>
                <b>Meta Platforms, Inc.</b> — 이용자가 연결한 인스타그램·페이스북 페이지에 콘텐츠·광고를
                발행하기 위한 API 전송
              </li>
              <li className={LI}>
                <b>Google LLC</b> — 구글 비즈니스 프로필 소식 발행, 구글 광고 게시·성과 조회를 위한 API 전송
                및 클라우드 인프라 운영
              </li>
              <li className={LI}>
                <b>Anthropic, PBC</b> — AI 콘텐츠 생성을 위한 텍스트·이미지 처리(생성 목적 외 이용되지 않음)
              </li>
            </ul>
            <p className={P}>회사는 위 목적 외로 개인정보를 제3자에게 판매하거나 제공하지 않습니다.</p>

            <h2 className={H}>6. 이용자의 권리</h2>
            <p className={P}>
              이용자는 언제든지 자신의 개인정보를 열람·정정·삭제하거나 처리 정지를 요구할 수 있으며, 아래
              연락처로 요청하시면 지체 없이 처리합니다. 채널 연동은 서비스 내 설정 또는 각 플랫폼(메타·구글
              등)의 계정 설정에서 앱 권한을 회수하는 방법으로 언제든지 해제할 수 있습니다.
            </p>

            <h2 id="account-deletion" className={`${H} scroll-mt-24`}>7. 계정 및 자료 삭제 요청</h2>
            <ol className="list-decimal pl-5 flex flex-col gap-1.5 mb-3">
              <li className={LI}>누구나 콘텐츠 앱에서 설정, 고객 문의, 새 문의 순서로 들어갑니다.</li>
              <li className={LI}>제목에 &ldquo;계정 삭제 요청&rdquo;을 적어 보내거나 oscar@nugoona.co.kr로 요청합니다.</li>
              <li className={LI}>회사는 요청한 계정의 본인 여부를 확인한 뒤 회원 정보, 업로드 자료, 보관 중인 채널 연결 정보를 삭제합니다.</li>
              <li className={LI}>법령상 보관 의무가 있는 결제 기록 등은 정해진 기간 동안 분리 보관한 뒤 삭제합니다.</li>
            </ol>
            <p className={P}>
              메타·구글 등 외부 서비스에 남은 앱 권한은 각 서비스의 계정 설정에서도 직접 회수할 수 있습니다.
              계정을 삭제하면 작성 중인 자료와 서비스 이용 기록을 다시 복구할 수 없습니다.
            </p>

            <h2 className={H}>8. 안전성 확보 조치</h2>
            <p className={P}>
              채널 연동 자격 증명(토큰 등)은 암호화하여 저장하며, 접근 권한을 최소화해 관리합니다.
            </p>

            <h2 className={H}>9. 개인정보 보호책임자</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
              <li className={LI}>책임자: 최우현 (대표)</li>
              <li className={LI}>이메일: oscar@nugoona.co.kr</li>
              <li className={LI}>전화: 010-2781-4543</li>
            </ul>

            <h2 className={H}>10. 방침 변경</h2>
            <p className={P}>
              본 방침이 변경되는 경우 시행 7일 전부터 서비스 공지사항을 통해 알립니다.
            </p>

            <div className="border-t border-border-default mt-12 pt-10">
              <h2 className="text-[17px] font-bold text-text-primary tracking-[-0.01em] mb-3">
                English Summary (Privacy Policy)
              </h2>
              <p className={P}>
                Nugoona Company (&ldquo;NGN&rdquo;) operates &ldquo;Nugoona Contents&rdquo;
                (upload.nugoona.co.kr) and &ldquo;Nugoona Ads&rdquo;. We collect: account information (email,
                name via social login), channel connection data and access tokens (Instagram/Facebook Pages,
                Google Business Profile refresh token, ad account tokens), and user-uploaded photos and notes.
                Purpose: generating content with AI and publishing it to the channels the user has connected,
                on the user&apos;s behalf, and providing ad performance reports. Data is transmitted to Meta
                and Google APIs solely for publishing and reporting, and processed by Anthropic solely for
                content generation. We delete tokens and personal data without delay upon account deletion or
                channel disconnection; users may revoke the app&apos;s permissions at any time in their
                Meta/Google account settings. Account deletion can be requested in the Nugoona Contents app
                under Settings, Customer Support, New Inquiry, or by email. Contact: oscar@nugoona.co.kr
                (Data Protection Officer: Woohyun Choi).
              </p>
            </div>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
