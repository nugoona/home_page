'use client';

/**
 * Draft_CoreSet — 코어 6종 "거친 목업" 시안 세트 v2 + O/X 제출 (DESIGN §8.7-0 프로세스)
 *
 * v2 (2026-07-11, 사장님 1차 제출 반영):
 *   ① 다채널: "같은 사진→다른 내용"처럼 보였음(X성 메모) → **같은 이야기 하나, 채널마다 형식만** 다르게 재설계.
 *   ② 생성: 키워드 결과가 아니라 **"어떤 기준으로 뽑았나"가 핵심**(사장님) → 선정 과정 3단 + "뺀 키워드"까지.
 *      + 예시 업종 다양화(전부 성수동 브런치 금지) → ②횟집 ⑤미용실.
 *   ③ 노출소식: **O 통과** — 구현 시 "앞으로 쓰는 글에 자동 반영" 연결을 시각적으로 강조할 것(사장님 메모).
 *   ④ 지도: **보류** — 사장님이 실사풍 vs 단순화 고민 중. 결정 대기.
 *   ⑤ 순위: "어떤 키워드로 검색했을 때 **내 상호가** 어느 위치인지"가 문장 구조로 읽히게.
 *   ⑥ 온보딩 X: "+9개 배지"로 뭉개지 말고 **끝난 내역을 그룹(프로필/검색어/글감)으로** 보여줄 것.
 * 제출: O/X+메모 → 하단 고정 바 제출 → /api/draft-feedback → nugoona/.draft-feedback.json
 */

import { useEffect, useState, type ReactNode } from 'react';

const EN = { fontFamily: 'var(--font-en)' } as const;
const QUOTE = { fontFamily: 'var(--font-quote)' } as const;
const ACCENT = '#0070f3';
const BORDER = '#eaeaea';

type Verdict = 'O' | 'X';

const DRAFTS = [
  { id: 'd1', n: '①', title: '다채널 발행 — 같은 이야기 하나가, 채널마다 그 채널답게', status: '✓ 통과 — 구현 완료', q: '' },
  { id: 'd2', n: '②', title: '목표 키워드 — 어떤 기준으로 뽑았나 (v3)', status: '✓ 확정(3차 O) — 구현 완료', q: '' },
  { id: 'd3', n: '③', title: '노출 소식 엔진 — 노출 방식이 바뀌어도, 알아서 따라갑니다', status: '✓ 통과 — 구현 완료', q: '' },
  { id: 'd4', n: '④', title: '지도 노출', status: '✓ 확정(3차 O) — 단순화 유지(실사풍 포기, 사장님 메모)', q: '' },
  { id: 'd5', n: '⑤', title: '순위 증명 — 이 키워드로 검색하면, 내 가게가 어디에', status: '✓ 통과 — 구현 완료', q: '' },
  { id: 'd6', n: '⑥', title: '온보딩 — 가게 이름 하나로, 여기까지 끝', status: '✓ 통과 — 구현 완료', q: '' },
  { id: 'd7', n: '⑦', title: '홈 스토리 — 회사 우산형 5섹션', status: '✓ 확정(3차 O) — H3 문구는 나중에 수정(사장님 메모)', q: '' },
] as const;

function Dot({ c }: { c: string }) {
  return <span className="inline-block w-1.5 h-1.5 rounded-dot shrink-0" style={{ background: c }} />;
}

function PhotoSlot({ size = 44 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, background: '#e9ecef' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b7bec6" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" /><circle cx="8.5" cy="9" r="1.6" /><path d="M3 16l5-4 4 3 3-3 6 5" />
      </svg>
    </span>
  );
}

function HLine() {
  return (
    <span aria-hidden className="hidden md:inline-flex items-center shrink-0 self-center">
      <span className="block h-[1.5px] w-10" style={{ background: 'rgba(0,112,243,0.5)' }} />
      <span className="block w-1.5 h-1.5 rounded-dot" style={{ background: ACCENT }} />
    </span>
  );
}

