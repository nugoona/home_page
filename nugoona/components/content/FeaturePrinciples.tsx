'use client';

/**
 * FeaturePrinciples — /content "이 밖에도 필요한 기능을 담았습니다" 구간 시안 3판(2026-10-09, 직원 PC).
 *
 * 사장님 2026-10-09: "대본을 의심해 봐라 — 고객에게 꼭 필요한 말인가?" → 넷 중 둘만 남긴다.
 *   ① 문의함(주인공) — 손님의 가장 큰 불안 "맡겼는데 연락이 안 되면?"을 푼다.
 *   ② 사진 질문 — "사진만 보고 어떻게 쓰지? 틀리면?"이라는 궁금증을 푼다.
 *   알림·발행 일정은 어느 앱에나 있는 기본이라 뺐다.
 * 그림 = 앱 실제 화면의 흐름·모양 그대로(media/app-shots). 대화·메신저로 바꿨다가 "앱에 없는 화면" 반려 →
 *   문의함 = 문의 카드(화면 사진 첨부) 상태 확인 중 → 답변 도착 → 해결됨 + 아래 칸 답변 / 사진 질문 = 큰 사진 + 질문 + 입력칸.
 * 움직임 = 자리·크기 고정, 내용만 바뀐다(타자 효과로 상자가 커지자 "밀림 버그"로 보였다). 처음부터 무한 반복.
 * 문구 = media/app-shots/README.md 실제 흐름·상태(확인 중 → 답변 도착 → 해결됨 / 질문 최대 1개). 어색한 앱 문구는 뜻만 같게 다듬었다.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LINE = '#ECECEC';
const ACCENT = '#0070f3';
const K = (n: string) => `/img/content/food/${n}.jpg`;

function useStep(n: number, ms: number) {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((v) => (v + 1) % n), ms);
    return () => clearInterval(id);
  }, [n, ms]);
  return s;
}

/** 칸 머리: 아이콘 + 칸 이름 / 원칙 한 줄. 칸 이름은 <span> — 쉼표 처리(useCommaSerif)가 flex gap 과 부딪히지 않게 */
function Head({ icon, label, line }: { icon: React.ReactNode; label: string; line: string }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[13px] font-semibold text-text-weak">{icon}<span>{label}</span></p>
      <p className="mt-3 text-[20px] font-bold leading-[1.35] tracking-[-0.02em] text-text-primary">{line}</p>
    </div>
  );
}

const I = {
  chat: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  ask: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" /><circle cx="9" cy="11" r="2" /><path d="M21 16l-5-5-8 8" /></svg>,
};

/* ── ① 문의함: 앱 문의함 화면(media/app-shots 4-inquiry 05·06)을 보기 좋게 다듬은 것.
   시험(기준 25) = 글자를 다 빼도 "말풍선 아이콘 + 새 문의 버튼 + 사진 붙은 문의들 + 상태 색"만으로 물어보는 곳·답이 오는 곳이 보이게.
   움직임 = 맨 위 문의 상태만 확인 중 → 답변 도착(파란 점) → 해결됨. 자리·크기 고정 ── */
const STATUS = {
  wait: { t: '확인 중', style: { color: '#555', boxShadow: 'inset 0 0 0 1px #cfcfcf' } },
  reply: { t: '답변 도착', style: { background: ACCENT, color: '#fff' } },
  done: { t: '해결됨', style: { background: '#171717', color: '#fff' } },
} as const;
type St = keyof typeof STATUS;

const ITEMS: { img: string; title: string; st: St }[] = [
  { img: 'k-jeyuk', title: '지난주 글이 예약됨으로 보여요', st: 'wait' },
  { img: 'k-table', title: '사진 순서를 바꾸고 싶어요', st: 'done' },
  { img: 'k-doenjang', title: '메뉴 가격이 바뀌었어요', st: 'done' },
];

function Chip({ st }: { st: St }) {
  return <span className="block w-[64px] shrink-0 text-center text-[11px] font-bold leading-[22px]" style={STATUS[st].style}>{STATUS[st].t}</span>;
}

