import S7UpdatePairs from '@/components/home/s7/S7UpdatePairs';

/* S7 "매체가 바뀌면, 앱도 바뀝니다" 변화→대응 페어 타임라인 — 모바일 검수용 무대. */
export default function Page() {
  return (
    <main className="bg-white">
      <div className="sticky top-0 z-50 bg-neutral-900 px-5 py-3 font-mono text-[13px] text-white">
        S7 · 변화→대응 페어 타임라인
      </div>
      <S7UpdatePairs />
    </main>
  );
}
