# SPEC: Trend Image Benchmark (/trend/image-benchmark)

> **1:1 Clone 대상** — Flask Image Benchmark 전용 페이지
> **Flask 원본 (Desktop)**: `ngn_wep/dashboard/templates/trend_image_benchmark.html` (1179 lines)
> **Flask 원본 (Mobile)**: `ngn_wep/dashboard/templates/mobile/trend_image_benchmark.html` (1065 lines)
> **Flask 핸들러**: `ngn_wep/dashboard/handlers/data_handler.py` (image-benchmark endpoints)
> **Flask 라우트 (Desktop)**: `ngn_wep/dashboard/app.py` → `/trend/image-benchmark`
> **Flask 라우트 (Mobile)**: `ngn_wep/dashboard/handlers/mobile_trend_handler.py` → `/m/trend/image-benchmark`
> **데모 데이터**: `ngn_wep/dashboard/demo/demo_image_benchmark_data.py`
> **검증 업체**: piscess
> **Version**: 1.0

---

## 페이지 개요

Image Benchmark는 자사몰의 최근 7일 베스트 판매 상품을 기반으로, 29CM 및 Ably 플랫폼의 유사 트렌드 이미지를 AI 키워드 분석을 통해 추천하는 페이지이다.

### 주요 기능 요약

| # | 기능 | 설명 |
|---|------|------|
| 1 | **업체 선택** | 드롭다운에서 업체 선택 (관리자: piscess 자동선택) |
| 2 | **베스트 상품 조회** | 자사몰 최근 7일 판매 TOP 5 상품 로드 (BigQuery 주간 캐시) |
| 3 | **AI 키워드 추출** | Vertex AI(Gemini)로 상품명에서 패션 키워드 분석 (BigQuery 캐시) |
| 4 | **탭 기반 탐색** | 베스트 상품별 탭 전환 → 해당 상품의 유사 트렌드 검색 |
| 5 | **가중치 기반 검색** | AI 추출 키워드에 가중치(category:10, design:8, style:5, fit:5, pattern:1) 적용하여 29CM/Ably 베스트 상품 검색 |
| 6 | **결과 카드 그리드** | 검색 결과를 이미지 카드 그리드로 표시 (Desktop: auto-fill 280px, Mobile: 2열) |
| 7 | **카테고리 폴백** | 키워드 검색 결과 없으면 카테고리 기반 trending API로 폴백 |
| 8 | **이미지 상세 모달** | (Mobile) 카드 클릭 시 이미지 모달 → 상품 페이지 링크 |

---

## 데이터 플로우

```
[페이지 로드]
  ├── Desktop: autoSelectCompany()
  │   ├── 관리자 → piscess 자동선택
  │   ├── sessionStorage('siteSelectedCompany' / 'adsSelectedCompany') 복원
  │   └── 기본값: companyNames[0]
  │
  └── Mobile: companyName (서버에서 전달)
      └── DOMContentLoaded → loadBestProducts()

[loadBestProducts]
  ├── 1. GET /dashboard/image-benchmark/best-products?company={name}
  │   └── 응답: { status, company, products: [{product_name, total_qty}], source, week_id }
  │
  ├── 2. POST /dashboard/image-benchmark/extract-keywords
  │   ├── body: { product_names: [string] }
  │   └── 응답: { status, analysis: {"1": {categories_29cm, categories_ably, keywords, reasoning}}, cache_info }
  │
  ├── 3. renderTabs() → 탭 UI 생성
  └── 4. loadBenchmarkResults(0) → 첫 탭 결과 로드

[loadBenchmarkResults(tabIndex)]
  ├── aiAnalysis = extractedKeywords[tabIndex+1]
  │   ├── categories_29cm, categories_ably 추출
  │   └── keywordWeights (category/design/style/fit/pattern) 추출
  │
  ├── 1차: POST /dashboard/image-benchmark/search-by-keywords
  │   ├── body: { keyword_weights, categories_29cm, categories_ably, limit: 48 }
  │   └── 응답: { status, data_date, keyword_weights, results: [{platform, rank, brand_name, product_name, category, price, like_count, review_count, item_url, thumbnail_url, relevance_score}] }
  │
  ├── 2차 (폴백, 결과=0일때): GET /dashboard/image-benchmark/trending
  │   ├── params: categories_29cm, categories_ably, limit
  │   └── 응답: { status, categories_29cm, categories_ably, results: [...] }
  │
  └── renderResults(results)

[탭 클릭]
  └── selectTab(index) → loadBenchmarkResults(index)
```

---

## CSS 변수 / 디자인 토큰

Image Benchmark 페이지는 전용 inline `<style>`을 사용하며 CSS 변수를 선언하지 않는다. 대신 하드코딩된 컬러 토큰을 사용한다:

```
# 배경
--bg-body:          #0a0a0a
--bg-card:          #18181b
--bg-card-header:   #27272a
--bg-input:         #18181b
--bg-hover:         #27272a
--bg-tab-group:     #18181b
--bg-explanation:   #111113

# 테두리
--border-default:   #27272a
--border-subtle:    rgba(255, 255, 255, 0.06)
--border-hover:     rgba(255, 255, 255, 0.1)
--border-focus:     #6366f1
--border-card:      #27272a
--border-select:    #3f3f46

# 텍스트
--text-primary:     #ffffff
--text-secondary:   #e4e4e7
--text-muted:       #9ca3af
--text-dim:         #71717a
--text-dimmer:      #52525b

# 강조색
--accent-primary:   #6366f1 (인디고, 탭 active, 배지, 브랜드명)
--accent-gradient:  linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)
--accent-info-bg:   rgba(99, 102, 241, 0.1)
--accent-info-border: rgba(99, 102, 241, 0.2)
--accent-info-text: #a5b4fc

# 플랫폼 배지
--platform-29cm-bg: #18181b (border: #3f3f46)
--platform-ably-bg: #db2777

# 키워드 가중치별 컬러
--kw-category:      #f472b6 (10점, 핑크)
--kw-design:        #34d399 (8점, 에메랄드)
--kw-style:         #a78bfa (5점, 바이올렛)
--kw-fit:           #60a5fa (5점, 블루)
--kw-pattern:       #71717a / #a1a1aa (1점, 그레이)

# 통계
--stat-likes:       #f472b6
--stat-error:       #f87171 / #fca5a5

# 폰트
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif (Desktop)
font-family: 'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif (Mobile)
```

---

## 레이아웃 구조

### Desktop

