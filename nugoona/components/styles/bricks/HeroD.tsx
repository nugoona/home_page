'use client';

/**
 * HeroD — 경쟁 시안 D [컨셉: 톤온톤 무게 (로고 시스템과 한 몸)]
 *
 * 회사 로고 시스템(직각 정사각 + 톤온톤 — N #171717/흰, Nc 다크그린/그린, Na 다크네이비/블루)을
 * 히어로의 디자인 언어로 그대로 확장한다. 다크 배경 위에 어도비 Creative Cloud 앱 그리드를
 * 연상시키는 비대칭 타일 4장(콘텐츠·광고·마스터·시스템 라벨)이 진입 시 순차 조립되고,
 * H1과 함께 "한 회사, 두 제품"이 텍스트가 아니라 그리드 구조 자체로 읽힌다.
 *
 * 톤: 격조·무게감(다크 + 톤온톤) + 밀도(타일 내부 아이콘·라벨·코너 크로스헤어·인덱스 넘버로 채움).
 * 기술: framer-motion(진입 시 1회 순차 스케일-업 조립) + 로컬 로고 SVG(/img/logo/*).
 */

import Link from 'next/link';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

/* 로고 시스템 톤온톤 — nugoona.md/globals.css 정본 값 그대로 */
const BG = '#141414';
const BG_DEEP = '#0a0a0a';
const ACCENT = '#0070f3';
const NC_BG = '#0b2e1b';
const NC_FG = '#2fd46b';
const NA_BG = '#0a1f4d';
const NA_FG = '#3e8bff';

const tiles = [
  {
    key: 'nc',
    area: 'nc',
    bg: NC_BG,
    fg: NC_FG,
    icon: '/img/logo/nc.svg',
    name: '누구나 콘텐츠',
    desc: '블로그·플레이스·SNS 노출',
    href: '/content',
    index: '01',
    initial: { opacity: 0, scale: 0.82, x: -18, y: -14 },
    delay: 0.32,
  },
  {
    key: 'na',
    area: 'na',
    bg: NA_BG,
    fg: NA_FG,
    icon: '/img/logo/na.svg',
    name: '누구나 광고',
    desc: '메타·구글 광고 운영',
    href: '/ads',
    index: '02',
    initial: { opacity: 0, scale: 0.82, x: 20, y: -10 },
    delay: 0.46,
  },
] as const;

export default function HeroD() {
  return (
    <section
      className="max-md:!px-5 max-md:!py-16"
      style={{
        background: BG,
        position: 'relative',
        overflow: 'hidden',
        padding: '0 48px',
        minHeight: 'clamp(560px, 76vh, 820px)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* 배경 미세 그리드(구조감 — 파스텔·장식 없이 라인만) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, #000 40%, transparent 92%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, #000 40%, transparent 92%)',
        }}
      />

      <div
        className="max-md:!flex-col max-md:!gap-12"
        style={{
          position: 'relative',
          maxWidth: 1240,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 72,
        }}
      >
        {/* ══════════ 좌: 카피 ══════════ */}
        <div style={{ flex: '1 1 480px', minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '7px 14px 7px 8px',
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            <img src="/img/logo/n.svg" alt="" width={16} height={16} style={{ display: 'block' }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', letterSpacing: '-0.01em' }}>
              누구나컴퍼니 <span style={{ color: 'rgba(255,255,255,0.32)' }}>·</span>{' '}
              <span style={{ ...EN, letterSpacing: '0.06em', fontSize: 11 }}>PRODUCT SYSTEM</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
            className="max-md:!text-[clamp(32px,8.4vw,44px)]"
            style={{
              fontSize: 'clamp(38px, 4.4vw, 58px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.14,
              margin: '26px 0 20px',
            }}
          >
            <span style={{ color: ACCENT }}>누구나</span> 마케팅하는 시대
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
            className="max-md:!text-[16px]"
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.65,
              marginBottom: 36,
              fontWeight: 500,
              maxWidth: 440,
            }}
          >
            광고도 노출도, 한 화면에서 이해하고 직접 운영합니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.24 }}
            style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 44 }}
          >
            <Link
              href="/start"
              className="hover:bg-[#2a2a2a] transition-colors"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 52,
                padding: '0 34px',
                background: '#fff',
                color: '#141414',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              무료로 시작하기
            </Link>
          </motion.div>

          {/* 톤온톤 범례 — 두 제품이 하나의 시스템임을 텍스트로도 못박기 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            className="max-md:!hidden"
            style={{ display: 'flex', alignItems: 'center', gap: 24, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            {tiles.map((t) => (
              <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: t.fg, display: 'inline-block' }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{t.name}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══════════ 우: 로고 시스템 타일 그리드 (조립 이벤트) ══════════ */}
        <div style={{ flex: '1 1 420px', minWidth: 0, width: '100%' }}>
          <div
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1.32fr 1fr',
              gridTemplateRows: '1fr 1fr 0.62fr',
              gridTemplateAreas: '"nc na" "nc na" "n stat"',
              gap: 3,
              background: BG_DEEP,
              aspectRatio: '1 / 0.92',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {tiles.map((t) => (
              <motion.a
                key={t.key}
                href={t.href}
                initial={t.initial}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: t.delay }}
                className="group hover:brightness-[1.08]"
                style={{
                  gridArea: t.area,
                  position: 'relative',
                  background: t.bg,
                  padding: 'clamp(16px, 3vw, 26px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'filter 0.3s ease',
                  overflow: 'hidden',
                }}
              >
                {/* 코너 크로스헤어 — 시스템 그리드 디테일 */}
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 8,
                    height: 8,
                    borderTop: `1px solid ${t.fg}`,
                    borderRight: `1px solid ${t.fg}`,
                    opacity: 0.55,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <img src={t.icon} alt="" width={30} height={30} style={{ display: 'block' }} />
                  <span style={{ ...EN, fontSize: 11, color: t.fg, opacity: 0.65, letterSpacing: '0.04em' }}>
                    {t.index}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 5, letterSpacing: '-0.01em' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 13, color: t.fg, opacity: 0.85, lineHeight: 1.4 }}>{t.desc}</div>
                </div>
              </motion.a>
            ))}

            {/* N 마스터 타일 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}
              style={{
                gridArea: 'n',
                background: '#171717',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src="/img/logo/n.svg" alt="누구나컴퍼니" width={30} height={30} style={{ display: 'block' }} />
            </motion.div>

            {/* 시스템 라벨 타일 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.72 }}
              style={{
                gridArea: 'stat',
                background: '#1c1c1c',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 clamp(12px, 2.4vw, 18px)',
                gap: 4,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>한 회사, 두 제품</span>
              <span style={{ ...EN, fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
                ONE SYSTEM
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
