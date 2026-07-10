# SPEC: 월간 NGN 리포트 사이드바 (Monthly Report)

> **1:1 Clone 대상** — Flask 대시보드 우측 사이드바 월간 리포트 뷰어
> **Flask 원본 HTML**: `ngn_wep/dashboard/templates/components/monthly_report_modal.html` (290 lines)
> **Flask JS**: `ngn_wep/dashboard/static/js/monthly_report.js` (2602 lines)
> **Flask CSS**: `ngn_wep/dashboard/static/css/monthly_report.css` (2014 lines)
> **Flask 핸들러**: `ngn_wep/dashboard/handlers/data_handler.py` (route: `/monthly_report`, `/monthly_report/check_new`)
> **진입점**: `ngn_wep/dashboard/templates/index.html` (토글 버튼 + 모달 include)
> **검증 업체**: piscess
> **Version**: 1.0

---

## 페이지 개요

월간 NGN 리포트는 대시보드 우측에서 슬라이드 인하는 사이드바 형태의 리포트 뷰어이다.
매월 1일 오전 7시 5분에 GCS 버킷에 생성된 스냅샷 JSON을 불러와 9개 섹션으로 렌더링한다.
성능 최적화를 위해 Section 1-2는 즉시 렌더링, Section 3-9는 Intersection Observer 기반 Lazy Loading을 적용한다.

### 주요 기능 요약

| # | 기능 | 설명 |
|---|------|------|
| 1 | **사이드바 열기/닫기** | 우측 하단 토글 버튼 클릭 → 사이드바 슬라이드 인/아웃 (300ms 트랜지션) |
| 2 | **NEW 배지** | GCS 파일 수정 시간과 localStorage 마지막 조회 시간 비교 → 미확인 데이터 시 빨간 dot 배지 |
| 3 | **데이터 캐시** | `Map` 기반 메모리 캐시 (key: `{company}-{year}-{month}`) |
| 4 | **로딩 프로그레스 바** | 0→100% 점진적 로딩 (fetch 전 30%까지 시뮬레이션) |
| 5 | **Section 1: 지난달 매출 분석** | 스코어카드 3개 (매출, 주문수, 객단가) + 스파크라인 SVG + AI 분석 |
| 6 | **Section 2: 주요 유입 채널** | GA4 Top 5 채널 표 (유입수, 유입비중, 이탈률) + AI 분석 |
| 7 | **Section 3: 고객 방문 및 구매 여정** | 깔때기 차트 (유입→장바구니→주문) + AI 분석 |
| 8 | **Section 4: 자사몰 베스트 상품 성과** | 탭(구매/조회) + 가로 막대 그래프 Top 5 + AI 분석 |
| 9 | **Section 5: 시장 트렌드 확인 (29CM)** | 카테고리 탭 + 상품 카드 그리드 Top 5 + 경쟁 상품 표 + AI 분석 |
| 10 | **Section 6: 매체 성과 및 효율 진단** | 탭(전환/유입) + 소재 랭킹 리스트 Top 10 + AI 분석 |
| 11 | **Section 7: 시장 트렌드와 자사몰 비교** | 통합 비교표 + 좌우 AI 분석 (29CM vs 자사몰) |
| 12 | **Section 8: 익월 목표 설정 및 시장 전망** | 작년 동월/익월 매출 + 증감률 카드 3개 + AI 분석 |
| 13 | **Section 9: 데이터 기반 전략 액션 플랜** | 전략 카드 그리드 (3열) + 마크다운 렌더링 |
| 14 | **마크다운 렌더링** | `marked.js` + `DOMPurify` 기반 AI 분석 텍스트 변환 |
| 15 | **Lazy Loading** | Intersection Observer (threshold: 0.1) Section 3-9 지연 렌더링 |

---

## 데이터 플로우 개요

```
[REPORT 버튼 클릭]
  ├─ getSelectedCompany() → accountFilter에서 업체명 확인
  ├─ companyName 없으면 토스트 "업체를 먼저 선택해주세요" → return
  ├─ hideMonthlyReportNewBadge() → NEW 배지 제거
  ├─ sidebar.classList.remove("hidden") → 사이드바 표시
  ├─ sidebar.classList.add("active") → 슬라이드 인 트랜지션
  ├─ 전월 날짜 계산 (현재 기준 -1개월)
  ├─ localStorage에 마지막 조회 시간 저장
  │   └─ key: monthlyReportLastViewed_{userId}_{company}_{year}_{month}
  └─ loadMonthlyReport(companyName, year, month)
      ├─ 캐시 확인 (reportCache.has(cacheKey))
      │   └─ 캐시 히트 → renderAllSections() → return
      ├─ 로딩 프로그레스 바 초기화 (0%)
      ├─ 점진적 로딩 시뮬레이션 (0→30%, 100ms 간격)
      ├─ POST /dashboard/monthly_report
      │   └─ body: { company_name, year, month }
      ├─ 응답 처리 (50% → 70% → 85% → 100%)
      ├─ reportCache.set(cacheKey, data)
      ├─ updateReportHeader()
      │   └─ "{year}.{month} 월간 NGN 리포트 - {COMPANY}"
      ├─ renderAllSections(data)
      │   ├─ renderSection1(data) ← 즉시
      │   ├─ renderSection2(data) ← 즉시
      │   └─ setupLazySectionRendering(data) ← Section 3-9
      │       └─ IntersectionObserver (threshold: 0.1)
      │           ├─ section-3-funnel → renderSection3(data)
      │           ├─ section-4-products → renderSection4(data)
      │           ├─ section-5-market-trend → renderSection5(data)
      │           ├─ section-6-ads → renderSection6(data)
      │           ├─ section-7-comparison → renderSection7(data)
      │           ├─ section-8-forecast → renderSection8(data)
      │           └─ section-9-strategy → renderSection9(data)
      └─ 300ms 후 섹션 display: block 전환

[페이지 로드 시]
  └─ checkAndShowNewBadge()
      └─ POST /dashboard/monthly_report/check_new
          └─ body: { company_name, year, month }
          └─ 응답 → snapshot_updated vs localStorage 비교
              └─ 새 데이터 → showMonthlyReportNewBadge()

[사이드바 닫기]
  ├─ 닫기 버튼 (×) 클릭
  ├─ ESC 키 누름
  └─ sidebar.classList.remove("active") → 300ms 후 hidden 추가
```

---

## CSS 변수 / 디자인 토큰

월간 리포트는 **화이트 테마** (대시보드 본체와 동일)를 사용하며, 별도 CSS 변수를 정의하지 않는다.
아래는 사용되는 핵심 색상 토큰이다.

