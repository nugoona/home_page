import type { Metadata } from 'next';
import { AssetProfiles } from '@/components/content/AssetProfiles';
import { Eyebrow } from '@/components/content/ContentSections';

export const metadata: Metadata = { title: '쌓인 콘텐츠 구간 시안', robots: { index: false, follow: false } };

/* "서비스 이용이 끝나도 쌓인 콘텐츠는 그대로 남습니다" 구간 시안(2026-10-09) */
export default function Page() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-[1200px] px-12 py-24 max-md:px-6 max-md:py-16">
        <Eyebrow label="Asset" />
        <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.26] tracking-[-0.04em] text-balance text-text-primary max-md:text-[26px]">
          서비스 이용이 끝나도<br />쌓인 콘텐츠는 그대로 남습니다
        </h2>
        <p className="mt-4 max-w-[460px] text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-balance text-[#4f4f4f] md:max-w-[680px] md:leading-[1.35]">발행된 글과 영상은 고객님의 계정에 쌓입니다.</p>
        <div className="relative mt-10 px-8 py-10 max-md:mt-8 max-md:px-4 max-md:py-7" style={{ background: '#FAFAFA', backgroundImage: 'radial-gradient(#dcdcdc 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="mx-auto max-w-[1040px]"><AssetProfiles /></div>
        </div>
      </section>
    </main>
  );
}
