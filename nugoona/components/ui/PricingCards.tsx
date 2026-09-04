import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  Send,
  Layers,
  Search,
  TrendingUp,
  RefreshCw,
  Lightbulb,
  MessageSquare,
  MessageCircle,
  Clapperboard,
  UserCheck,
  Store,
  LayoutDashboard,
  MousePointerClick,
  Plug,
  Bot,
  FileText,
  BarChart3,
  Globe,
  Database,
  Headphones,
  Building2,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react';
import type { PricingTier, CrossSell } from '@/lib/content/types';

/**
 * 가격 티어 카드 (재사용) — /content 2티어·/ads 4티어 공용.
 * 문법 = Vercel 요금 페이지 실물 참조(사장님 캡처 3장, 2026-07-20):
 *   플랜명 옆 인라인 아웃라인 배지(대문자) · 초대형 가격 + 작은 단위 · 가격 아래 설명 2줄 · 얇은 hr ·
 *   상속 문구("~의 모든 기능, 그리고:") · 기능별 라인 아이콘(lucide, 자작 path 금지 §8.16) ·
 *   CTA = 맨 아래 좌측 정렬 pill(주력 = 다크 필 / 나머지 = 아웃라인) · 주력 카드만 흰 배경.
 * DESIGN 준수: 직각 카드(모서리 0, pill은 .rounded-pill 예외 유틸)·토큰 클래스·featured 상단 accent 바.
 */

const ICONS: Record<string, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  send: Send,
  layers: Layers,
  search: Search,
  trending: TrendingUp,
  refresh: RefreshCw,
  lightbulb: Lightbulb,
  message: MessageSquare,
  chat: MessageCircle,
  clapperboard: Clapperboard,
  usercheck: UserCheck,
  store: Store,
  dashboard: LayoutDashboard,
  click: MousePointerClick,
  plug: Plug,
  bot: Bot,
  file: FileText,
  chart: BarChart3,
  globe: Globe,
  database: Database,
  headphones: Headphones,
  building: Building2,
  shield: ShieldCheck,
  calendar: CalendarCheck,
};

export default function PricingCards({
  tiers,
  footnote,
  hook,
  featuredLabel = '추천',
}: {
  tiers: PricingTier[];
  footnote?: string;
  hook?: CrossSell;
  /** featured 티어 배지 문구 (콘텐츠="추천" / 광고 그로스="가장 인기" — CEO 확정 2026-07-20) */
  featuredLabel?: string;
}) {
  const cols =
    tiers.length === 2
      ? 'md:grid-cols-2'
      : tiers.length === 4
        ? 'md:grid-cols-4'
        : 'md:grid-cols-3';

  return (
    <div className="max-w-[1080px] mx-auto">
      <div className={`grid grid-cols-1 ${cols} border border-border-default`}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            className={`relative p-8 flex flex-col border-r border-border-default last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0 max-md:px-6 ${
              tier.featured ? 'bg-white' : 'bg-[#fafafa]'
            }`}
          >
            {/* 플랜명 + 인라인 아웃라인 배지 (Vercel "Pro [POPULAR]" 문법. 상단 액센트 바 = CEO 제거 확정 2026-07-20) */}
            <div className="flex items-center gap-2.5 mb-6">
              <h3 className="text-[18px] font-semibold text-text-primary tracking-[-0.01em]">
                {tier.name}
              </h3>
              {tier.featured && (
                <span className="border border-[#171717] text-[11px] font-semibold text-text-primary px-2 py-[2px] tracking-[0.08em] whitespace-nowrap">
                  {featuredLabel}
                </span>
              )}
            </div>

            {/* 가격 초대형 + 단위 작게 (4열은 카드 폭이 좁아 한 단계 축소 — "원/월" 줄꺾임 방지) */}
            <div className="mb-5 whitespace-nowrap">
              <span
                className={`font-extrabold text-text-primary tracking-[-0.03em] leading-none ${
                  tiers.length === 4 ? 'text-[clamp(24px,2.2vw,32px)]' : 'text-[clamp(30px,3vw,42px)]'
                }`}
                style={{ fontFamily: 'var(--font-en)' }}
              >
                {tier.price}
              </span>
              {tier.priceUnit && (
                <span className="text-[13px] text-text-body ml-1.5">{tier.priceUnit}</span>
              )}
            </div>

            {/* 설명 2줄 (Vercel desc 문법) + 얇은 구분선 */}
            <p className="text-[15px] text-[#4f4f4f] leading-[1.55] min-h-[46px]">{tier.tagline}</p>
            <div className="border-b border-border-light my-6" />

            {/* 상속 문구 + 기능(라인 아이콘) */}
            <div className="flex-1">
              {tier.inherits && (
                <p className="text-[14px] text-text-body mb-4">{tier.inherits}</p>
              )}
              <ul className="flex flex-col gap-[14px]">
                {tier.features.map((feat, j) => {
                  const Icon = ICONS[feat.icon] ?? Layers;
                  return (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-[14px] text-[#333] leading-[1.5]"
                    >
                      <Icon className="w-[17px] h-[17px] shrink-0 mt-[2px] text-text-primary" strokeWidth={1.6} />
                      {feat.text}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* CTA = 맨 아래 좌측 pill (주력 = 다크 필 / 나머지 = 아웃라인) */}
            <div className="mt-8">
              <Link
                href={tier.cta.href}
                className={`rounded-pill inline-flex items-center justify-center h-[44px] px-6 text-[14px] font-semibold transition-all ${
                  tier.featured
                    ? 'bg-[#171717] text-white hover:bg-[#333]'
                    : 'bg-white text-text-primary border border-border-hover hover:border-[#171717]'
                }`}
              >
                {tier.cta.text}
              </Link>
              {tier.cta.sub && (
                <p className="text-[12px] text-text-muted mt-3">{tier.cta.sub}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {footnote && (
        <p className="text-[13px] text-text-body text-center mt-7">{footnote}</p>
      )}

      {hook && (
        <p className="text-[14px] text-text-body text-center mt-4">
          {hook.text}{' '}
          <Link href={hook.cta.href} className="text-accent font-medium hover:underline">
            {hook.cta.text} &rarr;
          </Link>
        </p>
      )}
    </div>
  );
}
