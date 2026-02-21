'use client';

export default function Footer() {
  return (
    <footer className="border-t border-border-default bg-white relative">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold text-text-primary mb-1">누구나컴퍼니</p>
            <p className="text-[12px] text-text-weak">대표 최우현</p>
            <p className="text-[12px] text-text-weak">주소 : 서울시 노원구 공릉로34길 62</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold text-text-primary mb-1">사업 정보</p>
            <p className="text-[12px] text-text-weak">사업자등록번호 : 544-02-02671</p>
            <p className="text-[12px] text-text-weak">통신판매업신고번호 : 2023-서울노원-1648</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold text-text-primary mb-1">연락처</p>
            <p className="text-[12px] text-text-weak">대표번호 : 010-2781-4543</p>
            <p className="text-[12px] text-text-weak">이메일문의 : oscar@nugoona.co.kr</p>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center relative">
          <p className="text-[12px] text-text-weak">&copy; 2025 누구나컴퍼니. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute right-0 w-10 h-10 flex items-center justify-center border border-[#999] rounded-full text-[#555] hover:text-text-primary hover:border-text-primary transition-colors cursor-pointer"
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
