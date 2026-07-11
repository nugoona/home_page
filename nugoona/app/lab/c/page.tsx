'use client';

/**
 * /lab/c = 벽돌2(홈 분기 카드) C안 단독 검증 라우트.
 * C = "정밀 카드 개선" — 현행 ProductBranch를 유지·정밀화한 안전한 대조군.
 * BranchC를 라이트 배경에 풀폭으로 단독 렌더한다(다른 시안과 경합하지 않도록 격리).
 */

import BranchC from '@/components/styles/bricks/BranchC';

export default function LabC() {
  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={{ fontFamily: 'var(--font-en)' }}>
          Brick 02 · Home Branch Card — C
        </p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">C안 — 정밀 카드 개선</h1>
        <p className="text-[14px] text-text-weak mt-1">
          현행 2열 카드를 유지한 안전한 대조군. 그리드 정렬·stagger 모션·제품색 절제 포인트로 정밀화.
        </p>
      </div>
      <BranchC />
    </main>
  );
}
