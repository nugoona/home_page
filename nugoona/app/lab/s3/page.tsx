import S3GraphicA from '@/components/home/s3/S3GraphicA';
import S3GraphicB from '@/components/home/s3/S3GraphicB';
import S3GraphicC from '@/components/home/s3/S3GraphicC';

/* S3 "어려운 건 앱이, 확인은 사장님이" 개념 그래픽 시안 3종 비교 — 모바일 검수용.
   각 컴포넌트가 헤드·그래픽·캡션을 자체 렌더하므로 여기선 라벨 바 + 컴포넌트만 둔다(중복 방지). */
const ITEMS = [
  { n: 'A', C: S3GraphicA, label: '완료 더미 → ✓ 하나' },
  { n: 'B', C: S3GraphicB, label: '거의 끝난 흐름 → 마지막 ✓' },
  { n: 'C', C: S3GraphicC, label: '완성물 하나 + ✓ 배지' },
];

export default function Page() {
  return (
    <main className="bg-white">
      {ITEMS.map(({ n, C, label }) => (
        <section key={n} className="border-b-8 border-neutral-100">
          <div className="sticky top-0 z-50 bg-neutral-900 px-5 py-3 font-mono text-[13px] text-white">
            시안 {n} · {label}
          </div>
          <C />
        </section>
      ))}
    </main>
  );
}
