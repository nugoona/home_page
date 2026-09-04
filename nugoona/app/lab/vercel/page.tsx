import Clone01 from '@/components/styles/vercel/Clone01';
import Clone02 from '@/components/styles/vercel/Clone02';
import Clone03 from '@/components/styles/vercel/Clone03';
import Clone04 from '@/components/styles/vercel/Clone04';
import Clone05 from '@/components/styles/vercel/Clone05';
import Clone06 from '@/components/styles/vercel/Clone06';
import Clone07 from '@/components/styles/vercel/Clone07';
import Clone08 from '@/components/styles/vercel/Clone08';
import Clone09 from '@/components/styles/vercel/Clone09';
import Clone10 from '@/components/styles/vercel/Clone10';

/* Vercel 디자인 소스 복제 갤러리 — 렌더 검수·변형 실험용(디자인 소스).
   ⛔ 삭제 금지 = 재사용 자산(사장님 지시 2026-07-16). /lab/sources(애니 33종)와 함께 영구 소스. DESIGN §8.13 등록. */
const CLONES = [
  { n: '01', C: Clone01, label: 'Provider fallback (플로우)' },
  { n: '02', C: Clone02, label: 'Routing/billing (3분할 카드)' },
  { n: '03', C: Clone03, label: 'Safest way to run code (브라우저 목업)' },
  { n: '04', C: Clone04, label: 'Avoid unintended access (터미널)' },
  { n: '05', C: Clone05, label: 'Infrastructure for AI (말풍선·궤도)' },
  { n: '06', C: Clone06, label: 'The AI Cloud (Fluid·Sandbox)' },
  { n: '07', C: Clone07, label: 'Security by default (다크 3칸)' },
  { n: '08', C: Clone08, label: 'Powerful compute (배포·SSO·프레임워크)' },
  { n: '09', C: Clone09, label: '2×2 (Scale·Global·Experiment·Secure)' },
  { n: '10', C: Clone10, label: '2×2 (Conformance·Middleware·A/B·RES)' },
];

export default function Page() {
  return (
    <main className="bg-white">
      {CLONES.map(({ n, C, label }) => (
        <section key={n} className="border-b border-neutral-200">
          <div className="px-6 py-3 font-mono text-[13px] text-neutral-500">#{n} · {label}</div>
          {/* 모바일: PC 레이아웃 유지 + 가로 스크롤로 열람 */}
          <div className="overflow-x-auto">
            <div className="min-w-[1280px]">
              <C />
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
