'use client';

/**
 * 철학 섹션 곁들임 목업(공용) — 홈 본편 Philosophy.tsx · /lab/philosophy-mock 공유.
 * RankMock = 누구나 콘텐츠(노출 측정, 정직 A13) / AdChatMock = 누구나 광고(AI 챗봇, 쉬운 말).
 * ★목업 제작 디테일 8조(DESIGN §8.7-I) 적용: --shadow-mock 5겹 · 재질 크롬 · hairline divider ·
 *   무대(글로우+도트 페이드) · 배지 그라디언트+미세그림자 · EN/tabular 숫자 · 살아있는 신호 1개.
 * 짝퉁 아님(우리 앱 화면). 순위·성과 보장 없음 — 현황·과거 사실 예시만.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;

/* 목업 무대 — 라디얼 글로우(accent ≤0.06 '빛') + 도트 그리드 가장자리 페이드 */
function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative shrink-0">
      <div
        aria-hidden
        className="absolute inset-0 -m-10 pointer-events-none [background:radial-gradient(420px_280px_at_50%_38%,rgba(0,112,243,0.05),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -m-10 pointer-events-none opacity-40 [background-image:radial-gradient(rgba(15,23,42,0.14)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(58%_58%_at_50%_45%,#000_28%,transparent_100%)]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* 재질 있는 브라우저 크롬 — top-light 그라디언트 + inset 하이라이트 + 중앙 URL 칩 */
function WinBar() {
  return (
    <div className="relative flex items-center h-9 px-3.5 border-b border-border-light [background:linear-gradient(180deg,#fcfcfd,#f5f7f9)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-[9px] h-[9px] rounded-full bg-[#e4e8ee] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]" />
        ))}
      </div>
      <span
        className="absolute left-1/2 -translate-x-1/2 flex items-center h-[19px] px-2.5 rounded-[5px] bg-white/80 shadow-[0_0_0_1px_rgba(15,23,42,0.05)] text-[11px] text-text-muted"
        style={EN}
      >
        app.ngn.co.kr
      </span>
    </div>
  );
}

/* ── 누구나 콘텐츠 · 노출 측정 ── */
const ROWS = [
  { kw: '공릉동 맛집', sub: '내 블로그 · 플레이스', badge: '1페이지', tone: 'good' as const },
  { kw: '노원구 고깃집', sub: '글이 매일 발행되고 있어요', badge: '3페이지 · 27위', tone: 'mid' as const },
  { kw: '공릉역 삼겹살', sub: '이제 막 시작했어요', badge: '아직 안 보임', tone: 'none' as const },
];

function Badge({ tone, children }: { tone: 'good' | 'mid' | 'none'; children: React.ReactNode }) {
  const base = 'ml-3 shrink-0 rounded-[5px] px-2 py-[3px] text-[13px] font-semibold';
  if (tone === 'good')
    return (
      <span
        className={`${base} text-white [background:linear-gradient(180deg,#1a82ff,#0070f3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(0,112,243,0.35)]`}
        style={EN}
      >
        {children}
      </span>
    );
  if (tone === 'mid')
    return (
      <span className={`${base} bg-white text-text-body shadow-[0_0_0_1px_rgba(15,23,42,0.10)]`} style={EN}>
        {children}
      </span>
    );
  return (
    <span className={`${base} bg-bg-alt text-text-muted`} style={EN}>
      {children}
    </span>
  );
}

