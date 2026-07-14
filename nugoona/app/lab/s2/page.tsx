import S2Concept1 from '@/components/home/s2/S2Concept1';
import S2Concept2 from '@/components/home/s2/S2Concept2';
import S2Concept3 from '@/components/home/s2/S2Concept3';
import S2Concept4 from '@/components/home/s2/S2Concept4';

/* S2 "복잡한 시작" 시안 4종 비교 갤러리 — 모바일 검수용. */
const ITEMS = [
  { n: '1', C: S2Concept1, label: '얽힌 연결망 (복잡 = 엉킴)' },
  { n: '2', C: S2Concept2, label: '쌓이는 단계 (복잡 = 과다)' },
  { n: '3', C: S2Concept3, label: '낯선 설정 화면 (복잡 = 낯섦)' },
  { n: '4', C: S2Concept4, label: '넘치는 탭/창 (복잡 = 산만)' },
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
