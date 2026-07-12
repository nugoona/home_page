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
function BotIcon({ size = 20, color = '#5b6572' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 5v3" />
      <circle cx="12" cy="4" r="1" fill={color} stroke="none" />
      <circle cx="9.5" cy="13" r="1" fill={color} stroke="none" />
      <circle cx="14.5" cy="13" r="1" fill={color} stroke="none" />
    </svg>
  );
}

/* 헤더 색 후보 — 파랑 제외 채도색(사장님 2026-07-12 "헤더 채도 높은 색 · 아이콘 배경 파랑 금지") */
type HeaderTone = 'white' | 'slate' | 'teal' | 'orange' | 'rose';
const HEAD: Record<HeaderTone, { bar: string; name: string; icon: string; av: string; ui: string }> = {
  white: { bar: 'bg-white border-b border-border-light', name: 'text-text-primary', icon: '#5b6572', av: 'bg-[#dfe4ea]', ui: 'text-text-muted' },
  slate: { bar: 'bg-[#1e293b]', name: 'text-white', icon: '#1e293b', av: 'bg-white', ui: 'text-white/70' },
  teal: { bar: 'bg-[#0d9488]', name: 'text-white', icon: '#0d9488', av: 'bg-white', ui: 'text-white/75' },
  orange: { bar: 'bg-[#ea580c]', name: 'text-white', icon: '#ea580c', av: 'bg-white', ui: 'text-white/80' },
  rose: { bar: 'bg-[#e11d48]', name: 'text-white', icon: '#e11d48', av: 'bg-white', ui: 'text-white/80' },
};

/* ── 누구나 광고 · AI 챗봇(카카오톡 톤 메신저 — 파란 배경/무대 제거, 원형 프로필·이름·시간) ── */
export function AdChatMock({ header = 'white' }: { header?: HeaderTone }) {
  const h = HEAD[header];
  return (
    <div className="w-[340px] max-md:w-[300px] rounded-[18px] overflow-hidden shadow-[var(--shadow-mock)] bg-[#eef1f4]">
      {/* 헤더 (채도색 선택) */}
      <div className={`flex items-center gap-3 px-4 h-[52px] ${h.bar}`}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={h.ui} aria-hidden>
          <path d="M15 5l-7 7 7 7" />
        </svg>
        <span className={`flex items-center justify-center w-8 h-8 rounded-full ${h.av}`}>
          <BotIcon size={17} color={h.icon} />
        </span>
        <p className={`flex-1 text-[15px] font-semibold tracking-[-0.01em] ${h.name}`}>광고 도우미</p>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={h.ui} aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </div>

      {/* 대화 (중립 회색 배경) */}
      <div className="flex flex-col gap-4 px-4 py-5 bg-[#eef1f4]">
        {/* 사용자 — 우측, accent 말풍선(강조 1곳), 시간 */}
        <div className="flex items-end justify-end gap-1.5">
          <span className="text-[11px] text-text-muted mb-0.5" style={EN}>오후 2:14</span>
          <div className="max-w-[76%] rounded-[18px] rounded-br-[6px] bg-accent px-3.5 py-2.5">
            <p className="text-[14px] leading-[1.45] text-white tracking-[-0.01em]">이 광고 지금 잘 되고 있나요?</p>
          </div>
        </div>

        {/* AI — 좌측, 원형 프로필 + 이름 + 흰 말풍선 + 시간 */}
        <div className="flex items-start gap-2">
          <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-[#dfe4ea]">
            <BotIcon size={16} />
          </span>
          <div className="min-w-0">
            <p className="mb-1 pl-1 text-[12px] text-text-muted tracking-[-0.01em]">광고 도우미</p>
            <div className="flex items-end gap-1.5">
              <div className="max-w-[230px] rounded-[18px] rounded-tl-[6px] bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                <p className="text-[14px] leading-[1.55] text-text-primary tracking-[-0.01em]">
                  네, 지난주보다 주문이 늘었어요.
                  <br />
                  광고비 <b className="text-accent" style={EN}>1만 원당 3.2명</b>이 장바구니에 담았어요.
                </p>
              </div>
              <span className="text-[11px] text-text-muted mb-0.5 shrink-0" style={EN}>오후 2:14</span>
            </div>
          </div>
        </div>
      </div>

      {/* 입력창 (흰색) — + / 둥근 필드 / 전송 */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-t border-border-light">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-text-muted shrink-0" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
        <div className="flex-1 flex items-center h-8 px-3.5 rounded-full bg-[#eef1f4] text-[13px] text-text-muted tracking-[-0.01em]">
          메시지 입력
        </div>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0" aria-hidden>
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      </div>
    </div>
  );
}
