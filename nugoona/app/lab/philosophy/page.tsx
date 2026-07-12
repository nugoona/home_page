'use client';

/**
 * /lab/philosophy = 벽돌3 철학 섹션 시안 갤러리
 * A 절제 중앙형 / B 좌우 2단+시간축 / C 창업자 편지형. 사장님 택1 → 본편 장착.
 */

import PhilosophyA from '@/components/styles/bricks/PhilosophyA';
import PhilosophyB from '@/components/styles/bricks/PhilosophyB';
import PhilosophyC from '@/components/styles/bricks/PhilosophyC';

const EN = { fontFamily: 'var(--font-en)' } as const;

function Label({ tag, title, note }: { tag: string; title: string; note: string }) {
  return (
    <div className="border-y border-border-default bg-[#f7f9fc] px-6 py-4">
      <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>{tag}</p>
      <h2 className="text-[17px] font-bold text-text-primary">{title}</h2>
      <p className="text-[13px] text-text-weak mt-0.5">{note}</p>
    </div>
  );
}

export default function LabPhilosophy() {
  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 03 · Philosophy</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">철학 섹션 시안 3종 (텍스트 주인공 · 목업 없음)</h1>
        <p className="text-[14px] text-text-weak mt-1">헤드 “15년 동안 같은 고민을 만났습니다” — 조판·분위기만 변주. 순위·파스텔·IT도식 없음.</p>
      </div>

      <Label tag="Option A" title="절제 중앙형" note="현행 정제 + 연도 오버라인(2011—2026). 가장 안전·미니멀." />
      <div id="opt-a"><PhilosophyA /></div>

      <Label tag="Option B" title="좌우 2단 + 시간축" note="좌 헤딩 / 우 본문 + 세로 연도 축. ‘축적’을 사실로 거든다." />
      <div id="opt-b"><PhilosophyB /></div>

      <Label tag="Option C" title="창업자 편지형" note="좌측 accent 바 + 왼쪽정렬 + 회사 서명. 목소리·진정성." />
      <div id="opt-c"><PhilosophyC /></div>
    </main>
  );
}
