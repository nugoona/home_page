import S42AdScene from '@/components/home/s4/S42AdScene';

/* S4-2 광고 목업 시안 — "광고를 만들고 → 성과 한 화면 → 챗봇" 3단. 모바일 검수 무대. */
export default function Page() {
  return (
    <main className="bg-white">
      <div className="sticky top-0 z-50 bg-neutral-900 px-5 py-3 font-mono text-[13px] text-white">
        S4-2 · 광고 3단 (만들고 → 성과 → 챗봇)
      </div>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[640px]">
          <h2 className="text-[clamp(24px,4.4vw,34px)] font-bold leading-[1.25] tracking-[-0.03em] text-text-primary [text-wrap:balance]">
            광고를 만들고 운영하는 일을
            <br />
            누구나 할 수 있도록
          </h2>
          <p className="mt-4 text-[15px] font-medium leading-[1.5] text-text-body">
            광고 만들기부터 운영, 성과 확인까지 한 화면에서
            <br />
            궁금한 것은 AI 챗봇에게 바로 물어봅니다.
          </p>
        </div>
        <div className="mt-12">
          <S42AdScene />
        </div>
      </section>
    </main>
  );
}
