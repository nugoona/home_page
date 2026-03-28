'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import FadeUp from '@/components/motion/FadeUp';
import { features } from '@/lib/content/home';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };
const f = features[0]; // AdCanvas data

export default function AdCanvasMagic() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="py-[100px] px-12 max-md:py-16 max-md:px-6">
      <div className="grid grid-cols-[5fr_6fr] gap-14 items-center max-w-[1080px] mx-auto max-md:grid-cols-1 max-md:gap-10">
        {/* Left: Text */}
        <div>
          <FadeUp>
            <p
              className="text-[11px] font-semibold text-text-weak tracking-[0.1em] uppercase mb-3"
              style={EN}
            >
              {f.label}
            </p>
            <h2
              className="text-[clamp(24px,3vw,32px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.25] mb-3.5"
              dangerouslySetInnerHTML={{ __html: f.title }}
            />
            <p className="text-[15px] text-text-body leading-[1.65] mb-6">
              {f.desc}
            </p>
            <ul className="flex flex-col gap-2.5 mb-6">
              {f.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[14px] text-[#444] leading-[1.5]"
                >
                  <span className="block w-[5px] h-[5px] shrink-0 mt-[7px] bg-[#ccc]" />
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href={f.link}
              className="inline-flex items-center gap-1.5 text-[14px] text-accent font-medium hover:gap-2.5 transition-[gap] duration-150"
            >
              자세히 보기
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M6 4l4 4-4 4" />
              </svg>
            </Link>
          </FadeUp>
        </div>

        {/* Right: Overlapping URL → iPhone visual */}
        <div className="relative max-md:order-[-1]">
          <FadeUp delay={0.15}>
            {/* Background layer: URL input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="border border-border-default bg-[#fafafa] p-6 pb-32 max-md:pb-24"
            >
              {/* Browser-like header */}
              <div className="flex items-center gap-1.5 mb-5">
                <span className="w-2 h-2 bg-[#e0e0e0] rounded-dot" />
                <span className="w-2 h-2 bg-[#e0e0e0] rounded-dot" />
                <span className="w-2 h-2 bg-[#e0e0e0] rounded-dot" />
                <span
                  className="ml-2 text-[10px] text-text-weak"
                  style={EN}
                >
                  adcanvas.nugoona.co.kr
                </span>
              </div>

              {/* URL input field */}
              <div className="flex items-center gap-3 px-4 py-3 bg-white border border-border-default mb-4">
                <svg
                  className="w-4 h-4 text-[#bbb] shrink-0"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M7 3H4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11 3h4v4M15 3L8 10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] text-[#999]" style={EN}>
                  myshop.cafe24.com/product/12345
                </span>
              </div>

              {/* AI processing indicator */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[rgba(0,112,243,0.04)] border border-[rgba(0,112,243,0.12)]">
                <svg
                  className="w-3.5 h-3.5 text-accent"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="8" cy="8" r="3" />
                  <path d="M8 2v2M8 12v2M2 8h2M12 8h2" strokeLinecap="round" />
                </svg>
                <span className="text-[11px] text-accent font-medium">
                  AI가 이미지·문구·타겟을 자동 생성 중...
                </span>
              </div>
            </motion.div>

            {/* Foreground layer: iPhone with Instagram ad */}
            <motion.div
              initial={{ opacity: 0, y: 40, x: 20 }}
              animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="absolute bottom-[-20px] right-[10%] w-[220px] max-md:w-[160px] max-md:right-[5%]"
              style={{
                filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.15))',
              }}
            >
              {/* iPhone frame */}
              <div className="iphone-frame bg-[#1a1a1a] p-[3px] border border-[#333]">
                <div className="iphone-screen bg-white overflow-hidden">
                  {/* Notch */}
                  <div className="flex justify-center pt-2 pb-1 bg-white">
                    <div className="iphone-notch w-[80px] h-[18px] bg-[#1a1a1a]" />
                  </div>

                  {/* Instagram-like ad */}
                  <div className="px-3 pt-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-dot bg-gradient-to-br from-[#833AB4] to-[#FD1D1D]" />
                      <div>
                        <p className="text-[7px] font-semibold text-[#171717]" style={EN}>
                          myshop_official
                        </p>
                        <p className="text-[6px] text-[#999]" style={EN}>
                          Sponsored
                        </p>
                      </div>
                    </div>

                    {/* Product image placeholder */}
                    <div
                      className="w-full aspect-[4/5] mb-2"
                      style={{
                        background:
                          'linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #fce7f3 100%)',
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <span
                          className="text-[24px] font-semibold text-white/30"
                          style={EN}
                        >
                          AD
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mb-1.5">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="#171717"
                        strokeWidth="1.5"
                      >
                        <path
                          d="M8 14s-5.5-4.5-5.5-8A3.5 3.5 0 018 3.5 3.5 3.5 0 0113.5 6c0 3.5-5.5 8-5.5 8z"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="#171717"
                        strokeWidth="1.5"
                      >
                        <path
                          d="M14 2L7 9M14 2l-5 12-2-5-5-2 12-5z"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* CTA button */}
                    <div className="bg-accent py-1.5 text-center mb-2">
                      <span className="text-[7px] font-semibold text-white" style={EN}>
                        Shop Now
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Lightning icon between layers */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.6,
              }}
              className="absolute bottom-[60px] right-[calc(10%+180px)] max-md:right-[calc(5%+130px)] z-10 w-10 h-10 bg-accent flex items-center justify-center"
              style={{
                boxShadow: '0 0 24px rgba(0,112,243,0.3)',
              }}
            >
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M9 1L3 9h4v6l6-8H9V1z" />
              </svg>
            </motion.div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
