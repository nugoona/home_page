'use client';

/**
 * /lab/chat-icons = 광고 도우미 챗봇 헤더 색 후보 비교 (파랑 제외 채도색)
 * 사장님 2026-07-12: 헤더 채도 높은 색 · 아이콘(아바타) 배경 파랑 금지.
 */

import { AdChatMock } from '@/components/styles/bricks/PhilosophyMocks';

const OPTS: { header: 'slate' | 'teal' | 'orange' | 'rose' | 'white'; label: string; note: string }[] = [
  { header: 'slate', label: '차콜', note: '#1e293b — 세련·차분. 무채에 가까운 진한 남색.' },
  { header: 'teal', label: '틸(청록)', note: '#0d9488 — 채도 있고 신뢰감. 파랑과 다른 계열.' },
  { header: 'orange', label: '오렌지', note: '#ea580c — 생동감·친근. 가장 채도 높음.' },
  { header: 'rose', label: '로즈', note: '#e11d48 — 강조·활기. 눈에 확 띔.' },
  { header: 'white', label: '흰색(현행)', note: '지금 버전. 참고용.' },
];

export default function LabChatHeaders() {
  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={{ fontFamily: 'var(--font-en)' }}>
          Chat Header
        </p>
        <h1 className="text-[20px] font-bold text-text-primary">광고 도우미 헤더 색 후보 (파랑 제외)</h1>
        <p className="text-[14px] text-text-weak mt-1">아바타 배경은 파랑 완전 배제(흰색 원형). 헤더 색만 골라주세요.</p>
      </div>

      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-px bg-border-light">
        {OPTS.map((o) => (
          <div key={o.header} className="bg-[#f7f9fc] px-8 py-12 flex flex-col items-center gap-5">
            <AdChatMock header={o.header} />
            <div className="text-center">
              <p className="text-[15px] font-semibold text-text-primary">{o.label}</p>
              <p className="text-[13px] text-text-weak mt-1" style={{ fontFamily: 'var(--font-en)' }}>{o.note}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
