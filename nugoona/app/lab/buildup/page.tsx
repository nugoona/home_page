import type { Metadata } from 'next';
import { BuildUpStone } from '@/components/content/BuildUpStone';
import { Eyebrow } from '@/components/content/ContentSections';

export const metadata: Metadata = { title: '2번 구간 시안', robots: { index: false, follow: false } };

/* "검색에 보이려면 꾸준히 올려야 합니다" — 원리 모션 1단계(돌 하나 가라앉기) 시험. 서브 = 한 줄만(§8.19-C) */
export default function Page() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-[1200px] px-12 py-20 max-md:px-6 max-md:py-14">
        <div className="grid grid-cols-[1fr_1.2fr] items-center gap-12 max-md:grid-cols-1 max-md:gap-8">
          <div>
            <Eyebrow label="Build-up" />
            <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.26] tracking-[-0.04em] text-balance text-text-primary">검색에 보이려면<br />꾸준히 올려야 합니다</h2>
            <p className="mt-4 text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-[#4f4f4f]">그 꾸준함은 누구나 콘텐츠가 이어갑니다</p>
          </div>
          <BuildUpStone />
        </div>
      </section>
    </main>
  );
}
