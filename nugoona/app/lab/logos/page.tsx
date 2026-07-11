'use client';

/**
 * /lab/logos = 로고 시안 갤러리 10종 (사장님 "10개 목업, 2개 고를게" 2026-07-12)
 * 브랜드 블루(#0070f3) 기반. 형태·배경·글자 배치 변주. Nc(콘텐츠) 기준 — 확정 후 Na 적용.
 */

import { useState } from 'react';

const EN = { fontFamily: 'var(--font-en)' } as const;
const BLUE = '#0070f3';
const NAVY = '#0a1f4d';
const DARK = '#171717';
const F = "'Inter Tight','Segoe UI',Arial,sans-serif";

/* 각 시안: 100x100 svg. 기본 Nc 중앙 정렬(x46 y53 central). */
const LOGOS: { n: number; label: string; el: React.ReactNode }[] = [
  {
    n: 1,
    label: '블루 솔리드 · 직각',
    el: (
      <svg viewBox="0 0 100 100"><rect width="100" height="100" fill={BLUE} /><text x="46" y="55" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="62" letterSpacing="-6" fill="#fff">Nc</text></svg>
    ),
  },
  {
    n: 2,
    label: '흰 배경 · 블루 보더 · 블루 글자',
    el: (
      <svg viewBox="0 0 100 100"><rect x="3" y="3" width="94" height="94" fill="#fff" stroke={BLUE} strokeWidth="5" /><text x="46" y="55" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="60" letterSpacing="-6" fill={BLUE}>Nc</text></svg>
    ),
  },
  {
    n: 3,
    label: '블루 · 라운드(살짝)',
    el: (
      <svg viewBox="0 0 100 100"><rect width="100" height="100" rx="16" fill={BLUE} /><text x="46" y="55" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="62" letterSpacing="-6" fill="#fff">Nc</text></svg>
    ),
  },
  {
    n: 4,
    label: '다크 뉴트럴 · 블루 글자',
    el: (
      <svg viewBox="0 0 100 100"><rect width="100" height="100" fill={DARK} /><text x="46" y="55" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="62" letterSpacing="-6" fill={BLUE}>Nc</text></svg>
    ),
  },
  {
    n: 5,
    label: 'N 모노그램 (c 생략)',
    el: (
      <svg viewBox="0 0 100 100"><rect width="100" height="100" fill={BLUE} /><text x="50" y="55" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="74" fill="#fff">N</text></svg>
    ),
  },
  {
    n: 6,
    label: 'N 크게 + c 작게(우하단)',
    el: (
      <svg viewBox="0 0 100 100"><rect width="100" height="100" fill={BLUE} /><text x="40" y="50" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="72" fill="#fff">N</text><text x="76" y="74" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="34" fill="#fff">c</text></svg>
    ),
  },
  {
    n: 7,
    label: '흰 배경 · 블루 N + 블루 c작게',
    el: (
      <svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#f4f6f8" /><text x="40" y="50" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="72" fill={BLUE}>N</text><text x="76" y="74" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="34" fill={NAVY}>c</text></svg>
    ),
  },
  {
    n: 8,
    label: '네이비 배경 · 블루 글자',
    el: (
      <svg viewBox="0 0 100 100"><rect width="100" height="100" fill={NAVY} /><text x="46" y="55" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="62" letterSpacing="-6" fill={BLUE}>Nc</text></svg>
    ),
  },
  {
    n: 9,
    label: '블루→네이비 그라디언트',
    el: (
      <svg viewBox="0 0 100 100"><defs><linearGradient id="g9" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={BLUE} /><stop offset="1" stopColor={NAVY} /></linearGradient></defs><rect width="100" height="100" fill="url(#g9)" /><text x="46" y="55" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="62" letterSpacing="-6" fill="#fff">Nc</text></svg>
    ),
  },
  {
    n: 10,
    label: '블루 · 하단 액센트 바',
    el: (
      <svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#fff" /><rect width="100" height="100" fill={BLUE} opacity="0.08" /><text x="46" y="52" textAnchor="middle" dominantBaseline="central" fontFamily={F} fontWeight="800" fontSize="60" letterSpacing="-6" fill={NAVY}>Nc</text><rect x="0" y="88" width="100" height="12" fill={BLUE} /></svg>
    ),
  },
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
        body: JSON.stringify({ brick: 'logo', picks, memo, at: new Date().toISOString() }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 02 · Logo Gallery</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">로고 시안 10종 — 최대 2개 골라주세요</h1>
        <p className="text-[14px] text-text-weak mt-1">브랜드 블루(#0070f3) 기반. Nc(콘텐츠) 기준이고, 고르시면 그 스타일로 Na(광고)도 만듭니다. 각 로고는 실제 크기(작게)와 확대를 함께 봅니다.</p>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-3 gap-6">
        {LOGOS.map(({ n, label, el }) => {
          const on = picks.includes(n);
          return (
            <button
              key={n}
              onClick={() => toggle(n)}
              className="flex flex-col items-center border p-5 transition-colors text-left"
              style={{ borderColor: on ? BLUE : '#eaeaea', background: on ? 'rgba(0,112,243,0.05)' : '#fff', borderWidth: on ? 2 : 1 }}
            >
              <div className="flex items-end gap-4 mb-4">
                {/* 확대 */}
                <div style={{ width: 96, height: 96 }}>{el}</div>
                {/* 실제 크기 + 워드마크(장면 재현) */}
                <div className="flex items-center gap-2 pb-1">
                  <div style={{ width: 30, height: 30 }}>{el}</div>
                  <span className="text-[13px] font-semibold text-text-primary">누구나 콘텐츠</span>
                </div>
              </div>
              <span className="text-[13px] font-semibold text-text-primary">
                {n}. {label} {on && <span style={{ color: BLUE }}>✓</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t-4 border-[#171717] px-6 py-12 max-w-[720px] mx-auto">
        {status === 'done' ? (
          <p className="text-[18px] font-bold text-text-primary text-center py-8">제출됐습니다. 고르신 걸로 다듬겠습니다.</p>
        ) : (
          <>
            <h2 className="text-[18px] font-bold text-text-primary mb-2">고른 시안: {picks.length ? picks.join(', ') : '없음'} (최대 2개)</h2>
            <p className="text-[13px] text-text-weak mb-4">로고를 클릭하면 선택/해제됩니다.</p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              placeholder="메모 (선택) — 예: 3번인데 라운드 더 작게 / 1번 글자 살짝 아래로"
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
