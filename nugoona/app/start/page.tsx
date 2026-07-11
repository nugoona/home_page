'use client';

/**
 * /start — 두 갈래(콘텐츠·대시보드) 공통 종착 (E2-4).
 * 카피·필드 = lib/content/start.ts 정본 그대로(토씨 유지, 창작 금지).
 * 구버전(월 광고비·플랫폼 셀렉트 폼)은 2026-07-11 정본 미반영 오염으로 판정, 정본 4필드로 교체.
 * API 호환: /api/submit-survey 는 name 필수 — 새 필드를 기존 페이로드 키에 매핑(서버·Slack 알림 무수정).
 */

import { useState } from 'react';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import { hero, form as formCopy, steps, faq } from '@/lib/content/start';

const EN = { fontFamily: 'var(--font-en)' } as const;

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

  const inputCls =
    'w-full h-11 px-4 border border-border-default bg-white text-[14px] text-text-primary focus:border-accent focus:outline-none transition-colors';

  return (
    <main>
      <OuterContainer>
        {/* ── 헤더 ── */}
        <Section crossMarks>
          <div className="py-20 px-12 text-center max-md:py-14 max-md:px-6">
            <FadeUp>
              <h1 className="text-[clamp(32px,5vw,48px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.15] mb-4">
                {hero.h1}
              </h1>
              <p className="text-[16px] text-text-body max-w-[480px] mx-auto leading-[1.65]">{hero.sub}</p>
            </FadeUp>
          </div>
        </Section>

        {/* ── 폼 4필드 ── */}
        <Section alt>
          <div className="py-16 px-12 max-md:py-12 max-md:px-6">
            <FadeUp>
              <div className="max-w-[560px] mx-auto">
                {status === 'success' ? (
                  <div className="text-center py-12">
                    <h2 className="text-[24px] font-semibold text-text-primary mb-4">신청이 접수되었습니다</h2>
                    <p className="text-[15px] text-text-body">시작을 돕는 안내를 먼저 드리겠습니다.</p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="flex flex-col gap-6">
                    <h2 className="text-[20px] font-semibold text-text-primary tracking-[-0.02em]">{formCopy.heading}</h2>

                    {/* ① 관심 제품 — 카드형 라디오 */}
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-2">{formCopy.interest.label} *</label>
                      <div className="flex flex-col gap-2">
                        {formCopy.interest.options.map((o) => (
                          <label
                            key={o.value}
                            className="flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors bg-white"
                            style={{
                              borderColor: form.interest === o.value ? '#0070f3' : 'var(--color-border-default, #eaeaea)',
                            }}
                          >
                            <input
                              type="radio"
                              name="interest"
                              value={o.value}
                              checked={form.interest === o.value}
                              onChange={onChange}
                              required
                              className="accent-[#0070f3]"
                            />
                            <span className="text-[14px] text-text-primary">{o.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* ② 상호·브랜드명 */}
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">{formCopy.business.label} *</label>
                      <input name="business" value={form.business} onChange={onChange} required placeholder={formCopy.business.placeholder} className={inputCls} />
                    </div>

                    {/* ③ 연락처 */}
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">{formCopy.contact.label} *</label>
                      <input name="contact" value={form.contact} onChange={onChange} required placeholder={formCopy.contact.placeholder} className={inputCls} />
                    </div>

                    {/* ④ 메모 (선택) */}
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">{formCopy.memo.label}</label>
                      <textarea name="memo" value={form.memo} onChange={onChange} rows={4} placeholder={formCopy.memo.placeholder}
                        className="w-full px-4 py-3 border border-border-default bg-white text-[14px] text-text-primary focus:border-accent focus:outline-none transition-colors resize-y" />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full h-12 btn-gradient-dark text-white text-[15px] font-semibold border border-[#333] cursor-pointer disabled:opacity-50 transition-all"
                      >
                        {status === 'loading' ? '전송 중...' : formCopy.submit}
                      </button>
                      <p className="text-[13px] text-text-weak text-center mt-3">{formCopy.note}</p>
                      {/* 안심 문구(GPT+사장님 확정 2026-07-11) — "영업 전화 경계" 이탈 지점 수리 */}
                      <p className="text-[13px] text-text-weak text-center mt-1">{formCopy.reassure}</p>
                    </div>
                    {status === 'error' && (
                      <p className="text-[13px] text-red-500 text-center">전송에 실패했습니다. 다시 시도해주세요.</p>
                    )}
                  </form>
                )}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* ── 3스텝 기대관리 ── */}
        <Section>
          <div className="py-20 px-12 max-w-[1080px] mx-auto max-md:py-14 max-md:px-6">
            <FadeUp>
              <h2 className="text-[clamp(24px,3.4vw,34px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.2] mb-12 max-md:mb-8">
                {steps.heading}
              </h2>
            </FadeUp>
            <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-6">
              {steps.items.map((s, i) => (
                <FadeUp key={s.num} delay={i * 0.08}>
                  {/* §8.7-I: 스텝 글리프(안내/계정/한 달) — stroke 1.5, 직각 */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex w-8 h-8 items-center justify-center text-[13px] font-bold text-white bg-[#171717]" style={EN}>
                      {s.num}
                    </span>
                    <div className="flex-1 h-px bg-border-default" />
                    <svg viewBox="0 0 20 20" className="w-[20px] h-[20px] text-text-weak" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" aria-hidden>
                      {i === 0 && <path d="M3 4h14v9H9l-4 4v-4H3z" />}
                      {i === 1 && <><circle cx="10" cy="7" r="3" /><path d="M4 17c0-3 2.5-5 6-5s6 2 6 5" /></>}
                      {i === 2 && <><rect x="3" y="4" width="14" height="13" /><path d="M3 8h14M7 3v3M13 3v3M7 12.5l2 2 4-4" /></>}
                    </svg>
                  </div>
                  <h3 className="text-[16px] font-bold text-text-primary mb-2">{s.title}</h3>
                  <p className="text-[14px] text-text-body leading-[1.65]">{s.desc}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* ── FAQ 3 ── */}
        <Section alt>
          <div className="py-20 px-12 max-w-[720px] mx-auto max-md:py-14 max-md:px-6">
            <div className="flex flex-col">
              {faq.map((f, i) => (
                <FadeUp key={f.q} delay={i * 0.06}>
                  <div className={`py-6 ${i < faq.length - 1 ? 'border-b border-border-default' : ''}`}>
                    <h3 className="text-[16px] font-bold text-text-primary mb-2">{f.q}</h3>
                    <p className="text-[14px] text-text-body leading-[1.65]">{f.a}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
