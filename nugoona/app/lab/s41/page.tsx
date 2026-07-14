import S41SearchScene from '@/components/home/s4/S41SearchScene';

/* S4-1 콘텐츠 목업 시안 D — "앱 → 검색 발견" 합성 장면. 거친 시안 O/X 무대. */
export default function Page() {
  return (
    <main className="bg-white">
      <div className="sticky top-0 z-50 bg-neutral-900 px-5 py-3 font-mono text-[13px] text-white">
        S4-1 · 시안 D (앱 → 검색 발견)
      </div>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[640px]">
          <h2 className="text-[clamp(24px,4.4vw,34px)] font-bold leading-[1.25] tracking-[-0.03em] text-text-primary [text-wrap:balance]">
            검색할 때 우리
            <br />
            가게를 찾을 수 있도록
          </h2>
          <p className="mt-4 text-[15px] font-medium leading-[1.5] text-text-body">
            사진과 짧은 메모를 남기면
            <br />
            이야기할 내용을 찾고, 채널에 맞게 정리합니다.
          </p>
        </div>
        <div className="mt-12">
          <S41SearchScene />
        </div>
      </section>
    </main>
  );
}
