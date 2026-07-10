/**
 * /styles — 작업 갤러리 (사장님 검수 무대. 지우지 말 것 — 사장님 지시)
 * 구성: ①지금 판정 필요한 것(O/X) ②구현 완료(보기만) ③아카이브(접힘 — 옛 실험·구버전).
 */
import S1_IllustrationHero from '@/components/styles/S1_IllustrationHero';
import S2_IconSteps from '@/components/styles/S2_IconSteps';
import S3_BeforeAfterSlider from '@/components/styles/S3_BeforeAfterSlider';
import S4_MiniDemo from '@/components/styles/S4_MiniDemo';
import S5_Mascot from '@/components/styles/S5_Mascot';
import S6_KineticType from '@/components/styles/S6_KineticType';
import S7_ScrollAssemble from '@/components/styles/S7_ScrollAssemble';
import S8_RealPhoto from '@/components/styles/S8_RealPhoto';
import S9_ChannelFanout from '@/components/styles/S9_ChannelFanout';
import S10_RankTrack from '@/components/styles/S10_RankTrack';
import S11_NewsEngine from '@/components/styles/S11_NewsEngine';
import S12_MapExposure from '@/components/styles/S12_MapExposure';
import S13_Onboarding from '@/components/styles/S13_Onboarding';
import S14_Generate from '@/components/styles/S14_Generate';
import Draft_CoreSet from '@/components/styles/Draft_CoreSet';

const EN = { fontFamily: 'var(--font-en)' } as const;

/* 구현 완료 — 판정 불필요, 눈으로만 확인 */
const DONE = [
  { name: '① 다채널 발행 — 구현 완료 (통과 시안 + fan-out 모션)', C: S9_ChannelFanout },
  { name: '② 목표 키워드 — 자율 구현 (v3 시안 기반 · 기상 후 확인)', C: S14_Generate },
  { name: '③ 노출 소식 엔진 — 구현 완료 (통과 시안 + 브랜드 모션)', C: S11_NewsEngine },
  { name: '④ 지도 노출 — 단순화 감량판 (자율 채택 · 실사풍 원하시면 되돌림)', C: S12_MapExposure },
  { name: '⑤ 순위 증명 — 구현 완료 (초대형 측정값 + 카운트업)', C: S10_RankTrack },
  { name: '⑥ 온보딩 — 구현 완료 (내역 3그룹 체크 판)', C: S13_Onboarding },
];

/* 아카이브 — 옛 실험. 판정 불필요. 재사용 자산이라 보존(지우지 않음) */
const ARCHIVE = [
  { name: '(스타일 실험 01) 큰 일러스트 1컷', C: S1_IllustrationHero },
  { name: '(스타일 실험 02) 아이콘 3단계', C: S2_IconSteps },
  { name: '(스타일 실험 03) Before → After 슬라이더', C: S3_BeforeAfterSlider },
  { name: '(스타일 실험 04) 미니 인터랙티브 데모', C: S4_MiniDemo },
  { name: '(스타일 실험 05) 캐릭터 마스코트', C: S5_Mascot },
  { name: '(스타일 실험 06) 거대 타이포', C: S6_KineticType },
  { name: '(스타일 실험 07) 스크롤 조립 애니', C: S7_ScrollAssemble },
  { name: '(스타일 실험 08) 실물 사진 은유', C: S8_RealPhoto },
];

export default function StylesGallery() {
  return (
    <main className="max-w-[1120px] mx-auto px-8 py-16 max-md:px-5 max-md:py-10">
      {/* ── 1. 지금 판정 필요한 것 ── */}
      <header className="mb-6">
        <p className="text-[13px] font-semibold text-accent tracking-[0.12em] uppercase mb-2" style={EN}>지금 판정할 것</p>
        <h1 className="text-[clamp(26px,4vw,36px)] font-semibold text-text-primary tracking-[-0.03em] mb-3">
          시안 5개만 봐 주세요 — ①②⑤⑥⑦
        </h1>
        <p className="text-[14px] text-text-body leading-[1.7]">
          아래 각 시안의 파란 Q 옆 <b>[O] [X]</b>를 누르고(메모 선택), 화면 하단 <b>제출</b>을 누르면 끝.
          <br />③은 통과되어 구현 완료, ④지도는 보류(실사풍 vs 단순화 결정 대기)라 안 눌러도 됩니다.
        </p>
      </header>

      <div className="border border-border-default bg-white p-8 max-md:p-4">
        <Draft_CoreSet />
      </div>

      {/* ── 2. 구현 완료 — 보기만 ── */}
      <div className="mt-16">
        <p className="text-[13px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ ...EN, color: '#16a34a' }}>구현 완료 — 판정 불필요</p>
        {DONE.map((s) => (
          <section key={s.name} className="border-t border-border-default py-10">
            <h2 className="text-[16px] font-bold text-text-primary mb-5">{s.name}</h2>
            <div className="border border-border-default bg-white p-8 max-md:p-4 overflow-hidden">
              <s.C />
            </div>
          </section>
        ))}
        <p className="text-[12px] text-text-weak mt-2">
          홈의 "두 제품 분기"와 /ads 새 히어로는 실제 페이지에 반영됨 — <a className="text-accent underline" href="/">홈 보기</a> · <a className="text-accent underline" href="/ads?m=1">/ads 보기</a>
        </p>
      </div>

      {/* ── 3. 아카이브 (접힘) ── */}
      <details className="mt-16 border-t border-border-default pt-8">
        <summary className="cursor-pointer text-[14px] font-semibold text-text-muted">
          아카이브 열기 — 옛 실험·구버전 {ARCHIVE.length}개 (판정 불필요, 재사용 자산이라 보존)
        </summary>
        {ARCHIVE.map((s) => (
          <section key={s.name} className="border-t border-border-default py-10 mt-6">
            <h2 className="text-[15px] font-bold text-text-muted mb-5">{s.name}</h2>
            <div className="border border-border-default bg-white p-8 max-md:p-4 overflow-hidden opacity-80">
              <s.C />
            </div>
          </section>
        ))}
      </details>
    </main>
  );
}