```
── 브랜드 / 강조 ──
#8B1A1A          사이드바 헤더 배경 (짙은 적갈색)
#d94538          토글 버튼 배경 (적색)
#b8382d          토글 버튼 hover
#003366          주요 강조색 (섹션 제목, 랭킹 배지, 차트 바, 탭 active)
#004488          링크 버튼 hover
#2563eb          섹션 7 비교표 헤더 배경 (진한 파란색)

── 텍스트 ──
#212529          기본 텍스트
#495057          AI 분석 텍스트, 표 셀
#868E96          레이블, 보조 텍스트
#344054          마크다운 본문 단락

── 상태 ──
#28a745          상승 (green) — 스파크라인, 증감률
#dc3545 / #DC3545  하락 (red) — 스파크라인, 증감률
#0066CC          상승 (blue) — 스코어카드 변화율, 시장 비교
#ef4444          NEW 배지 dot

── 배경 ──
#ffffff          카드 배경, 표 배경
#F8F9FA          AI 분석 배경, 입력 배경, 빈 상태, 탭 미선택
#E9ECEF          구분선, hover 배경, 스켈레톤 base
#F1F3F5          스켈레톤 highlight
#f8f9fa          표 헤더 배경 (섹션 7 첫 번째 열)

── 차트 ──
#1e293b          깔때기 바 첫 번째 (유입수)
#8b5cf6          깔때기 바 두 번째 (장바구니)
#ec4899          깔때기 바 세 번째 (주문)
linear-gradient(90deg, #6366f1, #8b5cf6)  막대 그래프 바

── 기타 ──
linear-gradient(90deg, #003366, #0066CC)  로딩 프로그레스 바
linear-gradient(135deg, #667eea, #764ba2)  섹션 5 제목 박스
#374151          경쟁 상품 표 헤더, 더보기 버튼

── ⚠️ index.html 색상 오버라이드 ──
토글 버튼(.monthly-report-toggle-btn)은 monthly_report.css에서 #d94538(적색)으로 정의되지만,
index.html에서 아래 스타일로 파란색 그라데이션으로 오버라이드한다:
  .monthly-report-toggle-btn {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
  }
```

---

## 레이아웃 구조

