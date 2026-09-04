'use client';

import S41SearchScene from '@/components/home/s4/S41SearchScene';
import S42AdScene from '@/components/home/s4/S42AdScene';

/**
 * 모바일 캐러셀 카드 전용 목업(2026-07-15 사장님 "모바일 용으로 다시 만들어").
 * PC용 S41/S42 `part`(가로 3열 배치 전용)는 좁은 모바일 세로 카드에 안 맞아 박살 →
 * 평면 UI 단계(NC02 문서·NA03 챗봇)만 세로 카드 비율로 새로 그린다.
 * 기기(폰) 목업이 있는 단계는 기존 part 재활용(회색 카드에 잘 뜸).
 * ⛔ 모바일 전용 — PC(TwoAppsRail OccupancyGrid)는 통짜 S41/S42(part 없음) 그대로.
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;
const EN = { fontFamily: 'var(--font-en)' } as const;
const BORDER = '#ECECEC';
const CARD_SHADOW = '0 1px 2px rgba(15,23,42,0.05), 0 8px 20px rgba(15,23,42,0.08)';
const THUMB = '/img/unsplash/webp/photo-1504674900247-0877df9cc836.webp';
const ACCENT = '#0070f3';

/* ── NC 02 "글이 자동으로 완성" — 세로 글 카드(썸네일 크게 위 + 제목 + 본문) ── */
function NcDocMobile() {
  return (
    <div className="w-full overflow-hidden rounded-[16px] border bg-white" style={{ borderColor: BORDER }}>
      {/* 앱바 — 누구나 콘텐츠 + DONE */}
      <div className="flex items-center gap-2 border-b px-3.5 py-2.5" style={{ borderColor: '#F1F1F1' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo/nc.svg?v=16" alt="" className="h-[16px] w-[16px]" />
        <span className="text-[12px] font-semibold tracking-[-0.01em] text-text-body" style={KR}>누구나 콘텐츠</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-bold tracking-[0.04em] text-accent" style={EN}>
          <span className="rounded-dot h-[5px] w-[5px] bg-accent" />DONE
        </span>
      </div>
      {/* 대표 썸네일 크게 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={THUMB} alt="" className="h-[200px] w-full object-cover" loading="lazy" />
      {/* 글 본문 — 아래로 길게(카드보다 커서 하단이 카드에 꽂혀 잘림) */}
      <div className="px-4 pb-4 pt-3">
        <span className="text-[10.5px] font-medium tracking-[-0.01em] text-text-muted" style={KR}>공릉동 파스타 · 오늘 발행</span>
        <h4 className="mt-1.5 text-[16px] font-bold leading-[1.4] tracking-[-0.02em] text-text-primary" style={KR}>
          공릉동 파스타 봄 신메뉴 3종,<br />이렇게 준비했습니다
        </h4>
        <p className="mt-2 text-[12.5px] leading-[1.6] tracking-[-0.01em] text-text-body" style={KR}>
          직접 뽑은 생면으로 만든 파스타 세 가지를 소개합니다. 재료 손질부터 플레이팅까지, 매장에서 준비한 과정을 그대로 담았어요.
        </p>
      </div>
    </div>
  );
}

/* ── NA 03 "궁금한 건 바로 물어봐요" — 세로 채팅(질문↔답변) ── */
function NaChatMobile() {
  return (
    <div className="w-full rounded-[16px] px-3.5 pb-8 pt-5" style={{ background: '#eef1f4' }}>
      {/* 사장님 질문(우, accent) */}
      <div className="mb-3 flex justify-end">
        <div className="max-w-[80%] rounded-[16px] rounded-br-[5px] px-3.5 py-2.5" style={{ background: ACCENT }}>
          <p className="text-[13px] font-semibold leading-[1.45] tracking-[-0.01em] text-white" style={KR}>이 광고 지금 잘 되고 있나요?</p>
        </div>
      </div>
      {/* 광고 도우미 답변(좌, 흰) */}
      <div className="flex items-start gap-2">
        <span className="rounded-dot mt-0.5 flex h-[24px] w-[24px] shrink-0 items-center justify-center bg-[#334155]">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 5v3" /><circle cx="12" cy="4" r="1" fill="#fff" stroke="none" /><circle cx="9.5" cy="13" r="1" fill="#fff" stroke="none" /><circle cx="14.5" cy="13" r="1" fill="#fff" stroke="none" />
          </svg>
        </span>
        <div className="max-w-[82%] rounded-[16px] rounded-tl-[5px] bg-white px-3.5 py-2.5" style={{ border: '1px solid #e5e7eb' }}>
          <p className="text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-text-body" style={KR}>
            네, 지난주보다 주문이 늘었어요.<br />광고비 <span className="font-bold" style={{ color: ACCENT }}>1만 원당 3.2명</span>이 장바구니에 담았어요.
          </p>
        </div>
      </div>
      {/* 후속 대화 — 카드보다 길어져 하단이 홀더에 꽂혀 잘림 */}
      <div className="mb-3 mt-3 flex justify-end">
        <div className="max-w-[80%] rounded-[16px] rounded-br-[5px] px-3.5 py-2.5" style={{ background: ACCENT }}>
          <p className="text-[13px] font-semibold leading-[1.45] tracking-[-0.01em] text-white" style={KR}>주문을 더 늘리려면요?</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <span className="rounded-dot mt-0.5 flex h-[24px] w-[24px] shrink-0 items-center justify-center bg-[#334155]">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 5v3" /><circle cx="12" cy="4" r="1" fill="#fff" stroke="none" /><circle cx="9.5" cy="13" r="1" fill="#fff" stroke="none" /><circle cx="14.5" cy="13" r="1" fill="#fff" stroke="none" />
          </svg>
        </span>
        <div className="max-w-[82%] rounded-[16px] rounded-tl-[5px] bg-white px-3.5 py-2.5" style={{ border: '1px solid #e5e7eb' }}>
          <p className="text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-text-body" style={KR}>
            지금 반응이 좋은 소재에 예산을 조금 더 실어볼게요.
          </p>
        </div>
      </div>
    </div>
  );
}

export function NcMobileMock({ part, hideHead }: { part?: 1 | 2 | 3; hideHead?: boolean }) {
  if (part === 2) return <NcDocMobile />;
  return <S41SearchScene part={part} hideHead={hideHead} />;
}

export function NaMobileMock({ part, hideHead }: { part?: 1 | 2 | 3; hideHead?: boolean }) {
  if (part === 3) return <NaChatMobile />;
  return <S42AdScene part={part} hideHead={hideHead} />;
}
