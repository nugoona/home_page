'use client';

/** /lab/promise = S4 약속 타임라인 + S5 CTA 흐름 확인용(홈 하단 캡처 버그 우회) */
import PromiseTimeline from '@/components/home/PromiseTimeline';
import CTA from '@/components/home/CTA';

export default function LabPromise() {
  return (
    <main>
      <PromiseTimeline />
      <CTA />
    </main>
  );
}