```
── 토글 버튼 (position:fixed, bottom:20px, right:0, z-index:1500) ──
#openMonthlyReportBtn (.monthly-report-toggle-btn)
  ├── writing-mode: vertical-rl, padding: 36px 14px, 12px font
  ├── <span>REPORT</span>
  └── .new-badge (absolute, top:-6px, left:-6px, 12x12px dot, pulse 2s)

── 사이드바 래퍼 (position:fixed, top:20px, right:0, z-index:2000) ──
#monthlyReportModal (.monthly-report-sidebar-wrapper)
  ├── width: 1600px, min-width: 1600px, max-width: 95vw
  ├── max-height: calc(100vh - 40px)
  ├── transform: translateX(100%) → active: translateX(0%)
  ├── border-radius: 12px 0 0 12px (좌상/좌하 라운드)
  ├── transition: transform 0.3s ease-in-out
  │
  ├── .monthly-report-header-bar (sticky top:0, z-index:11)
  │   ├── bg: #8B1A1A, h:60px, padding: 12px 16px
  │   ├── .monthly-report-header-title
  │   │   ├── #monthlyReportTitle (20px, bold, white)
  │   │   │   └── "{year}.{month} 월간 NGN 리포트 - {COMPANY}"
  │   │   └── .monthly-report-update-info (12px, white 80%)
  │   │       └── "매월 1일 오전 7시5분 업데이트"
  │   └── #closeMonthlyReportBtn (.monthly-report-close-btn)
  │       └── "×" (32px, 40x40px)
  │
  └── .monthly-report-sidebar-content (padding:24px, overflow-y:auto, flex:1)
      └── #monthlyReportContent (padding:24px)
          ├── #monthlyReportLoading (.monthly-report-loading)
          │   └── .loading-progress-wrapper (max-width:400px)
          │       ├── #loadingProgressBar (h:8px, gradient bar)
          │       └── .loading-text "리포트를 불러오는 중... " #loadingPercent "0%"
          │
          ├── Section 1 (.section-1-key-metrics) ← margin-bottom:48px
          │   ├── h3.section-title "1. 지난달 매출 분석"
          │   └── .section-content-wrapper (grid: 1fr 40%, gap:32px)
          │       ├── .section-main
          │       │   └── #section1Scorecard (.scorecard-grid, grid: 3col, gap:20px)
          │       │       ├── .scorecard-item (border:1px solid 0.08, radius:8px, pad:20px)
          │       │       │   ├── .scorecard-label (14px, #868E96)
          │       │       │   ├── .scorecard-value (24px, bold, #212529)
          │       │       │   ├── .scorecard-prev (12px, #868E96) "전월: {value}"
          │       │       │   ├── .scorecard-change.{up|down} (14px, bold)
          │       │       │   │   └── "▲/▼ +/-N% (+/-차이)"
          │       │       │   └── .scorecard-sparkline (mt:12px, pt:12px, border-top)
          │       │       │       ├── .sparkline-label (11px) "{startMonth} ~ {endMonth}"
          │       │       │       └── SVG polyline (width:100%, h:30px)
          │       │       ├── [매출 카드]
          │       │       └── [주문 건수 카드, 객단가 카드]
          │       └── .section-ai-analysis (bg:#F8F9FA, radius:8px, pad:20px, border-left:3px #003366)
          │           └── #section1AiAnalysis
          │
          ├── Section 2 (.section-2-channels)
          │   ├── h3.section-title "2. 주요 유입 채널"
          │   └── .section-content-wrapper
          │       ├── .section-main
          │       │   └── #section2ChannelsTable (.channels-table-wrapper)
          │       │       └── table.channels-table
          │       │           ├── thead (bg:#003366, white text)
          │       │           │   └── tr: 채널 | 유입수 | 유입비중 | 이탈률
          │       │           └── tbody (Top 5 행)
          │       └── .section-ai-analysis → #section2AiAnalysis
          │
          ├── Section 3 (.section-3-funnel) ← Lazy Loading
          │   ├── h3.section-title "3. 고객 방문 및 구매 여정"
          │   └── .section-content-wrapper
          │       ├── .section-main
          │       │   └── #section3Funnel (.funnel-chart-wrapper)
          │       │       └── .funnel-item × 3
          │       │           ├── .funnel-label-row
          │       │           │   ├── .funnel-label (14px, bold)
          │       │           │   └── .funnel-conversion (12px) "전환율: N%"
          │       │           └── .funnel-bar-wrapper (h:40px, bg:#F8F9FA, radius:8px)
          │       │               └── .funnel-bar (width:N%, bg:color)
          │       │                   └── .funnel-value-inside (white) 또는
          │       │               .funnel-value-outside (#212529) ← 바 밖
          │       └── .section-ai-analysis → #section3AiAnalysis
          │
          ├── Section 4 (.section-4-products) ← Lazy Loading
          │   ├── h3.section-title "4. 자사몰 베스트 상품 성과"
          │   └── .section-content-wrapper
          │       ├── .section-main
          │       │   ├── .products-tabs-wrapper
          │       │   │   └── #section4Tabs (.products-tabs, flex, gap:8px)
          │       │   │       ├── button.products-tab-btn.active [data-tab="sales"] "구매"
          │       │   │       └── button.products-tab-btn [data-tab="views"] "조회"
          │       │   └── #section4BarChart (.bar-chart-wrapper)
          │       │       └── .bar-chart-item × 5
          │       │           ├── .bar-chart-label-row (flex, gap:12px)
          │       │           │   ├── .bar-chart-rank (24x24px circle, bg:#003366)
          │       │           │   ├── .bar-chart-name (14px, 2-line clamp)
          │       │           │   └── .bar-chart-value (14px, bold)
          │       │           └── .bar-chart-bar-wrapper (h:32px, bg:#F8F9FA)
          │       │               └── .bar-chart-bar (gradient #6366f1→#8b5cf6)
          │       └── .section-ai-analysis → #section4AiAnalysis
          │
          ├── Section 5 (.section-5-market-trend) ← Lazy Loading
          │   └── .section-main-full (전폭 사용)
          │       ├── h3.section-title "5. 시장 트렌드 확인 (29CM)"
          │       ├── .market-trend-tabs-wrapper
          │       │   └── #section5Tabs (.market-trend-tabs, flex, gap:8px)
          │       │       └── 6 buttons: 전체 | 아우터 | 상의 | 니트 | 바지 | 스커트
          │       ├── .market-trend-content-wrapper
          │       │   └── #section5MarketTrend (.market-trend-grid-compact, flex)
          │       │       ├── [prev nav button] (40x40px circle)
          │       │       ├── .market-trend-cards-container (grid:5col, gap:16px)
          │       │       │   └── .market-trend-card-compact × 5
          │       │       │       ├── .market-trend-rank-badge (abs, "Rank N")
          │       │       │       ├── .market-trend-image-wrapper-compact (aspect:1)
          │       │       │       │   ├── .image-skeleton (skeleton loading)
          │       │       │       │   └── img.market-trend-image-compact (lazy)
          │       │       │       └── .market-trend-info-compact (pad:12px)
          │       │       │           ├── .market-trend-brand-compact (11px)
          │       │       │           ├── .market-trend-name-compact (13px, 2-line)
          │       │       │           ├── .market-trend-price-compact (14px, bold, #003366)
          │       │       │           └── a.market-trend-link-btn (bg:#003366) "바로가기"
          │       │       └── [next nav button]
          │       └── .section-ai-analysis-full
          │           ├── #section5AiAnalysis (AI 분석)
          │           └── #section5CompetitorsTable (display:none → block)
          │               ├── h4.section5-title-box "경쟁 상품" (gradient 배지)
          │               ├── div (max-h:400px, overflow-y, border)
          │               │   └── table.competitors-table
          │               │       ├── thead (sticky, bg:#374151, white)
          │               │       │   └── th: #sortBrandHeader "업체명⇅"
          │               │       │       | "상품명"
          │               │       │       | #sortRankHeader "순위⇅"
          │               │       │       | "URL"
          │               │       └── tbody #section5CompetitorsTableBody
          │               └── #section5CompetitorsShowMore (.competitors-show-more-btn)
          │
          ├── Section 6 (.section-6-ads) ← Lazy Loading
          │   ├── h3.section-title "6. 매체 성과 및 효율 진단"
          │   └── .section-content-wrapper
          │       ├── .section-main
          │       │   └── .ads-tabs-wrapper
          │       │       ├── .ads-tabs (flex, gap:8px, border-bottom)
          │       │       │   ├── button.ads-tab-btn.active [data-tab="conversion"] "전환"
          │       │       │   └── button.ads-tab-btn [data-tab="traffic"] "유입"
          │       │       └── #section6AdsContent (.ads-content)
          │       │           ├── .ads-tab-content.active [data-content="conversion"]
          │       │           │   └── .ads-ranking-item × 10
          │       │           │       ├── .ads-ranking-rank (32x32px circle)
          │       │           │       └── .ads-ranking-info
          │       │           │           ├── .ads-ranking-name (14px)
          │       │           │           └── .ads-ranking-metrics (12px, #868E96)
          │       │           │               └── "전환: N건 • ROAS: N% • {spend}"
          │       │           └── .ads-tab-content [data-content="traffic"]
          │       └── .section-ai-analysis → #section6AiAnalysis
          │
          ├── Section 7 (.section-7-comparison) ← Lazy Loading
          │   ├── h3.section-title "7. 시장 트렌드와 자사몰 비교"
          │   └── .section-main-full
          │       ├── .comparison-table-wrapper
          │       │   └── table.comparison-table-unified
          │       │       ├── thead (bg:#2563eb, white)
          │       │       │   └── tr: 구분 | 29CM 시장 | 자사몰
          │       │       └── tbody #section7ComparisonTableBody
          │       │           └── tr × N (동적 생성)
          │       └── .section-7-analysis-boxes (grid:2col, gap:24px, mt:24px)
          │           ├── .section-7-analysis-left
          │           │   ├── .ai-analysis-label "29CM 시장 분석"
          │           │   └── #section7AnalysisLeft
          │           └── .section-7-analysis-right
          │               ├── .ai-analysis-label "자사몰 분석"
          │               └── #section7AnalysisRight
          │
          ├── Section 8 (.section-8-forecast) ← Lazy Loading
          │   ├── h3.section-title "8. 익월 목표 설정 및 시장 전망"
          │   └── .section-content-wrapper
          │       ├── .section-main
          │       │   └── #section8Forecast (.forecast-cards-grid, grid:3col, gap:20px)
          │       │       ├── .forecast-card (border, radius:8px, pad:20px)
          │       │       │   ├── .forecast-label (14px, #868E96)
          │       │       │   │   └── "작년 동월 매출 ({YYYY-MM})"
          │       │       │   └── .forecast-value-large (24px, bold)
          │       │       ├── .forecast-card "작년 익월 매출 ({YYYY-MM})"
          │       │       └── .forecast-card "작년 매출 증감"
          │       │           └── .forecast-growth-positive / .forecast-growth-negative
          │       └── .section-ai-analysis → #section8AiAnalysis
          │
          └── Section 9 (.section-9-strategy) ← Lazy Loading
              └── .section-main-full
                  ├── h3.section-title "9. 데이터 기반 전략 액션 플랜"
                  └── #section9StrategyCards (.strategy-cards-grid, grid:3col, gap:20px)
                      └── .strategy-card × N (border, radius:8px, pad:24px)
                          ├── .strategy-card-header (flex, gap:12px, border-bottom)
                          │   ├── .strategy-card-icon (28px emoji)
                          │   └── h4.strategy-card-title (18px, bold)
                          └── .strategy-card-content.markdown-content
```

---

## JS 전역 상태 변수

