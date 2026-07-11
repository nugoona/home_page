'use client';

/**
 * /lab/b — 벽돌2(홈 분기 카드) 시안 B "히어로 빔의 착지" 단독 검증 라우트.
 * BranchB 하나만 풀폭 렌더(배경은 컴포넌트 자체가 다크→라이트로 정함).
 */

import BranchB from '@/components/styles/bricks/BranchB';

export default function LabBrickB() {
  return (
    <main>
      <BranchB />
    </main>
  );
}
