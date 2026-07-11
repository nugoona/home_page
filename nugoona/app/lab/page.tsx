'use client';

/**
 * /lab = 벽돌 시안장 (벽돌 쌓기 프로세스 전용 — .ngn-session.md 2026-07-11 저녁 확정)
 * 벽돌 1: 홈 히어로 — 시안 A/B/C/D 풀폭 실렌더 + 사장님 택1·메모 제출(/api/draft-feedback 재활용).
 * 당선작은 본편(app/page.tsx) 장착 후, 당선 문법을 DESIGN 정본에 적립.
 */

import { useState } from 'react';
import HeroA from '@/components/styles/bricks/HeroA';
import HeroB from '@/components/styles/bricks/HeroB';
import HeroC from '@/components/styles/bricks/HeroC';
import HeroD from '@/components/styles/bricks/HeroD';

const EN = { fontFamily: 'var(--font-en)' } as const;

const BRICKS = [
  { id: 'hero-a', label: 'A', concept: '타이포 지배 — 한글 활자가 그래픽 (화이트·마스크 리빌·밑줄 드로잉)', C: HeroA },
  { id: 'hero-b', label: 'B', concept: '빔 캔버스 진화 — 원작 계승 + 두 제품색 빔·코너 버스트 (다크)', C: HeroB },
  { id: 'hero-c', label: 'C', concept: '실물이 주인공 — 검색 타이핑→내 가게 팝 + 대시보드 카운트업 (라이트)', C: HeroC },
  { id: 'hero-d', label: 'D', concept: '톤온톤 무게 — 로고 시스템 타일이 순차 조립 (다크·어도비 감성)', C: HeroD },
] as const;

export default function Lab() {
  const [pick, setPick] = useState<string>('');
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function submit() {
    setStatus('sending');
    try {
      const res = await fetch('/api/draft-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brick: 'hero', pick, memo, at: new Date().toISOString() }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="bg-white">
      {/* 안내 헤더 */}
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 01 · Home Hero</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">홈 히어로 시안 4종 — 하나를 골라주세요</h1>
        <p className="text-[14px] text-text-weak mt-1">카피는 4개 모두 동일(확정본), 연출만 다릅니다. 아래로 내리며 보고 맨 아래에서 선택·제출.</p>
      </div>

      {/* 시안 4종 — 각각 풀폭 실렌더 */}
      {BRICKS.map(({ id, label, concept, C }) => (
        <div key={id}>
          <div className="sticky top-0 z-40 flex items-center gap-3 px-6 py-3 bg-[#171717]">
            <span className="w-8 h-8 flex items-center justify-center text-[15px] font-bold text-[#171717] bg-white shrink-0" style={EN}>{label}</span>
            <span className="text-[13px] max-md:text-[12px] text-white/80">{concept}</span>
          </div>
          <C />
        </div>
      ))}

      {/* 선택·제출 */}
      <div className="border-t-4 border-[#171717] px-6 py-12 max-w-[720px] mx-auto">
        {status === 'done' ? (
          <p className="text-[18px] font-bold text-text-primary text-center py-8">제출됐습니다. 반영하겠습니다.</p>
        ) : (
          <>
            <h2 className="text-[18px] font-bold text-text-primary mb-4">어느 안으로 갈까요?</h2>
            <div className="grid grid-cols-4 gap-2 max-md:grid-cols-2 mb-4">
              {BRICKS.map(({ id, label }) => (
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
              placeholder="메모 (선택) — 예: A로 가되 밑줄은 빼고 / C 목업을 B 배경에 얹으면?"
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
