import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import HeroAurora from '@/components/home/HeroAurora';
import ProductBranch from '@/components/home/ProductBranch';
import Philosophy from '@/components/home/Philosophy';
import StoryStep from '@/components/home/StoryStep';
import CTA from '@/components/home/CTA';
import { promise } from '@/lib/content/home';

const EN = { fontFamily: 'var(--font-en)' } as const;

export default function Home() {
  return (
    <main>
      <OuterContainer>
        {/* S1 · 히어로 (사장님 작품 — 유지) */}
        <Section noBorder>
          <HeroAurora />
        </Section>

        {/* S2 · 두 제품 분기 (홈의 심장) */}
        <Section>
          <ProductBranch />
        </Section>

        {/* S3 · 왜 만들었나 (라이트, 텍스트 전용) */}
        <Section>
          <Philosophy />
        </Section>

        {/* S4 · 회사 약속 */}
        <Section noBorder>
          <StoryStep dark time="∞" step={promise.step} headline={promise.title} subtitle={promise.sub}>
            <div className="flex gap-4 max-w-[520px] max-md:flex-col">
              <div className="flex-1 border border-white/15 bg-white/[0.03] px-6 py-7">
                <p className="text-[13px] text-white/50 mb-2">기능</p>
                <p className="text-[26px] font-bold text-white" style={EN}>계속 &uarr;</p>
              </div>
              <div className="flex-1 border border-accent/40 bg-accent/[0.07] px-6 py-7">
                <p className="text-[13px] text-white/50 mb-2">요금</p>
                <p className="text-[26px] font-bold text-accent" style={EN}>그대로 &rarr;</p>
              </div>
            </div>
          </StoryStep>
        </Section>

        {/* S5 · CTA */}
        <Section alt noBorder>
          <CTA />
        </Section>
      </OuterContainer>
    </main>
  );
}
