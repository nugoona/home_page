'use client';

/**
 * /lab/philosophy = 벽돌3 철학 섹션 시안 갤러리
 * A 절제 중앙형 / B 좌우 2단+시간축 / C 창업자 편지형. 사장님 택1 → 본편 장착.
 */

import PhilosophyA from '@/components/styles/bricks/PhilosophyA';
import PhilosophyB from '@/components/styles/bricks/PhilosophyB';
import PhilosophyC from '@/components/styles/bricks/PhilosophyC';

const EN = { fontFamily: 'var(--font-en)' } as const;

function Label({ tag, title, note }: { tag: string; title: string; note: string }) {
  return (
    <div className="border-y border-border-default bg-[#f7f9fc] px-6 py-4">
      <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>{tag}</p>
      <h2 className="text-[17px] font-bold text-text-primary">{title}</h2>
      <p className="text-[13px] text-text-weak mt-0.5">{note}</p>
    </div>
  );
}

export default function LabPhilosophy() {
  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 03 · Philosophy</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">철학 롱폼 3막 시안 3종 (글이 주인공 · A안 확정 카피)</h1>
        <p className="text-[14px] text-text-weak mt-1">“마케팅은 늘 남의 일 → 규칙이 바뀜 → 직접 할 수 있게” 3막. 레이아웃만 변주. 순위·파스텔·IT도식 없음.</p>
      </div>

      <Label tag="Option A" title="중앙 세로 서사 (글만)" note="여는 문장 → 3막 세로 중앙정렬. 가장 담백·미니멀. 현 홈 본편 잠정안." />
      <div id="opt-a"><PhilosophyA /></div>

      <Label tag="Option B" title="좌 제목 / 우 본문 2단" note="에디토리얼. 막마다 좌측 제목·우측 본문 + 얇은 구분선." />
      <div id="opt-b"><PhilosophyB /></div>

      <Label tag="Option C" title="글 + 실물 지그재그" note="2막에 정직 측정 실물, 3막에 앱 실물을 곁들임(‘내용과 함께 보여주고’)." />
      <div id="opt-c"><PhilosophyC /></div>
    </main>
  );
}
