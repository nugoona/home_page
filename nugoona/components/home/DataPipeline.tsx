'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FadeUp from '@/components/motion/FadeUp';
import SectionHeader from '@/components/ui/SectionHeader';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

const platforms = [
  { name: 'Cafe24', color: '#3DB39E' },
  { name: 'Meta', color: '#0081FB' },
  { name: 'Google', color: '#4285F4' },
  { name: 'GA4', color: '#E37400' },
  { name: '29CM', color: '#FF6B35' },
];

const outputs = [
  { name: 'Dashboard', desc: '실시간 성과 확인' },
  { name: 'AI Report', desc: '자동 인사이트 분석' },
  { name: 'Trend', desc: '경쟁사 베스트 추적' },
];

export default function DataPipeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="py-[72px] px-12 max-md:py-12 max-md:px-6">
      <FadeUp>
        <SectionHeader
          title="5개 플랫폼 → 1개 대시보드"
          subtitle="흩어진 데이터를 한 곳으로. 로그인 5번 대신, 대시보드 1번."
          align="center"
        />
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="max-w-[900px] mx-auto">
          {/* Desktop: horizontal flow */}
          <div className="hidden md:grid grid-cols-[200px_1fr_200px] items-center gap-0">
            {/* Sources */}
            <div className="flex flex-col gap-2">
              {platforms.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-3 px-4 py-2.5 border border-border-default bg-white"
                >
                  <div
                    className="w-2 h-2 rounded-dot shrink-0"
                    style={{ background: p.color }}
                  />
                  <span className="text-[12px] font-semibold text-text-primary" style={EN}>
                    {p.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* SVG Paths */}
            <div className="relative h-[260px]">
              <svg
                viewBox="0 0 400 260"
                className="w-full h-full"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {platforms.map((p, i) => {
                  const startY = 22 + i * 54;
                  const endY = 130;
                  const pathId = `pipe-h-${i}`;
                  return (
                    <g key={p.name}>
                      <path
                        id={pathId}
                        d={`M 0 ${startY} C 140 ${startY}, 260 ${endY}, 400 ${endY}`}
                        fill="none"
                        stroke="#eaeaea"
                        strokeWidth="1.5"
                      />
                      {inView && (
                        <>
                          <circle r="3" fill="#0070f3">
                            <animateMotion
                              dur={`${2.2 + i * 0.3}s`}
                              repeatCount="indefinite"
                              begin={`${i * 0.4}s`}
                            >
                              <mpath href={`#${pathId}`} />
                            </animateMotion>
                          </circle>
                          <circle r="8" fill="#0070f3" opacity="0.12">
                            <animateMotion
                              dur={`${2.2 + i * 0.3}s`}
                              repeatCount="indefinite"
                              begin={`${i * 0.4}s`}
                            >
                              <mpath href={`#${pathId}`} />
                            </animateMotion>
                          </circle>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* NGN Outputs */}
            <div className="flex flex-col gap-2">
              {outputs.map((o, i) => (
                <motion.div
                  key={o.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  className="px-4 py-3 border border-border-default bg-[#0a0a0a]"
                >
                  <p className="text-[12px] font-semibold text-white mb-0.5" style={EN}>
                    {o.name}
                  </p>
                  <p className="text-[10px] text-white/50">{o.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical flow */}
          <div className="md:hidden flex flex-col items-center gap-6">
            {/* Platform badges row */}
            <div className="flex flex-wrap justify-center gap-2">
              {platforms.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-center gap-2 px-3 py-2 border border-border-default bg-white"
                >
                  <div
                    className="w-[6px] h-[6px] rounded-dot shrink-0"
                    style={{ background: p.color }}
                  />
                  <span className="text-[11px] font-semibold text-text-primary" style={EN}>
                    {p.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Vertical animated line */}
            <div className="relative w-[2px] h-16 bg-border-default overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-6 bg-accent animate-pipeline-flow" />
            </div>

            {/* NGN card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-full max-w-[280px] border border-border-default bg-[#0a0a0a] p-5"
            >
              <p className="text-[14px] font-semibold text-white mb-3 text-center" style={EN}>
                NGN
              </p>
              <div className="flex flex-col gap-2">
                {outputs.map((o) => (
                  <div key={o.name} className="flex items-center justify-between">
                    <span className="text-[11px] text-white/70" style={EN}>{o.name}</span>
                    <span className="text-[10px] text-white/40">{o.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}
