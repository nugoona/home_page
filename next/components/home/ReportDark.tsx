'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import FadeUp from '@/components/motion/FadeUp';
import { features } from '@/lib/content/home';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };
const f = features[2]; // AI Report data

const reportLines = [
  { icon: '✅', text: 'Meta ROAS 1,024% 달성 — 전월 대비 최고 효율', delay: 0 },
  { icon: '📈', text: '검색 유입 전월 대비 +15% 상승, Instagram 유입 48% 비중', delay: 2200 },
  { icon: '⚠️', text: '상품 A 전환율 3.2배 상승, 광고비 비중 8% → 증액 권장', delay: 4400 },
  { icon: '💡', text: '리타겟팅 캠페인 ROAS 485% — 예산 확대 시 추가 매출 예상', delay: 6600 },
];

function TypeWriterLine({
  text,
  icon,
  active,
  delay,
}: {
  text: string;
  icon: string;
  active: boolean;
  delay: number;
}) {
  const [displayed, setDisplayed] = useState('');
  const startedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    let i = 0;
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length && intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }, 20);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, text, delay]);

  if (!startedRef.current && !displayed) return null;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/[0.06] last:border-b-0">
      <span className="text-[14px] shrink-0 mt-0.5">{icon}</span>
      <p className="text-[13px] text-[#ccc] leading-[1.7]">
        {displayed}
        {displayed.length < text.length && displayed.length > 0 && (
          <span className="text-accent" style={{ animation: 'pulse 1s infinite' }}>
            |
          </span>
        )}
      </p>
    </div>
  );
}

export default function ReportDark() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="py-[100px] px-12 max-md:py-16 max-md:px-6">
      <div className="grid grid-cols-[5fr_6fr] gap-14 items-center max-w-[1080px] mx-auto max-md:grid-cols-1 max-md:gap-10">
        {/* Left: Text */}
        <div>
          <FadeUp>
            <p
              className="text-[11px] font-semibold text-white/40 tracking-[0.1em] uppercase mb-3"
              style={EN}
            >
              {f.label}
            </p>
            <h2
              className="text-[clamp(24px,3vw,32px)] font-semibold text-white tracking-[-0.02em] leading-[1.25] mb-3.5"
              dangerouslySetInnerHTML={{ __html: f.title }}
            />
            <p className="text-[15px] text-white/60 leading-[1.65] mb-6">
              {f.desc}
            </p>
            <ul className="flex flex-col gap-2.5 mb-6">
              {f.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[14px] text-white/50 leading-[1.5]"
                >
                  <span className="block w-[5px] h-[5px] shrink-0 mt-[7px] bg-accent" />
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

        {/* Right: AI Report Card with Typewriter */}
        <div className="max-md:order-[-1]">
          <FadeUp delay={0.15}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="border border-white/10 bg-[#111] overflow-hidden"
              style={{
                boxShadow:
                  '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,112,243,0.06)',
              }}
            >
              {/* Report header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div>
                  <p
                    className="text-[11px] font-semibold text-accent tracking-[0.06em] mb-1"
                    style={EN}
                  >
                    AI MONTHLY REPORT
                  </p>
                  <p className="text-[11px] text-white/30">
                    2026년 1월 분석 리포트
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-[#22c55e]"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M3 7l3 3 5-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[10px] text-[#22c55e]" style={EN}>
                    Generated
                  </span>
                </div>
              </div>

              {/* Typewriter content */}
              <div className="px-6 py-5 min-h-[260px]">
                {reportLines.map((line, i) => (
                  <TypeWriterLine
                    key={i}
                    text={line.text}
                    icon={line.icon}
                    active={inView}
                    delay={600 + line.delay}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2 px-6 py-3 border-t border-white/[0.06]">
                <svg
                  className="w-3 h-3 text-white/20"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <circle cx="6" cy="6" r="3" />
                  <path d="M6 4v2l1.5 1" strokeLinecap="round" />
                </svg>
                <span className="text-[10px] text-white/20" style={EN}>
                  Powered by Gemini AI · 매월 1일 자동 생성
                </span>
              </div>
            </motion.div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