/* ── ① 같은 이야기 → 형식만 다르게 (같은 볼드 문구가 세 채널에 반복) ── */
function D1() {
  const rows = [
    ['#03c75a', '네이버 블로그', '긴 글', <>오늘 들여온 <b>제철 딸기</b>로 <b>팬케이크</b>를 구웠어요. 창가 자리에 앉으면…</>],
    ['#e1306c', '인스타그램', '사진+해시태그', <><b>제철 딸기 팬케이크</b> — #성수동브런치 #제철카페</>],
    ['#1877f2', '페이스북', '짧은 소식', <><b>제철 딸기 팬케이크</b>, 이번 주부터 시작합니다.</>],
  ] as const;
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="shrink-0">
          <div className="grid grid-cols-2 gap-1 p-2 border bg-white" style={{ borderColor: BORDER }}>
            {[0, 1, 2, 3].map((i) => <PhotoSlot key={i} />)}
          </div>
          <p className="text-[10.5px] mt-1.5 text-text-weak text-center">오늘 올린 이야기 하나</p>
        </div>
        <HLine />
        <div className="flex flex-col gap-3 min-w-0">
          {rows.map(([c, ch, form, body]) => (
            <div key={ch as string} className="flex items-start gap-2">
              <Dot c={c as string} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-text-primary">{ch}</span>
                  <span className="text-[9.5px] px-1.5 py-0.5 border text-text-weak" style={{ ...EN, borderColor: '#e5e5e5' }}>{form}</span>
                </div>
                <p className="text-[13px] text-text-body mt-0.5">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-[11px] text-text-weak">이야기는 하나 — 채널마다 그 채널의 형식으로 다시 씁니다.</p>
    </div>
  );
}

/* ── ② 선정 기준이 주인공 v3 — 신뢰 축 = 네이버 검색광고 실데이터 (네거티브 삭제, 사장님 X 메모 반영) ── */
function D2() {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-4" style={{ ...EN, color: '#a9aeb5' }}>가게 이름: 해도담 횟집 (속초)</p>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* 기준 3단 — 방법의 신뢰 */}
        <div className="flex flex-col gap-3 shrink-0 max-w-[340px]">
          {[
            ['1', '가게 정보에서 후보를 만들고', '속초(지역) × 횟집(업종) × 대게(메뉴)'],
            ['2', '네이버 검색광고 데이터로 확인합니다', '손님이 실제로 검색하는 말인지 — 감이 아니라 네이버 공식 검색 데이터로'],
            ['3', '실제로 검색되는 말만 남깁니다', '남긴 검색어가 글 제목·태그가 됩니다'],
          ].map(([n, t, s]) => (
            <div key={n} className="flex items-start gap-2.5">
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white shrink-0" style={{ ...EN, background: '#171717' }}>{n}</span>
              <div>
                <p className="text-[13.5px] font-bold text-text-primary leading-tight">{t}</p>
                <p className="text-[11px] text-text-weak mt-0.5">{s}</p>
              </div>
            </div>
          ))}
        </div>
        {/* 결과: 채택만 */}
        <div className="min-w-0">
          <div className="flex flex-col gap-1">
            {['속초 횟집', '속초 대게 맛집'].map((k, i) => (
              <div key={k} className="flex items-center gap-2.5">
                <span className={`text-[clamp(20px,2.6vw,30px)] font-bold tracking-[-0.02em] ${i === 0 ? 'text-accent' : 'text-text-primary'}`}>{k}</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5l2.5 2.5 4.5-5.5" /></svg>
              </div>
            ))}
            <span className="text-[10px] mt-1" style={{ ...EN, color: '#a9aeb5' }}>네이버 검색 데이터 확인됨</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[11px] text-text-weak">남긴 검색어는 글 제목·태그·해시태그에 자동으로 실리고, 매일 순위를 잽니다.</p>
    </div>
  );
}

/* ── ③ 노출 소식 (통과 — 참조용 유지) ── */
function D3() {
  return (
    <div className="max-w-[620px]">
      <div className="flex items-center gap-1.5 mb-2">
        <Dot c="#03c75a" />
        <span className="text-[11px] font-semibold text-text-primary">네이버 플레이스</span>
        <span className="text-[10px]" style={{ ...EN, color: '#a9aeb5' }}>이번 주 노출 소식</span>
      </div>
      <p className="text-[clamp(18px,2.2vw,24px)] font-bold text-text-primary tracking-[-0.015em] leading-[1.35] mb-4">
        찾아오는 길이 적힌 글을<br />더 오래 보여주기 시작했습니다.
      </p>
      <div className="flex items-start gap-2 pl-1">
        <span aria-hidden className="block w-3.5 h-6 border-l-[1.5px] border-b-[1.5px] shrink-0" style={{ borderColor: 'rgba(0,112,243,0.5)' }} />
        <p className="text-[14px] leading-[1.7] text-text-body pt-2.5" style={QUOTE}>
          &ldquo;성수역 3번 출구에서 걸어서 5분입니다.&rdquo; <span className="text-[10px]" style={{ ...EN, color: ACCENT }}>— 앞으로 쓰는 글에 자동 반영</span>
        </p>
      </div>
      <p className="mt-5 text-[11px] text-text-weak">매주 일요일 밤 매체 5곳을 대신 확인합니다 — 거짓 수법은 버립니다.</p>
    </div>
  );
}

/* ── ④ 지도 (보류 — 자리만) ── */
function D4() {
  return (
    <p className="text-[13px] text-text-weak py-4">
      실사풍으로 갈지 단순화할지 결정 대기 중 — 결정되면 그 방향으로 시안을 다시 냅니다.
    </p>
  );
}

/* ── ⑤ 키워드 → 내 상호 → 위치 (미용실 예시) ── */
function D5() {
  return (
    <div>
      <p className="text-[13px] text-text-body mb-1">
        <span className="font-bold text-accent">&ldquo;홍대 미용실&rdquo;</span>로 검색하면, <span className="font-bold text-text-primary">결헤어 홍대점</span>은 지금
      </p>
      <div className="flex items-baseline gap-4 flex-wrap">
        <span className="text-[clamp(40px,6vw,72px)] font-bold text-text-primary tracking-[-0.03em] leading-none">2페이지 14위</span>
        <span className="text-[clamp(16px,2vw,22px)] font-bold" style={{ color: '#16a34a' }}>▲ 3계단</span>
      </div>
      <div className="flex gap-2 mt-5 flex-wrap">
        <span className="text-[11px] px-2 py-1 border" style={{ borderColor: BORDER }}>홍대 펌 — <b>1페이지</b></span>
        <span className="text-[11px] px-2 py-1 border text-text-weak" style={{ borderColor: BORDER }}>연남동 미용실 — 곧 확인해요</span>
      </div>
      <p className="mt-4 text-[11px] text-text-weak">매일 아침 7시 40분, 네이버·구글 네 곳에서 잽니다. 떨어지면 알려드립니다.</p>
    </div>
  );
}

/* ── ⑥ 온보딩 — 끝난 내역을 3그룹으로 ── */
function D6() {
  const groups = [
    ['가게 프로필', <>오늘의 브런치, 성수 · 브런치 카페 <span className="text-text-weak">— 소개·메뉴·말투·썸네일까지</span></>],
    ['노출 검색어', <><b>성수동 브런치</b> 외 목표 3개 · 태그 15개</>],
    ['1년치 글감', <>🔥 아침 오픈 준비 외 <b>52편</b> 미리 준비</>],
  ] as const;
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 border px-3 h-10" style={{ borderColor: ACCENT }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#9aa0a8" strokeWidth="1.8"><circle cx="7" cy="7" r="4.5" /><path d="M11 11l3 3" strokeLinecap="round" /></svg>
            <span className="text-[13px] text-text-primary">오늘의 브런치</span>
          </div>
        </div>
        <HLine />
        <div className="border bg-white flex-1 max-w-[480px] divide-y" style={{ borderColor: BORDER }}>
          {groups.map(([g, body]) => (
            <div key={g as string} className="flex items-start gap-3 px-4 py-3" style={{ borderColor: '#f2f2f2' }}>
              <span className="text-[10px] font-semibold w-16 shrink-0 pt-0.5" style={{ ...EN, color: '#a9aeb5' }}>{g}</span>
              <p className="text-[12.5px] text-text-primary leading-snug flex-1">{body}</p>
              <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 12 12" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5l2.5 2.5 4.5-5.5" /></svg>
            </div>
          ))}
          <div className="px-4 py-3">
            <button className="w-full h-9 text-[12.5px] font-semibold text-white" style={{ background: ACCENT }}>네, 맞아요</button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[11px] text-text-weak">사장님이 한 일은 이름 입력뿐 — 나머지는 AI가 네이버 플레이스·홈페이지를 읽고 채웠습니다.</p>
    </div>
  );
}

/* ── ⑦ 홈 스토리 v2 — 구성 유지, H3 문구는 사장님 육성(아이디어로그 A·E·F)에서만 발췌.
      (v1의 "'다 해드릴게요'가 모르게 만든다"는 지어낸 문구 + 육성과 정반대 — 폐기) ── */
function D7() {
  const blocks = [
    ['H1', true, '누구나 마케팅하는 시대', '회사 선언 — GPT+사장님 확정 문구로 복원(2026-07-11, 시안 당시의 임의 문구 폐기)'],
    ['H2', false, '누구나컴퍼니는 두 가지를 만듭니다', '[누구나 콘텐츠 — 검색하면 우리 가게가 보이게 →]  [누구나 광고 — 광고를 이해하며 직접 →]  · 소개 톤, 기능 데모 없음'],
    ['H3', false, '왜 만들었나 — 문구 후보 (사장님 육성 발췌)', 'A안: "15년 광고 현업에서 봤습니다 — 예산이 적으면 대행은 받아주지 않고, 사장님은 하고 싶어도 못 합니다. 그걸 어렵지 않게, 직접 할 수 있게 만들었습니다."  ·  B안: "할 수 있는 건 다 해드린다 — 이 마음으로 만들었습니다."'],
    ['H4', true, '회사 약속', '"앱은 생물처럼 계속 자랍니다. 그동안 요금은 그대로." (육성 E — 사장님 "매우 중요 문구")'],
    ['H5', true, '한 달 무료로 시작 · 카드 필요 없음', 'CTA → /start'],
  ] as const;
  return (
    <div className="max-w-[640px]">
      <div className="flex flex-col gap-2">
        {blocks.map(([n, dark, title, sub]) => (
          <div key={n as string} className="flex items-stretch gap-3 border px-4 py-3" style={{ borderColor: BORDER, background: dark ? '#111' : '#fff' }}>
            <span className="text-[10px] font-bold w-6 shrink-0 pt-1" style={{ ...EN, color: dark ? '#666' : '#b7bec6' }}>{n}</span>
            <div className="min-w-0">
              <p className={`text-[14px] font-bold leading-snug ${dark ? 'text-white' : 'text-text-primary'}`}>{title}</p>
              <p className={`text-[11px] mt-1 leading-[1.6] ${dark ? 'text-white/50' : 'text-text-weak'}`}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-text-weak">
        제품 기능 데모(현재 홈의 쇼케이스 행들·§8.0 S4·S5)는 홈에서 빠지고 각 제품 페이지가 맡습니다 — 멀티 제품 회사(Atlassian·HubSpot·토스) 홈의 표준 구조.
      </p>
    </div>
  );
}

const BODIES: Record<string, () => ReactNode> = { d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7 };

/* ── 세트 본체: O/X 상태 + 제출 ── */
export default function Draft_CoreSet() {
  const [ans, setAns] = useState<Record<string, Verdict | undefined>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/draft-feedback')
      .then((r) => r.json())
      .then((d) => {
        if (d?.answers) { setAns(d.answers); setNotes(d.notes ?? {}); setStatus(`이전 제출분 불러옴 (${new Date(d.submittedAt).toLocaleTimeString('ko-KR')})`); }
      })
      .catch(() => {});
  }, []);

  const done = DRAFTS.filter((d) => ans[d.id]).length;
  const anyInput = done > 0 || Object.values(notes).some((v) => v && v.trim().length > 0);

  async function submit() {
    setStatus('보내는 중…');
    try {
      const r = await fetch('/api/draft-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: ans, notes }),
      });
      const j = await r.json();
      setStatus(`제출됨 ✓ ${new Date(j.submittedAt).toLocaleTimeString('ko-KR')} — 전달됐습니다`);
    } catch {
      setStatus('전송 실패 — 다시 눌러주세요');
    }
  }

  return (
    <div className="w-full pb-16">
      <p className="text-[12px] font-semibold pt-2" style={{ color: ACCENT }}>시안 v2 — 1차 제출 메모 반영(①②⑤⑥ 재설계 · ③통과 · ④보류)</p>
      {DRAFTS.map((d) => {
        const Body = BODIES[d.id];
        return (
          <section key={d.id} className="py-10 border-b" style={{ borderColor: '#f0f0f0' }}>
            <div className="flex items-baseline gap-2.5 mb-6 flex-wrap">
              <span className="inline-flex items-center justify-center w-7 h-7 text-[13px] font-bold text-white" style={{ ...EN, background: '#171717' }}>{d.n}</span>
              <span className="text-[15px] font-bold text-text-primary">{d.title}</span>
              {d.status && <span className="text-[11px] font-semibold" style={{ color: d.status.startsWith('✓') ? '#16a34a' : '#a9aeb5' }}>{d.status}</span>}
            </div>
            <Body />
            {d.q && (
              <div className="mt-6 flex items-center gap-2 flex-wrap">
                <p className="text-[12px] font-medium w-full md:w-auto md:flex-1" style={{ color: ACCENT }}>Q. {d.q}</p>
                {(['O', 'X'] as const).map((v) => (
                  <button
                    key={v}
                    aria-label={`${d.id}-${v}`}
                    onClick={() => setAns((p) => ({ ...p, [d.id]: p[d.id] === v ? undefined : v }))}
                    className="w-11 h-9 text-[14px] font-bold border transition-colors"
                    style={ans[d.id] === v
                      ? (v === 'O' ? { background: ACCENT, color: '#fff', borderColor: ACCENT } : { background: '#171717', color: '#fff', borderColor: '#171717' })
                      : { color: '#8b9199', borderColor: '#ddd', background: '#fff' }}
                  >
                    {v}
                  </button>
                ))}
                <input
                  aria-label={`${d.id}-note`}
                  value={notes[d.id] ?? ''}
                  onChange={(e) => setNotes((p) => ({ ...p, [d.id]: e.target.value }))}
                  placeholder="메모 (선택 — X면 이유를)"
                  className="h-9 border px-2.5 text-[12px] flex-1 min-w-[180px] outline-none focus:border-accent"
                  style={{ borderColor: '#ddd' }}
                />
              </div>
            )}
          </section>
        );
      })}

      {/* 제출 바 — 화면 하단 고정 */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[60] border-t bg-white px-4 py-3 flex items-center gap-3 flex-wrap shadow-[0_-8px_30px_rgba(0,0,0,0.10)] pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        style={{ borderColor: BORDER }}
      >
        <span className="text-[13px] font-bold text-text-primary" style={EN}>{done}/{DRAFTS.filter((d) => d.q).length}</span>
        <span className="text-[12px] text-text-weak">응답함</span>
        <button
          aria-label="draft-submit"
          onClick={submit}
          disabled={!anyInput}
          className="h-9 px-5 text-[13px] font-semibold text-white disabled:opacity-40"
          style={{ background: ACCENT }}
        >
          제출
        </button>
        <span className="text-[12px] font-medium" style={{ color: status.startsWith('전송 실패') ? '#dc2626' : ACCENT }}>{status}</span>
      </div>
    </div>
  );
}
