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
      <style>{`
        @media (max-width: 899px) {
          .vercel-clone-stage { zoom: 0.2; }
        }
      `}</style>
      {CLONES.map(({ n, C, label }) => (
        <section key={n} className="border-b border-neutral-200">
          <div className="px-6 py-3 font-mono text-[13px] text-neutral-500">#{n} · {label}</div>
          {/* ★2026-10-02 모바일 = **축소해서 한눈에**(사장님 "폰 테일스케일로 볼 수 있게").
              구 방식은 "PC 폭 그대로 두고 가로 스크롤"이었는데, 실제로 재 보니
              안쪽 폭 1948px를 390px 창으로 밀어 보는 셈이라 조각만 보이고 레이아웃을 읽을 수 없었다.
              Vercel 클론의 참고 가치는 **배치 뼈대**이므로 글자가 작아져도 전체가 보이는 쪽이 맞다.
              `zoom`을 쓴 이유 = `scale`은 차지하는 높이가 안 줄어 아래에 빈 공간이 생긴다.
              0.2 = 가장 넓은 클론의 안쪽 폭 1948px를 390px 화면에 담는 값(실측). 0.3도 재 봤으나
              584px라 오른쪽이 잘렸다. 글자는 작아지지만 **배치 뼈대는 전부 보인다** — 세부는 PC에서 본다.
              900px = DESIGN §8.18 모바일 경계. PC는 전과 완전히 동일하다(zoom 미적용 실측). */}
          <div className="overflow-x-auto">
            <div className="vercel-clone-stage min-w-[1280px]">
              <C />
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
