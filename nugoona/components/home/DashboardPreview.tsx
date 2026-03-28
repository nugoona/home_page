'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

const kpis = [
  { label: 'Revenue', value: '₩12,847,200', change: '+18.3%', up: true },
  { label: 'ROAS', value: '785%', change: '+124%', up: true },
  { label: 'Visitors', value: '2,341', change: '+7.2%', up: true },
  { label: 'CVR', value: '3.8%', change: '-0.4%', up: false },
];

const bars = [65, 45, 78, 92, 56, 84, 70];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DashboardPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className="relative border-b border-border-default overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000 0%, #000 10%, #fafafa 75%, #fafafa 100%)',
      }}
    >
      <div className="pt-6 pb-28 px-6 flex flex-col items-center max-md:pb-16">
        <p className="text-center text-[13px] text-white/35 mb-10 tracking-[0.3px] max-md:mb-6" style={EN}>
          4개 플랫폼 데이터를 하나의 화면에서
        </p>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[860px]"
          style={{ perspective: '1200px' }}
        >
          <div
            style={{
              transform: 'rotateX(12deg)',
              transformOrigin: 'center bottom',
            }}
          >
            {/* Dashboard card */}
            <div
              className="border border-border-default bg-white overflow-hidden"
              style={{
                boxShadow:
                  '0 60px 120px rgba(0,112,243,0.1), 0 20px 60px rgba(0,0,0,0.06)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border-light bg-[#fafafa]">
                <div className="flex items-center gap-2">
                  <div className="w-[6px] h-[6px] bg-[#22c55e] rounded-dot" />
                  <span
                    className="text-[11px] font-semibold text-text-weak tracking-[0.08em]"
                    style={EN}
                  >
                    NGN DASHBOARD
                  </span>
                </div>
                <span className="text-[10px] text-[#ccc]" style={EN}>
                  Live
                </span>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-[1px] bg-border-light border-b border-border-light">
                {kpis.map((kpi, i) => (
                  <div key={i} className="p-5 bg-white max-sm:p-3.5">
                    <p className="text-[10px] text-text-weak mb-1" style={EN}>
                      {kpi.label}
                    </p>
                    <p
                      className="text-[18px] font-semibold text-text-primary tracking-[-0.02em] max-sm:text-[15px]"
                      style={EN}
                    >
                      {kpi.value}
                    </p>
                    <p
                      className={`text-[11px] mt-1 font-medium ${kpi.up ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}
                      style={EN}
                    >
                      {kpi.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="p-6 max-sm:p-4">
                <p
                  className="text-[10px] text-text-weak mb-4 tracking-[0.06em]"
                  style={EN}
                >
                  WEEKLY REVENUE
                </p>
                <div className="flex items-end gap-2 h-[68px]">
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1.5"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={inView ? { height: `${h}%` } : {}}
                        transition={{
                          duration: 0.5,
                          delay: 0.4 + i * 0.06,
                          ease: 'easeOut',
                        }}
                        className="w-full bg-accent"
                      />
                      <span
                        className="text-[8px] text-[#ccc]"
                        style={EN}
                      >
                        {days[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Blue glow underneath */}
            <div
              className="mx-auto h-[60px]"
              style={{
                background:
                  'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0,112,243,0.12) 0%, transparent 70%)',
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
