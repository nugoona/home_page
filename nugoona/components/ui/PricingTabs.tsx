'use client';

import { useState } from 'react';
import PricingCards from '@/components/ui/PricingCards';
import type { PricingTier } from '@/lib/content/types';

/**
 * 요금표 제품 탭 — 누구나 콘텐츠 / 누구나 광고 (사장님 낙점 2026-09-18, 시안 3번)
 *
 * 【왜 탭인가】사장님 판단: "누구나 광고 요금을 바로 알고 싶은 사람은 **스크롤을 안 해도** 되고,
 *   그렇게 하는 게 **확실히 더 위계가 있어 보인다**." 실제로 블록을 위아래로 쌓으면(구 1안)
 *   모바일에서 광고를 보려면 콘텐츠 카드 3장을 지나야 한다. 탭은 그 거리를 한 번의 누름으로 줄인다.
 *   탭은 "제품을 고른다 → 플랜을 본다"는 2단 구조를 화면에 드러낸다(나열이 아니라 위계).
 *
 * 【⚠ 반드시 지킬 것 — 숨기는 방식】
 *   선택 안 된 탭을 **조건부 렌더로 빼면 안 된다.** 그러면 HTML에 아예 없어서
 *   ①검색엔진이 광고 요금을 못 읽고 ②브라우저 페이지 내 검색(Ctrl+F)으로 "199,000"을 못 찾는다.
 *   → 둘 다 그려두고 `hidden`으로 화면에서만 감춘다. 요금은 사람들이 찾아보는 정보다.
 *
 * 【디자인 근거】탭 머리 = NC/NA 로고 + 제품명 (DESIGN §1 "제품 표기 = 로고 + 제품명",
 *   §8.17 "로고는 작게 쓰지 말 것"). 활성 표시 = 2px 검정 밑줄, 비활성 = 흐림.
 *   ⛔ 색·그림자로 구분하지 않는다(§8.17 색 3개·블러 금지).
 */

type Product = { key: string; logo: string; name: string; note: string; tiers: PricingTier[]; featuredLabel?: string };

export default function PricingTabs({ products }: { products: Product[] }) {
  const [active, setActive] = useState(products[0]?.key);

  return (
    <div className="mx-auto max-w-[1080px]">
      {/* 탭 머리 */}
      <div className="flex gap-0 border-b border-border-default" role="tablist">
        {products.map((p) => {
          const on = p.key === active;
          return (
            <button
              key={p.key}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`pricing-panel-${p.key}`}
              onClick={() => setActive(p.key)}
              className={`flex items-center gap-3 px-7 py-4 text-left transition-opacity max-md:gap-2.5 max-md:px-4 ${
                on ? '' : 'opacity-45 hover:opacity-75'
              }`}
              style={{ borderBottom: on ? '2px solid #171717' : '2px solid transparent', marginBottom: '-1px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo} alt="" width={34} height={34} className="shrink-0 max-md:h-7 max-md:w-7" style={{ width: 34, height: 34 }} />
              <span className="min-w-0">
                <span className="block text-[16px] font-bold tracking-[-0.02em] text-text-primary max-md:text-[13.5px]">{p.name}</span>
                <span className="block text-[12.5px] font-medium text-text-muted max-md:text-[11.5px]">{p.note}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* 내용 — 전부 렌더하고 비활성만 hidden (위 주석의 이유) */}
      {products.map((p) => (
        <div key={p.key} id={`pricing-panel-${p.key}`} role="tabpanel" hidden={p.key !== active} className="mt-8">
          <PricingCards tiers={p.tiers} featuredLabel={p.featuredLabel} />
        </div>
      ))}
    </div>
  );
}
