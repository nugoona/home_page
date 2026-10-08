'use client';

/**
 * /start — 두 갈래(콘텐츠·대시보드) 공통 종착 (E2-4).
 * 필드·FAQ·전송 계약 = lib/content/start.ts 유지.
 * 2026-10-08 /start 한 페이지 디자인 지시: 합의 제목·설명·제품 선택 설명·안심 문구만 교체.
 * 구버전(월 광고비·플랫폼 셀렉트 폼)은 2026-07-11 정본 미반영 오염으로 판정, 정본 4필드로 교체.
 * API 호환: /api/submit-survey 는 name 필수 — 새 필드를 기존 페이로드 키에 매핑(서버·Slack 알림 무수정).
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { LayoutGroup, motion, useInView, useReducedMotion } from 'framer-motion';
import { RadioGroup } from 'radix-ui';
import { Dithering } from '@paper-design/shaders-react';
import NumberFlow from '@number-flow/react';
import TextareaAutosize from 'react-textarea-autosize';
import { ArrowRight, Check, Store } from 'lucide-react';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';
import { form as formCopy, steps, faq } from '@/lib/content/start';

const EN = { fontFamily: 'var(--font-en)' } as const;

// 2차 보수도 이 페이지 안에서만: 전송 함수·FAQ·요금·공용 부품은 원문 유지.
// 선/숫자 반응은 한 큐에서 순서대로 실행한다. 반응 중에는 디더도 speed=0.
function useMotionQueue() {
  const reduced = useReducedMotion();
  const [busy, setBusy] = useState(false);
  const jobs = useRef<{ run: () => void; duration: number }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enqueue = useCallback((run: () => void, duration = 350) => {
    jobs.current.push({ run, duration: reduced ? 0 : duration });
    function next() {
      const job = jobs.current.shift();
      if (!job) { timer.current = null; setBusy(false); return; }
      setBusy(true);
      job.run();
      timer.current = setTimeout(next, job.duration);
    }
    if (timer.current === null) next();
  }, [reduced]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); jobs.current = []; }, []);
  return { busy, enqueue, reduced };
}

/** A8 line-draw の破線技法を標準 Check の線に適用。色・太い線・反復を引き継がない。 */
function DrawCheck({ done }: { done: boolean }) {
  const reduced = useReducedMotion();
  return <svg viewBox="0 0 24 24" className="ml-auto h-4 w-4 shrink-0 text-text-primary" aria-hidden>
    <motion.path d="m20 6-11 11-5-5" fill="none" stroke="currentColor" strokeWidth="1"
      initial={{ pathLength: 0 }} animate={{ pathLength: done ? 1 : 0 }}
      transition={{ duration: reduced || !done ? 0 : 0.25 }} data-start-motion="check" />
  </svg>;
}

function FocusLine({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  return <motion.span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-text-primary"
    initial={false} animate={{ scaleX: active ? 1 : 0 }}
    transition={{ duration: active && !reduced ? 0.25 : 0 }} data-start-motion="focus" />;
}

// FAQ 원문/순서는 그대로 두고, 바깥 등장 효과만 같은 큐에 넣어 동시 실행을 막는다.
function QueuedReveal({ children, enqueue }: { children: ReactNode; enqueue: (run: () => void, duration?: number) => void }) {
  const frame = useRef<HTMLDivElement>(null);
  const entered = useInView(frame, { once: true, amount: 0.15 });
  const started = useRef(false);
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!entered || started.current) return;
    started.current = true;
    enqueue(() => setShown(true), 600);
  }, [entered, enqueue]);
  return <motion.div ref={frame} initial={false} animate={{ opacity: shown || reduced ? 1 : 0, y: shown || reduced ? 0 : 24 }}
    transition={{ duration: reduced ? 0 : 0.5 }} data-start-motion="reveal">{children}</motion.div>;
}

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


