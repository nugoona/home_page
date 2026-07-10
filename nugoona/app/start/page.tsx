'use client';

import { useState } from 'react';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';

export default function StartPage() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    platform: '',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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

  return (
    <main>
      <OuterContainer>
        <Section crossMarks>
          <div className="py-20 px-12 text-center max-md:py-14 max-md:px-6">
            <FadeUp>
              <h1 className="text-[clamp(32px,5vw,48px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.15] mb-4">
                무료로 시작하기
              </h1>
              <p className="text-[17px] text-text-body max-w-[480px] mx-auto leading-[1.6]">
                아래 정보를 남겨주시면 담당자가 연락드려 세팅을 도와드립니다.
              </p>
            </FadeUp>
          </div>
        </Section>

        <Section alt>
          <div className="py-16 px-12 max-md:py-12 max-md:px-6">
            <FadeUp>
              <div className="max-w-[560px] mx-auto">
                {status === 'success' ? (
                  <div className="text-center py-12">
                    <h2 className="text-[24px] font-semibold text-text-primary mb-4">문의가 접수되었습니다</h2>
                    <p className="text-[15px] text-text-body">영업일 기준 1일 이내에 연락드리겠습니다.</p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">이름 *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        required
                        className="w-full h-11 px-4 border border-border-default bg-white text-[14px] text-text-primary focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">회사/브랜드명 *</label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={onChange}
                        required
                        className="w-full h-11 px-4 border border-border-default bg-white text-[14px] text-text-primary focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">연락처 *</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        required
                        type="tel"
                        className="w-full h-11 px-4 border border-border-default bg-white text-[14px] text-text-primary focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">이메일</label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        type="email"
                        className="w-full h-11 px-4 border border-border-default bg-white text-[14px] text-text-primary focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">쇼핑몰 플랫폼</label>
                      <select
                        name="platform"
                        value={form.platform}
                        onChange={onChange}
                        className="w-full h-11 px-4 border border-border-default bg-white text-[14px] text-text-primary focus:border-accent focus:outline-none transition-colors"
                      >
                        <option value="">선택해주세요</option>
                        <option value="cafe24">카페24</option>
                        <option value="makeshop">메이크샵</option>
                        <option value="godomall">고도몰</option>
                        <option value="imweb">아임웹</option>
                        <option value="other">기타</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">월 광고비 예산</label>
                      <select
                        name="budget"
                        value={form.budget}
                        onChange={onChange}
                        className="w-full h-11 px-4 border border-border-default bg-white text-[14px] text-text-primary focus:border-accent focus:outline-none transition-colors"
                      >
                        <option value="">선택해주세요</option>
                        <option value="under200">200만원 이하</option>
                        <option value="200-500">200~500만원</option>
                        <option value="500-1000">500~1,000만원</option>
                        <option value="over1000">1,000만원 이상</option>
                        <option value="undecided">미정</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">문의사항</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={onChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-border-default bg-white text-[14px] text-text-primary focus:border-accent focus:outline-none transition-colors resize-y"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="h-12 btn-gradient-dark text-white text-[15px] font-semibold border border-[#333] cursor-pointer disabled:opacity-50 transition-all"
                    >
                      {status === 'loading' ? '전송 중...' : '무료 상담 신청'}
                    </button>
                    {status === 'error' && (
                      <p className="text-[13px] text-red-500 text-center">전송에 실패했습니다. 다시 시도해주세요.</p>
                    )}
                  </form>
                )}
              </div>
            </FadeUp>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
