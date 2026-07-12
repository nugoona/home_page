'use client';

/**
 * /lab/philosophy-mock = 철학 2막에 곁들일 "중간 목업" 형태 4시안 비교
 * 같은 2막(측정 실물)을 4방식으로: ①핵심 크롭 카드 ②작은 폰 통짜 ③앱 창 프레임 ④글만
 * 실물은 형태 제안 — 사장님이 직접 스샷으로 교체 가능.
 */

import { philosophy } from '@/lib/content/home';

const EN = { fontFamily: 'var(--font-en)' } as const;
const IMG = '/shots/content/mock-rank-detail.png'; // 검정 배경 폰 통짜(대조군)
const CROP = '/shots/content/rank-crop.png'; // 화면 카드만 크롭(깨끗)
const act = philosophy.acts[1]; // 2막 "그런데 규칙이 바뀌었습니다"

function Text() {
  return (
    <div className="max-w-[440px]">
      <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.12em] text-[#0070f3]">02</span>
      <h3 className="mb-5 text-[clamp(22px,3vw,30px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.25]">
        {act.title}
      </h3>
      <div className="space-y-2">
        {act.lines.map((l, i) => (
          <p key={i} className="text-[16px] text-text-body leading-[1.55]">{l}</p>
        ))}
      </div>
    </div>
  );
}

function Row({ tag, title, note, children }: { tag: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="border-y border-border-default bg-[#f7f9fc] px-6 py-4">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>{tag}</p>
        <h2 className="text-[17px] font-bold text-text-primary">{title}</h2>
        <p className="text-[13px] text-text-weak mt-0.5">{note}</p>
      </div>
      <div className="bg-white px-6 py-16 flex items-center justify-center gap-14 max-md:flex-col max-md:gap-8">
        {children}
      </div>
    </section>
  );
}

export default function LabPhilosophyMock() {
  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 03 · Mock Form</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">철학 2막 “중간 목업” 형태 4시안</h1>
        <p className="text-[14px] text-text-weak mt-1">글이 주인공 · 실물은 거들 뿐. 통짜 폰이 크고 붕 뜨는 문제를 4방식으로 개선.</p>
      </div>

      {/* ① 핵심 크롭 카드 — 폰 프레임 없이 카드 부분만 */}
      <Row tag="Form 1" title="핵심 크롭 카드" note="폰 전체 말고 ‘1페이지 / 안 보임’ 카드 부분만 잘라 작게. 가장 담백.">
        <Text />
        <img src={CROP} alt="노출 측정 카드" className="w-[248px] rounded-[14px] border border-border-default shadow-[0_16px_44px_-20px_rgba(15,23,42,0.3)] shrink-0" />
      </Row>

      {/* ② 작은 폰 통짜 — 현재보다 작게 */}
      <Row tag="Form 2" title="작은 폰 통짜" note="지금 방식(통짜)을 그대로 두되 크기만 축소. 세로가 길어 여전히 붕 뜰 수 있음.">
        <Text />
        <img src={IMG} alt="노출 측정 화면" className="w-[168px] rounded-[12px] border border-border-default shadow-[0_16px_44px_-20px_rgba(15,23,42,0.3)] shrink-0" />
      </Row>

      {/* ③ 앱 창 프레임 카드 — 상단 바 + 크롭 */}
      <Row tag="Form 3" title="앱 창 프레임" note="크롭을 깔끔한 앱 창(상단 바)에 담아 ‘제품 화면’임을 명확히.">
        <Text />
        <div className="w-[248px] rounded-[14px] border border-border-default shadow-[0_16px_44px_-20px_rgba(15,23,42,0.3)] overflow-hidden shrink-0">
          <div className="flex items-center gap-1.5 px-3 h-8 bg-[#f1f4f8] border-b border-border-default">
            <span className="w-2 h-2 rounded-full bg-[#cdd5df]" />
            <span className="w-2 h-2 rounded-full bg-[#cdd5df]" />
            <span className="w-2 h-2 rounded-full bg-[#cdd5df]" />
            <span className="ml-2 text-[11px] text-text-weak" style={EN}>app.ngn.co.kr</span>
          </div>
          <img src={CROP} alt="노출 측정 화면" className="w-full block" />
        </div>
      </Row>

      {/* ④ 글만 — 목업 없음 */}
      <Row tag="Form 4" title="글만 (목업 없음)" note="철학은 글로만 밀고, 실물은 아래 제품 섹션에서 제대로. 가장 절제.">
        <div className="text-center max-md:text-left"><Text /></div>
      </Row>
    </main>
  );
}
