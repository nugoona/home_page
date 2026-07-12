'use client';

/**
 * /lab/chat-icons = 광고 도우미(챗봇) 아바타 아이콘 후보 비교
 * 우리 톤: accent 그라디언트 직각 칩 + 흰 아이콘. 촌스럽지 않고 미니멀.
 */

const CHIP =
  'flex items-center justify-center w-12 h-12 rounded-[12px] [background:linear-gradient(180deg,#1a82ff,#0070f3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_6px_rgba(0,112,243,0.30)]';

const ICONS: { key: string; label: string; note: string; svg: React.ReactNode }[] = [
  {
    key: 'A',
    label: '스파클 (AI 상징)',
    note: '요즘 AI 아이콘 대세. 가장 트렌디·세련.',
    svg: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="white" aria-hidden>
        <path d="M12 2l1.7 6.6c.2.9.9 1.6 1.8 1.8L22 12l-6.5 1.6c-.9.2-1.6.9-1.8 1.8L12 22l-1.7-6.6c-.2-.9-.9-1.6-1.8-1.8L2 12l6.5-1.6c.9-.2 1.6-.9 1.8-1.8z" />
      </svg>
    ),
  },
  {
    key: 'B',
    label: '더블 스파클',
    note: '큰 별 + 작은 별. "AI가 만들어준다" 느낌 강조.',
    svg: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="white" aria-hidden>
        <path d="M10 4l1.3 4.7c.15.7.7 1.25 1.4 1.4L17 11.5l-4.3 1.2c-.7.2-1.25.75-1.4 1.45L10 19l-1.3-4.85c-.15-.7-.7-1.25-1.4-1.45L3 11.5l4.3-1.4c.7-.15 1.25-.7 1.4-1.4z" />
        <path d="M18 3l.6 2.1c.07.3.3.53.6.6L21.5 6.3l-2.3.6c-.3.08-.53.3-.6.6L18 9.8l-.6-2.3c-.07-.3-.3-.52-.6-.6L14.5 6.3l2.3-.6c.3-.07.53-.3.6-.6z" />
      </svg>
    ),
  },
  {
    key: 'C',
    label: '말풍선 + 점',
    note: '채팅 그 자체. 직관적이지만 다소 흔함.',
    svg: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" aria-hidden>
        <path d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3.5V15H5a1 1 0 0 1-1-1z" />
        <circle cx="9" cy="9.5" r="0.6" fill="white" stroke="none" />
        <circle cx="12" cy="9.5" r="0.6" fill="white" stroke="none" />
        <circle cx="15" cy="9.5" r="0.6" fill="white" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'D',
    label: '봇 얼굴',
    note: '친근한 도우미 인격. 살짝 캐주얼.',
    svg: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="4" y="8" width="16" height="11" rx="3" />
        <path d="M12 5v3" />
        <circle cx="12" cy="4" r="1" fill="white" stroke="none" />
        <circle cx="9.5" cy="13" r="1" fill="white" stroke="none" />
        <circle cx="14.5" cy="13" r="1" fill="white" stroke="none" />
      </svg>
    ),
  },
];

export default function LabChatIcons() {
  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={{ fontFamily: 'var(--font-en)' }}>
          Chat Avatar
        </p>
        <h1 className="text-[20px] font-bold text-text-primary">광고 도우미 아이콘 후보 4종</h1>
        <p className="text-[14px] text-text-weak mt-1">accent 그라디언트 칩 + 흰 아이콘. 하나 골라주세요(직접 다른 방향 원하면 말씀).</p>
      </div>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-px bg-border-light">
        {ICONS.map((ic) => (
          <div key={ic.key} className="bg-white px-8 py-12 flex flex-col items-center gap-5">
            {/* 실제 챗봇 헤더처럼 미리보기 */}
            <div className="flex items-center gap-2.5">
              <span className={CHIP}>{ic.svg}</span>
              <div className="leading-tight text-left">
                <p className="text-[14px] font-bold text-text-primary">광고 도우미</p>
                <p className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> 실시간 답변
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-text-primary">
                <span className="text-accent mr-1.5">{ic.key}</span>
                {ic.label}
              </p>
              <p className="text-[13px] text-text-weak mt-1">{ic.note}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
