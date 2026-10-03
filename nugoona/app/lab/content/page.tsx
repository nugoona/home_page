/* /lab/content — /content 후보 부품 모음 (사장님 퀄리티 검수용, 2026-07-16)
   재고조사 결론의 재사용 후보를 /content 섹션(S1~S11) 순서대로 한 페이지에 렌더.
   목적: 이미 만든 목업의 퀄리티를 눈으로 보고 "그대로 쓸지 / 새로 만들지" 판정.
   ⚠ 카피는 대부분 홈/구 상태 — 지금은 디자인·퀄리티만 확인. */
import type { ComponentType } from 'react';
import S41SearchScene from '@/components/home/s4/S41SearchScene';
import S42AdScene from '@/components/home/s4/S42AdScene';
import TwoAppsRail from '@/components/home/s4/TwoAppsRail';
import BrandPhilosophySection from '@/components/home/BrandPhilosophySection';
import S3GraphicA from '@/components/home/s3/S3GraphicA';
import S6AssetStacks from '@/components/home/s6/S6AssetStacks';
import S8CtaDark from '@/components/home/s8/S8CtaDark';
import S9_ChannelFanout from '@/components/styles/S9_ChannelFanout';
import S10_RankTrack from '@/components/styles/S10_RankTrack';
import S11_NewsEngine from '@/components/styles/S11_NewsEngine';
import S12_MapExposure from '@/components/styles/S12_MapExposure';
import S13_Onboarding from '@/components/styles/S13_Onboarding';
import S14_Generate from '@/components/styles/S14_Generate';
import Clone09 from '@/components/styles/vercel/Clone09';
import Clone10 from '@/components/styles/vercel/Clone10';

const EN = { fontFamily: 'var(--font-en)' } as const;

type Part = { sec: string; label: string; comp: string; C: ComponentType; note: string; wide?: boolean };

const PARTS: Part[] = [
  { sec: 'S1', label: '검색결과 속 하나의 스토어', comp: 'S41SearchScene', note: '검색 브라우저 안 내 가게가 스켈레톤 결과 사이에 노출(part 3)', C: S41SearchScene },
  { sec: 'S2', label: '광고 vs 콘텐츠 · 후보 A', comp: 'TwoAppsRail', note: '두 제품 분기 (홈 카피 상태)', C: TwoAppsRail },
  { sec: 'S2', label: '광고 vs 콘텐츠 · 후보 B', comp: 'BrandPhilosophySection', note: '콘텐츠로 발견 / 광고로 고객 · 2열 선언 (다크)', C: BrandPhilosophySection },
  { sec: 'S3', label: '세 기능 미니 흐름 · 후보 A', comp: 'S14_Generate', note: '키워드 선정 기준 3단', C: S14_Generate },
  { sec: 'S3', label: '세 기능 미니 흐름 · 후보 B', comp: 'S3GraphicA', note: '궤도 + 채팅 (홈 OUR WAY)', C: S3GraphicA },
  { sec: 'S4', label: '채널별 콘텐츠 변환', comp: 'S9_ChannelFanout', note: '정본', C: S9_ChannelFanout },
  { sec: 'S5', label: '변화 수집 → 다음 글 반영 (킬러)', comp: 'S11_NewsEngine', note: '정본', C: S11_NewsEngine },
  { sec: 'S6', label: '지도·플레이스', comp: 'S12_MapExposure', note: '정본', C: S12_MapExposure },
  { sec: 'S7', label: '순위 추적 · 후보 A', comp: 'S10_RankTrack', note: '정본 · 대형 측정값', C: S10_RankTrack },
  { sec: 'S7', label: '성과 대시보드 · 후보 B', comp: 'S42AdScene', note: '폰 대시보드 (광고쪽 참고)', C: S42AdScene },
  { sec: 'S8', label: '시작 부담 · 온보딩', comp: 'S13_Onboarding', note: '정본', C: S13_Onboarding },
  { sec: 'S9', label: '미니 UI 기능 그리드 · 후보 A', comp: 'Clone09', note: 'px 고정 Vercel 시안 · 한글화·반응형 필요 · 가로 스크롤', C: Clone09, wide: true },
  { sec: 'S9', label: '미니 UI 기능 그리드 · 후보 B', comp: 'Clone10', note: 'px 고정 Vercel 시안 · 한글화·반응형 필요 · 가로 스크롤', C: Clone10, wide: true },
  { sec: 'S10', label: '콘텐츠 자산', comp: 'S6AssetStacks', note: '정본급 · 홈 자산 섹션', C: S6AssetStacks },
  { sec: 'S11', label: 'CTA', comp: 'S8CtaDark', note: '정본급 · 다크 패널', C: S8CtaDark },
];

export default function ContentPartsReview() {
  return (
    <main className="max-w-[1180px] mx-auto px-6 py-12 max-md:px-3 max-md:py-8">
      <header className="mb-8">
        <p className="text-[12px] font-semibold text-accent tracking-[0.14em] uppercase mb-2" style={EN}>/content 부품 검수</p>
        <h1 className="text-[clamp(22px,4vw,32px)] font-semibold text-text-primary tracking-[-0.03em] mb-3">이미 만든 목업들 — 퀄리티 확인용</h1>
        <p className="text-[14px] text-text-body leading-[1.7]">
          재고조사에서 /content 후보로 나온 부품을 섹션 순서대로 모았습니다. 각 부품이 맘에 드는지(그대로 쓸지 / 새로 만들지) 봐 주세요.
          <br />카피는 대부분 아직 홈·구 상태 — 지금은 <b>디자인·퀄리티</b>만 봐 주시면 됩니다.
        </p>
      </header>

      {PARTS.map((p, i) => (
        <section key={i} className="border-t border-border-default py-8 max-md:py-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
            <span className="text-[12px] font-bold text-white bg-[#171717] px-2 py-0.5" style={EN}>{p.sec}</span>
            <h2 className="text-[15px] font-bold text-text-primary">{p.label}</h2>
            <span className="text-[12px] text-text-weak" style={EN}>{p.comp}</span>
          </div>
          <p className="text-[12px] text-text-weak mb-4">{p.note}</p>
          <div className={`border border-border-default bg-white ${p.wide ? 'overflow-x-auto' : 'overflow-hidden'}`}>
            <p.C />
          </div>
        </section>
      ))}
    </main>
  );
}
