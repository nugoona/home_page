import S8CtaDark from '@/components/home/s8/S8CtaDark';

/* S8 CTA — Clone07 다크 패널 차용 시안. 모바일 검수용 무대. */
export default function Page() {
  return (
    <main className="bg-white">
      <div className="sticky top-0 z-50 bg-neutral-900 px-5 py-3 font-mono text-[13px] text-white">
        S8 · CTA (Clone07 다크 패널)
      </div>
      <S8CtaDark />
    </main>
  );
}
