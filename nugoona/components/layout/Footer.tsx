'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  /* ★2026-09-18 연락처 칸 시안 — 비교 경로(/home2·/content2·/ads2)에서만 다르게 그린다.
     원본 경로의 출력은 한 글자도 바뀌지 않는다(아래 preview 분기 밖은 손대지 않았다).

     왜: docs/_handoff-dashboard-support-escalation.md (CEO 확정 2026-07-20)
     "전화·실시간 상담 = 안 한다. 대표번호는 화면에서 내리는 방향."
     지금 푸터는 "연락처 / 대표번호"라 전화 상담 창구로 읽힌다.

     🛑 다만 이 푸터는 전자상거래법상 **사업자 정보 표시란**이다(통신판매업 신고번호 동거).
     표시 항목에 전화번호가 들어가므로 **완전 삭제는 하지 않았다** — 사장님·법무 확인 사항.
     시안이 한 것: 라벨을 "연락처 → 문의"로, 전화를 상담 창구 자리에서 **사업 정보 칸으로 이동**.
     읽는 순서가 이메일 먼저가 되고, 전화는 법정 표시로만 남는다. */
  const pathname = usePathname();
  const preview = /^\/(home2|content2|ads2)(\/|$)/.test(pathname ?? '');

  return (
    <footer className="border-t border-border-default bg-white relative">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            {/* ★2026-10-08 새 로고(NUGOONA)에 맞춰 "(NGN)" → "(NUGOONA)" — 메뉴 로고 영문과 회사명의 관계를 푸터에서 풀어준다 */}
            <p className="text-[13px] font-semibold text-text-primary mb-1">누구나 컴퍼니(NUGOONA)</p>
            <p className="text-[13px] text-text-weak">대표 최우현</p>
            <p className="text-[13px] text-text-weak">주소 : 서울시 노원구 공릉로34길 62</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold text-text-primary mb-1">사업 정보</p>
            <p className="text-[13px] text-text-weak">사업자등록번호 : 544-02-02671</p>
            <p className="text-[13px] text-text-weak">통신판매업신고번호 : 2023-서울노원-1648</p>
            {preview && <p className="text-[13px] text-text-weak">전화 : 010-2781-4543</p>}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold text-text-primary mb-1">{preview ? '문의' : '연락처'}</p>
            {!preview && <p className="text-[13px] text-text-weak">대표번호 : 010-2781-4543</p>}
            <p className="text-[13px] text-text-weak">이메일문의 : oscar@nugoona.co.kr</p>
          </div>
        </div>
        {/* 방침·약관 링크 — API 심사 요건(로그인 없는 공개 URL, docs/_handoff-review-requirements.md) */}
        {/* ⚠ 링크가 4→5개가 되면서 모바일(390)에서 글자가 "콘텐츠/앱/로그인"으로 잘렸다(2026-09-18 실측).
            wrap 허용 + 링크별 nowrap + 가로 간격 축소로 해소. 링크를 더 늘릴 때 여기를 다시 볼 것. */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 [&>a]:whitespace-nowrap max-md:gap-x-3">
          {/* ★2026-09-18 "앱 로그인" 하나 → 제품별 둘로 분리(사장님 확정).
              구 상태는 콘텐츠 앱으로만 가서, 광고만 쓰는 손님이 누르면 엉뚱한 앱에 도착했다.
              광고 앱 = board.nugoona.co.kr(2026-09-18 실제 접속 확인 — 제목 "누구나 광고", 로그인 화면). */}
          <a href="https://upload.nugoona.co.kr/login" className="text-[13px] text-text-weak hover:text-text-primary hover:underline">
            콘텐츠 앱 로그인
          </a>
          <a href="https://board.nugoona.co.kr/login" className="text-[13px] text-text-weak hover:text-text-primary hover:underline">
            광고 앱 로그인
          </a>
          <a href="/privacy" className="text-[13px] font-semibold text-text-primary hover:underline">
            개인정보처리방침
          </a>
          <a href="/terms" className="text-[13px] text-text-weak hover:text-text-primary hover:underline">
            이용약관
          </a>
          <a href="/privacy#account-deletion" className="text-[13px] text-text-weak hover:text-text-primary hover:underline">
            계정 삭제 안내
          </a>
        </div>
        <div className="mt-4 flex items-center justify-center relative">
          <p className="text-[13px] text-text-weak">&copy; 2025 누구나컴퍼니. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute right-0 w-10 h-10 flex items-center justify-center border border-[#999] rounded-full text-text-weak hover:text-text-primary hover:border-text-primary transition-colors cursor-pointer"
            aria-label="맨 위로 이동"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 13V3" />
              <path d="M3 7l5-5 5 5" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
