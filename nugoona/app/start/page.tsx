'use client';

/**
 * /start — 두 갈래(콘텐츠·대시보드) 공통 종착 (E2-4).
 * 필드·FAQ·전송 계약 = lib/content/start.ts 유지.
 * 2026-10-08 /start 한 페이지 디자인 지시: 합의 제목·설명·제품 선택 설명·안심 문구만 교체.
 * 구버전(월 광고비·플랫폼 셀렉트 폼)은 2026-07-11 정본 미반영 오염으로 판정, 정본 4필드로 교체.
 * API 호환: /api/submit-survey 는 name 필수 — 새 필드를 기존 페이로드 키에 매핑(서버·Slack 알림 무수정).
 */

import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Store } from 'lucide-react';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';
import { form as formCopy, steps, faq } from '@/lib/content/start';

const EN = { fontFamily: 'var(--font-en)' } as const;

// /start 전용 합의 카피. 다른 페이지와 카피 원본을 수정하지 않는 이번 작업의 범위.
const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  content: '사진 올리면 글이 되고, 알아서 올라갑니다',
  ads: '상품 고르면 광고가 되고, 성과가 한눈에 보입니다',
  both: '글도 쌓고 광고도 돌립니다',
};

/** §8.16: 배경 오버레이 대신 실제 병합 칸. 내용 높이를 재서 정사각 셀의 행 수를 결정한다.
 * PC = 12열(레일 4 + 입력 8), 모바일 = 6열 전체 점유. 빈 공간은 최대 한 셀 미만.
 * 반응형에서도 양식을 한 번만 렌더하므로 라디오·필수 검사·입력 상태가 중복되지 않는다. */
function MeasuredGrid({ children, rail }: {
  children: (desktop: boolean) => ReactNode;
  rail?: ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const side = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ cols: 12, rows: rail ? 8 : 3 });
  const desktop = layout.cols === 12;

  useLayoutEffect(() => {
    function measure() {
      if (!frame.current || !content.current) return;
      const width = frame.current.getBoundingClientRect().width;
      if (!width) return;
      // 외곽 테두리 때문에 900px 화면의 칸 폭은 898px. CSS와 같은 화면 폭 경계를 사용한다.
      const cols = window.matchMedia('(min-width: 900px)').matches ? 12 : 6;
      const height = Math.max(content.current.getBoundingClientRect().height,
        cols === 12 ? (side.current?.getBoundingClientRect().height ?? 0) : 0);
      const rows = Math.max(1, Math.ceil(height / (width / cols)));
      setLayout(prev => prev.cols === cols && prev.rows === rows ? prev : { cols, rows });
    }
    const observer = new ResizeObserver(measure);
    [frame.current, content.current, side.current].forEach(el => el && observer.observe(el));
    measure();
    return () => observer.disconnect();
  }, [desktop]);

  const areas: GridArea[] = [
    ...(desktop && rail ? [{ key: 'rail', c: [1, 5] as [number, number], r: [1, layout.rows + 1] as [number, number], className: 'min-w-0' }] : []),
    { key: 'content', c: [desktop && rail ? 5 : 1, layout.cols + 1], r: [1, layout.rows + 1], className: 'min-w-0' },
  ];
  return (
    <div ref={frame} data-start-grid>
      <OccupancyGrid {...layout} areas={areas} tone="light" render={key => key === 'rail'
        ? <div ref={side}>{rail}</div>
        : <div ref={content}>{children(desktop)}</div>} />
    </div>
  );
}

function Progress({ complete }: { complete: boolean[] }) {
  const reduced = useReducedMotion();
  return (
    <ol className="flex w-full gap-3" aria-label="필수 입력 진행">
      {complete.map((done, i) => (
        <li key={i} className="flex min-w-0 flex-1 flex-col gap-3" aria-label={`${formCopy[i === 0 ? 'interest' : i === 1 ? 'business' : 'contact'].label}: ${done ? '입력됨' : '입력 전'}`}>
          <span className={`flex h-8 items-center gap-2 text-[14px] font-semibold ${done ? 'text-accent' : 'text-text-weak'}`} style={EN}>
            {String(i + 1).padStart(2, '0')}
            {done && <Check size={14} strokeWidth={1.8} aria-hidden />}
          </span>
          <span className="relative block h-px bg-border-mid" aria-hidden>
            {/* 갤러리 A8 svg/line-draw: 선이 한 번 그려지는 동작을 입력 완료 반응으로 재가공. */}
            <motion.span className="absolute inset-0 origin-left bg-accent"
              initial={false} animate={{ scaleX: done ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.35 }} />
          </span>
        </li>
      ))}
    </ol>
  );
}

