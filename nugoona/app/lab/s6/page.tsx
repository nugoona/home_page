import S6AssetStacks from '@/components/home/s6/S6AssetStacks';

/* S6 "남는 것은 사장님의 것" 두 자산 스택 — 모바일 검수용 무대. */
export default function Page() {
  return (
    <main className="bg-white">
      <div className="sticky top-0 z-50 bg-neutral-900 px-5 py-3 font-mono text-[13px] text-white">
        S6 · 두 자산 스택 (계정 글 쌓임 + 리포트 쌓임)
      </div>
      <S6AssetStacks />
    </main>
  );
}
