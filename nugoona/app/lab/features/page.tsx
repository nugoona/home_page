import type { Metadata } from 'next';
import { FeaturePrinciples } from '@/components/content/FeaturePrinciples';
import { Eyebrow } from '@/components/content/ContentSections';

export const metadata: Metadata = { title: '기능 구간 시안', robots: { index: false, follow: false } };

/* "이 밖에도 필요한 기능을 담았습니다" 구간 시안(2026-10-09) — 흰 바탕(회색 밴드 폐기, §8.17) */
export default function Page() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-[1200px] px-12 py-24 max-md:px-6 max-md:py-16">
        <Eyebrow label="Features" />
        <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.26] tracking-[-0.04em] text-balance text-text-primary max-md:text-[26px]">이 밖에도 필요한 기능을 담았습니다</h2>
        <div className="mt-10 max-md:mt-8">
          <FeaturePrinciples />
        </div>
      </section>
    </main>
  );
}
