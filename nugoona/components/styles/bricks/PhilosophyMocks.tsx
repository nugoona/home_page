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

/* ── 누구나 광고 · AI 챗봇(어려운 광고를 쉬운 말로) ── */
export function AdChatMock() {
  return (
    <Stage>
      <div className="w-[300px] max-md:w-[280px] rounded-[12px] overflow-hidden bg-white shadow-[var(--shadow-mock)]">
        <WinBar />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center w-4 h-4 rounded-[4px] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.08)]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            </span>
            <p className="text-[16px] font-bold text-text-primary">광고 도우미</p>
          </div>
          <p className="text-[13px] text-text-muted mb-4">어려운 광고, 물어보면 쉬운 말로 답해요</p>
          <div className="flex flex-col gap-3">
            {/* 사용자 질문 */}
            <div className="self-end max-w-[80%] rounded-[14px] rounded-br-[4px] px-3.5 py-2.5 [background:linear-gradient(180deg,#1a82ff,#0070f3)] shadow-[0_1px_2px_rgba(0,112,243,0.30)]">
              <p className="text-[14px] leading-[1.45] text-white">이 광고 지금 잘 되고 있나요?</p>
            </div>
            {/* AI 답 */}
            <div className="self-start max-w-[86%] rounded-[14px] rounded-bl-[4px] bg-bg-alt px-3.5 py-2.5 shadow-[0_0_0_1px_rgba(15,23,42,0.05)]">
              <p className="text-[14px] leading-[1.5] text-text-primary">
                네, 지난주보다 주문이 늘었어요.
                <br />
                광고비 <b className="text-accent" style={EN}>1만 원당 3.2명</b>이 장바구니에 담았어요.
              </p>
            </div>
            {/* 살아있는 신호 1개 — typing 도트 */}
            <div className="self-start flex items-center gap-1 pl-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-border-mid animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
}
