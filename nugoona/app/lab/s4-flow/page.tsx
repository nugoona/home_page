import type { Metadata } from 'next';
import { S4Flow } from '@/components/content/S4Flow';
import { Eyebrow } from '@/components/content/ContentSections';
import { multiChannel } from '@/lib/content/content';

export const metadata: Metadata = { title: 'S4 채널 시안', robots: { index: false, follow: false } };

/* 채널 구간 재설계 시안(2026-10-08). ?f=input | output 으로 정지 화면, 없으면 실제 재생 */
export default async function Page({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const { f } = await searchParams;
  const freeze = f === 'input' || f === 'output' ? f : undefined;
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-[1200px] px-12 py-24 max-md:px-6 max-md:py-16">
        <Eyebrow label="Channels" />
        <h2 className="mb-4 text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.26] tracking-[-0.04em] text-balance text-text-primary max-md:text-[26px]" dangerouslySetInnerHTML={{ __html: multiChannel.heading }} />
        <p className="mb-4 max-w-[460px] text-[clamp(15px,1.4vw,18px)] font-medium leading-[1.55] text-balance text-[#4f4f4f] max-md:text-[15px] md:max-w-[680px] md:leading-[1.35]">{multiChannel.body}</p>
        <div className="relative mt-10 px-8 py-10 max-md:mt-8 max-md:px-4 max-md:py-7" style={{ background: '#FAFAFA', backgroundImage: 'radial-gradient(#dcdcdc 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <S4Flow freeze={freeze} />
        </div>
      </section>
    </main>
  );
}
