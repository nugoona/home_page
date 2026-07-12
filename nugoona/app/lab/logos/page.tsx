'use client';

/**
 * /lab/logos = 로고 폰트 시안 갤러리 (사장님 "배경 좋아, 폰트가 어도비 비슷" 2026-07-12)
 * 배경 = 블루 솔리드 고정. 폰트만 변주 10종 + 커스텀 벡터 1종. Nc 기준. 최대 2개 택.
 * 확정 폰트는 최종 로고에서 벡터 패스로 고정(폰트 의존 제거).
 */

import { useState } from 'react';

const EN = { fontFamily: 'var(--font-en)' } as const;
const BLUE = '#0070f3';

/* 배경 블루 솔리드 + 흰 Nc, 폰트만 다름 */
function Sq({ font, size = 62, ls = -6, weight = 800 }: { font: string; size?: number; ls?: number; weight?: number }) {
  return (
    <svg viewBox="0 0 100 100">
      <rect width="100" height="100" fill={BLUE} />
      <text x="47" y="55" textAnchor="middle" dominantBaseline="central" fontFamily={font} fontWeight={weight} fontSize={size} letterSpacing={ls} fill="#fff">Nc</text>
    </svg>
  );
}

/* 커스텀 벡터 N (기하학·각진, 폰트 무관) + 작은 c */
function Custom() {
  return (
    <svg viewBox="0 0 100 100">
      <rect width="100" height="100" fill={BLUE} />
      {/* N: 두꺼운 각진 획 (좌기둥·대각·우기둥) */}
      <path d="M26 74 V30 h11 l16 26 V30 h11 v44 h-11 L37 48 v26 z" fill="#fff" />
      {/* c: 작은 라운드 */}
      <path d="M70 58 a11 11 0 1 0 0 12 h-7 a5 5 0 1 1 0-12 z" fill="#fff" />
    </svg>
  );
}

const LOGOS: { n: number; label: string; el: React.ReactNode }[] = [
  { n: 1, label: 'Inter Tight (현재·어도비풍)', el: <Sq font="var(--font-en)" /> },
  { n: 2, label: 'Pretendard', el: <Sq font="'Pretendard Variable', Pretendard, sans-serif" size={60} ls={-5} weight={900} /> },
  { n: 3, label: '세리프 (Georgia)', el: <Sq font="Georgia, 'Times New Roman', serif" size={58} ls={-3} weight={700} /> },
  { n: 4, label: '모노스페이스', el: <Sq font="'Courier New', monospace" size={52} ls={-2} weight={700} /> },
  { n: 5, label: 'system-ui', el: <Sq font="system-ui, sans-serif" size={60} ls={-4} /> },
  { n: 6, label: 'Impact (압축·굵음)', el: <Sq font="Impact, 'Haettenschweiler', sans-serif" size={64} ls={-3} weight={400} /> },
  { n: 7, label: 'Arial Narrow (콘덴스드)', el: <Sq font="'Arial Narrow', sans-serif" size={64} ls={-2} weight={700} /> },
  { n: 8, label: 'Trebuchet (라운드 산세)', el: <Sq font="'Trebuchet MS', sans-serif" size={58} ls={-4} weight={700} /> },
  { n: 9, label: 'Verdana (넓은 산세)', el: <Sq font="Verdana, sans-serif" size={52} ls={-4} weight={700} /> },
  { n: 10, label: '커스텀 벡터 N (폰트 무관)', el: <Custom /> },
];

export default function LabLogos() {
  const [picks, setPicks] = useState<number[]>([]);
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  function toggle(n: number) {
    setPicks((p) => (p.includes(n) ? p.filter((x) => x !== n) : p.length < 2 ? [...p, n] : [p[1], n]));
  }

  async function submit() {
    setStatus('sending');
    try {
      const res = await fetch('/api/draft-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brick: 'logo-font', picks, memo, at: new Date().toISOString() }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 02 · Logo Font</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">로고 폰트 시안 10종 — 최대 2개 골라주세요</h1>
        <p className="text-[14px] text-text-weak mt-1">배경(블루 솔리드)은 고정, 폰트만 바꿨습니다. 1번이 지금 어도비풍이고, 10번은 폰트 대신 커스텀 벡터입니다. 고르시면 그 글자를 벡터로 고정해 확정합니다.</p>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-3 gap-6">
        {LOGOS.map(({ n, label, el }) => {
          const on = picks.includes(n);
          return (
            <button
              key={n}
              onClick={() => toggle(n)}
              className="flex flex-col items-center border p-5 transition-colors"
              style={{ borderColor: on ? BLUE : '#eaeaea', background: on ? 'rgba(0,112,243,0.05)' : '#fff', borderWidth: on ? 2 : 1 }}
            >
              <div className="flex items-end gap-4 mb-4">
                <div style={{ width: 96, height: 96 }}>{el}</div>
                <div className="flex items-center gap-2 pb-1">
                  <div style={{ width: 30, height: 30 }}>{el}</div>
                  <span className="text-[13px] font-semibold text-text-primary">누구나 콘텐츠</span>
                </div>
              </div>
              <span className="text-[12px] font-semibold text-text-primary text-center">
                {n}. {label} {on && <span style={{ color: BLUE }}>✓</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t-4 border-[#171717] px-6 py-12 max-w-[720px] mx-auto">
        {status === 'done' ? (
          <p className="text-[18px] font-bold text-text-primary text-center py-8">제출됐습니다. 고르신 폰트로 벡터 고정해 확정하겠습니다.</p>
        ) : (
          <>
            <h2 className="text-[18px] font-bold text-text-primary mb-2">고른 시안: {picks.length ? picks.join(', ') : '없음'} (최대 2개)</h2>
            <p className="text-[13px] text-text-weak mb-4">로고를 클릭하면 선택/해제됩니다.</p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              placeholder="메모 (선택) — 예: 3번 세리프 좋은데 더 굵게 / 10번 c를 더 크게"
              className="w-full px-4 py-3 border border-border-default text-[15px] text-text-primary focus:border-accent focus:outline-none resize-y mb-3"
            />
            <button
              onClick={submit}
              disabled={(picks.length === 0 && !memo.trim()) || status === 'sending'}
              className="w-full h-12 bg-[#171717] text-white text-[15px] font-semibold disabled:opacity-40"
            >
              {status === 'sending' ? '전송 중...' : '제출'}
            </button>
            {status === 'error' && <p className="text-[13px] text-red-500 mt-2 text-center">전송 실패 — 다시 눌러주세요.</p>}
          </>
        )}
      </div>
    </main>
  );
}