```javascript
// ─── 캐시 ───
const reportCache = new Map();           // key: "{company}-{year}-{month}", value: snapshot JSON

// ─── 현재 리포트 상태 ───
let currentReportData = null;            // 현재 로드된 스냅샷 전체 JSON
let currentCompany = null;               // 현재 선택된 업체명 (예: "piscess")
let currentYear = null;                  // 현재 리포트 연도 (예: 2026)
let currentMonth = null;                 // 현재 리포트 월 (예: 1, 전월 기준)

// ─── 섹션 5 페이지네이션 ───
let section5Data = null;                 // 29CM 아이템 배열 (items[])
let section5CurrentPage = 1;             // 현재 페이지 (5개씩 페이징)

// ─── 섹션 5 경쟁 상품 정렬 ───
let competitorsListGlobal = [];          // 경쟁 상품 전체 배열
let competitorsSortOrder = 'asc';        // 업체명 정렬 순서 ('asc' | 'desc')
let competitorsRankSortOrder = 'asc';    // 순위 정렬 순서 ('asc' | 'desc')

// ─── 외부 의존 (index.html에서 주입) ───
// let currentUserId;                    // 로그인한 사용자 ID (localStorage 키에 사용)
```

---

## HTML 요소 전체 맵

### 토글 버튼 (index.html)

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#openMonthlyReportBtn` | div | 우측 하단 고정 토글 버튼 ("REPORT") | 항상 표시 |
| `.monthly-report-toggle-btn` | class | 토글 버튼 스타일 | fixed, bottom:20px, right:0 |
| `.new-badge` | span | NEW 표시 빨간 dot 배지 (동적 추가) | 없음 → 동적 추가 |

### 사이드바 래퍼

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#monthlyReportModal` | div | 사이드바 전체 래퍼 | hidden, translateX(100%) |
| `.monthly-report-sidebar-wrapper` | class | 사이드바 스타일 | fixed, 1600px width |
| `.monthly-report-header-bar` | div | 사이드바 헤더 (짙은 적갈색) | sticky top:0 |
| `#monthlyReportTitle` | span | 리포트 제목 텍스트 | "월간 NGN 리포트" |
| `.monthly-report-update-info` | span | 업데이트 시간 텍스트 | "매월 1일 오전 7시5분 업데이트" |
| `#closeMonthlyReportBtn` | button | 닫기 버튼 (×) | - |
| `.monthly-report-sidebar-content` | div | 스크롤 가능 본문 영역 | overflow-y:auto |
| `#monthlyReportContent` | div | 섹션 컨테이너 | padding:24px |

### 로딩 상태

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#monthlyReportLoading` | div | 로딩 상태 래퍼 | display:block → none |
| `#loadingProgressBar` | div | 프로그레스 바 (0→100%) | width:0% |
| `#loadingPercent` | span | 퍼센트 텍스트 | "0%" |

### Section 1: 지난달 매출 분석

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.section-1-key-metrics` | section | 섹션 1 컨테이너 | display:none → block |
| `#section1Scorecard` | div | 스코어카드 그리드 (3열) | 빈 → 동적 생성 |
| `#section1AiAnalysis` | div | AI 분석 텍스트 영역 | skeleton → 마크다운 |

### Section 2: 주요 유입 채널

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.section-2-channels` | section | 섹션 2 컨테이너 | display:none → block |
| `#section2ChannelsTable` | div | 채널 표 래퍼 | 빈 → 동적 생성 |
| `#section2AiAnalysis` | div | AI 분석 텍스트 영역 | skeleton |

### Section 3: 고객 방문 및 구매 여정

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.section-3-funnel` | section | 섹션 3 컨테이너 | display:none → block |
| `#section3Funnel` | div | 깔때기 차트 래퍼 | 빈 → 동적 생성 |
| `#section3AiAnalysis` | div | AI 분석 텍스트 영역 | skeleton |

### Section 4: 자사몰 베스트 상품 성과

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.section-4-products` | section | 섹션 4 컨테이너 | display:none → block |
| `#section4Tabs` | div | 탭 버튼 그룹 (구매/조회) | 구매 active |
| `.products-tab-btn` | button | 개별 탭 버튼 | data-tab="sales" / "views" |
| `#section4BarChart` | div | 가로 막대 그래프 래퍼 | 빈 → 동적 생성 |
| `#section4AiAnalysis` | div | AI 분석 텍스트 영역 | skeleton |

### Section 5: 시장 트렌드 확인 (29CM)

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.section-5-market-trend` | section | 섹션 5 컨테이너 | display:none → block |
| `#section5Tabs` | div | 카테고리 탭 그룹 (6개) | 전체 active |
| `.market-trend-tab-btn` | button | 개별 탭 버튼 | data-tab="전체/아우터/상의/..." |
| `#section5MarketTrend` | div | 상품 카드 그리드 | 빈 → 동적 생성 |
| `#section5AiAnalysis` | div | AI 분석 텍스트 영역 | skeleton |
| `#section5CompetitorsTable` | div | 경쟁 상품 표 래퍼 | display:none |
| `#sortBrandHeader` | th | 업체명 정렬 헤더 (클릭 가능) | ⇅ |
| `#sortRankHeader` | th | 순위 정렬 헤더 (클릭 가능) | ⇅ |
| `#section5CompetitorsTableBody` | tbody | 경쟁 상품 표 본문 | 빈 → 동적 생성 |
| `#section5CompetitorsShowMore` | button | "더보기" 버튼 | display:none |

### Section 6: 매체 성과 및 효율 진단

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.section-6-ads` | section | 섹션 6 컨테이너 | display:none → block |
| `.ads-tab-btn` | button | 전환/유입 탭 버튼 | data-tab="conversion" / "traffic" |
| `#section6AdsContent` | div | 소재 랭킹 리스트 래퍼 | 빈 → 동적 생성 |
| `.ads-tab-content` | div | 탭별 콘텐츠 | data-content="conversion" / "traffic" |
| `#section6AiAnalysis` | div | AI 분석 텍스트 영역 | skeleton |

### Section 7: 시장 트렌드와 자사몰 비교

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.section-7-comparison` | section | 섹션 7 컨테이너 | display:none → block |
| `#section7ComparisonTableBody` | tbody | 비교표 본문 | 빈 → 동적 생성 |
| `#section7AnalysisLeft` | div | 29CM 시장 분석 텍스트 | skeleton |
| `#section7AnalysisRight` | div | 자사몰 분석 텍스트 | skeleton |

### Section 8: 익월 목표 설정 및 시장 전망

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.section-8-forecast` | section | 섹션 8 컨테이너 | display:none → block |
| `#section8Forecast` | div | 전망 카드 그리드 (3열) | 빈 → 동적 생성 |
| `#section8AiAnalysis` | div | AI 분석 텍스트 영역 | skeleton |

### Section 9: 데이터 기반 전략 액션 플랜

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.section-9-strategy` | section | 섹션 9 컨테이너 | display:none → block |
| `#section9StrategyCards` | div | 전략 카드 그리드 (3열) | 빈 → 동적 생성 |

---

## 섹션별 상세 스펙

### 사이드바 열기/닫기 메커니즘

