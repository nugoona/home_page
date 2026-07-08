'use client';

import { useState } from 'react';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import { hero, form, steps, faq } from '@/lib/content/start';

const EN = { fontFamily: 'var(--font-en)' } as const;

export default function StartPage() {
  const [interest, setInterest] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // 스팸 방어(honeypot)·실제 알림 전송(Telegram)·rate limit = E3-8에서 API 연결.
    const data = new FormData(e.currentTarget);
    if (data.get('company_website')) return; // honeypot: 봇이 채우면 무시
    setSubmitted(true);
  }

  return (
    <main>
      <OuterContainer>
        {/* 헤더 */}
        <Section noBorder>
          <div className="pt-40 pb-12 px-6 text-center max-md:pt-28 max-md:pb-8">
            <FadeUp>
              <h1 className="text-[clamp(30px,5vw,52px)] font-extrabold text-text-primary tracking-[-0.035em] leading-[1.12]">
                {hero.h1}
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-[16px] text-text-body leading-[1.7] max-w-[520px] mx-auto mt-6">{hero.sub}</p>
            </FadeUp>
          </div>
        </Section>

        {/* 폼 + 3스텝 (2열) */}
        <Section>
          <div className="py-12 px-12 max-md:px-6 max-md:py-8">
            <div className="grid grid-cols-[1.2fr_1fr] gap-12 max-w-[1000px] mx-auto max-md:grid-cols-1 max-md:gap-10">
              {/* 폼 */}
              <FadeUp>
                <div className="border border-border-default p-8 max-md:p-6">
                  {submitted ? (
                    <div className="py-16 text-center">
                      <span className="rounded-dot inline-flex w-12 h-12 items-center justify-center bg-accent-bg text-accent text-[22px] mb-5">✓</span>
                      <h2 className="text-[20px] font-semibold text-text-primary mb-2">신청이 접수되었습니다</h2>
                      <p className="text-[14px] text-text-body leading-[1.7]">
                        남겨 주신 연락처로 곧 안내드리겠습니다.<br />상호명으로 미리 세팅해 두겠습니다.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} className="flex flex-col gap-6">
                      <h2 className="text-[18px] font-semibold text-text-primary">{form.heading}</h2>

                      {/* 관심 제품 */}
                      <div>
                        <label className="block text-[13px] font-medium text-text-secondary mb-2.5">{form.interest.label}</label>
                        <div className="grid grid-cols-1 gap-2">
                          {form.interest.options.map((o) => (
                            <label
                              key={o.value}
                              className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors text-[14px] ${
                                interest === o.value
                                  ? 'border-accent bg-accent-bg text-text-primary'
                                  : 'border-border-default text-text-body hover:border-border-hover'
                              }`}
                            >
                              <input
                                type="radio"
                                name="interest"
                                value={o.value}
                                checked={interest === o.value}
                                onChange={() => setInterest(o.value)}
                                className="accent-[#0070f3]"
                                required
                              />
                              {o.text}
                            </label>
                          ))}
                        </div>
                      </div>

                      <Field label={form.business.label} name="business" placeholder={form.business.placeholder} required />
                      <Field label={form.contact.label} name="contact" placeholder={form.contact.placeholder} required />
                      <Field label={form.memo.label} name="memo" placeholder={form.memo.placeholder} />

                      {/* honeypot (봇 트랩 — 화면 숨김) */}
                      <input
                        type="text"
                        name="company_website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="absolute w-px h-px opacity-0 -left-[9999px]"
                      />

                      <button
                        type="submit"
                        className="h-[50px] px-6 text-[15px] font-semibold btn-gradient-dark text-white transition-all"
                      >
                        {form.submit}
                      </button>
                      <p className="text-[12px] text-text-muted text-center">{form.note}</p>
                    </form>
                  )}
                </div>
              </FadeUp>

              {/* 3스텝 기대관리 */}
              <FadeUp delay={0.1}>
                <div>
                  <h2 className="text-[18px] font-semibold text-text-primary mb-6">{steps.heading}</h2>
                  <div className="flex flex-col">
                    {steps.items.map((s, i) => (
                      <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                        {i < steps.items.length - 1 && (
                          <span className="absolute left-[15px] top-8 bottom-0 w-px bg-border-default" />
                        )}
                        <span className="shrink-0 w-8 h-8 flex items-center justify-center border border-border-default text-[13px] font-semibold text-accent bg-white z-[1]" style={EN}>
                          {s.num}
                        </span>
                        <div className="pt-1">
                          <h3 className="text-[15px] font-semibold text-text-primary mb-1">{s.title}</h3>
                          <p className="text-[13px] text-text-body leading-[1.6]">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* FAQ 3 */}
        <Section alt>
          <div className="py-16 px-12 max-md:py-12 max-md:px-6 max-w-[720px] mx-auto">
            <FadeUp>
              <h2 className="text-[clamp(24px,3.4vw,34px)] font-semibold text-text-primary tracking-[-0.02em] text-center mb-10">
                자주 묻는 질문
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="border-t border-border-default">
                {faq.map((f, i) => (
                  <div key={i} className="py-6 border-b border-border-default">
                    <h3 className="text-[16px] font-semibold text-text-primary mb-2">{f.q}</h3>
                    <p className="text-[14px] text-text-body leading-[1.7]">{f.a}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}

function Field({ label, name, placeholder, required }: { label: string; name: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-text-secondary mb-2">{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full h-[46px] px-4 text-[14px] text-text-primary border border-border-default bg-white placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
      />
    </div>
  );
}