function Progress({ complete, active }: { complete: boolean[]; active: number }) {
  const reduced = useReducedMotion();
  return (
    <ol className="flex w-full gap-3" aria-label="필수 입력 진행">
      {complete.map((done, i) => (
        <li key={i} aria-current={active === i ? 'step' : undefined}
          className="flex min-w-0 flex-1 flex-col gap-2"
          aria-label={`${formCopy[i === 0 ? 'interest' : i === 1 ? 'business' : 'contact'].label}: ${done ? '입력됨' : '입력 전'}`}>
          <span className={['flex h-6 items-center text-[14px]', active === i ? 'font-bold text-text-primary' : 'font-medium text-text-weak'].join(' ')} style={EN}>
            {String(i + 1).padStart(2, '0')}
            {done && <Check size={14} strokeWidth={1} className="ml-2 text-text-primary" aria-hidden />}
          </span>
          <span className="relative block h-px bg-border-mid" aria-hidden>
            {active === i && <motion.span layoutId="start-step-line" className="absolute inset-0 bg-text-primary"
              transition={{ duration: reduced ? 0 : 0.25, ease: 'easeInOut' }} data-start-motion="step" />}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** A8 line-draw: 세 선을 순서대로 한 번만 그린다. 기존 A9 반복 도트는 제거. */
function StartScene({ line, compact }: { line: number; compact: boolean }) {
  const reduced = useReducedMotion();
  const paths = compact
    ? ['M80 55 V12 H412 V35 H432', 'M184 55 H432', 'M288 55 V98 H412 V75 H432']
    : ['M120 55 C180 55 180 120 240 120', 'M120 120 H240', 'M120 185 C180 185 180 120 240 120'];
  return (
    <svg viewBox={compact ? '0 0 540 110' : '0 0 360 240'} className="h-full w-full" aria-hidden="true">
      {paths.map((d, i) => <motion.path key={d} d={d} fill="none" className="stroke-white/60" strokeWidth="1"
        initial={{ pathLength: 0 }} animate={{ pathLength: line >= i ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: 'easeInOut' }} data-start-motion="hero-line" />)}
      {[0, 1, 2].map(i => <g key={i}>
        <rect x={compact ? 8 + i * 104 : 20} y={compact ? 35 : 35 + i * 65}
          width={compact ? 72 : 100} height="40" className="fill-bg-dark stroke-white/40" strokeWidth="1" />
        <text x={compact ? 28 + i * 104 : 36} y={compact ? 60 : 60 + i * 65}
          className="fill-white text-[14px] font-medium" style={EN}>{String(i + 1).padStart(2, '0')}</text>
      </g>)}
      <rect x={compact ? 432 : 240} y={compact ? 20 : 72} width={compact ? 70 : 96} height={compact ? 70 : 96}
        fill="none" className="stroke-white/60" strokeWidth="1" />
      <Store x={compact ? 450 : 266} y={compact ? 37 : 98} width={compact ? 34 : 44} height={compact ? 34 : 44}
        className="text-white" strokeWidth={1} />
    </svg>
  );
}

function StartHero({ busy, enqueue }: { busy: boolean; enqueue: (run: () => void, duration?: number) => void }) {
  const frame = useRef<HTMLDivElement>(null);
  const visible = useInView(frame, { amount: 0.2, once: true });
  const inView = useInView(frame);
  const reduced = useReducedMotion();
  const started = useRef(false);
  const [line, setLine] = useState(-1);
  const [desktop, setDesktop] = useState(true);
  const [drawn, setDrawn] = useState(false);
  useLayoutEffect(() => {
    const media = window.matchMedia('(min-width: 900px)');
    const update = () => setDesktop(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    [0, 1, 2].forEach(i => enqueue(() => setLine(i), 600));
    enqueue(() => setDrawn(true), 0);
  }, [visible, enqueue]);
  return (
    <div ref={frame} className="relative isolate overflow-hidden bg-bg-dark" data-start-hero>
      {/* Apache-2.0 Paper Dithering: 설치된 소스를 흑백 두 색으로만 사용. 글자 뒤 흰 점의 불투명도는 최대12%.
          모바일은 정적 대체(speed=0). 화면 밖과 입력 반응 중에도 멈춰 부하와 움직임 중복을 줄인다. */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]" aria-hidden>
        <Dithering colorBack="#171717" colorFront="#ffffff" shape="warp" type="4x4"
          speed={desktop && drawn && inView && !busy && !reduced ? 0.1 : 0}
          maxPixelCount={desktop ? 240000 : 80000} minPixelRatio={1} className="h-full w-full" data-start-motion="dithering" />
      </div>
      {/* 기존 정사각 격자를 유지. PC12×2, 모바일6×3. 화면 크기에 맞는 한 개만 렌더. */}
      <OccupancyGrid cols={desktop ? 12 : 6} rows={desktop ? 2 : 3} tone="dark" checker areas={desktop ? [
        { key: 'title', c: [2, 8], r: [1, 3], className: 'flex items-center px-8 lg:px-12' },
        { key: 'scene', c: [8, 12], r: [1, 3], className: 'p-3' },
      ] : [
        { key: 'title', c: [1, 7], r: [1, 3], className: 'flex items-center px-6' },
        { key: 'scene', c: [1, 7], r: [3, 4], className: 'px-6' },
      ]} render={key => key === 'title' ? <div>
        <h1 className="text-[clamp(28px,4.3vw,48px)] font-semibold tracking-[-0.04em] leading-[1.18] text-white">가게 이름 하나면 됩니다</h1>
        <p className="mt-3 text-[15px] leading-[1.6] text-white">나머지는 저희가 찾아서 채워 둘게요.</p>
      </div> : <StartScene line={line} compact={!desktop} />} />
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
  const { busy, enqueue, reduced } = useMotionQueue();
  const [activeStep, setActiveStep] = useState(0);
  const [numberStep, setNumberStep] = useState(0);
  const [focusLine, setFocusLine] = useState<string | null>(null);
  const focused = useRef<string | null>(null);
  const [selectionLine, setSelectionLine] = useState('');
  const [checked, setChecked] = useState([false, false, false]);

  function focusField(name: string, step: number) {
    focused.current = name;
    setFocusLine(null);
    if (step !== activeStep) {
      enqueue(() => { if (focused.current === name) setNumberStep(step); });
      enqueue(() => { if (focused.current === name) setActiveStep(step); });
    }
    enqueue(() => { if (focused.current === name) setFocusLine(name); });
  }

  function finishField(name: 'business' | 'contact') {
    focused.current = null;
    setFocusLine(null);
    const i = name === 'business' ? 1 : 2;
    if (form[name].trim() && !checked[i]) enqueue(() => setChecked(prev => prev.map((done, n) => n === i ? true : done)));
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (!e.target.value.trim() && (e.target.name === 'business' || e.target.name === 'contact')) {
      const i = e.target.name === 'business' ? 1 : 2;
      setChecked(prev => prev.map((done, n) => n === i ? false : done));
    }
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
  const inputCls = 'w-full h-11 px-4 border border-border-mid bg-bg text-[15px] max-md:text-[16px] text-text-primary placeholder:text-text-weak focus:border-text-primary focus:outline-none';
  const heading = <h2 className="text-[clamp(24px,2.7vw,32px)] font-semibold leading-[1.3] tracking-[-0.03em] text-text-primary">세 가지만 여쭤봅니다</h2>;
  const progressHeading = <div className="flex items-center justify-between gap-3">{heading}
    <NumberFlow value={numberStep + 1} format={{ minimumIntegerDigits: 2 }} animated={!reduced}
      transformTiming={{ duration: 250, easing: 'ease-in-out' }} spinTiming={{ duration: 250, easing: 'ease-in-out' }}
      opacityTiming={{ duration: 250, easing: 'ease-in-out' }}
      className="shrink-0 text-[14px] font-semibold text-text-primary" style={EN} aria-label={`현재 입력 단계 ${numberStep + 1}`} data-start-motion="number" />
  </div>;
  const rail = (
    <div className="flex flex-col gap-8 px-[15%] py-8">
      <div className="flex flex-col gap-5">{progressHeading}<Progress complete={complete} active={activeStep} /></div>
      {/* 기존 신청 후 안내를 양식 옆으로 옮김. 새 문단을 추가하지 않는다. */}
      <Expectations />
    </div>
  );

  return (
    <main data-start-motion-busy={busy}>
      <LayoutGroup id="start-form">
      <OuterContainer>
        <Section noBorder><StartHero busy={busy} enqueue={enqueue} /></Section>
        <Section noBorder>
          <MeasuredGrid rail={rail}>
            {desktop => (
              <div className="px-[9%] py-8 max-md:px-6 max-md:py-6">
                {!desktop && <div className="mb-5 flex flex-col gap-3">{progressHeading}<Progress complete={complete} active={activeStep} /></div>}
                {status === 'success' ? (
                  <div className="flex flex-col items-center gap-4 py-12 text-center" role="status">
                    <Check size={40} strokeWidth={1.3} className="text-accent" aria-hidden />
                    <h2 className="text-[clamp(22px,2.5vw,28px)] font-semibold text-text-primary">신청이 접수되었습니다</h2>
                    <p className="text-[15px] max-md:text-[16px] max-md:font-medium text-text-body">시작을 돕는 안내를 먼저 드리겠습니다.</p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    <fieldset className="min-w-0" onFocus={() => focusField('interest', 0)}>
                      <legend id="start-interest-label" className="mb-3 flex items-center gap-3 text-[14px] font-semibold text-text-primary">
                        <span className="text-text-weak" style={EN}>01</span>{formCopy.interest.label} *
                        <DrawCheck done={complete[0] && checked[0]} />
                      </legend>
                      <RadioGroup.Root name="interest" required orientation="vertical" aria-labelledby="start-interest-label"
                        value={form.interest} onValueChange={interest => {
                          setForm(prev => ({ ...prev, interest }));
                          enqueue(() => setSelectionLine(interest));
                          if (!checked[0]) enqueue(() => setChecked(prev => [true, prev[1], prev[2]]));
                        }} className="flex flex-col gap-2">
                        {formCopy.interest.options.map(o => (
                          <RadioGroup.Item key={o.value} value={o.value}
                            aria-labelledby={`start-${o.value}-title`} aria-describedby={`start-${o.value}-description`}
                            className={['relative flex w-full min-w-0 cursor-pointer items-center bg-bg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary', form.interest === o.value ? 'border-2 border-text-primary px-[15px] py-[11px]' : 'border border-border-mid px-4 py-3 hover:border-text-weak'].join(' ')}>
                            {selectionLine === o.value && <motion.span layoutId="start-product-line" aria-hidden
                              className="pointer-events-none absolute inset-x-[15px] bottom-[5px] h-px bg-text-primary"
                              transition={{ duration: reduced ? 0 : 0.25, ease: 'easeInOut' }} data-start-motion="product" />}
                            <span className="flex min-w-0 flex-col gap-1.5">
                              <span id={`start-${o.value}-title`} className="text-[15px] font-semibold text-text-primary">{o.text}</span>
                              <span id={`start-${o.value}-description`} className="text-[14px] leading-[1.65] text-text-body">{PRODUCT_DESCRIPTIONS[o.value]}</span>
                            </span>
                          </RadioGroup.Item>
                        ))}
                      </RadioGroup.Root>
                    </fieldset>
                    <div>
                      <label htmlFor="start-business" className="mb-2 flex items-center gap-3 text-[14px] font-semibold text-text-primary">
                        <span className="text-text-weak" style={EN}>02</span>{formCopy.business.label} *
                        <DrawCheck done={complete[1] && checked[1]} />
                      </label>
                      <div className="relative">
                        <input id="start-business" name="business" value={form.business} onChange={onChange} onFocus={() => focusField('business', 1)} onBlur={() => finishField('business')} required placeholder={formCopy.business.placeholder} className={inputCls} />
                        <FocusLine active={focusLine === 'business'} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="start-contact" className="mb-2 flex items-center gap-3 text-[14px] font-semibold text-text-primary">
                        <span className="text-text-weak" style={EN}>03</span>{formCopy.contact.label} *
                        <DrawCheck done={complete[2] && checked[2]} />
                      </label>
                      <div className="relative">
                        <input id="start-contact" name="contact" value={form.contact} onChange={onChange} onFocus={() => focusField('contact', 2)} onBlur={() => finishField('contact')} required placeholder={formCopy.contact.placeholder} className={inputCls} />
                        <FocusLine active={focusLine === 'contact'} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="start-memo" className="mb-2 block text-[14px] font-medium text-text-primary">{formCopy.memo.label}</label>
                      <div className="relative">
                        <TextareaAutosize id="start-memo" name="memo" value={form.memo} onChange={onChange} minRows={2} placeholder={formCopy.memo.placeholder}
                          onFocus={() => focusField('memo', 2)} onBlur={() => { focused.current = null; setFocusLine(null); }}
                          className="block w-full resize-none border border-border-mid bg-bg px-4 py-3 text-[15px] max-md:text-[16px] text-text-primary placeholder:text-text-weak focus:border-text-primary focus:outline-none" />
                        <FocusLine active={focusLine === 'memo'} />
                      </div>
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
        {/* FAQ 문구·순서 유지. 기존 등장 반응의 실행 순서만 겹치지 않게 조정. */}
        <Section noBorder>
          <MeasuredGrid>
            {() => (
              <div className="px-12 py-9 max-w-[720px] mx-auto max-md:px-6 max-md:py-8">
                <div className="flex flex-col">
                  {faq.map((f, i) => (
                    <QueuedReveal key={f.q} enqueue={enqueue}>
                      <div className={['py-6', i < faq.length - 1 ? 'border-b border-border-default' : ''].join(' ')}>
                        <h3 className="text-[clamp(16px,1.4vw,17px)] font-bold text-text-primary mb-2">{f.q}</h3>
                        <p className="text-[14px] max-md:font-medium text-text-body leading-[1.65]">{f.a}</p>
                      </div>
                    </QueuedReveal>
                  ))}
                </div>
              </div>
            )}
          </MeasuredGrid>
        </Section>
      </OuterContainer>
      </LayoutGroup>
    </main>
  );
}