```
── 열기 ──
1. #openMonthlyReportBtn 클릭
2. getSelectedCompany() → accountFilter select의 value
3. value가 없거나 "all"이면 토스트 표시 → return
4. hideMonthlyReportNewBadge() → .new-badge 제거
5. sidebar.classList.remove("hidden")  → display 복원
6. sidebar.classList.add("active")     → translateX(0%) 트랜지션
7. 전월 날짜 계산: new Date(now.getFullYear(), now.getMonth() - 1, 1)
8. localStorage 저장: monthlyReportLastViewed_{userId}_{company}_{year}_{month} = Date.now()
9. loadMonthlyReport(companyName, year, month)

── 닫기 ──
1. #closeMonthlyReportBtn 클릭 또는 ESC 키
2. sidebar.classList.remove("active")  → translateX(100%) 트랜지션
3. 300ms setTimeout 후:
   - sidebar.classList.add("hidden")   → display:none
   - currentReportData = null
```

### 열기 애니메이션 CSS

```
.monthly-report-sidebar-wrapper {
  transform: translateX(100%);       /* 화면 밖 (오른쪽) */
  transition: transform 0.3s ease-in-out;
  visibility: hidden;
  pointer-events: none;
}
.monthly-report-sidebar-wrapper.active {
  transform: translateX(0%);         /* 화면 안으로 슬라이드 */
  visibility: visible;
  pointer-events: auto;
}
.monthly-report-sidebar-wrapper.hidden {
  display: none !important;          /* 완전히 숨김 */
}
```

### NEW 배지 메커니즘

```
[페이지 로드 시]
  ├─ checkAndShowNewBadge()
  │   ├─ getSelectedCompany() → 업체 없으면 return
  │   ├─ 전월 계산
  │   ├─ localStorage에서 마지막 조회 시간 가져오기
  │   ├─ POST /dashboard/monthly_report/check_new
  │   │   └─ 응답: { snapshot_updated: "2026-01-01T00:05:00Z" }
  │   └─ snapshot_updated > lastViewed → showMonthlyReportNewBadge()
  │       └─ <span class="new-badge"> 동적 추가
  │           └─ 12x12px 빨간 dot + pulse 애니메이션 (2s infinite)
  └─ 사이드바 열 때 → hideMonthlyReportNewBadge()
      └─ .new-badge.remove()
      └─ localStorage 업데이트
```

