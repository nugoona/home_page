import type { Metadata } from 'next';
import { StartScene } from '@/components/content/StartScene';
import { Eyebrow } from '@/components/content/ContentSections';

export const metadata: Metadata = { title: '시작 구간 시안', robots: { index: false, follow: false } };

/* "상호명만 넣어주세요" 구간 시안(2026-10-09) — 동네 고깃집 */
export default function Page() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-[1200px] px-12 py-20 max-md:px-6 max-md:py-14">
        <Eyebrow label="Start" />
        <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.26] tracking-[-0.04em] text-balance text-text-primary">상호명만 넣어주세요</h2>
        <p className="mt-4 max-w-[460px] text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-balance text-[#4f4f4f] md:max-w-[680px] md:leading-[1.35]">가게 운영만으로도 하루는 이미 벅찹니다.</p>
        <div className="mx-auto mt-12 w-full max-w-[980px] max-md:mt-8">
          <StartScene />
        </div>
      </section>
    </main>
  );
}