```
body (bg: #0a0a0a, font: 'Inter')
└── .nav-buttons (햄버거 메뉴)
    ├── .hamburger-icon
    └── .hamburger-dropdown (네비게이션 링크)

└── .benchmark-wrapper (max-width: 1400px, margin: 0 auto)
    │                   (padding: 80px 24px 40px 24px)
    │
    ├── .page-header (mb: 32px)
    │   ├── h1.page-title (font-size: 2rem, font-weight: 700)
    │   │   ├── a.home-btn (38x38px, rounded-10px, → /adcanvas/select-platform)
    │   │   ├── "Image Benchmark" + Beta 배지 (bg: #6366f1, 11px)
    │   │   └── span.page-update-info (12px, color: #71717a)
    │   └── p.page-subtitle (1rem, color: #9ca3af)
    │
    ├── .company-selector (flex, gap: 16px, mb: 24px)
    │   ├── select#companySelect.company-select
    │   │   (padding: 12px 16px, bg: #18181b, border: #3f3f46, min-width: 200px)
    │   ├── span.company-selector-info
    │   │   ("최근 7일 베스트 판매 상품 기준", bg: rgba(99,102,241,0.1))
    │   └── span#dataDateInfo.data-date-badge (display: none → inline-flex)
    │       └── span#dataDateText ("수집일: YYYY년 MM월 DD일")
    │
    ├── .loading-state#loadingState (display: none)
    │   ├── .loading-spinner (40x40px)
    │   └── p ("베스트 상품 로딩 중...")
    │
    ├── .empty-state#emptyState
    │   └── p ("업체를 선택하면...")
    │
    ├── #mainContent (display: none → block)
    │   ├── .tab-group (bg: #18181b, border: #27272a, mb: 24px)
    │   │   ├── .product-tabs#productTabs (flex, overflow-x: auto, border-bottom: #27272a)
    │   │   │   └── .product-tab * N (padding: 14px 20px, flex: 1)
    │   │   │       ├── span.tab-rank (bg: rgba(255,255,255,0.15), 11px, 600)
    │   │   │       └── span.tab-name (max-width: 180px, ellipsis)
    │   │   │       ── .active → bg: gradient(#6366f1 → #8b5cf6)
    │   │   │
    │   │   └── .search-explanation#searchExplanation (padding: 16px 20px, bg: #111113)
    │   │       ├── .explanation-title ("검색 키워드", 12px, #6366f1, uppercase)
    │   │       └── .explanation-steps
    │   │           ├── 가중치별 키워드 (컬러별 표시)
    │   │           └── 검색 범위 ("29CM [카테고리] · Ably [카테고리]")
    │   │
    │   └── .results-grid#resultsGrid
    │       (grid, auto-fill minmax(280px, 1fr), gap: 20px)
    │       └── a.result-card * N (bg: #18181b, border: #27272a)
    │           ├── .result-card-header (padding: 10px 12px, bg: #27272a)
    │           │   ├── 플랫폼 배지 (29CM/Ably) + 카테고리 순위
    │           │   └── relevance_score 점수 (color: #6366f1)
    │           ├── .result-image-wrapper (height: 320px)
    │           │   ├── img.result-image (object-fit: cover)
    │           │   ├── span.result-rank-badge (top:12px left:12px, gradient)
    │           │   └── span.result-platform-badge (top:12px right:12px)
    │           └── .result-info (padding: 16px)
    │               ├── .result-brand (12px, #6366f1, 600)
    │               ├── .result-title (14px, 500, -webkit-line-clamp: 2)
    │               └── .result-stats (flex, gap: 16px)
    │                   ├── .stat-item.likes (heart N, color: #f472b6)
    │                   └── .stat-item ("리뷰 N")
    │
    └── .error-message#errorMessage (display: none)
        (bg: rgba(239,68,68,0.1), border: rgba(239,68,68,0.3), color: #fca5a5)
```

### Mobile

```
body (bg: #0a0a0a, font: Inter/Pretendard)
└── .benchmark-container (min-height: 100vh)
    ├── header.benchmark-header (fixed, top:0, height: 56px, z-index: 100)
    │   │   (bg: rgba(10,10,10,0.95), backdrop-filter: blur(12px))
    │   ├── .header-left (width: 44px)
    │   │   └── a.back-btn (40x40px → /m/trend/)
    │   ├── .header-title-wrap
    │   │   ├── h1.header-title ("이미지 벤치마크", 16px, 600)
    │   │   └── span.beta-badge ("Beta", 9px, bg: #6366f1)
    │   └── .header-right (width: 44px)
    │       └── a.home-btn (40x40px → /adcanvas/select-platform)
    │
    ├── main.benchmark-main (padding-top: 56px)
    │   ├── .info-banner
    │   │   │   (bg: gradient rgba(99,102,241,0.15)→rgba(139,92,246,0.1))
    │   │   │   (border-bottom: rgba(99,102,241,0.2), padding: 14px 16px)
    │   │   ├── .info-banner-title (13px, 600, #a5b4fc)
    │   │   └── .info-banner-desc (11px, rgba(255,255,255,0.5))
    │   │
    │   ├── .product-tabs-container (bg: #111, border-bottom: rgba(255,255,255,0.06))
    │   │   ├── .product-tabs#productTabsWrapper (overflow-x: auto, -webkit-overflow-scrolling: touch)
    │   │   │   └── .tabs-inner#productTabs (flex, gap: 8px, padding: 12px 0 0 16px)
    │   │   │       └── .product-tab * N (flex-direction: column, min-w: 100px, max-w: 120px)
    │   │   │           │                  (padding: 10px 14px, border-radius: 12px)
    │   │   │           ├── .tab-rank (11px, 700, #a5b4fc)
    │   │   │           └── .tab-name (12px, 500, -webkit-line-clamp: 2)
    │   │   └── .scroll-indicator#scrollIndicator (height: 3px, bottom: 6px)
    │   │       └── .scroll-indicator-thumb#scrollThumb
    │   │
    │   ├── .keyword-section#keywordSection (bg: #111, padding: 14px 16px, display: none)
    │   │   ├── .keyword-title ("AI 추출 검색 키워드", 11px, #6366f1, uppercase)
    │   │   ├── .keyword-list#keywordList (flex-wrap, gap: 6px)
    │   │   │   └── .keyword-chip * N (11px, padding: 5px 10px, border-radius: 14px)
    │   │   │       ── .category (bg: rgba(244,114,182,0.15), color: #f472b6)
    │   │   │       ── .design   (bg: rgba(52,211,153,0.15),  color: #34d399)
    │   │   │       ── .style    (bg: rgba(167,139,250,0.15), color: #a78bfa)
    │   │   │       ── .fit      (bg: rgba(96,165,250,0.15),  color: #60a5fa)
    │   │   │       ── .pattern  (bg: rgba(113,113,122,0.15), color: #a1a1aa)
    │   │   │       ── .empty    (opacity: 0.35)
    │   │   └── .search-range#searchRange (10px, rgba(255,255,255,0.4))
    │   │
    │   ├── .image-grid#imageGrid (grid, 2col, gap: 12px, padding: 12px)
    │   │   └── .image-card * N (bg: #18181b, border-radius: 16px)
    │   │       ├── .image-wrapper (padding-top: 133% → 3:4 비율)
    │   │       │   ├── img (object-fit: cover, loading: lazy)
    │   │       │   ├── .rank-badge (top:10 left:10, gradient, 10px)
    │   │       │   ├── .score-badge (top:10 right:10, bg: rgba(0,0,0,0.7))
    │   │       │   └── .platform-badge (bottom:10 left:10)
    │   │       │       ── .cm29 (bg: #18181b, border: #3f3f46)
    │   │       │       ── .ably (bg: #db2777)
    │   │       └── .image-info (padding: 12px)
    │   │           ├── .image-brand (11px, #6366f1, 600)
    │   │           ├── .image-name (12px, 500, -webkit-line-clamp: 2)
    │   │           └── .image-stats (11px, rgba(255,255,255,0.5))
    │   │               └── .likes (heart N, color: #f472b6)
    │   │
    │   └── .empty-state#emptyState (display: none)
    │
    ├── .loading-overlay#loadingOverlay (fixed, z-index: 200, bg: rgba(10,10,10,0.9))
    │   ├── .spinner (40x40px)
    │   └── .loading-text#loadingText (14px)
    │
    ├── .image-modal#imageModal (fixed, z-index: 300, bg: rgba(0,0,0,0.95))
    │   ├── button.modal-close (fixed top:16 right:16, 40x40px, border-radius: 50%)
    │   ├── img.modal-image#modalImage (max-height: 70vh, border-radius: 12px, mt: 60px)
    │   └── .modal-info (padding: 20px 0)
    │       ├── .modal-brand#modalBrand (13px, #6366f1)
    │       ├── .modal-name#modalName (18px, 600)
    │       ├── .modal-score#modalScore (14px, #a5b4fc)
    │       └── a.modal-link#modalLink (padding: 14px, gradient, border-radius: 12px)
    │
    └── .toast-container#toastContainer (fixed top:70, left:16, right:16, z-index: 9999)
```