### Section 1: 지난달 매출 분석

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. 지난달 매출 분석                                                  │
├──────────────────────────────────────┬──────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐   │ AI 분석                       │
│ │ 월 매출  │ │주문 건수│ │객단가    │   │ (bg: #F8F9FA)               │
│ │ 24px   │ │ 24px   │ │(AOV)   │   │ (border-left: 3px #003366)  │
│ │ bold   │ │ bold   │ │ 24px   │   │                              │
│ │전월: xx │ │전월: xx │ │전월: xx │   │ 마크다운 렌더링               │
│ │▲+N%    │ │▲+N%    │ │▲+N%    │   │ (section_1_analysis)        │
│ │(+차이)  │ │(+차이)  │ │(+차이)  │   │                              │
│ ├────────┤ ├────────┤ ├────────┤   │                              │
│ │mm~mm   │ │mm~mm   │ │mm~mm   │   │                              │
│ │~~~~SVG │ │~~~~SVG │ │~~~~SVG │   │                              │
│ └────────┘ └────────┘ └────────┘   │                              │
├──────────────────────────────────────┴──────────────────────────────┤
```

**데이터 매핑:**
```
data.facts.mall_sales.this.net_sales      → 당월 매출
data.facts.mall_sales.prev.net_sales      → 전월 매출
data.facts.mall_sales.this.total_orders   → 당월 주문수
data.facts.mall_sales.prev.total_orders   → 전월 주문수
AOV = net_sales / total_orders            → 객단가 (JS 내 계산)
data.facts.comparisons.mall_sales.net_sales_mom.pct → 매출 MoM %
data.facts.comparisons.mall_sales.orders_mom.pct    → 주문 MoM %
data.facts.mall_sales.monthly_13m[]       → 최근 13개월 데이터 (스파크라인 .slice(-6))
  └─ { ym: "YYYY-MM", net_sales, total_orders }
data.signals.section_1_analysis           → AI 분석 텍스트 (마크다운)
```

**스파크라인 SVG 생성:**
```javascript
// SVG polyline: width=100, height=30
// min-max 정규화 → points "x1,y1 x2,y2 ..."
// 색상: 증가(#28a745), 감소(#dc3545)
// stroke-width: 2, stroke-linecap: round
```

### Section 2: 주요 유입 채널

```
┌─────────────────────────────────────┬──────────────────────────────┐
│ 2. 주요 유입 채널                    │ AI 분석                       │
│ ┌───────┬──────┬──────┬──────┐     │                              │
│ │ 채널   │유입수 │유입비중│이탈률 │     │ (section_2_analysis)        │
│ ├───────┼──────┼──────┼──────┤     │                              │
│ │Direct │1,234 │35.2% │42.1% │     │                              │
│ │Google │  892 │25.6% │38.5% │     │                              │
│ │Naver  │  567 │16.3% │45.2% │     │                              │
│ │Meta   │  432 │12.4% │35.8% │     │                              │
│ │Others │  365 │10.5% │50.1% │     │                              │
│ └───────┴──────┴──────┴──────┘     │                              │
└─────────────────────────────────────┴──────────────────────────────┘
```

**데이터 매핑:**
```
data.facts.ga4_traffic.this.top_sources[]   → Top 5 채널
  (fallback: .this.topSources, .this.sources, ga4_traffic.top_sources)
  └─ { source, total_users (or users/value), bounce_rate }
유입비중 = (item.users / total) * 100
data.signals.section_2_analysis             → AI 분석 텍스트
```

### Section 3: 고객 방문 및 구매 여정

```
┌─────────────────────────────────────┬──────────────────────────────┐
│ 3. 고객 방문 및 구매 여정              │ AI 분석                       │
│                                     │                              │
│ 유입수 (GA)            전환율: -     │ (section_3_analysis)        │
│ ██████████████████████████ 15,234   │                              │
│                                     │                              │
│ 장바구니 건수 (GA)     전환율: 12.3% │                              │
│ ████████████  1,876                 │                              │
│                                     │                              │
│ 주문 건수              전환율: 8.5%  │                              │
│ ██████  892                         │                              │
└─────────────────────────────────────┴──────────────────────────────┘
```

**데이터 매핑:**
```
data.facts.ga4_traffic.this.totals.total_users       → 유입수
data.facts.ga4_traffic.this.totals.add_to_cart_users  → 장바구니 건수
data.facts.mall_sales.this.total_orders               → 주문 건수
전환율 = (현 단계 / 이전 단계) * 100

깔때기 색상:
  유입수:     #1e293b (slate-800)
  장바구니:   #8b5cf6 (violet-500)
  주문:       #ec4899 (pink-500)

바 높이: 40px, border-radius: 8px
값이 바 너비의 30% 미만이면 → 값 텍스트를 바 밖에 표시
```

### Section 4: 자사몰 베스트 상품 성과

```
┌─────────────────────────────────────┬──────────────────────────────┐
│ 4. 자사몰 베스트 상품 성과              │ AI 분석                       │
│ [구매] [조회]                        │                              │
│                                     │ (section_4_analysis)        │
│ ① 상품A ────────── 1,234,000원     │                              │
│   ████████████████████████████      │                              │
│ ② 상품B ──────── 892,000원         │                              │
│   ████████████████████             │                              │
│ ③ 상품C ────── 567,000원           │                              │
│   ████████████████                 │                              │
│ ④ 상품D ──── 432,000원             │                              │
│   ████████████                     │                              │
│ ⑤ 상품E ── 365,000원               │                              │
│   ████████                         │                              │
└─────────────────────────────────────┴──────────────────────────────┘
```

**데이터 매핑:**
```
구매 탭:
  data.facts.products.this.rolling.d30.top_products_by_sales[]
    └─ { product_name, sales }

조회 탭:
  data.facts.viewitem.this.top_items_by_view_item[]
    └─ { item_name_normalized, total_view_item }

탭 전환: setupSection4Tabs() → renderSection4ByTab(tab, data)
```

### Section 5: 시장 트렌드 확인 (29CM)

**탭 매핑:**
```
UI 탭명      데이터 tab 필드
──────────   ──────────────
전체         "전체"
아우터       "아우터"
상의         "상의"
니트         "니트웨어"
바지         "바지"
스커트       "스커트"
```

**데이터 매핑:**
```
data.facts["29cm_best"].items[]
  └─ { tab, rank, brand, name, img, price, url, item_url, item_id }

URL 변환 로직:
  product.29cm.co.kr/catalog/{id} → 29cm.co.kr/products/{id}
  item_id만 있으면 → https://29cm.co.kr/products/{item_id}

페이지네이션: 5개씩, 좌우 화살표 네비게이션
```

**경쟁 상품 표:**
```
data.signals.section_5_analysis 에서 "### 경쟁 상품" 섹션 파싱
+ data.facts["29cm_best"].items[] 에서 직접 추출
→ 병합 (AI 파싱 우선, 중복 제거: tabName + rankNumber 기준)
→ 정렬: 전체(0) > 상의(1) > 니트웨어(2) > 바지(3) > 스커트(4)

기본 표시: 3개, "더보기" 버튼으로 전체 확장
업체명/순위 헤더 클릭 → 정렬 토글 (asc ↔ desc)
```

### Section 6: 매체 성과 및 효율 진단

**데이터 매핑:**
```
data.facts.meta_ads_goals.this.top_ads.conversion_top_by_purchases[]
  └─ { ad_name, purchases, spend, roas }
  → 표시: "전환: N건 • ROAS: N% • {spend}"

data.facts.meta_ads_goals.this.top_ads.traffic_top_by_ctr[]
  └─ { ad_name, clicks, spend, ctr }
  → 표시: "클릭: N회 • 클릭률: N% • {spend}"

정렬: 전환 탭은 purchases 내림차순, 유입 탭은 clicks 내림차순
최대 10개
```

### Section 7: 시장 트렌드와 자사몰 비교

**데이터 매핑:**
```
비교표:
  data.signals.section_7_data (JSON 객체)
    └─ { key: { market: "...", company: "..." }, ... }
    → market 값 시도 순서: .market, .trend, .["29cm"], .["29CM"], .market_value, .market_data
    → company 값 시도 순서: .company, .our, .ours, .own, .own_mall, .[company.toLowerCase()], .piscess, .demo

  데이터 없으면 기본 항목 5개:
    주력_아이템, 평균_가격, 핵심_소재, 타겟_고객층, 가격대

AI 분석 (좌우 분리):
  data.signals.section_7_analysis_1 → 29CM 시장 분석 (왼쪽)
  data.signals.section_7_analysis_2 → 자사몰 분석 (오른쪽)
  Fallback: data.signals.section_7_analysis → 패턴 매칭으로 분리
    - "29cm 시장은" / "29CM 시장은" → 시장 분석 시작
    - "자사몰은" / "자사몰" → 자사몰 분석 시작
```

### Section 8: 익월 목표 설정 및 시장 전망

**데이터 매핑:**
```
data.facts.forecast_next_month.mall_sales
  .net_sales_same_month_stats.median   → 작년 동월 매출
  .net_sales_next_month_stats.median   → 작년 익월 매출
  .yoy_growth_pct                      → 작년 매출 증감률

날짜 계산:
  작년 동월: (currentYear - 1) + "-" + currentMonth
  작년 익월: currentMonth === 12 ? currentYear + "-01" : (currentYear - 1) + "-" + (currentMonth + 1)
```

### Section 9: 데이터 기반 전략 액션 플랜

**데이터 매핑:**
```
data.signals.section_9_cards[]         → 구조화된 카드 배열
  └─ { title: "전략 제목", content: "마크다운 내용" }
Fallback: data.signals.section_9_analysis → 원본 텍스트 마크다운 렌더링

카드 아이콘: ['💡', '🎯', '📦', '🚀', '⭐', '🔥'] (인덱스 % 6)

제목 정리:
  - ** 마크다운 제거
  - ### 헤더 제거
  - 이모지 제거
  - [전략 N] 패턴 제거
  - 괄호와 내용 제거
  - HTML 엔티티 디코딩
```

---

## 핵심 함수 흐름

```
initMonthlyReportButton()
  ├─ 이벤트 리스너 등록 (클릭 → openMonthlyReportModal)
  ├─ 중복 클릭 방지 (isProcessing 플래그, 500ms cooldown)
  └─ checkAndShowNewBadge()

openMonthlyReportModal()
  ├─ getSelectedCompany()
  ├─ hideMonthlyReportNewBadge()
  ├─ 사이드바 hidden 해제 + active 추가
  ├─ 전월 날짜 계산
  ├─ localStorage 저장
  └─ loadMonthlyReport(companyName, year, month)

closeMonthlyReportModal()
  ├─ active 제거
  └─ 300ms 후 hidden 추가 + currentReportData = null

loadMonthlyReport(companyName, year, month)
  ├─ 캐시 확인
  ├─ 로딩 UI 표시
  ├─ POST /dashboard/monthly_report
  ├─ 캐시 저장
  ├─ updateReportHeader()
  ├─ renderAllSections(data)
  └─ 섹션 표시 전환

renderAllSections(data)
  ├─ renderSection1(data)      ← 즉시
  ├─ renderSection2(data)      ← 즉시
  └─ setupLazySectionRendering(data)

setupLazySectionRendering(data)
  └─ IntersectionObserver (threshold: 0.1)
      ├─ 7개 섹션 관찰 등록
      ├─ 뷰포트 진입 시 1회 렌더링
      └─ 렌더링 후 unobserve

renderSection1(data)          → 스코어카드 3개 + 스파크라인 + AI
renderSection2(data)          → 채널 표 + AI
renderSection3(data)          → 깔때기 차트 + AI
renderSection4(data)          → 탭 설정 + 막대 그래프 + AI
  └─ setupSection4Tabs(data)
  └─ renderSection4ByTab(tab, data)
renderSection5(data)          → 29CM 카드 + 경쟁 상품 + AI
  └─ setupSection5Tabs(items)
  └─ renderSection5ByTab(tabName, items, page)
  └─ renderSection5AnalysisWithCompetitors(text, items)
      └─ renderCompetitorsTable(competitorsList)
renderSection6(data)          → 소재 랭킹 + AI
  └─ renderAdsRankingList(ads, type)
renderSection7(data)          → 비교표 + 좌우 AI 분석
renderSection8(data)          → 전망 카드 3개 + AI
renderSection9(data)          → 전략 카드 그리드

renderAiAnalysis(elementId, text, isSection5)  ← 공통 AI 분석 렌더링
  └─ marked.parse() → DOMPurify.sanitize() → ** 후처리 제거

renderAiAnalysisForSection7(element, text)     ← 섹션 7 전용

── 헬퍼 ──
getSelectedCompany()                    → #accountFilter에서 선택된 업체명 반환
checkAndShowNewBadge()                  → GCS에서 새 데이터 존재 여부 확인 후 배지 표시
showMonthlyReportNewBadge()             → 토글 버튼에 .new-badge span 동적 추가
hideMonthlyReportNewBadge()             → 토글 버튼에서 .new-badge span 제거
updateLoadingProgress(percent)          → 프로그레스 바 width/text를 percent 값으로 갱신
updateReportHeader(companyName, year, month) → #monthlyReportTitle 텍스트 업데이트

── 유틸리티 ──
formatMoney(value)   → "1,234,000원"
formatNumber(value)  → "1,234"
formatChange(pct)    → "+12.3%"
showToastMonthly(message, type, duration)
```

---

## API 엔드포인트 레퍼런스

### 1. POST /dashboard/monthly_report

월간 리포트 스냅샷 데이터를 GCS 버킷에서 조회한다.

**인증**: `@login_required`

**Request:**
```json
{
  "company_name": "piscess",
  "year": 2026,
  "month": 1
}
```

**Response (성공):**
```json
{
  "status": "success",
  "data": {
    "report_meta": {
      "period_this": { "label": "2026-01" },
      "period_prev": { "label": "2025-12" },
      "period_yoy": { "label": "2025-01" }
    },
    "facts": {
      "mall_sales": {
        "this": {
          "net_sales": 45000000,
          "total_orders": 320
        },
        "prev": {
          "net_sales": 42000000,
          "total_orders": 290
        },
        "yoy": {
          "net_sales": 38000000,
          "total_orders": 250
        },
        "monthly_13m": [
          { "ym": "2025-01", "net_sales": 38000000, "total_orders": 250 },
          { "ym": "2025-02", "net_sales": 35000000, "total_orders": 230 },
          "... (13 months)"
        ]
      },
      "comparisons": {
        "mall_sales": {
          "net_sales_mom": { "pct": 7.1 },
          "orders_mom": { "pct": 10.3 }
        }
      },
      "ga4_traffic": {
        "this": {
          "top_sources": [
            {
              "source": "google",
              "total_users": 5432,
              "bounce_rate": 38.5
            },
            {
              "source": "direct",
              "total_users": 3210,
              "bounce_rate": 42.1
            }
          ],
          "totals": {
            "total_users": 15234,
            "add_to_cart_users": 1876
          }
        }
      },
      "products": {
        "this": {
          "rolling": {
            "d30": {
              "top_products_by_sales": [
                {
                  "product_name": "FW 더블 브레스티드 코트",
                  "sales": 12340000
                }
              ]
            }
          }
        }
      },
      "viewitem": {
        "this": {
          "top_items_by_view_item": [
            {
              "item_name_normalized": "캐시미어 블렌드 니트",
              "total_view_item": 1523
            }
          ]
        }
      },
      "29cm_best": {
        "items": [
          {
            "tab": "전체",
            "rank": 1,
            "brand": "MUSINSA STANDARD",
            "name": "릴랙스드 핏 크루 넥 스웨터",
            "img": "https://img.29cm.co.kr/...",
            "price": 39000,
            "url": "https://product.29cm.co.kr/catalog/2964732",
            "item_id": "2964732"
          }
        ]
      },
      "meta_ads_goals": {
        "this": {
          "top_ads": {
            "conversion_top_by_purchases": [
              {
                "ad_name": "FW 코트 컬렉션_v2",
                "purchases": 45,
                "spend": 350000,
                "roas": 1580.2
              }
            ],
            "traffic_top_by_ctr": [
              {
                "ad_name": "겨울 신상 프로모션",
                "clicks": 892,
                "spend": 120000,
                "ctr": 3.45
              }
            ]
          }
        }
      },
      "forecast_next_month": {
        "mall_sales": {
          "net_sales_same_month_stats": { "median": 38000000 },
          "net_sales_next_month_stats": { "median": 41000000 },
          "yoy_growth_pct": 7.9
        }
      }
    },
    "signals": {
      "section_1_analysis": "## 매출 분석\n지난달 매출은 전월 대비 7.1% 증가...",
      "section_2_analysis": "## 유입 채널 분석\nGoogle 검색이 가장 큰 유입원...",
      "section_3_analysis": "## 구매 여정 분석\n장바구니 전환율이 12.3%로...",
      "section_4_analysis": "## 베스트 상품 분석\nFW 더블 브레스티드 코트가...",
      "section_5_analysis": "## 시장 트렌드\n29CM에서 아우터 카테고리가...\n### 경쟁 상품\n* 브랜드A | 상품A | 전체 TOP1\n* 브랜드B | 상품B | 상의 TOP2",
      "section_6_analysis": "## 매체 성과 분석\n전환 캠페인의 ROAS가...",
      "section_7_data": {
        "주력_아이템": {
          "market": "캐주얼 아우터, 니트웨어",
          "company": "포멀 코트, 재킷"
        },
        "평균_가격": {
          "market": "45,000원~89,000원",
          "company": "120,000원~250,000원"
        },
        "핵심_소재": {
          "market": "폴리에스터, 면",
          "company": "울, 캐시미어"
        }
      },
      "section_7_analysis": "29cm 시장은 캐주얼 아이템이 강세... 자사몰은 프리미엄 소재...",
      "section_7_analysis_1": "29cm 시장은 캐주얼 아이템이 강세...",
      "section_7_analysis_2": "자사몰은 프리미엄 소재 중심으로...",
      "section_8_analysis": "## 익월 전망\n작년 동기 대비 7.9% 성장...",
      "section_9_cards": [
        {
          "title": "프리미엄 니트 라인업 강화",
          "content": "시장 트렌드에 맞춰 니트웨어 카테고리를 확장하고..."
        },
        {
          "title": "Meta 전환 캠페인 최적화",
          "content": "ROAS 1,580%를 기록한 FW 코트 소재를 활용하여..."
        },
        {
          "title": "GA4 유입 채널 다각화",
          "content": "현재 Google/Direct 중심의 유입 구조에서..."
        }
      ],
      "section_9_analysis": "Fallback 원본 텍스트 (section_9_cards가 없을 때 사용)"
    }
  }
}
```

**Response (에러 - 업체 미선택):**
```json
{
  "status": "error",
  "message": "업체를 선택해주세요"
}
```
HTTP Status: 400

**Response (에러 - year/month 미전달):**
```json
{
  "status": "error",
  "message": "year와 month 파라미터가 필요합니다"
}
```
HTTP Status: 400

**Response (에러 - year/month 숫자 변환 실패):**
```json
{
  "status": "error",
  "message": "year와 month는 유효한 숫자여야 합니다"
}
```
HTTP Status: 400

**Response (에러 - 리포트 없음):**
```json
{
  "status": "error",
  "message": "2026년 1월 리포트가 아직 생성되지 않았습니다."
}
```
HTTP Status: 404

**Response (에러 - 서버 오류):**
```json
{
  "status": "error",
  "message": "스냅샷 파일을 읽는 중 오류가 발생했습니다: {error_detail}"
}
```
HTTP Status: 500

**GCS 경로 탐색 순서:**
```
1. ai-reports/monthly/{company_name}/{YYYY-MM}/snapshot.json.gz    (압축, 원본)
2. ai-reports/monthly/{company_name_lower}/{YYYY-MM}/snapshot.json.gz  (압축, 소문자)
3. ai-reports/monthly/{company_name}/{YYYY-MM}/snapshot.json       (비압축, 원본)
4. ai-reports/monthly/{company_name_lower}/{YYYY-MM}/snapshot.json (비압축, 소문자)
5. ai-reports/{company_name}/{YYYY-MM}.json                        (대체 경로, 원본)
6. ai-reports/{company_name_lower}/{YYYY-MM}.json                  (대체 경로, 소문자)
```

**GCS 설정:**
```
PROJECT_ID: "winged-precept-443218-v8" (env: GOOGLE_CLOUD_PROJECT)
GCS_BUCKET: "winged-precept-443218-v8.appspot.com" (env: GCS_BUCKET)
```

---

### 2. POST /dashboard/monthly_report/check_new

GCS 파일의 수정 시간만 확인한다 (파일 다운로드 없이 메타데이터만 조회, 비용 최소화).

**인증**: `@login_required`

**Request:**
```json
{
  "company_name": "piscess",
  "year": 2026,
  "month": 1
}
```

**Response (성공):**
```json
{
  "status": "success",
  "snapshot_updated": "2026-02-01T07:05:12.345678+00:00",
  "snapshot_created": "2026-02-01T07:05:10.123456+00:00"
}
```

**Response (에러 - 리포트 없음):**
```json
{
  "status": "error",
  "message": "2026년 1월 리포트가 아직 생성되지 않았습니다."
}
```
HTTP Status: 404

**⚠️ 참고: year/month null-check 차이**

`/monthly_report/check_new`은 `/monthly_report`와 달리 year/month 파라미터에 대한 명시적 null-check를 수행하지 않는다. `int(data.get("year"))`로 직접 캐스팅하므로, year 또는 month가 None인 경우 `TypeError`가 발생하며 이는 외부 exception handler에서 500 에러로 처리된다.

**GCS 경로 탐색 순서** (check_new 전용, 4개):
```
1. ai-reports/monthly/{company_name}/{YYYY-MM}/snapshot.json.gz
2. ai-reports/monthly/{company_name_lower}/{YYYY-MM}/snapshot.json.gz
3. ai-reports/monthly/{company_name}/{YYYY-MM}/snapshot.json
4. ai-reports/monthly/{company_name_lower}/{YYYY-MM}/snapshot.json
```

---

## 외부 라이브러리 의존성

| 라이브러리 | 용도 | 필수 여부 |
|-----------|------|----------|
| `marked.js` | 마크다운 → HTML 변환 | 선택 (없으면 줄바꿈만 처리) |
| `DOMPurify` | XSS 방지 HTML 정제 | 선택 (없으면 raw HTML 사용) |

**marked 설정:**
```javascript
marked.setOptions({
  breaks: true,    // 줄바꿈 지원
  gfm: true        // GitHub Flavored Markdown (표 지원)
});
```

**DOMPurify 설정 (함수별 차이):**

`ALLOWED_TAGS`는 모든 함수에서 동일:
```javascript
['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
 'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
 'table', 'thead', 'tbody', 'tr', 'th', 'td']
```

`ALLOWED_ATTR` 및 marked 옵션은 함수마다 다르다:

| 함수 | ALLOWED_ATTR | marked 옵션 | 비고 |
|------|-------------|-------------|------|
| `renderAiAnalysis()` | `['class']` | 기본 (gfm: true) | style 속성 불허 |
| `renderAiAnalysisForSection7()` | `[]` (빈 배열) | `gfm: false` | 모든 속성 불허, GFM 테이블 비활성 |
| `renderSection9()` | `['class', 'style']` | 기본 (gfm: true) | style 속성 허용 |

---

## localStorage 키 구조

```
monthlyReportLastViewed_{userId}_{companyName}_{year}_{month}
  └─ 값: Date.now().toString() (밀리초 타임스탬프)

예시:
  monthlyReportLastViewed_admin_piscess_2026_1 = "1738393512345"
```

---

## 반응형 브레이크포인트

| 브레이크포인트 | 변화 |
|-------------|------|
| `> 1024px` | 기본: 2열 레이아웃 (메인 60% + AI 40%), 스코어카드 3열, 전략 3열 |
| `<= 1024px` | 1열 레이아웃 (수직 스택), 스코어카드 2열, 전략 2열, 카드 3열 |
| `<= 768px` | 스코어카드 1열, 전략 1열, 카드 2열, 토글 버튼 축소 |

---

## Next.js 포팅 시 참고 사항

1. **사이드바 패턴**: Sheet/Drawer 컴포넌트 사용 권장 (Radix UI, shadcn/ui)
2. **트랜지션**: `framer-motion` 또는 CSS transition으로 슬라이드 인/아웃
3. **Lazy Loading**: `IntersectionObserver` → React의 lazy + Suspense 또는 직접 훅 구현
4. **마크다운 렌더링**: `react-markdown` + `rehype-sanitize` 사용 권장
5. **캐시**: React Query / SWR의 캐싱 메커니즘 활용
6. **스파크라인**: SVG 직접 렌더링 또는 `recharts` 라이브러리
7. **상태 관리**: `useState` + `useCallback`으로 섹션별 상태 관리
8. **API 호출**: Next.js API route로 프록시 또는 직접 GCS 접근
9. **토스트**: `sonner` 또는 `react-hot-toast` 라이브러리
10. **NEW 배지**: localStorage 기반 동일 메커니즘, useEffect에서 check_new 호출
