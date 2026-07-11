'use client';

/**
 * /lab/exposure = "검색에 보인다" 목업 3방향 비교 (목업 정의 = 메시지 이해 도구, 창의 자유, 톤 고정)
 * 메시지 = "손님이 검색하면 내 가게를 만난다"(발견, 순위 아님). 금지 게이트 통과분.
 * A 여러 길 / B 모여드는 손님 / C 켜지는 내 가게. 사장님 택1 → 광고 목업 통일 → 분기 카드 이식.
 */

import { useState } from 'react';
import ExposurePaths from '@/components/styles/bricks/ExposurePaths';
import ExposureGather from '@/components/styles/bricks/ExposureGather';
import ExposureLightup from '@/components/styles/bricks/ExposureLightup';

const EN = { fontFamily: 'var(--font-en)' } as const;

const MOCKS = [
  { id: 'exp-a', label: 'A', concept: '여러 길, 한 도착지 — 블로그·플레이스·인스타 손님이 각 길로 내 가게에 도착', C: ExposurePaths },
  { id: 'exp-b', label: 'B', concept: '모여드는 손님 — 흩어진 손님들이 검색으로 내 가게에 모여듦', C: ExposureGather },
  { id: 'exp-c', label: 'C', concept: '켜지는 내 가게 — 여러 가게 중 검색이 내 가게만 또렷이 켠다', C: ExposureLightup },
] as const;

export default function LabExposure() {
  const [pick, setPick] = useState('');
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function submit() {
    setStatus('sending');
    try {
      const res = await fetch('/api/draft-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brick: 'exposure-metaphor', pick, memo, at: new Date().toISOString() }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 02 · Content Mock (은유)</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">“검색에 보인다” 3방향 — 하나를 골라주세요</h1>
        <p className="text-[14px] text-text-weak mt-1">메시지 = “손님이 검색하면 내 가게를 만난다”(순위 아님, 발견). 실제 화면 재현 대신 은유로. 스크롤하면 모션이 재생됩니다.</p>
      </div>

      <div className="max-w-[1120px] mx-auto px-6 py-12 grid grid-cols-3 gap-6 max-md:grid-cols-1">
        {MOCKS.map(({ id, label, concept, C }) => (
          <div key={id} className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 flex items-center justify-center text-[13px] font-bold text-white bg-[#171717] shrink-0" style={EN}>{label}</span>
              <span className="text-[12px] text-text-weak leading-tight">{concept}</span>
            </div>
            <div className="flex flex-col border border-border-default bg-white">
              <div className="relative h-[240px] overflow-hidden bg-bg-alt border-b border-border-default">
                <span className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{ background: '#2fd46b', opacity: 0.55 }} />
                <C />
              </div>
              <div className="p-6">
                <p className="flex items-center gap-2 text-[11px] font-semibold text-text-weak tracking-[0.08em] uppercase mb-3" style={EN}>
                  <span style={{ width: 6, height: 6, background: '#2fd46b', borderRadius: '50%' }} />
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

      <div className="border-t-4 border-[#171717] px-6 py-12 max-w-[720px] mx-auto">
        {status === 'done' ? (
          <p className="text-[18px] font-bold text-text-primary text-center py-8">제출됐습니다. 이 은유로 광고 목업도 통일하겠습니다.</p>
        ) : (
          <>
            <h2 className="text-[18px] font-bold text-text-primary mb-4">어느 은유로 갈까요?</h2>
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
              placeholder="메모 (선택) — 예: A인데 손님을 더 크게 / C가 제일 직관적"
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