---

## JS 전역 상태 변수

### Desktop (`trend_image_benchmark.html`)

```javascript
// Flask 템플릿 변수
const isAdmin = {{ is_admin | tojson }};     // boolean — 관리자 여부
const companyNames = {{ company_names | tojson }}; // string[] — 접근 가능 업체 목록

// 상태 관리
let currentCompany = '';           // 현재 선택된 업체명
let bestProducts = [];             // 베스트 상품 배열 [{product_name, total_qty}]
let currentTabIndex = 0;           // 현재 활성 탭 인덱스 (0-based)
let extractedKeywords = {};        // AI 추출 키워드 캐싱 {"1": {categories_29cm, categories_ably, keywords, reasoning}}

// 카테고리 매핑 (폴백용)
const categoryMapping = { ... };   // 영어 상품명 키워드 → 플랫폼 카테고리 매핑
const styleKeywordMap = { ... };   // 영어 스타일 키워드 → 한글 검색어 매핑
```

### Mobile (`mobile/trend_image_benchmark.html`)

```javascript
var companyName = "{{ company_name }}";  // 서버에서 전달받은 업체명
var bestProducts = [];                   // 베스트 상품 배열
var currentTabIndex = 0;                 // 현재 활성 탭 인덱스
var extractedKeywords = {};              // AI 추출 키워드 캐싱
```

---

## HTML 요소 맵

### Desktop 요소

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#hamburgerIcon` | div | 햄버거 메뉴 아이콘 | - |
| `#hamburgerDropdown` | div | 네비게이션 드롭다운 | hidden |
| `.benchmark-wrapper` | div | 메인 래퍼 (max-width: 1400px) | - |
| `.page-header` | div | 페이지 헤더 | - |
| `.page-title` | h1 | "Image Benchmark" + Beta 배지 | - |
| `.home-btn` | a | AdCanvas 홈 버튼 (38x38px) | → /adcanvas/select-platform |
| `.page-update-info` | span | "↻ 매주 월요일 오전 9시 업데이트" | - |
| `.page-subtitle` | p | 부제목 | - |
| `#companySelect` | select | 업체 선택 드롭다운 | "" |
| `.company-selector-info` | span | "최근 7일 베스트 판매 상품 기준" | - |
| `#dataDateInfo` | span | 데이터 기준일 배지 컨테이너 | display: none |
| `#dataDateText` | span | 기준일 텍스트 ("YYYY년 MM월 DD일") | - |
| `#loadingState` | div | 로딩 상태 (스피너 + 텍스트) | display: none |
| `#emptyState` | div | 빈 상태 메시지 | display: block |
| `#mainContent` | div | 메인 컨텐츠 (탭 + 그리드) | display: none |
| `#productTabs` | div | 상품 탭 컨테이너 (.product-tabs) | - |
| `.product-tab` | div | 개별 상품 탭 (동적 생성) | - |
| `.tab-rank` | span | 탭 순위 배지 ("N위") | - |
| `.tab-name` | span | 탭 상품명 (max-width: 180px) | - |
| `#searchExplanation` | div | 검색 기준 설명 영역 | - |
| `#resultsGrid` | div | 결과 카드 그리드 (.results-grid) | - |
| `.result-card` | a | 결과 카드 (동적 생성, target: _blank) | - |
| `#errorMessage` | div | 에러 메시지 | display: none |

### Mobile 전용 요소

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.benchmark-container` | div | 최상위 컨테이너 | - |
| `.benchmark-header` | header | 고정 헤더 (56px, fixed) | - |
| `.back-btn` | a | 뒤로가기 (→ /m/trend/) | - |
| `.header-title` | h1 | "이미지 벤치마크" (16px) | - |
| `.beta-badge` | span | "Beta" 배지 | - |
| `.info-banner` | div | 정보 배너 (gradient bg) | - |
| `#productTabsWrapper` | div | 탭 스크롤 래퍼 | - |
| `#productTabs` | div | 탭 내부 (.tabs-inner) | - |
| `#scrollIndicator` | div | 스크롤 인디케이터 바 | - |
| `#scrollThumb` | div | 스크롤 인디케이터 썸 | - |
| `#keywordSection` | div | 검색 키워드 섹션 | display: none |
| `#keywordList` | div | 키워드 칩 리스트 | - |
| `#searchRange` | div | 검색 범위 텍스트 | - |
| `#imageGrid` | div | 이미지 그리드 (2열) | - |
| `.image-card` | div | 이미지 카드 (클릭 → 모달) | - |
| `#loadingOverlay` | div | 전체화면 로딩 오버레이 | display: none |
| `#loadingText` | span | 로딩 텍스트 | - |
| `#imageModal` | div | 이미지 상세 모달 (fullscreen) | display: none |
| `#modalImage` | img | 모달 이미지 | - |
| `#modalBrand` | div | 모달 브랜드명 | - |
| `#modalName` | div | 모달 상품명 | - |
| `#modalScore` | div | 모달 유사도 점수 | - |
| `#modalLink` | a | 모달 "상품 페이지 열기" 링크 | - |
| `#toastContainer` | div | 토스트 알림 컨테이너 | - |