export function RankMock() {
  return (
    <Stage>
      <div className="w-[300px] max-md:w-[280px] rounded-[12px] overflow-hidden bg-white shadow-[var(--shadow-mock)]">
        <WinBar />
        <div className="p-5">
          <div className="flex items-center gap-2">
            <p className="text-[16px] font-bold text-text-primary">내 가게 노출</p>
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <p className="text-[13px] text-text-muted mt-1 mb-4">매일 아침 자동으로 확인해요</p>
          <div className="rounded-[10px] border border-border-light overflow-hidden divide-y divide-border-light">
            {ROWS.map((r) => (
              <div key={r.kw} className="flex items-center justify-between px-3.5 py-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary truncate">{r.kw}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">{r.sub}</p>
                </div>
                <Badge tone={r.tone}>{r.badge}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* 봇 아이콘(후보 D — 사장님 택 2026-07-12) */
function BotIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 5v3" />
      <circle cx="12" cy="4" r="1" fill="white" stroke="none" />
      <circle cx="9.5" cy="13" r="1" fill="white" stroke="none" />
      <circle cx="14.5" cy="13" r="1" fill="white" stroke="none" />
    </svg>
  );
}
const AVATAR =
  'flex items-center justify-center rounded-[9px] [background:linear-gradient(180deg,#1a82ff,#0070f3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(0,112,243,0.30)]';

/* ── 누구나 광고 · AI 챗봇(채팅 앱 UI — 실제 앱 톤 정교화, 쉬운 말 유지) ── */
export function AdChatMock() {
  return (
    <Stage>
      <div className="w-[336px] max-md:w-[300px] rounded-[14px] overflow-hidden bg-white shadow-[var(--shadow-mock)]">
        {/* 헤더 — 아바타 + 이름 + 온라인 + 메뉴 */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border-light">
          <span className={`${AVATAR} w-9 h-9`}>
            <BotIcon size={20} />
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[14px] font-bold text-text-primary">광고 도우미</p>
            <p className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              온라인
            </p>
          </div>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-text-muted" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </div>

        {/* 대화 영역 */}
        <div className="flex flex-col gap-3 px-4 py-4 bg-[#fbfcfd]">
          {/* 사용자 */}
          <div className="self-end max-w-[78%] rounded-[16px] rounded-br-[5px] px-3.5 py-2.5 [background:linear-gradient(180deg,#1a82ff,#0070f3)] shadow-[0_1px_2px_rgba(0,112,243,0.30)]">
            <p className="text-[14px] leading-[1.45] text-white">이 광고 지금 잘 되고 있나요?</p>
          </div>
          {/* AI — 아바타 + 버블 + 실제 인터랙션 */}
          <div className="flex items-end gap-2 self-start max-w-[94%]">
            <span className={`${AVATAR} w-6 h-6 shrink-0`}>
              <BotIcon size={13} />
            </span>
            <div>
              <div className="rounded-[16px] rounded-bl-[5px] bg-white px-3.5 py-2.5 shadow-[0_0_0_1px_rgba(15,23,42,0.05)]">
                <p className="text-[14px] leading-[1.5] text-text-primary">
                  네, 지난주보다 주문이 늘었어요.
                  <br />
                  광고비 <b className="text-accent" style={EN}>1만 원당 3.2명</b>이 장바구니에 담았어요.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-1.5 pl-1 text-[11px] text-text-muted">
                <span className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
                    <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM7 11l4-8a2 2 0 0 1 3 1.7V9h5a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 20.6 20H7" />
                  </svg>
                  도움돼요
                </span>
                <span className="text-accent">대시보드에서 더 보기 →</span>
              </div>
            </div>
          </div>
        </div>

        {/* 입력창 — 커서 + 전송 활성 */}
        <div className="flex items-center gap-2 px-3 py-3 border-t border-border-light">
          <div className="flex-1 flex items-center h-9 px-3 rounded-[9px] bg-bg-alt text-[13px] text-text-muted">
            무엇이든 물어보세요
            <span className="w-px h-4 bg-accent ml-0.5 animate-pulse" />
          </div>
          <button
            aria-label="전송"
            className="flex items-center justify-center w-9 h-9 rounded-[9px] [background:linear-gradient(180deg,#1a82ff,#0070f3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(0,112,243,0.35)]"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="white" aria-hidden>
              <path d="M3 20.5l18-8.5L3 3.5V10l12 2-12 2v6.5z" />
            </svg>
          </button>
        </div>
      </div>
    </Stage>
  );
}