function InquiryBox() {
  const s = useStep(6, 1100); // 0~1 확인 중 · 2~3 답변 도착 · 4~5 해결됨
  const live: St = s < 2 ? 'wait' : s < 4 ? 'reply' : 'done';
  return (
    <div className="flex h-full flex-col border bg-white" style={{ borderColor: LINE }}>
      {/* 머리: 말풍선 아이콘 + 문의함 */}
      <div className="flex items-center gap-3 px-5 pt-5 max-md:px-4 max-md:pt-4">
        <span className="flex h-8 w-8 items-center justify-center bg-[#171717] text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </span>
        <span className="text-[17px] font-bold text-text-primary">문의함</span>
      </div>
      {/* 새 문의 버튼 */}
      <div className="mx-5 mt-6 flex h-11 items-center gap-3 border border-[#171717] px-3 text-text-primary max-md:mx-4">
        <span className="flex h-6 w-6 items-center justify-center bg-[#171717] text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
        <span className="text-[15px] font-bold">새 문의 남기기</span>
      </div>
      {/* 문의 목록 — 사진이 붙은 문의, 오른쪽 상태 색 */}
      <div className="mt-4 flex-1 border-t" style={{ borderColor: LINE }}>
        {ITEMS.map((it, i) => {
          const st = i === 0 ? live : it.st;
          return (
            <div key={it.img} className="flex items-center gap-3 border-b px-5 py-3 last:border-b-0 max-md:px-4" style={{ borderColor: LINE }}>
              <span className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={K(it.img)} alt="" className="h-11 w-11 object-cover" />
                {i === 0 && (
                  <motion.span className="rounded-dot absolute -right-1 -top-1 block h-3 w-3 bg-[#0070f3]" style={{ boxShadow: '0 0 0 2px #fff' }} initial={false} animate={{ scale: st === 'reply' ? 1 : 0 }} transition={{ type: 'spring', stiffness: 420, damping: 20 }} />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-text-primary">{it.title}</span>
              <Chip st={st} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── ② 사진 질문: 반찬 사진 하나에만 질문 하나. 누구나 아는 음식 셋은 체크만(그대로 쓴다) ── */
const PLAIN = ['k-table', 'k-jeyuk', 'k-doenjang'];

function AskPhoto() {
  return (
    <div className="grid h-full grid-cols-[1fr_88px] gap-3 max-md:grid-cols-1">
      <div className="flex flex-col border-2 border-[#0070f3] bg-white">
        <span className="relative block min-h-[220px] flex-1 overflow-hidden max-md:aspect-[16/10] max-md:min-h-0 max-md:flex-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={K('k-banchan')} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute left-0 top-0 bg-[#0070f3] px-2.5 text-[13px] font-bold leading-[28px] text-white">질문 1개</span>
        </span>
        <p className="px-4 py-3.5 text-[15px] font-bold text-text-primary">반찬 이름이 뭔가요?</p>
      </div>
      {/* PC = 큰 카드 높이를 셋이 나눠 채운다 / 휴대폰 = 카드 아래 가로 3칸 */}
      <div className="flex flex-col gap-3 max-md:grid max-md:grid-cols-3 max-md:gap-3">
        {PLAIN.map((img) => (
          <span key={img} className="relative block min-h-0 flex-1 overflow-hidden max-md:aspect-[4/3] max-md:flex-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={K(img)} alt="" className="absolute inset-0 h-full w-full object-cover" style={img === 'k-table' ? { objectPosition: '35% 50%' } : undefined} />
            <span className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }} />
            <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center bg-[#171717] text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function FeaturePrinciples() {
  return (
    <div className="grid grid-cols-2 border bg-white max-md:grid-cols-1 max-md:border-x-0" style={{ borderColor: LINE }}>
      <div className="flex flex-col gap-8 border-r p-10 max-md:border-b max-md:border-r-0 max-md:px-0 max-md:py-8" style={{ borderColor: LINE }}>
        <Head icon={I.chat} label="앱 안에서 바로 문의" line="물어보면, 해결될 때까지 답해요" />
        <div className="flex-1"><InquiryBox /></div>
      </div>
      <div className="flex flex-col gap-8 p-10 max-md:px-0 max-md:py-8">
        <Head icon={I.ask} label="사진에 대해 물어봐요" line="꼭 필요할 때만, 하나만 물어요" />
        <div className="flex-1"><AskPhoto /></div>
      </div>
    </div>
  );
}