---

## 섹션별 상세 스펙

### 1. 페이지 헤더

#### Desktop

```
┌──────────────────────────────────────────────────────────┐
│ [Home] Image Benchmark [Beta]  ↻ 매주 월요일 오전 9시 업데이트 │
│ 자사몰 베스트 상품 기반 29CM & Ably 트렌드 이미지 추천        │
└──────────────────────────────────────────────────────────┘
```

- `[Home]` → `.home-btn` (38x38px, bg: rgba(255,255,255,0.06), border: rgba(255,255,255,0.1), rounded-10px)
- `[Beta]` → inline span (bg: #6366f1, 11px, 600, padding: 3px 8px)
- 업데이트 정보 → `.page-update-info` (12px, #71717a, margin-left: auto)

#### Mobile

```
┌─────────────────────────────────────┐
│ [<-]   이미지 벤치마크 [Beta]  [Home] │  <- 56px fixed header
└─────────────────────────────────────┘
│ 최근 7일 베스트 판매 상품 기준          │  <- info-banner
│ 자사몰 베스트 상품과 유사한 ...         │
└─────────────────────────────────────┘
```

### 2. 업체 선택 (Desktop Only)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [piscess v]  │ 최근 7일 베스트 판매 상품 기준 │  수집일: 2026년 02월 24일 │
└────────────────────────────────────────────────────────────────────────┘
```

- Desktop은 `<select>` 드롭다운으로 업체 선택
- Mobile은 URL 파라미터 `?company_name=piscess`로 서버에서 전달 (선택 UI 없음)

**자동 선택 로직 (Desktop):**
1. 관리자 → `piscess` 고정
2. `sessionStorage('siteSelectedCompany')` 또는 `sessionStorage('adsSelectedCompany')` 복원
3. 둘 다 없으면 → `companyNames[0]`

### 3. 베스트 상품 탭

#### Desktop

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────────┬─────────────┬─────────────┬─────────────┬──────────┐│
│ │[1위] 상품명A ▓│[2위] 상품명B │[3위] 상품명C │[4위] 상품명D │[5위] 상품E││
│ └─────────────┴─────────────┴─────────────┴─────────────┴──────────┘│
│ ▓ = active tab (gradient #6366f1 -> #8b5cf6)                        │
│ ─────────────────────────────────────────────────────────────────── │
│ 검색 키워드                                                         │
│ 카테고리(10점): hoodie/후드                                           │
│ 디자인(8점): -                                                       │
│ 스타일(5점): vintage/빈티지                                           │
│ 핏(5점): oversized/오버사이즈                                         │
│ 패턴(1점): -                                                         │
│ ─────────────────────────────────────────────────────────────────── │
│ 검색 범위: 29CM [상의] · Ably [상의, 트레이닝]                         │
└──────────────────────────────────────────────────────────────────────┘
```

- 탭: `.product-tab` (padding: 14px 20px, flex: 1, border-right: #27272a)
- 활성 탭: `.product-tab.active` (bg: gradient, color: #fff, 600)
- 탭 랭크: `.tab-rank` (bg: rgba(255,255,255,0.15), 11px, 600, rounded-4px)
- 탭 이름: `.tab-name` (max-width: 180px, overflow: hidden, text-overflow: ellipsis)

#### Mobile

```
┌─────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │ <- 가로 스크롤
│ │ 1위  │ │ 2위  │ │ 3위  │ │ 4위  │ │ 5위  │   │
│ │상품명│ │상품명│ │상품명│ │상품명│ │상품명│   │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │
│ ====──────────────────── (scroll indicator)     │
└─────────────────────────────────────────────────┘
```

- 탭: column 방향 (rank 위, name 아래), min-w: 100px, max-w: 120px, border-radius: 12px
- 스크롤 인디케이터: height 3px, bottom 6px, 스크롤에 따라 thumb 이동

### 4. 검색 키워드 표시

#### Desktop: `.search-explanation` 내부 inline HTML

가중치별 키워드를 컬러로 구분하여 한 줄씩 표시:
```
카테고리(10점): hoodie/후드         <- #f472b6
디자인(8점): -                     <- #34d399 (opacity: 0.35 when empty)
스타일(5점): vintage/빈티지         <- #a78bfa
핏(5점): oversized/오버사이즈       <- #60a5fa
패턴(1점): -                       <- #71717a (opacity: 0.35 when empty)
```

#### Mobile: `.keyword-section` → `.keyword-chip` 칩 형태

```
┌────────────────────────────────────────┐
│ AI 추출 검색 키워드                      │
│ [hoodie/후드 (10점)] [vintage/빈티지 (5점)] │
│ [oversized/오버사이즈 (5점)]               │
│ 검색 범위: 29CM [상의] / Ably [상의, 트레이닝] │
└────────────────────────────────────────┘
```

- 칩: `.keyword-chip` (11px, padding: 5px 10px, border-radius: 14px)
- 가중치별 클래스: `.category`, `.design`, `.style`, `.fit`, `.pattern`
- 빈 가중치: `.empty` (opacity: 0.35)

### 5. 결과 카드 그리드

#### Desktop

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │[29CM] 상의 2위│ │[Ably] 상의 5위│ │[29CM] 상의 8위│ │[Ably] 트레 3위│ │
│ │     30점      │ │     28점      │ │     25점      │ │     23점      │ │
│ ├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤ │
│ │              │ │              │ │              │ │              │ │
│ │              │ │              │ │              │ │              │ │
│ │   이미지     │ │   이미지     │ │   이미지     │ │   이미지     │ │
│ │   320px      │ │   320px      │ │   320px      │ │   320px      │ │
│ │              │ │              │ │              │ │              │ │
│ ├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤ │
│ │ 브랜드명     │ │ 브랜드명     │ │ 브랜드명     │ │ 브랜드명     │ │
│ │ 상품명 (2줄) │ │ 상품명 (2줄) │ │ 상품명 (2줄) │ │ 상품명 (2줄) │ │
│ │ heart 3,420  │ │ heart 2,180  │ │ heart 1,890  │ │ heart 4,510  │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │
│ (repeat rows...)                                                     │
│ grid: auto-fill, minmax(280px, 1fr), gap: 20px                      │
└──────────────────────────────────────────────────────────────────────┘
```

- `.results-grid` → CSS Grid, `auto-fill`, `minmax(280px, 1fr)`, gap: 20px
- `.result-card` → `<a>` 태그 (target: _blank, href: item_url)
- hover: border-color: #6366f1, transform: translateY(-4px), box-shadow: 0 8px 24px rgba(0,0,0,0.4)
- `.result-card-header`: flex, justify-content: space-between, padding: 10px 12px, bg: #27272a
- `.result-image-wrapper`: height: 320px, overflow: hidden
- 이미지 hover: transform: scale(1.05), transition: 0.3s

#### Mobile

```
┌────────────────────────────────┐
│ ┌────────────┐ ┌────────────┐ │
│ │ [상의 2위] │ │ [상의 5위] │ │
│ │   [30점]   │ │   [28점]   │ │
│ │            │ │            │ │
│ │  이미지    │ │  이미지    │ │
│ │  (3:4)     │ │  (3:4)     │ │
│ │ [29CM]     │ │ [Ably]     │ │
│ ├────────────┤ ├────────────┤ │
│ │ 브랜드     │ │ 브랜드     │ │
│ │ 상품명     │ │ 상품명     │ │
│ │ heart 3420 │ │ heart 2180 │ │
│ └────────────┘ └────────────┘ │
│ grid: 2col, gap: 12px         │
└────────────────────────────────┘
```

- `.image-grid` → CSS Grid, 2열 고정, gap: 12px, padding: 12px
- `.image-card` → `<div>` (클릭 → openModal())
- `.image-wrapper` → padding-top: 133% (3:4 비율)
- 배지 위치: rank(top:10 left:10), score(top:10 right:10), platform(bottom:10 left:10)
- border-radius: 16px (Desktop 4px vs Mobile 16px -- 중요 차이)

### 6. 이미지 상세 모달 (Mobile Only)

```
┌────────────────────────────────┐
│                          [X]  │ <- fixed top:16 right:16
│                                │
│   ┌────────────────────────┐  │
│   │                        │  │
│   │     이미지             │  │ <- max-height: 70vh
│   │     (object-fit: contain)│ │    border-radius: 12px
│   │                        │  │
│   └────────────────────────┘  │
│                                │
│   브랜드명                     │ <- #6366f1, 13px
│   상품명                       │ <- #fff, 18px, 600
│   유사도 점수: 30점             │ <- #a5b4fc, 14px
│                                │
│   ┌────────────────────────┐  │
│   │   상품 페이지 열기      │  │ <- gradient, 15px, 600
│   └────────────────────────┘  │    border-radius: 12px
└────────────────────────────────┘
```

- 오버레이 닫기: 모달 외부 클릭 또는 X 버튼
- body overflow: hidden (모달 open 시)

---

## 핵심 함수 흐름

### Desktop

```
autoSelectCompany()
  ├── isAdmin && companyNames.includes('piscess') → 'piscess'
  ├── sessionStorage('siteSelectedCompany') || ('adsSelectedCompany')
  └── companyNames[0]
  → loadBestProducts()

loadBestProducts()
  ├── showLoading()
  ├── GET /dashboard/image-benchmark/best-products?company={name}
  │   └── bestProducts = data.products
  ├── POST /dashboard/image-benchmark/extract-keywords
  │   └── extractedKeywords = data.analysis
  ├── renderTabs()
  └── loadBenchmarkResults(0)

renderTabs()
  └── bestProducts.forEach → .product-tab 생성
      ├── cleanProductName() → 프로모션 태그/색상 제거
      ├── .tab-rank (순위)
      └── .tab-name (상품명)

selectTab(index)
  ├── 탭 활성화 상태 토글
  └── loadBenchmarkResults(index)

loadBenchmarkResults(index)
  ├── aiAnalysis = extractedKeywords[String(index+1)]
  │   ├── categories_29cm, categories_ably 추출
  │   └── keywordWeights 추출
  │       └── 없으면 규칙 기반 폴백 (extractCategory + extractStyleKeywords)
  ├── updateExplanation(categoryInfo, keywordWeights)
  ├── POST /dashboard/image-benchmark/search-by-keywords
  │   └── results = data.results
  ├── (폴백) GET /dashboard/image-benchmark/trending
  └── renderResults(results, categoryInfo, allKeywords)

renderResults(results, category, keywords)
  └── results.forEach → .result-card 생성
      ├── 플랫폼 배지 (29CM/Ably, 색상 분기)
      ├── 카테고리 순위 (category + rank)
      ├── relevance_score 점수
      ├── 이미지 (onerror → No Image SVG placeholder)
      ├── 브랜드명 / 상품명 (2줄 클램프)
      └── 통계 (likes, review_count)

cleanProductName(name)
  ├── /\[.*?\]/g 제거 (프로모션 태그)
  └── /_[A-Za-z\s]+$/ 제거 (색상 접미사)

extractCategory(productName)      -- 폴백용
extractStyleKeywords(productName)  -- 폴백용
```

### Mobile 추가 함수

```
showLoading(show, text)
  └── .loading-overlay.show 토글

showToast(message, type, duration)
  └── .toast 생성 → slideIn → setTimeout → slideOut → remove

setupScrollIndicator()
  └── wrapper.scroll → thumb width/position 업데이트

updateKeywordSection(keywordWeights, categories_29cm, categories_ably)
  ├── 키워드 칩 생성 (.keyword-chip, 가중치별 컬러)
  └── 검색 범위 텍스트 업데이트 (#searchRange)

openModal(imageUrl, brand, name, score, productUrl)
  ├── 모달 데이터 세팅
  ├── .image-modal.show 추가
  └── body.overflow = 'hidden'

closeModal()
  ├── .image-modal.show 제거
  └── body.overflow = ''

escapeHtml(text)  -- XSS 방지
formatNumber(num) -- 숫자 포맷팅 (toLocaleString)
```

---

## API 엔드포인트 레퍼런스

### 1. `GET /dashboard/image-benchmark/best-products`

업체의 최근 7일 베스트 판매 상품 조회 (BigQuery 주간 캐시 → 실시간 폴백).

**Route**: `data_handler.py` → `image_benchmark_best_products()`
**Auth**: `@login_required`
**데모 모드**: `demo_image_benchmark_data.get_demo_best_products()`

**Request:**
```
GET /dashboard/image-benchmark/best-products?company=piscess
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `company` | string | Yes | 업체명 |

**Response (성공 -- 캐시 히트):**
```json
{
  "status": "success",
  "company": "piscess",
  "products": [
    { "product_name": "Front Shirring Long Sleeve Top", "total_qty": 47 },
    { "product_name": "플리츠 미디 스커트", "total_qty": 38 },
    { "product_name": "데님 카고 와이드 팬츠", "total_qty": 31 },
    { "product_name": "울 블렌드 숏 코트", "total_qty": 26 },
    { "product_name": "셔링 원피스", "total_qty": 22 }
  ],
  "source": "cache",
  "week_id": "2026-W09"
}
```

**Response (성공 -- 실시간):**
```json
{
  "status": "success",
  "company": "piscess",
  "mall_id": "piscess",
  "products": [ ... ],
  "source": "realtime"
}
```

**Response (에러):**
```json
{ "status": "error", "message": "업체를 선택해주세요." }
{ "status": "error", "message": "업체 'xxx'를 찾을 수 없습니다." }
```

**BigQuery 테이블:**
- 캐시: `ngn_dataset.image_benchmark_best_products_cache` (week_id, company_name, products_json, created_at)
- 업체 정보: `ngn_dataset.company_info` (company_name → mall_id)
- 주문 데이터: `ngn_dataset.cafe24_order_items_table` (mall_id, ordered_date, product_name, quantity, status_code)

**BigQuery 쿼리 로직:**
1. `image_benchmark_best_products_cache` 에서 `week_id + company_name` 캐시 조회
2. 캐시 미스 시 → `company_info`에서 mall_id 조회
3. `cafe24_order_items_table`에서 최근 7일 판매 상품 TOP 5 조회
   - `status_code NOT IN ('C1', 'C2', 'C3')` -- 취소 제외
   - 상품명 정규화: `_[A-Za-z\s]+$` 색상 접미사 제거

---

### 2. `POST /dashboard/image-benchmark/extract-keywords`

Vertex AI(Gemini 2.0 Flash)를 사용하여 상품명에서 패션 검색 키워드를 추출 (BigQuery 캐싱 적용).

**Route**: `data_handler.py` → `image_benchmark_extract_keywords()`
**Auth**: `@login_required`
**데모 모드**: `demo_image_benchmark_data.get_demo_extract_keywords()`
**AI 모델**: `gemini-2.0-flash` (Vertex AI, project: winged-precept-443218-v8, location: us-central1)

**Request:**
```json
{
  "product_names": [
    "빈티지 오버사이즈 후드 집업",
    "플리츠 미디 스커트",
    "데님 카고 와이드 팬츠",
    "울 블렌드 숏 코트",
    "셔링 원피스"
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_names` | string[] | Yes | 상품명 배열 (최대 5개) |

**Response (성공):**
```json
{
  "status": "success",
  "analysis": {
    "1": {
      "categories_29cm": ["상의"],
      "categories_ably": ["상의", "트레이닝"],
      "keywords": {
        "category": [["hoodie", "후드", "후디"]],
        "design": [["zip-up", "집업"]],
        "style": [["vintage", "빈티지"]],
        "fit": [["oversized", "오버사이즈", "오버핏"]],
        "pattern": []
      },
      "reasoning": "후드 집업 상의 -> hoodie 카테고리, vintage 스타일, oversized 핏"
    },
    "2": {
      "categories_29cm": ["스커트"],
      "categories_ably": ["스커트"],
      "keywords": {
        "category": [["skirt", "스커트"]],
        "design": [["pleated", "플리츠"]],
        "style": [],
        "fit": [["midi", "미디"]],
        "pattern": []
      },
      "reasoning": "플리츠 미디 스커트 -> skirt 카테고리, pleated 디자인"
    },
    "3": { "..." : "..." },
    "4": { "..." : "..." },
    "5": { "..." : "..." }
  },
  "cache_info": {
    "hits": 3,
    "misses": 2
  }
}
```

**Keywords 구조 상세:**

| Key | 가중치 | 설명 | 예시 |
|-----|--------|------|------|
| `category` | 10점 | 구체적 아이템 종류 (화이트리스트만) | `[["hoodie", "후드"]]`, `[["cargo", "카고"]]` |
| `design` | 8점 | 디자인 특징 (셔링, 플리츠 등) | `[["pleated", "플리츠"]]`, `[["shirring", "셔링"]]` |
| `style` | 5점 | 소재/스타일 | `[["vintage", "빈티지"]]`, `[["denim", "데님"]]` |
| `fit` | 5점 | 핏/길이 | `[["oversized", "오버사이즈"]]`, `[["midi", "미디"]]` |
| `pattern` | 1점 | 패턴/장식 (alt: `detail`) | `[["check", "체크"]]`, `[["stripe", "스트라이프"]]` |

- 각 키워드는 `[영어, 한글, 한글변형]` 쌍 배열 -- 같은 쌍 내 매칭은 중복 점수 불가 (GREATEST)
- 별도 쌍의 키워드는 점수 합산 가능

**Category 화이트리스트:**
hoodie/후드, cardigan/가디건, blazer/블레이저, vest/베스트, jogger/조거, cargo/카고, shorts/쇼츠, slacks/슬랙스, leggings/레깅스, skirt/스커트, dress/드레스/원피스, jumpsuit/점프수트, jacket/자켓, coat/코트, padding/패딩, puffer/푸퍼, trench/트렌치, bikini/비키니, swimsuit/수영복, bralette/브라렛

**Category 블랙리스트 (절대 category에 넣지 않음):**
top/탑, tee/티, t-shirt, blouse/블라우스, shirt/셔츠, pants/팬츠/바지, bottom, outer/아우터 -> 이들은 `categories_29cm`/`categories_ably`에만 사용

**캐싱 메커니즘:**
- BigQuery 테이블: `ngn_dataset.ai_keyword_cache`
  - Schema: `product_name_hash` (MD5), `product_name`, `keywords_json`, `created_at`
  - 유효기간: 7일
- 캐시 히트 시 AI 호출 스킵
- 캐시 미스 상품만 AI 호출 후 MERGE upsert

---

### 3. `POST /dashboard/image-benchmark/search-by-keywords`

가중치 적용 키워드로 29CM/Ably 베스트 상품을 검색하여 유사도 점수 순으로 반환.

**Route**: `data_handler.py` → `image_benchmark_search_by_keywords()`
**Auth**: `@login_required`
**데모 모드**: `demo_image_benchmark_data.get_demo_search_by_keywords(tab)`

**Request:**
```json
{
  "keyword_weights": {
    "category": [["hoodie", "후드", "후디"]],
    "design": [["zip-up", "집업"]],
    "style": [["vintage", "빈티지"]],
    "fit": [["oversized", "오버사이즈", "오버핏"]],
    "pattern": []
  },
  "categories_29cm": ["상의"],
  "categories_ably": ["상의", "트레이닝"],
  "limit": 48
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `keyword_weights` | object | Yes | - | 가중치별 키워드 (category/design/style/fit/pattern) |
| `categories_29cm` | string[] | No | `["전체"]` | 29CM 카테고리 필터 |
| `categories_ably` | string[] | No | `["상의"]` | Ably 카테고리 필터 |
| `limit` | number | No | 48 | 최대 결과 수 (max: 100) |
| `keywords` | string[] | No | [] | 구 형식 호환 (단순 키워드 리스트, 1점) |

**가중치 점수 계산 (BigQuery SQL):**

```
WEIGHTS = { category: 10, design: 8, style: 5, fit: 5, pattern: 1 }

- category: 전체를 GREATEST로 묶어 최대 10점 (중복 불가)
  GREATEST(
    CASE WHEN LOWER(product_name) LIKE '%hoodie%' THEN 10 ELSE 0 END,
    CASE WHEN LOWER(product_name) LIKE '%후드%' THEN 10 ELSE 0 END,
    CASE WHEN LOWER(product_name) LIKE '%후디%' THEN 10 ELSE 0 END
  )

- 나머지(design/style/fit/pattern): 각 쌍별 GREATEST, 쌍 간 합산 가능
  GREATEST(CASE ... 'vintage' ... 5, CASE ... '빈티지' ... 5)
  +
  GREATEST(CASE ... 'denim' ... 5, CASE ... '데님' ... 5)
```

**Response (성공):**
```json
{
  "status": "success",
  "data_date": "2026년 02월 24일",
  "keyword_weights": { "..." : "..." },
  "results": [
    {
      "platform": "29CM",
      "rank": 2,
      "brand_name": "마르디 메크디",
      "product_name": "유니섹스 빈티지 워시드 후디",
      "category": "상의",
      "price": 79000,
      "like_count": 3420,
      "review_count": 187,
      "item_url": "https://29cm.co.kr/...",
      "thumbnail_url": "https://img.29cm.co.kr/...",
      "relevance_score": 30
    },
    {
      "platform": "Ably",
      "rank": 5,
      "brand_name": "레이지오터",
      "product_name": "오버핏 피그먼트 후드 집업",
      "category": "상의",
      "price": 45900,
      "like_count": 2180,
      "review_count": 324,
      "item_url": "https://m.a-bly.com/...",
      "thumbnail_url": "https://image.a-bly.com/...",
      "relevance_score": 28
    }
  ]
}
```

**Result Item 스키마:**

| Field | Type | Description |
|-------|------|-------------|
| `platform` | string | "29CM" or "Ably" |
| `rank` | number | 플랫폼 내 순위 |
| `brand_name` | string | 브랜드명 |
| `product_name` | string | 상품명 |
| `category` | string | 카테고리 (29CM: best_page_name, Ably: category_medium) |
| `price` | number | 가격 (KRW) |
| `like_count` | number | 좋아요 수 |
| `review_count` | number | 리뷰 수 |
| `item_url` | string | 상품 URL |
| `thumbnail_url` | string | 썸네일 이미지 URL |
| `relevance_score` | number | 가중치 합산 유사도 점수 |

**정렬**: `relevance_score DESC, rank ASC`

**BigQuery 테이블:**
- `ngn_dataset.platform_29cm_best` (run_id, period_type, best_page_name, rank, brand_name, product_name, price, like_count, review_count, item_url, thumbnail_url, collected_at)
- `ngn_dataset.platform_ably_best` (run_id, period_type, category_medium, rank, brand_name, product_name, price, like_count, review_count, item_url, thumbnail_url, collected_at)
- 최신 데이터: `run_id DESC LIMIT 1`, `period_type = 'WEEKLY'`
- 중복 제거: `QUALIFY ROW_NUMBER() OVER (PARTITION BY item_url ORDER BY collected_at DESC) = 1`

---

### 4. `GET /dashboard/image-benchmark/trending`

카테고리 기반 29CM/Ably 트렌드 상품 조회 (키워드 검색 폴백용).

**Route**: `data_handler.py` → `image_benchmark_trending()`
**Auth**: `@login_required`
**데모 모드**: `demo_image_benchmark_data.get_demo_trending()`

**Request:**
```
GET /dashboard/image-benchmark/trending?categories_29cm=상의,니트웨어&categories_ably=상의,트레이닝&limit=48
```

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `categories_29cm` | string | No | "전체" | 29CM 카테고리 (쉼표 구분) |
| `categories_ably` | string | No | "상의" | Ably 카테고리 (쉼표 구분) |
| `limit` | string | No | "24" | 최대 결과 수 (max: 100) |

**Response (성공):**
```json
{
  "status": "success",
  "categories_29cm": ["상의", "니트웨어"],
  "categories_ably": ["상의", "트레이닝"],
  "results": [
    {
      "platform": "29CM",
      "rank": 1,
      "brand_name": "브랜드A",
      "product_name": "상품명",
      "category": "상의",
      "price": 79000,
      "like_count": 3420,
      "review_count": 187,
      "item_url": "https://...",
      "thumbnail_url": "https://..."
    }
  ]
}
```

**차이점 vs search-by-keywords:**
- `relevance_score` 필드 없음
- 키워드 매칭 없이 카테고리 + 순위만으로 정렬
- 정렬: `rank ASC, platform ASC`

**29CM 사용 가능 카테고리 (best_page_name):**
니트웨어, 단독, 바지, 상의, 셋업, 스커트, 아우터, 언더웨어, 원피스, 전체, 점프수트, 파티복/행사복, 해외브랜드, 홈웨어

**Ably 사용 가능 카테고리 (category_medium):**
비치웨어, 상의, 스커트, 아우터, 원피스/세트, 트레이닝, 팬츠

---

### 5. `GET /dashboard/image-benchmark/search` (Brave Search, 미사용)

Brave Search API를 사용한 범용 이미지 검색. 현재 UI에서는 직접 호출하지 않음 (초기 프로토타입 잔재).

**Request:**
```
GET /dashboard/image-benchmark/search?q=오버사이즈 후드&count=10
```

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `q` | string | Yes | - | 검색어 |
| `count` | string | No | "10" | 결과 수 (max: 20) |

**Response:**
```json
{
  "status": "success",
  "query": "오버사이즈 후드",
  "results": [ "..." ]
}
```

---

## 페이지 라우트 요약

### Desktop

| Route | Method | Handler | Template | 설명 |
|-------|--------|---------|----------|------|
| `/trend/image-benchmark` | GET | `app.py:trend_image_benchmark_page()` | `trend_image_benchmark.html` | 데모 허용, login 체크 |

**Template 변수:**
```python
render_template("trend_image_benchmark.html",
    company_names=company_names,  # session.get("company_names", [])
    is_admin=is_admin             # session.get("is_admin", False)
)
```

### Mobile

| Route | Method | Handler | Template | 설명 |
|-------|--------|---------|----------|------|
| `/m/trend/image-benchmark` | GET | `mobile_trend_handler.py:trend_image_benchmark()` | `mobile/trend_image_benchmark.html` | login 필수 |

**Template 변수:**
```python
render_template("mobile/trend_image_benchmark.html",
    company_name=company_name,    # request.args.get('company_name', '')
    company_names=company_names   # session.get("company_names", [])
)
```

---

## Desktop vs Mobile 주요 차이점

| 항목 | Desktop | Mobile |
|------|---------|--------|
| **업체 선택** | `<select>` 드롭다운 + 자동선택 로직 | URL 파라미터로 서버 전달 (UI 없음) |
| **헤더** | 햄버거 메뉴 (네비게이션 포함) | 고정 헤더 56px (back/home 버튼만) |
| **탭 레이아웃** | 가로 일렬 (flex: 1), 탭 그룹 박스 포함 | 카드형 (column 방향), 가로 스크롤 + 인디케이터 |
| **키워드 표시** | 텍스트 형태 (컬러별 한 줄씩) | 칩 형태 (`.keyword-chip`, border-radius: 14px) |
| **결과 그리드** | auto-fill minmax(280px, 1fr) | 고정 2열 |
| **카드 동작** | `<a>` 태그 → 새 탭에서 상품 페이지 열기 | `<div>` → 이미지 상세 모달 열기 |
| **이미지 높이** | 고정 320px | 3:4 비율 (padding-top: 133%) |
| **카드 radius** | 4px | 16px |
| **모달** | 없음 | 전체화면 이미지 모달 |
| **로딩** | 인라인 (#loadingState div) | 전체화면 오버레이 (#loadingOverlay) |
| **토스트** | 없음 | 토스트 알림 (업체 미선택 시 경고) |
| **font** | Inter만 | Inter + Pretendard |
| **limit** | 48 | 30 |

---

## 규칙 기반 폴백 (AI 키워드 추출 실패 시)

Desktop에만 존재하는 폴백 로직 (Mobile은 AI 실패 시 결과 없음 처리).

### categoryMapping

상품명 영어 키워드 → 플랫폼 카테고리 매핑:

```javascript
const categoryMapping = {
  'knit':     { ko: '니트웨어', categories_29cm: ['니트웨어', '상의'], categories_ably: ['상의'] },
  'sweater':  { ko: '니트웨어', categories_29cm: ['니트웨어', '상의'], categories_ably: ['상의'] },
  'cardigan': { ko: '니트웨어', categories_29cm: ['니트웨어', '상의'], categories_ably: ['상의'] },
  'hoodie':   { ko: '상의',    categories_29cm: ['상의'], categories_ably: ['상의', '트레이닝'] },
  'shirt':    { ko: '상의',    categories_29cm: ['상의'], categories_ably: ['상의'] },
  'blouse':   { ko: '상의',    categories_29cm: ['상의'], categories_ably: ['상의'] },
  'top':      { ko: '상의',    categories_29cm: ['상의'], categories_ably: ['상의'] },
  'tee':      { ko: '상의',    categories_29cm: ['상의'], categories_ably: ['상의'] },
  't-shirt':  { ko: '상의',    categories_29cm: ['상의'], categories_ably: ['상의'] },
  'skirt':    { ko: '스커트',  categories_29cm: ['스커트'], categories_ably: ['스커트'] },
  'pants':    { ko: '바지/팬츠', categories_29cm: ['바지'], categories_ably: ['팬츠'] },
  'jogger':   { ko: '바지/팬츠', categories_29cm: ['바지'], categories_ably: ['팬츠', '트레이닝'] },
  'shorts':   { ko: '바지/팬츠', categories_29cm: ['바지'], categories_ably: ['팬츠'] },
  'slacks':   { ko: '바지/팬츠', categories_29cm: ['바지'], categories_ably: ['팬츠'] },
  'dress':    { ko: '원피스',  categories_29cm: ['원피스'], categories_ably: ['원피스/세트'] },
  'onepiece': { ko: '원피스',  categories_29cm: ['원피스'], categories_ably: ['원피스/세트'] },
  'jacket':   { ko: '아우터',  categories_29cm: ['아우터'], categories_ably: ['아우터'] },
  'coat':     { ko: '아우터',  categories_29cm: ['아우터'], categories_ably: ['아우터'] },
  'outer':    { ko: '아우터',  categories_29cm: ['아우터'], categories_ably: ['아우터'] },
  'jumper':   { ko: '아우터',  categories_29cm: ['아우터'], categories_ably: ['아우터'] },
  'padding':  { ko: '아우터',  categories_29cm: ['아우터'], categories_ably: ['아우터'] },
  'set':      { ko: '셋업/세트', categories_29cm: ['셋업'], categories_ably: ['원피스/세트'] },
};
```

**기본값** (매칭 없을 시): `categories_29cm: ['전체']`, `categories_ably: ['상의', '스커트', '아우터', '원피스/세트', '팬츠']`

### styleKeywordMap

상품명 영어 키워드 → 한글 검색어 (핏/소재/디자인/패턴 등 80+ 매핑). Desktop 폴백 전용.
- `extractStyleKeywords(productName)` → `Set<string>` 반환
- 결과를 `keywordWeights.pattern` 배열로 변환하여 검색

---

## 데모 모드 동작

데모 모드(`is_demo()`)일 때 모든 API는 `demo_image_benchmark_data.py`에서 하드코딩된 데이터를 반환한다.

### 데모 데이터 요약

**베스트 상품 (5개):**
1. 빈티지 오버사이즈 후드 집업 (qty: 47)
2. 플리츠 미디 스커트 (qty: 38)
3. 데님 카고 와이드 팬츠 (qty: 31)
4. 울 블렌드 숏 코트 (qty: 26)
5. 셔링 원피스 (qty: 22)

**탭별 트렌드 결과:** 각 탭 18~24개 결과, 브랜드/상품명/점수 모두 가공된 가짜 데이터.
이미지: Unsplash 패션 이미지 (카테고리별 ID 풀에서 순환 선택).

**동적 필드:**
- `week_id`: 현재 주차 (`YYYY-WNN`)
- `data_date`: 오늘 날짜 (`YYYY년 MM월 DD일`)

---

## Next.js 포팅 시 고려사항

1. **반응형**: Desktop/Mobile 별도 템플릿 → Next.js에서는 단일 컴포넌트 + 반응형 CSS (breakpoint 기반)
2. **API 프록시**: Flask `/dashboard/image-benchmark/*` → Next.js API Route 또는 `next.config.ts` rewrite
3. **AI 키워드 추출**: 서버사이드 전용 (Vertex AI 호출, API Key 보호)
4. **카테고리 매핑/스타일 매핑**: Desktop 폴백 로직을 공유 유틸리티로 분리
5. **이미지 최적화**: `next/image` 사용, external domains 설정 (29cm, a-bly, unsplash)
6. **모달**: Mobile 모달은 Next.js Dialog/Sheet 컴포넌트로 구현
7. **스크롤 인디케이터**: Mobile 탭 스크롤 인디케이터 → CSS `scrollbar` 또는 커스텀 훅
8. **데모 모드**: 프론트에서 `is_demo` 플래그 확인 → 데모 데이터 별도 처리
9. **sessionStorage**: 업체 선택 상태 유지 (`siteSelectedCompany`, `adsSelectedCompany`)
10. **XSS 방지**: React는 기본적으로 텍스트를 이스케이프하므로 별도 처리 불필요. innerHTML 직접 사용은 피할 것.
