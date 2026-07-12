'use client';

/**
 * 철학 섹션 곁들임 목업(공용) — 홈 본편 Philosophy.tsx · /lab/philosophy-mock 공유.
 * RankMock = 누구나 콘텐츠(노출 측정, 정직 A13) / AdChatMock = 누구나 광고(AI 챗봇, 쉬운 말).
 * 짝퉁 아님(우리 앱 화면). 순위·성과 보장 없음 — 현황·과거 사실 예시만.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;

function WinBar() {
  return (
    <div className="flex items-center gap-1.5 px-3 h-8 bg-[#f1f4f8] border-b border-border-default">
      <span className="w-2 h-2 rounded-full bg-[#cdd5df]" />
      <span className="w-2 h-2 rounded-full bg-[#cdd5df]" />
      <span className="w-2 h-2 rounded-full bg-[#cdd5df]" />
      <span className="ml-2 text-[11px] text-text-weak" style={EN}>app.ngn.co.kr</span>
    </div>
  );
}

/* ── 누구나 콘텐츠 · 노출 측정 ── */
const ROWS = [
  { kw: '공릉동 맛집', sub: '내 블로그 · 플레이스', badge: '1페이지', tone: 'good' as const },
  { kw: '노원구 고깃집', sub: '글이 매일 발행되고 있어요', badge: '3페이지 · 27위', tone: 'mid' as const },
  { kw: '공릉역 삼겹살', sub: '이제 막 시작했어요', badge: '아직 안 보임', tone: 'none' as const },
];
const TONE = {
  good: 'bg-[#0070f3] text-white',
  mid: 'bg-[#f59e0b] text-white',
  none: 'bg-[#eef1f4] text-[#8b95a1]',
};

export function RankMock() {
  return (
    <div className="w-[300px] max-md:w-[280px] shrink-0 rounded-[14px] border border-border-default shadow-[0_18px_50px_-20px_rgba(15,23,42,0.32)] overflow-hidden bg-white">
      <WinBar />
      <div className="p-5">
        <p className="text-[16px] font-bold text-text-primary">내 가게 노출</p>
        <p className="text-[12px] text-text-weak mt-1 mb-4">검색하면 내 가게가 보이는지 매일 확인해요</p>
        <div className="flex flex-col gap-2.5">
          {ROWS.map((r) => (
            <div key={r.kw} className="flex items-center justify-between rounded-[10px] border border-border-default px-3.5 py-3">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-text-primary truncate">{r.kw}</p>
                <p className="text-[11.5px] text-text-weak mt-0.5">{r.sub}</p>
              </div>
              <span className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-[12px] font-bold ${TONE[r.tone]}`}>
                {r.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 누구나 광고 · AI 챗봇(어려운 광고를 쉬운 말로) ── */
export function AdChatMock() {
  return (
    <div className="w-[300px] max-md:w-[280px] shrink-0 rounded-[14px] border border-border-default shadow-[0_18px_50px_-20px_rgba(15,23,42,0.32)] overflow-hidden bg-white">
      <WinBar />
      <div className="p-5">
        <p className="text-[16px] font-bold text-text-primary mb-1">광고 도우미</p>
        <p className="text-[12px] text-text-weak mb-4">어려운 광고, 물어보면 쉬운 말로 답해요</p>
        <div className="flex flex-col gap-3">
          {/* 사용자 질문 */}
          <div className="self-end max-w-[80%] rounded-[14px] rounded-br-[4px] bg-[#0070f3] px-3.5 py-2.5">
            <p className="text-[13.5px] leading-[1.45] text-white">이 광고 지금 잘 되고 있나요?</p>
          </div>
          {/* AI 답 */}
          <div className="self-start max-w-[86%] rounded-[14px] rounded-bl-[4px] bg-[#f1f4f8] px-3.5 py-2.5">
            <p className="text-[13.5px] leading-[1.5] text-text-primary">
              네, 지난주보다 주문이 늘었어요.
              <br />
              광고비 <b className="text-[#0070f3]">1만 원당 3.2명</b>이 장바구니에 담았어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
