'use client';

/**
 * /lab/mock = 목업 문법 재정립 시안장 (벽돌2 하위 — DESIGN §8.7-I 3차 교정)
 * "검색에 보인다"(콘텐츠)를 세 방향으로: A 부상 애니 / B 짧은 텍스트 / C 혼합.
 * 짝퉁 실물 재현 폐기 → 즉각 이해 + 세련. 당선 문법으로 광고 목업도 통일 후 분기 시안에 이식.
 */

import { useState } from 'react';
import ExposureMockA from '@/components/styles/bricks/ExposureMockA';
import ExposureMockB from '@/components/styles/bricks/ExposureMockB';
import ExposureMockC from '@/components/styles/bricks/ExposureMockC';

const EN = { fontFamily: 'var(--font-en)' } as const;

const MOCKS = [
  { id: 'mock-a', label: 'A', concept: '부상 애니메이션 — 흐린 결과들 사이 내 가게만 위로 (텍스트 최소)', C: ExposureMockA },
  { id: 'mock-b', label: 'B', concept: '짧은 텍스트 + 미니 그래픽 — "3위 → 1위" 핵심만', C: ExposureMockB },
  { id: 'mock-c', label: 'C', concept: '혼합 — 부상 리스트 + 순위 배지', C: ExposureMockC },
] as const;

export default function LabMock() {
  const [pick, setPick] = useState('');
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function submit() {
    setStatus('sending');
    try {
      const res = await fetch('/api/draft-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brick: 'exposure-mock', pick, memo, at: new Date().toISOString() }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 02 · Mock Grammar</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">“검색에 보인다” 목업 3방향 — 하나를 골라주세요</h1>
        <p className="text-[14px] text-text-weak mt-1">짝퉁 네이버 재현은 폐기. 한 번에 이해되고 세련된 쪽을 고르시면, 광고 목업도 같은 문법으로 통일해 세 카드 시안에 이식합니다.</p>
      </div>

      {/* 3방향 — 실제 콘텐츠 카드 맥락으로 감쌈 */}
      <div className="max-w-[1120px] mx-auto px-6 py-12 grid grid-cols-3 gap-6 max-md:grid-cols-1">
        {MOCKS.map(({ id, label, concept, C }) => (
          <div key={id} className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 flex items-center justify-center text-[13px] font-bold text-white bg-[#171717] shrink-0" style={EN}>{label}</span>
              <span className="text-[12px] text-text-weak leading-tight">{concept}</span>
            </div>
            {/* 카드 프레임(BranchC와 동일 톤) */}
            <div className="flex flex-col border border-border-default bg-white">
              <div className="relative h-[220px] overflow-hidden bg-bg-alt border-b border-border-default flex items-center">
                <span className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: '#2fd46b', opacity: 0.55 }} />
                <C />
              </div>
              <div className="p-6">
                <p className="flex items-center gap-2 text-[11px] font-semibold text-text-weak tracking-[0.08em] uppercase mb-3" style={EN}>
                  <span className="rounded-dot w-1.5 h-1.5" style={{ background: '#2fd46b' }} />
                  누구나 콘텐츠
                </p>
                <h3 className="text-[22px] font-semibold text-text-primary tracking-[-0.02em] leading-[1.25] mb-3">
                  검색에 <span className="text-accent">보이고</span> 싶습니다
                </h3>
                <p className="text-[14px] text-text-body leading-[1.65]">블로그와 플레이스, SNS까지. 검색에서 고객이 내 가게를 먼저 만나는 시작.</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 선택·제출 */}
      <div className="border-t-4 border-[#171717] px-6 py-12 max-w-[720px] mx-auto">
        {status === 'done' ? (
          <p className="text-[18px] font-bold text-text-primary text-center py-8">제출됐습니다. 이 문법으로 통일하겠습니다.</p>
        ) : (
          <>
            <h2 className="text-[18px] font-bold text-text-primary mb-4">어느 목업 문법으로 갈까요?</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {MOCKS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setPick(id)}
                  className="h-14 text-[18px] font-bold border transition-colors"
                  style={{
                    borderColor: pick === id ? '#0070f3' : '#eaeaea',
                    background: pick === id ? 'rgba(0,112,243,0.06)' : '#fff',
                    color: pick === id ? '#0070f3' : '#171717',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              placeholder="메모 (선택) — 예: A로 가되 막대는 빼고 / B가 제일 직관적"
              className="w-full px-4 py-3 border border-border-default text-[15px] text-text-primary focus:border-accent focus:outline-none resize-y mb-3"
            />
            <button
              onClick={submit}
              disabled={(!pick && !memo.trim()) || status === 'sending'}
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
