'use client';

/**
 * /lab/a = 벽돌2(홈 분기 카드) 시안 A "살아있는 두 데모" 단독 검증 라우트.
 * 라이트 배경에 풀폭 렌더. 오케스트레이터가 통합 시 참조.
 */

import BranchA from '@/components/styles/bricks/BranchA';

export default function LabBranchA() {
  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[13px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={{ fontFamily: 'var(--font-en)' }}>
          Brick 02 · Branch — 시안 A
        </p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">살아있는 두 데모</h1>
        <p className="text-[14px] text-text-weak mt-1">각 카드가 제품이 일하는 3막(비포→진행→애프터)을 스크롤 진입 시 재생합니다.</p>
      </div>
      <BranchA />
    </main>
  );
}