/** 갤러리 A9 svg/path-dot-flow + A8 svg/line-draw + Vercel Clone01 노드 연결 구성.
 * 세 입력 → 한 가게로 모이는 장면. 원본의 스켈레톤·자체 색·라운드·그림자는 버린다.
 * SVG id는 PC/모바일 각 인스턴스 고유값. 도트는 12초 저속, 선은 진입 시 한 번만.
 */
function StartScene({ complete }: { complete: boolean[] }) {
  const id = useId().replace(/:/g, '');
  const reduced = useReducedMotion();
  const paths = ['M120 55 C180 55 180 120 240 120', 'M120 120 H240', 'M120 185 C180 185 180 120 240 120'];
  return (
    <svg viewBox="0 0 360 240" className="h-full w-full" aria-hidden="true">
      {paths.map((d, i) => (
        <g key={d}>
          <motion.path id={`${id}-${i}`} d={d} fill="none" pathLength={1} className="stroke-white/25" strokeWidth="1"
            initial={{ pathLength: reduced ? 1 : 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 1.2, delay: reduced ? 0 : i * 0.15 }} />
          {!reduced && <circle r="2.5" className="fill-accent">
            <animateMotion dur="12s" begin={`${-i * 4}s`} repeatCount="indefinite"><mpath href={`#${id}-${i}`} /></animateMotion>
          </circle>}
          <rect x="20" y={35 + i * 65} width="100" height="40" fill="none" className={complete[i] ? 'stroke-accent' : 'stroke-white/30'} strokeWidth="1" />
          <text x="36" y={60 + i * 65} className="fill-white/80 text-[14px] font-medium" style={EN}>{String(i + 1).padStart(2, '0')}</text>
          {complete[i] && <Check x={86} y={47 + i * 65} width={16} height={16} className="text-accent" strokeWidth={1.5} />}
        </g>
      ))}
      <rect x="240" y="72" width="96" height="96" fill="none" className="stroke-white/40" strokeWidth="1" />
      <Store x={266} y={98} width={44} height={44} className="text-white/80" strokeWidth={1} />
      {/* 단순 선 프리미티브: 종착 노드의 네 모서리를 구분해 장면을 마감. */}
      <path d="M240 82 V72 H250 M326 72 H336 V82 M336 158 V168 H326 M250 168 H240 V158" fill="none" className="stroke-white/80" strokeWidth="1" />
    </svg>
  );
}

function StartHero({ complete }: { complete: boolean[] }) {
  const title = <FadeUp>
    <h1 className="text-[clamp(28px,4.3vw,48px)] font-semibold tracking-[-0.04em] leading-[1.18] text-white">가게 이름 하나면 됩니다</h1>
    <p className="mt-4 text-[15px] leading-[1.6] text-white/80">나머지는 저희가 찾아서 채워 둘게요.</p>
  </FadeUp>;
  const scene = <StartScene complete={complete} />;
  return (
    <div className="bg-bg-dark" data-start-hero>
      {/* §8.16: PC 12×3. 제목 6×3 + 장면 4×3, 좌우 각 한 열 checker 여백. 하단 빈 행 없음. */}
      <OccupancyGrid cols={12} rows={3} tone="dark" checker mobile={false} areas={[
        { key: 'title', c: [2, 8], r: [1, 4], className: 'flex items-center px-8 lg:px-12' },
        { key: 'scene', c: [8, 12], r: [1, 4], className: 'p-6' },
      ]} render={key => key === 'title' ? title : scene} />
      {/* 모바일 6×5. 풀폭 제목 3행 + 장면 2행. 장면 옆 한 열씩만 checker 여백. */}
      <OccupancyGrid cols={6} rows={5} tone="dark" checker mobile areas={[
        { key: 'title', c: [1, 7], r: [1, 4], className: 'flex items-center px-6' },
        { key: 'scene', c: [2, 6], r: [4, 6], className: 'flex justify-center px-2' },
      ]} render={key => key === 'title' ? title : scene} />
    </div>
  );
}

function Expectations() {
  return (
    <div className="flex flex-col gap-7">
      <h2 className="text-[clamp(20px,2vw,24px)] font-semibold leading-[1.45] tracking-[-0.03em] text-text-primary">{steps.heading}</h2>
      <ol className="flex flex-col gap-6">
        {steps.items.map(s => (
          <li key={s.num} className="flex items-start gap-4">
            <span className="pt-1 text-[12px] font-semibold text-text-weak" style={EN}>{s.num}</span>
            <div className="flex flex-col gap-2">
              <h3 className="text-[clamp(15px,1.3vw,16px)] font-semibold leading-[1.5] text-text-primary">{s.title}</h3>
              <p className="text-[14px] leading-[1.7] text-text-body">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function StartPage() {
  const [form, setForm] = useState({ interest: '', business: '', contact: '', memo: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    const interestText = formCopy.interest.options.find((o) => o.value === form.interest)?.text ?? '';
    try {
      const res = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 서버(name 필수)·Slack 알림 필드에 매핑: 회사=상호, 연락처=contact, 플랫폼 칸=관심 제품
        body: JSON.stringify({
          name: form.business,
          company: form.business,
          phone: form.contact,
          platform: interestText,
          message: form.memo,
        }),
      });
      if (res.ok) {
        setStatus('success');
        if (typeof window !== 'undefined') {
          window.gtag?.('event', 'generate_lead', { event_category: 'form' });
          window.fbq?.('track', 'Lead');
        }
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }


  const complete = [Boolean(form.interest), Boolean(form.business.trim()), Boolean(form.contact.trim())];
  const inputCls = 'w-full h-11 px-4 border border-border-mid bg-bg text-[15px] max-md:text-[16px] text-text-primary placeholder:text-text-weak focus:border-accent focus:outline-none transition-colors';
  const heading = <h2 className="text-[clamp(24px,2.7vw,32px)] font-semibold leading-[1.3] tracking-[-0.03em] text-text-primary">세 가지만 여쭤봅니다</h2>;
  const rail = (
    <div className="flex flex-col gap-10 px-[15%] py-12">
      <div className="flex flex-col gap-6">{heading}<Progress complete={complete} /></div>
      {/* 기존 신청 후 안내를 양식 옆으로 옮김. 새 문단을 추가하지 않는다. */}
      <Expectations />
    </div>
  );

  return (
    <main>
      <OuterContainer>
        <Section noBorder><StartHero complete={complete} /></Section>
        <Section noBorder>
          <MeasuredGrid rail={rail}>
            {desktop => (
              <div className="px-[9%] py-9 max-md:px-6 max-md:py-8">
                {!desktop && <div className="mb-8 flex flex-col gap-4">{heading}<Progress complete={complete} /></div>}
                {status === 'success' ? (
                  <div className="flex flex-col items-center gap-4 py-12 text-center" role="status">
                    <Check size={40} strokeWidth={1.3} className="text-accent" aria-hidden />
                    <h2 className="text-[clamp(22px,2.5vw,28px)] font-semibold text-text-primary">신청이 접수되었습니다</h2>
                    <p className="text-[15px] max-md:text-[16px] max-md:font-medium text-text-body">시작을 돕는 안내를 먼저 드리겠습니다.</p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    <fieldset className="min-w-0">
                      <legend className="mb-3 flex items-center gap-3 text-[14px] font-semibold text-text-primary">
                        <span className={complete[0] ? 'text-accent' : 'text-text-weak'} style={EN}>01</span>{formCopy.interest.label} *
                      </legend>
                      <div className="flex flex-col gap-2">
                        {formCopy.interest.options.map(o => (
                          <label key={o.value}
                            className={['relative flex min-w-0 cursor-pointer items-center gap-4 border bg-bg px-4 py-3 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent', form.interest === o.value ? 'border-accent' : 'border-border-mid hover:border-text-weak'].join(' ')}>
                            <input type="radio" name="interest" value={o.value} checked={form.interest === o.value} onChange={onChange} required className="sr-only" />
                            <span className={['flex h-4 w-4 shrink-0 items-center justify-center border', form.interest === o.value ? 'border-accent text-accent' : 'border-text-weak'].join(' ')} aria-hidden>
                              {form.interest === o.value && <Check size={12} strokeWidth={1.8} />}
                            </span>
                            <span className="flex min-w-0 flex-col gap-1.5">
                              <span className="text-[15px] font-semibold text-text-primary">{o.text}</span>
                              <span className="text-[14px] leading-[1.65] text-text-body">{PRODUCT_DESCRIPTIONS[o.value]}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <div>
                      <label htmlFor="start-business" className="mb-2 flex items-center gap-3 text-[14px] font-semibold text-text-primary">
                        <span className={complete[1] ? 'text-accent' : 'text-text-weak'} style={EN}>02</span>{formCopy.business.label} *
                        {complete[1] && <Check size={14} className="ml-auto text-accent" strokeWidth={1.8} aria-hidden />}
                      </label>
                      <input id="start-business" name="business" value={form.business} onChange={onChange} required placeholder={formCopy.business.placeholder} className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="start-contact" className="mb-2 flex items-center gap-3 text-[14px] font-semibold text-text-primary">
                        <span className={complete[2] ? 'text-accent' : 'text-text-weak'} style={EN}>03</span>{formCopy.contact.label} *
                        {complete[2] && <Check size={14} className="ml-auto text-accent" strokeWidth={1.8} aria-hidden />}
                      </label>
                      <input id="start-contact" name="contact" value={form.contact} onChange={onChange} required placeholder={formCopy.contact.placeholder} className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="start-memo" className="mb-2 block text-[14px] font-medium text-text-primary">{formCopy.memo.label}</label>
                      <textarea id="start-memo" name="memo" value={form.memo} onChange={onChange} rows={2} placeholder={formCopy.memo.placeholder}
                        className="w-full resize-y border border-border-mid bg-bg px-4 py-3 text-[15px] max-md:text-[16px] text-text-primary placeholder:text-text-weak focus:border-accent focus:outline-none transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button type="submit" disabled={status === 'loading'}
                        className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 border border-text-primary bg-text-primary text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:opacity-50">
                        {status === 'loading' ? '전송 중...' : formCopy.submit}<ArrowRight size={16} strokeWidth={1.5} aria-hidden />
                      </button>
                      {/* 합의된 안심 문구로 기존 카드 안내를 교체. 클릭 직전에만 보여준다. */}
                      <p className="text-center text-[13px] leading-[1.7] text-text-body">첫 달 무료 · 카드 등록 없음 · 언제든 그만둘 수 있습니다</p>
                      <p className="text-center text-[13px] leading-[1.7] text-text-weak">{formCopy.reassure}</p>
                    </div>
                    {status === 'error' && <p className="text-[13px] max-md:text-[14px] text-text-primary text-center" role="alert">전송에 실패했습니다. 다시 시도해주세요.</p>}
                  </form>
                )}
                {!desktop && <div className="mt-10 border-t border-border-default pt-9"><Expectations /></div>}
              </div>
            )}
          </MeasuredGrid>
        </Section>
        {/* FAQ 문구·순서·등장 방식 유지. */}
        <Section noBorder>
          <MeasuredGrid>
            {() => (
              <div className="px-12 py-9 max-w-[720px] mx-auto max-md:px-6 max-md:py-8">
                <div className="flex flex-col">
                  {faq.map((f, i) => (
                    <FadeUp key={f.q} delay={i * 0.06}>
                      <div className={['py-6', i < faq.length - 1 ? 'border-b border-border-default' : ''].join(' ')}>
                        <h3 className="text-[clamp(16px,1.4vw,17px)] font-bold text-text-primary mb-2">{f.q}</h3>
                        <p className="text-[14px] max-md:font-medium text-text-body leading-[1.65]">{f.a}</p>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </div>
            )}
          </MeasuredGrid>
        </Section>
      </OuterContainer>
    </main>
  );
}
