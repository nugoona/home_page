# SPEC: Google Ads 성과 관리 (/adcanvas_gads/performance)

> **1:1 Clone 대상** — Google Ads 성과 조회/관리 페이지
> **Flask 원본**: `templates/adcanvas_gads_performance.html` (1,718줄)
> **백엔드**: `handlers/google_ads_adcanvas_handler.py`, `services/google_ads_performance_service.py`
> **BigQuery 서비스**: `services/google_ads_insight.py`

---

## 목차

1. [페이지 초기화 및 전체 아키텍처](#1-페이지-초기화-및-전체-아키텍처)
2. [전역 변수 및 캐싱 시스템](#2-전역-변수-및-캐싱-시스템)
3. [loadData() — 핵심 데이터 로드 체인](#3-loaddata--핵심-데이터-로드-체인)
4. [renderAll() — 클라이언트 사이드 필터링 + 렌더링](#4-renderall--클라이언트-사이드-필터링--렌더링)
5. [필터 바 인터랙션 체인](#5-필터-바-인터랙션-체인)
6. [KPI 요약 (7개 지표)](#6-kpi-요약-7개-지표)
7. [캠페인 카드 렌더링 체인](#7-캠페인-카드-렌더링-체인)
8. [계층형 펼치기/접기 시스템](#8-계층형-펼치기접기-시스템)
9. [키워드 패널 체인](#9-키워드-패널-체인)
10. [검색어 패널 체인](#10-검색어-패널-체인)
11. [검색어 "제외" 빠른 액션 체인](#11-검색어-제외-빠른-액션-체인)
12. [광고 패널 체인](#12-광고-패널-체인)
13. [PMax 에셋 상세 체인](#13-pmax-에셋-상세-체인)
14. [PMax 채널 성과 체인](#14-pmax-채널-성과-체인)
15. [PMax 게재위치 체인](#15-pmax-게재위치-체인)
16. [상태 토글 체인 (3레벨)](#16-상태-토글-체인-3레벨)
17. [예산 모달 체인](#17-예산-모달-체인)
18. [제외 키워드 모달 체인](#18-제외-키워드-모달-체인)
19. [자동 펼치기 (autoExpandDefaults)](#19-자동-펼치기-autoexpanddefaults)
20. [API 엔드포인트 전체 (12개) — Request/Response 포맷](#20-api-엔드포인트-전체-12개--requestresponse-포맷)
21. [서버 사이드 데이터 파이프라인](#21-서버-사이드-데이터-파이프라인)
22. [캠페인 타입별 조건부 표시 매트릭스](#22-캠페인-타입별-조건부-표시-매트릭스)
23. [에러/검증 메시지 (한국어)](#23-에러검증-메시지-한국어)
24. [로딩 상태 패턴](#24-로딩-상태-패턴)
25. [데모 모드](#25-데모-모드)
26. [CSS 변수 및 디자인 토큰](#26-css-변수-및-디자인-토큰)

---

## 1. 페이지 초기화 및 전체 아키텍처

### 페이지 라우트

```
GET /adcanvas_gads/performance?company={company_name}
```

### 접근 제어

```python
# app.py — adcanvas_gads_performance_page()
1. session['user_id'] 없으면 → redirect(login)
2. session['is_admin'] false → redirect(index, adcanvas_blocked=1)
3. company not in session['company_names'] → redirect(adcanvas_select_account_gads)
4. render_template("adcanvas_gads_performance.html", company_names, selected_company)
```

### 서버 → 클라이언트 주입 변수 (Jinja2)

```javascript
const COMPANY = '{{ selected_company }}';          // 업체명
const ACCOUNT_ID = '{{ account_id|default("", true) }}';  // customer_id (빈 문자열 가능)
const API_BASE = '/api/google-ads/adcanvas';       // API 기본 경로
const IS_DEMO = {{ 'true' if session.get('is_demo') else 'false' }};
```

### 3개 메인 영역

1. **필터 바** — 기간 + 캠페인 타입 + 검색 + 중지 포함 토글
2. **KPI 요약** — 7개 지표 그리드
3. **캠페인 목록** — 계층형 펼치기/접기 (campaignsContainer)

### 페이지 로드 시퀀스

```
1. DOMContentLoaded
2. loadData() 자동 호출 (스크립트 마지막)
3. Promise.all([summary API, campaigns API])
4. renderSummary() → KPI 업데이트
5. campaignsData = response → renderAll() → 캠페인 HTML 생성
6. autoExpandDefaults() → 첫 번째 검색/PMax 캠페인 자동 펼치기
```

---

## 2. 전역 변수 및 캐싱 시스템

### 캐시 객체 (Lazy Load 패턴)

```javascript
let campaignsData = {};          // { search: [...], performance_max: [...], ... }
let loadedKeywords = {};         // { [ad_group_id]: [keyword_data] }
let loadedSearchTerms = {};      // { [ad_group_id]: [search_term_data] }
let loadedAds = {};              // { [ad_group_id]: [ad_data] }
let loadedAssetDetail = {};      // { [asset_group_id]: [asset_data] }
let loadedChannels = {};         // { [campaign_id]: [channel_data] }
let loadedPlacements = {};       // { [campaign_id]: [placement_data] }
let currentBudgetCampId = null;  // 예산 모달이 열린 캠페인 ID
let currentNegKwCampId = null;   // 제외 키워드 모달이 열린 캠페인 ID
```

### 캐시 규칙

- 하위 패널 펼칠 때: 캐시 있으면 API 호출 없이 캐시 데이터로 렌더링
- `loadData()` 호출 시: `campaignsData` 교체, **하위 캐시(keywords, searchTerms 등)는 유지됨** (단, renderAll()이 DOM을 재생성하므로 이전 펼침 상태는 초기화)
- 페이지 새로고침만이 모든 캐시를 초기화

---

## 3. loadData() — 핵심 데이터 로드 체인

### 전체 체인

```
[새로고침 버튼 / periodFilter 변경 / 페이지 로드]
  → loadData()
  → .refresh-btn에 'spinning' 클래스 추가 (회전 애니메이션)
  → periodFilter.value 읽기
  → Promise.all([
      api('/performance/summary', { period }),    ← ①
      api('/performance/campaigns', { period }),  ← ②
    ])
  → ① 성공: renderSummary(data) → 7개 KPI DOM 업데이트
  → ② 성공: campaignsData = data → renderAll() → autoExpandDefaults()
  → ② 실패: "데이터를 불러올 수 없습니다" 빈 상태
  → catch: showToast('데이터 로드 실패', 'error')
  → finally: .refresh-btn에서 'spinning' 제거
```

### api() 공통 래퍼

```javascript
async function api(path, body = {}) {
    const res = await fetch(API_BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: COMPANY, account_id: ACCOUNT_ID, ...body })
    });
    return res.json();
}
```

모든 API 호출에 `company`와 `account_id`가 자동 포함된다.

---

## 4. renderAll() — 클라이언트 사이드 필터링 + 렌더링

### 전체 체인

```
[typeFilter 변경 / searchInput 입력 / showAllToggle 변경]
  → renderAll()
  → 3개 필터 값 읽기:
    - typeFilter.value ('all' | 'search' | 'performance_max' | ...)
    - searchInput.value.toLowerCase()
    - showAllToggle.checked (boolean)
  → types 배열 결정:
    - 'all'이면 Object.keys(TYPE_LABELS) = ['search','performance_max','display','shopping','video','other']
    - 아니면 [typeFilter]
  → 각 type에 대해:
    - campaignsData[type] 배열 필터링:
      - !showAll && c.status === 'PAUSED' → 제외
      - searchTerm && !c.name.toLowerCase().includes(searchTerm) → 제외
    - 필터 후 0개면 → 해당 type 섹션 스킵
    - 1개 이상이면 → type-section 렌더 + 각 캠페인 renderCampaignCard()
  → 모든 type이 빈 결과면 → "표시할 캠페인이 없습니다." 빈 상태
```

### 타입 라벨 매핑

```javascript
const TYPE_LABELS = {
    search: '검색',
    performance_max: 'PMax',
    display: '디스플레이',
    shopping: '쇼핑',
    video: '영상',
    other: '기타'
};
```

### 입찰 전략 라벨 매핑

```javascript
const BIDDING_LABELS = {
    MAXIMIZE_CONVERSIONS: '전환 최대화',
    MAXIMIZE_CONVERSION_VALUE: '전환가치 최대화',
    TARGET_CPA: '타겟 CPA',
    TARGET_ROAS: '타겟 ROAS',
    TARGET_SPEND: '지출 최대화',
    MANUAL_CPC: '수동 CPC',
    TARGET_IMPRESSION_SHARE: '노출점유율',
};
```

---

## 5. 필터 바 인터랙션 체인

### 기간 필터 (서버 데이터 다시 로드)

```
[#periodFilter select] → onchange="loadData()"
  → 서버 재요청 (summary + campaigns)
  → 모든 렌더링 재실행
```

| 값 | 라벨 | 서버 변환 |
|----|------|-----------|
| `today` | 오늘 (기본, selected) | `(today, today)` |
| `yesterday` | 어제 | `(today-1, today-1)` |
| `3days` | 3일 | `(today-2, today)` |
| `7days` | 7일 | `(today-6, today)` |

#### 서버 기간 변환 함수

```python
def _resolve_period(period: str) -> Tuple[str, str]:
    today = datetime.now(KST).date()  # KST = UTC+9
    if period == "yesterday":
        d = today - timedelta(days=1)
        return str(d), str(d)
    elif period == "3days":
        return str(today - timedelta(days=2)), str(today)
    elif period == "7days":
        return str(today - timedelta(days=6)), str(today)
    else:  # "today" (기본값)
        return str(today), str(today)
```

### 캠페인 타입 필터 (클라이언트 필터링만)

```
[#typeFilter select] → onchange="renderAll()"
  → API 호출 없음, campaignsData 내에서 type 키로 필터
```

| 값 | 라벨 |
|----|------|
| `all` | 전체 타입 (기본) |
| `search` | 검색 |
| `performance_max` | PMax |
| `display` | 디스플레이 |
| `shopping` | 쇼핑 |
| `video` | 영상 |

### 캠페인 검색 (클라이언트 필터링만)

```
[#searchInput text] → oninput="renderAll()"
  → c.name.toLowerCase().includes(searchTerm) 로 필터
```

### 중지 포함 토글 (클라이언트 필터링만)

```
[#showAllToggle checkbox] → onchange="renderAll()"
  → checked=true: PAUSED 캠페인도 표시
  → checked=false(기본): PAUSED 캠페인 숨김
```

---

## 6. KPI 요약 (7개 지표)

### renderSummary(d) 체인

```
loadData() → summaryRes.data → renderSummary(d)
  → #kpiSpend.textContent = fmt(d.spend)          // ₩ + 포맷
  → #kpiPurchases.textContent = fmtNum(d.purchases) // 콤마 포맷
  → #kpiRoas.textContent = (d.roas || 0) + '%'    // 에메랄드 하이라이트
  → #kpiClicks.textContent = fmtNum(d.clicks)
  → #kpiCpc.textContent = fmt(d.cpc)
  → #kpiCtr.textContent = fmtPct(d.ctr)           // 소수점 1자리 %
  → #kpiImpressions.textContent = fmtNum(d.impressions)
```

### 7개 지표 레이아웃

| 순서 | ID | 지표 | 포맷 | CSS |
|------|-----|------|------|-----|
| 1 | `kpiSpend` | 지출 | `fmt()` → ₩숫자 | - |
| 2 | `kpiPurchases` | 전환 | `fmtNum()` → 콤마 | - |
| 3 | `kpiRoas` | ROAS | `N%` | `.highlight` (에메랄드) |
| 4 | `kpiClicks` | 클릭 | `fmtNum()` | - |
| 5 | `kpiCpc` | CPC | `fmt()` → ₩숫자 | - |
| 6 | `kpiCtr` | CTR | `fmtPct()` → N.N% | - |
| 7 | `kpiImpressions` | 노출 | `fmtNum()` | - |

### 포맷 함수

```javascript
function fmt(n) { return n == null ? '-' : '₩' + Math.round(n).toLocaleString(); }
function fmtNum(n) { return n == null ? '-' : Math.round(n).toLocaleString(); }
function fmtPct(n) { return n == null ? '-' : n.toFixed(1) + '%'; }
```

### 그리드: `grid-template-columns: repeat(7, 1fr)` (반응형에서 4칸)

---

## 7. 캠페인 카드 렌더링 체인

### renderCampaignCard(c, type)

각 캠페인 카드는 다음 구조:

```
.campaign-card (.active | .paused)
  ├── .campaign-header
  │   ├── .campaign-info
  │   │   ├── .campaign-name (캠페인명)
  │   │   └── .campaign-badges
  │   │       ├── .badge-type | .badge-pmax (타입 뱃지)
  │   │       └── .badge-bidding (입찰전략 뱃지, 있으면)
  │   └── .campaign-controls
  │       ├── .campaign-budget-area
  │       │   ├── 일일 예산 라벨
  │       │   ├── 예산 금액 (fmt)
  │       │   ├── 소진율 % (barCls 적용)
  │       │   └── "변경" 버튼 → openBudgetModal()
  │       └── .perf-toggle → toggleCampaign()
  ├── .budget-progress (진행 바)
  │   └── .budget-progress-fill (barCls 색상)
  ├── .campaign-metrics (6칸 그리드)
  │   ├── 지출 | 전환 | ROAS(에메랄드) | 클릭 | CPC | CTR
  ├── [PMax만] .pmax-guide (운영 가이드 박스)
  └── .expand-btn → toggleExpand()
      └── .items-wrap
          └── .items-inner
              ├── [PMax] renderAssetGroupItem × N + 채널/게재위치 버튼
              └── [기타] renderAdGroupItem × N
```

### 예산 소진율 계산 및 색상

```javascript
const pct = c.daily_budget > 0 ? Math.round(c.spend / c.daily_budget * 100) : 0;
const barCls = pct >= 90 ? 'danger' : pct >= 70 ? 'warn' : '';
```

| 조건 | barCls | 색상 |
|------|--------|------|
| pct < 70 | `''` | 에메랄드 (기본) |
| 70 <= pct < 90 | `'warn'` | 골드 |
| pct >= 90 | `'danger'` | 빨강 |

### 캠페인 카드 6개 지표

| 순서 | 지표 | 포맷 | 특이사항 |
|------|------|------|----------|
| 1 | 지출 | `fmt()` | - |
| 2 | 전환 | `fmtNum()` | - |
| 3 | ROAS | `N%` | `.highlight` (에메랄드) |
| 4 | 클릭 | `fmtNum()` | - |
| 5 | CPC | `fmt()` | - |
| 6 | CTR | `fmtPct()` | - |

### PMax 운영 가이드 (renderPmaxGuide)

```
PMax 캠페인에만 표시. 조건부 메시지:

- pct >= 90 → (red) "예산 활용률 N%: 예산 한도 근접 → 증액 검토 권장"
- 70 <= pct < 90 → (yellow) "예산 활용률 N%: 성과 확인 후 증액 검토"
- pct < 70 → (green) "예산 활용률 N%: 예산 여유 → 현재 수준 유지"
- roas > 300 → (blue) "ROAS N%: 우수 → 증액 시 전환 확대 기대"
- cpa > 0 → "CPA ₩N (지출÷전환)"
- 항상 → "예산 조정은 10~20% 범위로 단계적 조정 권장"
```

---

## 8. 계층형 펼치기/접기 시스템

### Level 1: 캠페인 펼치기 (toggleExpand)

```
[.expand-btn 클릭] → toggleExpand(btn)
  → btn.classList.toggle('open')       // chevron 회전
  → btn.nextElementSibling.classList.toggle('show')  // .items-wrap max-height 전환
```

API 호출 없음. 순수 CSS 토글.

### Level 2: 항목 분기

**PMax 캠페인:**
```html
<button onclick="toggleExpand(this)">에셋그룹 ${count}개 ▼</button>
→ renderAssetGroupItem(ag, campId) × N
→ 채널/게재위치/소재그룹 추가 버튼
```

**검색/디스플레이/쇼핑/영상:**
```html
<button onclick="toggleExpand(this)">광고그룹 ${count}개 ▼</button>
→ renderAdGroupItem(ag, campId, isSearch) × N
```

### Level 3: 하위 패널 (sub-panel)

각 광고그룹/에셋그룹 아이템 안에 `<div class="sub-panel" id="kw-{id}">` 등의 패널 존재.
토글 함수(toggleKeywords 등) 호출 시 해당 패널의 `.show` 토글 + 캐시 확인 + API 호출.

---

## 9. 키워드 패널 체인

### 전체 체인

```
[action-btn.kw 클릭] → toggleKeywords(agId, btn)
  → panel = #kw-{agId}
  → IF panel.show → 접기 (panel.remove('show'), btn.remove('open')) → 종료
  → IF loadedKeywords[agId] 있음 → 캐시 렌더 → panel.show, btn.open → 종료
  → ELSE:
    → panel 내 "로딩 중..." 표시
    → panel.show, btn.open
    → api('/performance/keywords', { ad_group_id: agId })
    → 성공: loadedKeywords[agId] = res.data → renderKeywordList(data)
```

### renderKeywordList(keywords)

```
- 빈 배열 → "키워드 없음"
- 처음 20개만 표시 (show = keywords.slice(0, 20))
- 나머지 있으면 → "외 {rest}개 키워드" 푸터
- maxCost = 최대 cost (바 차트 비율 계산용)
```

### 키워드 테이블 컬럼

| 컬럼 | 데이터 | 특이사항 |
|------|--------|----------|
| 유형 | `kw.match_type` | `.kw-match` 뱃지 (BROAD=확장, PHRASE=구문, EXACT=정확) |
| 키워드 | `kw.text` | max-width: 250px, ellipsis |
| 광고비 | `kw.cost` | `fmt()` + 비율 바 차트 |
| 노출 | `kw.impressions` | `fmtNum()` |
| 클릭율 | `kw.ctr` | `N%` |
| 클릭당비용 | `kw.cpc` | `fmt()` |
| 구매 | `kw.conversions` | `Math.round()` |
| ROAS | `kw.roas` | `N%` |

### 매치 타입 뱃지 색상

| 타입 | 라벨 | 색상 |
|------|------|------|
| `BROAD` | 확장 | 퍼플 (#a78bfa) |
| `PHRASE` | 구문 | 블루 (#60a5fa) |
| `EXACT` | 정확 | 에메랄드 (#34d399) |

---

## 10. 검색어 패널 체인

### 전체 체인

```
[action-btn.st 클릭] → toggleSearchTerms(agId, campId, btn)
  → panel = #st-{agId}
  → IF panel.show → 접기 → 종료
  → IF loadedSearchTerms[agId] 있음 → 캐시 렌더 → 종료
  → ELSE:
    → "로딩 중..." → panel.show
    → api('/performance/search-terms', { ad_group_id: agId })
    → 성공: loadedSearchTerms[agId] = res.data → renderSearchTermList(data, campId)
```

### renderSearchTermList(terms, campId)

```
- 빈 배열 → "최근 7일간 검색어 데이터가 없습니다" + 힌트
- 최대 30개 표시 (show = terms.slice(0, 30))
- 헤더: 전환 수 / 미전환 수 레전드
  - 전환: 초록 dot (conv)
  - 미전환: 빨강 dot (no-conv)
```

### 검색어 테이블 컬럼

| 컬럼 | 데이터 | 특이사항 |
|------|--------|----------|
| # | 순번 (1-based) | - |
| 검색어 | `st.search_term` | `.has-conv` → 초록, `.no-conv` → 기본 |
| 클릭 | `st.clicks` | 정수 |
| 노출 | `st.impressions` | `fmtNum()` |
| CTR | `st.ctr` | `N%` |
| 비용 | `st.cost` | `fmt()` |
| 전환 | `st.conversions` | `.st-conv-badge` (has=초록, none=빨강) |
| (액션) | 비전환만 | "제외" 버튼 |

### 전환 여부별 행 스타일

| 조건 | 행 클래스 | 배경 |
|------|----------|------|
| `conversions > 0` | `st-has-conv` | `rgba(16,185,129,0.03)` |
| `conversions == 0` | `st-no-conv` | `rgba(239,68,68,0.03)` |

---

## 11. 검색어 "제외" 빠른 액션 체인

### 전체 체인

```
[st-exclude 버튼 클릭] → addNegativeFromSearchTerm(campId, term, btn)
  → confirm(`"${term}"을 제외 키워드로 추가할까요?`)
    → 취소: 아무것도 안 함
    → 확인:
      → btn.disabled = true, btn.textContent = '...'
      → api('/performance/add-negative-keywords', {
          campaign_id: campId,
          keywords: [term],
          match_type: 'PHRASE'   ← ★ 항상 PHRASE 매치
        })
      → 성공:
        → btn.textContent = '완료'
        → btn.style: 초록 배경+테두리+글자
        → showToast(`"${term}" 제외 추가됨`, 'success')
      → 실패:
        → btn.textContent = '실패'
        → showToast(res.error || '추가 실패', 'error')
```

**핵심**: `confirm()` 다이얼로그 사용, match_type은 항상 `PHRASE`.

---

## 12. 광고 패널 체인

### 전체 체인

```
[action-btn.ads 클릭] → toggleAds(agId, btn)
  → panel = #ads-{agId}
  → IF panel.show → 접기 → 종료
  → IF loadedAds[agId] 있음 → 캐시 렌더 → 종료
  → ELSE:
    → "로딩 중..." → panel.show
    → period = periodFilter.value
    → api('/performance/ads', { ad_group_id: agId, period })
    → 성공: loadedAds[agId] = res.data → renderAdsList(data, agId)
```

### renderAdsList(ads, agId) — RSA Google 검색 미리보기

각 광고 카드 구조:

```
.ad-card (.paused 가능)
  ├── .ad-card-header
  │   ├── .ad-badge (RSA | 기타)
  │   ├── .ad-card-name
  │   └── .perf-toggle-sm → toggleAd(agId, adId, status)
  ├── [RSA만] .ad-search-preview
  │   ├── .ad-preview-url (favicon "Ad" + domain + path)
  │   ├── .ad-preview-headline (첫 3개 헤드라인 | 구분)
  │   └── .ad-preview-desc (첫 번째 설명문)
  ├── .ad-asset-summary
  │   ├── "H {N}개" (헤드라인 개수)
  │   ├── "D {N}개" (설명문 개수)
  │   └── "URL" (최종 URL 있으면)
  └── [RSA만] .ad-detail-toggle → 전체 문구 보기 (클라이언트 토글)
      └── .ad-detail-panel
          ├── 헤드라인 (N/15) — 번호 + 텍스트
          ├── 설명문 (N/4) — 번호 + 텍스트
          └── 최종 URL
```

### 광고 상세 펼치기 (클라이언트만)

```
[.ad-detail-toggle 클릭]
  → this.classList.toggle('open')   // chevron 회전
  → this.nextElementSibling.classList.toggle('show')  // .ad-detail-panel
```

---

## 13. PMax 에셋 상세 체인

### 전체 체인

```
[pmax-action-btn.assets 클릭] → toggleAssetDetail(agId, btn)
  → panel = #assets-{agId}
  → IF panel.show → 접기 → 종료
  → IF loadedAssetDetail[agId] 있음 → 캐시 렌더 → 종료
  → ELSE:
    → "로딩 중..." → panel.show
    → api('/performance/asset-group-detail', { asset_group_id: agId })
    → 성공: loadedAssetDetail[agId] = res.data → renderAssetList(data)
```

### renderAssetList(assets) — 2탭 구조 (클라이언트 토글)

```
.asset-tabs
  ├── [텍스트 탭] (기본 active) → switchAssetTab(this, uid, 'text')
  └── [이미지/영상 탭] → switchAssetTab(this, uid, 'media')
```

#### 텍스트 탭 (TEXT_TYPES)

분류: `HEADLINE`, `LONG_HEADLINE`, `DESCRIPTION`

| 컬럼 | 데이터 |
|------|--------|
| 타입 | `.asset-type-cell` 뱃지 (헤드라인/긴 헤드라인/설명문) |
| 콘텐츠 | `a.text` |
| 상태 | `.perf-label` 뱃지 (BEST/GOOD/LOW/LEARNING/PENDING 등) |

#### 미디어 탭 (IMAGE_TYPES + VIDEO_TYPES)

**이미지 분류**: `MARKETING_IMAGE`, `SQUARE_MARKETING_IMAGE`, `PORTRAIT_MARKETING_IMAGE`, `LOGO`, `LANDSCAPE_LOGO`

```
.asset-image-grid (auto-fill, minmax 200px)
  └── .asset-image-card
      ├── <img src="{image_url}" loading="lazy" onerror="hide">
      └── .card-info
          ├── .card-type (라벨)
          └── .card-size ({width}x{height})
```

**영상 분류**: `YOUTUBE_VIDEO`

```
.asset-image-card
  ├── .asset-video-thumb
  │   ├── <img src="https://img.youtube.com/vi/{ytId}/mqdefault.jpg">
  │   └── .play-overlay (재생 아이콘)
  └── .card-info
      ├── .card-type "영상"
      └── .card-size (ytId)
```

### 에셋 탭 전환 (switchAssetTab)

```
[asset-tab 클릭] → switchAssetTab(btn, uid, tab)
  → 모든 .asset-tab에서 .active 제거
  → 모든 .asset-tab-content에서 .active 제거
  → 클릭한 tab에 .active 추가
  → #{uid}-{tab} 에 .active 추가
```

### 에셋 타입 라벨 매핑

```javascript
const LABELS = {
    HEADLINE: '헤드라인',
    LONG_HEADLINE: '긴 헤드라인',
    DESCRIPTION: '설명문',
    MARKETING_IMAGE: '이미지',
    SQUARE_MARKETING_IMAGE: '정사각',
    PORTRAIT_MARKETING_IMAGE: '세로',
    LOGO: '로고',
    LANDSCAPE_LOGO: '가로 로고',
    YOUTUBE_VIDEO: '영상'
};
```

### 성과 라벨 뱃지 색상

| 라벨 | 색상 |
|------|------|
| `BEST` | 에메랄드 (#34d399) |
| `GOOD` | 블루 (#60a5fa) |
| `LOW` | 빨강 (#f87171) |
| `LEARNING` | 골드 (#fbbf24) |
| `PENDING`, `UNSPECIFIED`, `UNKNOWN`, `ENABLED` | 회색 (--text-muted) |

---

## 14. PMax 채널 성과 체인

### 전체 체인

```
[pmax-action-btn.channels 클릭] → toggleChannels(campId, btn)
  → panel = #channels-{campId}
  → IF panel.show → 접기 → 종료
  → IF loadedChannels[campId] 있음 → 캐시 렌더 → 종료
  → ELSE:
    → "로딩 중..." → panel.show
    → period = periodFilter.value
    → api('/performance/pmax-channels', { campaign_id: campId, period })
    → 성공: loadedChannels[campId] = res.data → renderChannelTable(data)
```

### 네트워크 라벨 매핑

```javascript
const NETWORK_LABELS = {
    SEARCH: '검색',
    SEARCH_PARTNERS: '검색 파트너',
    CONTENT: '디스플레이',
    YOUTUBE_WATCH: '유튜브',
    YOUTUBE_SEARCH: '유튜브 검색',
    MIXED: '혼합',
    UNSPECIFIED: '기타'
};
```

### 채널 테이블 컬럼

| 컬럼 | 데이터 | 포맷 |
|------|--------|------|
| 채널 | `NETWORK_LABELS[ch.network]` | font-weight:500 |
| 지출 | `ch.cost` | `fmt()` |
| 클릭 | `ch.clicks` | `fmtNum()` |
| 노출 | `ch.impressions` | `fmtNum()` |
| CTR | `ch.ctr` | `N%` |
| CPC | `ch.cpc` | `fmt()` |
| 전환 | `ch.conversions` | `Math.round()` |
| ROAS | `ch.roas` | `N%` |

---

## 15. PMax 게재위치 체인

### 전체 체인

```
[pmax-action-btn.placements 클릭] → togglePlacements(campId, btn)
  → panel = #placements-{campId}
  → IF panel.show → 접기 → 종료
  → IF loadedPlacements[campId] 있음 → 캐시 렌더 → 종료
  → ELSE:
    → "로딩 중..." → panel.show
    → api('/performance/pmax-placements', { campaign_id: campId })
    → 성공: loadedPlacements[campId] = res.data → renderPlacementList(data)
```

### 게재위치 타입 아이콘/라벨 매핑

```javascript
const PLACEMENT_ICONS = {
    WEBSITE: SVG_GLOBE,
    MOBILE_APPLICATION: SVG_PHONE,
    YOUTUBE_VIDEO: SVG_PLAY,
    YOUTUBE_CHANNEL: SVG_PLAY,
    GOOGLE_PRODUCTS: SVG_GOOGLE
};

const PLACEMENT_TYPE_LABELS = {
    WEBSITE: '웹사이트',
    MOBILE_APPLICATION: '앱',
    YOUTUBE_VIDEO: '유튜브',
    YOUTUBE_CHANNEL: '유튜브',
    GOOGLE_PRODUCTS: 'Google'
};
```

### 게재위치 테이블 컬럼

| 컬럼 | 데이터 | 특이사항 |
|------|--------|----------|
| (아이콘) | SVG 아이콘 | placement_type별 |
| 유형 | `.placement-type-badge` 뱃지 | 퍼플 색상 |
| 게재위치 | `p.display_name \|\| p.target_url` | max-width: 350px, ellipsis |
| 노출 | `p.impressions` | `fmtNum()` + 비율 바 (#a78bfa 퍼플) |
| (빈) | - | - |

바 차트: `maxImpr = Math.max(...placements.map(p => p.impressions), 1)`, 각 항목 `barW = p.impressions / maxImpr * 100`

---

## 16. 상태 토글 체인 (3레벨)

### 캠페인 토글

```
[.perf-toggle 클릭] → event.preventDefault() → toggleCampaign(id, status, el)
  → el.classList.add('loading')    // opacity 0.5, pointer-events none
  → api('/performance/toggle-status', {
      entity_type: 'campaign',
      entity_id: id,
      status: 'ENABLED' | 'PAUSED'
    })
  → el.classList.remove('loading')
  → 성공:
    → showToast(res.message, 'success')
    → checkbox.checked = (status === 'ENABLED')
    → .campaign-card 클래스 → 'active' | 'paused'
    → onclick 속성 업데이트 (다음 클릭 시 반대 상태로)
  → 실패: showToast(res.error || '실패', 'error')
```

### 광고그룹 토글

```
[.perf-toggle-sm 클릭] → event.preventDefault() → toggleAdGroup(id, status, el)
  → el.classList.add('loading')
  → api('/performance/toggle-status', {
      entity_type: 'ad_group',
      entity_id: id,
      status
    })
  → 성공:
    → .ag-item 클래스 → '' | 'paused'
    → onclick 속성 업데이트
  → 실패: showToast
```

### 광고 토글

```
[.perf-toggle-sm 클릭] → event.preventDefault() → toggleAd(agId, adId, status, el)
  → el.classList.add('loading')
  → api('/performance/toggle-status', {
      entity_type: 'ad',
      entity_id: adId,
      status,
      ad_group_id: agId     ← ★ 광고 토글에만 필요
    })
  → 성공:
    → .ad-item 클래스 → '' | 'paused'
    → onclick 속성 업데이트
  → 실패: showToast
```

### UI 상태 표현

| 상태 | checkbox | 슬라이더 배경 | 카드 클래스 |
|------|----------|--------------|------------|
| ENABLED | checked | `var(--accent-blue)` | `.active` (에메랄드 좌측 보더) |
| PAUSED | unchecked | `#3f3f46` | `.paused` (회색 좌측 보더) |

### 토글 크기

| 사용처 | 클래스 | 크기 |
|--------|--------|------|
| 캠페인 | `.perf-toggle` | 50x26px, 원 20px |
| 광고그룹/광고 | `.perf-toggle-sm` | 36x20px, 원 14px |

---

## 17. 예산 모달 체인

### 모달 구조

```
#budgetModal (.modal-overlay)
  └── .modal-content
      ├── .modal-header ("일일 예산 수정" + 닫기 X)
      ├── #budgetInput (type=number, 원)
      ├── .preset-grid (3x2 = 6개 프리셋)
      │   ├── -1만 (-10,000) / -5만 (-50,000) / -10만 (-100,000) [minus 빨강]
      │   └── +1만 (+10,000) / +5만 (+50,000) / +10만 (+100,000) [plus 파랑]
      └── #budgetSaveBtn "예산 변경"
```

### 열기 체인

```
["변경" 버튼 클릭] → openBudgetModal(campId, current)
  → currentBudgetCampId = campId
  → budgetInput.value = current (현재 예산)
  → budgetModal.classList.add('show')
```

### 프리셋 조정 체인

```
[preset-btn 클릭] → adjustBudget(delta)
  → input.value = Math.max(1000, (parseInt(input.value) || 0) + delta)
```

**핵심**: 최소값 1000으로 클램핑.

### 저장 체인

```
[#budgetSaveBtn 클릭] → saveBudget()
  → budget = parseInt(budgetInput.value)
  → IF !budget || budget < 1000
    → showToast('최소 예산은 ₩1,000입니다', 'error') → 종료
  → btn.disabled = true, btn.textContent = '변경 중...'
  → api('/performance/update-budget', {
      campaign_id: currentBudgetCampId,
      daily_budget: budget
    })
  → btn.disabled = false, btn.textContent = '예산 변경' (복원)
  → 성공:
    → showToast(res.message, 'success')
    → closeBudgetModal()
    → loadData()     ← ★ 전체 데이터 새로고침
  → 실패: showToast(res.error || '변경 실패', 'error')
```

### 닫기

```
[X 버튼] → closeBudgetModal() → budgetModal.classList.remove('show')
[모달 오버레이 클릭] → 모달 외부 클릭 리스너 → closeBudgetModal()
```

---

## 18. 제외 키워드 모달 체인

### 모달 구조

```
#negKwModal (.modal-overlay)
  └── .modal-content
      ├── .modal-header ("제외 키워드" + 닫기 X)
      ├── "기존 제외 키워드" 라벨
      ├── #negKwList (.neg-kw-list) — 기존 키워드 목록 (스크롤, max-height:200px)
      ├── "제외 키워드 추가 (쉼표 구분)" 라벨
      ├── #negKwInput (textarea, placeholder "예: 무료, 중고, 리뷰")
      ├── .match-type-radios
      │   ├── PHRASE — 구문 일치 (기본, checked)
      │   ├── EXACT — 정확히 일치
      │   └── BROAD — 확장 일치
      └── "추가" 버튼
```

### 열기 체인

```
[action-btn.neg 클릭] → openNegKwModal(campId)
  → currentNegKwCampId = campId
  → negKwInput.value = '' (초기화)
  → negKwList = "로딩 중..."
  → negKwModal.classList.add('show')
  → api('/performance/negative-keywords', { campaign_id: campId })
  → 성공:
    → 빈 배열 → "제외 키워드 없음"
    → 데이터 있으면:
      → .neg-kw-item × N
        ├── .neg-kw-match 뱃지 (매치 타입)
        └── 키워드 텍스트
```

### 추가 체인

```
["추가" 버튼 클릭] → addNegativeKeywords()
  → text = negKwInput.value.trim()
  → IF !text → showToast('키워드를 입력해주세요', 'error') → 종료
  → keywords = text.split(',').map(trim).filter(Boolean)
  → matchType = checked radio value ('PHRASE' | 'EXACT' | 'BROAD')
  → api('/performance/add-negative-keywords', {
      campaign_id: currentNegKwCampId,
      keywords,
      match_type: matchType
    })
  → 성공:
    → showToast(`${keywords.length}개 제외 키워드 추가됨`, 'success')
    → closeNegKwModal()
  → 실패: showToast(res.error || '추가 실패', 'error')
```

---

## 19. 자동 펼치기 (autoExpandDefaults)

`loadData()` 성공 후 호출. 첫 번째 검색/PMax 캠페인의 하위 패널을 자동 펼침.

### 검색 캠페인 자동 펼치기

```
1. campaignsData.search 에서 첫 번째 캠페인 찾기
2. .type-badge.search 가 있는 .type-section 찾기
3. .expand-btn 이 아직 open 아니면 → toggleExpand() (광고그룹 펼치기)
4. 첫 번째 광고그룹(firstAg)의:
   - 키워드 버튼 찾기 → await toggleKeywords()
   - 검색어 버튼 찾기 → await toggleSearchTerms()
   - 광고 버튼 찾기 → await toggleAds()
```

### PMax 캠페인 자동 펼치기

```
1. campaignsData.performance_max 에서 첫 번째 캠페인 찾기
2. .type-badge.performance_max 가 있는 .type-section 찾기
3. .expand-btn → toggleExpand() (에셋그룹 펼치기)
4. 첫 번째 에셋그룹의:
   - 에셋 상세 버튼 → await toggleAssetDetail()
   - 에셋 로드 후: 미디어 탭으로 자동 전환 (mediaTab.click())
5. 채널 성과 버튼 → await toggleChannels()
```

---

## 20. API 엔드포인트 전체 (12개) — Request/Response 포맷

모든 엔드포인트의 공통 사항:

- **Blueprint**: `google_ads_adcanvas_bp` (url_prefix=`/api/google-ads/adcanvas`)
- **메서드**: POST
- **인증**: `@admin_required` (session['user_id'] + session['is_admin'])
- **공통 요청 필드**: `company` (필수), `account_id` (선택)
- **접근 제어**: `verify_company_access(company)` → session['company_names'] 확인

---

### API #1: 성과 요약

```
POST /api/google-ads/adcanvas/performance/summary

Request Body:
{
    "company": "업체명",       // 필수
    "account_id": "xxx",      // 선택
    "period": "today"          // "today"|"yesterday"|"3days"|"7days"
}

Response (성공):
{
    "success": true,
    "data": {
        "spend": 245000,           // float → 원화
        "purchases": 12,           // int → 전환 수
        "purchase_value": 1860000, // float → 전환 가치
        "roas": 760,               // int → % (purchase_value / spend * 100)
        "clicks": 580,             // int
        "cpc": 422,                // int → 원화 (spend / clicks)
        "ctr": 3.21,               // float → % (clicks / impressions * 100)
        "impressions": 18060,      // int
        "cvr": 2.07,               // float → % (purchases / clicks * 100)
        "aov": 155000              // int → 원화 (purchase_value / purchases)
    }
}

Response (에러):
{ "error": "company 파라미터가 필요합니다" }  // 400
{ "error": "접근 권한이 없습니다" }           // 403
```

**서버 파이프라인**:
```
perf_service.get_performance_summary(company, account_id, period)
  → _resolve_period(period) → (start_date, end_date)
  → get_google_ads_insight_table(level="account", ..., date_type="summary")
    → BigQuery: google_ads_account_summary 테이블
    → SUM(cost) AS spend, SUM(impressions), SUM(clicks), SUM(conversions) AS purchases, SUM(conversions_value) AS purchase_value
    → HAVING SUM(cost) > 0 OR SUM(conversions) > 0
  → _calc_derived_metrics(row) → cpc, ctr, roas, cvr, aov 추가
```

---

### API #2: 캠페인 목록

```
POST /api/google-ads/adcanvas/performance/campaigns

Request Body:
{
    "company": "업체명",
    "account_id": "xxx",
    "period": "today"
}

Response (성공):
{
    "success": true,
    "data": {
        "search": [
            {
                "id": "123456",
                "name": "캠페인명",
                "type": "SEARCH",
                "status": "ENABLED",          // "ENABLED" | "PAUSED"
                "daily_budget": 50000,         // 원화
                "bidding_strategy": "MAXIMIZE_CONVERSIONS",
                "spend": 35000,
                "purchases": 5,
                "purchase_value": 450000,
                "roas": 1285,
                "clicks": 120,
                "cpc": 291,
                "ctr": 3.45,
                "impressions": 3478,
                "ad_groups": [
                    {
                        "id": "789",
                        "name": "광고그룹명",
                        "status": "ENABLED",
                        "spend": 12000,
                        "clicks": 45,
                        "impressions": 1200,
                        "conversions": 2,
                        "conversions_value": 180000,
                        "cpc": 267,
                        "ctr": 3.75,
                        "roas": 1500,
                        "cvr": 4.44
                    }
                ],
                "asset_groups": []
            }
        ],
        "performance_max": [
            {
                "id": "456789",
                "name": "PMax 캠페인",
                "type": "PERFORMANCE_MAX",
                "status": "ENABLED",
                "daily_budget": 80000,
                "bidding_strategy": "MAXIMIZE_CONVERSION_VALUE",
                "spend": 72000,
                "purchases": 8,
                "purchase_value": 960000,
                "roas": 1333,
                "clicks": 250,
                "cpc": 288,
                "ctr": 1.85,
                "impressions": 13500,
                "ad_groups": [],
                "asset_groups": [
                    {
                        "id": "ag_001",
                        "name": "에셋그룹명",
                        "status": "ENABLED",
                        "ad_strength": "GOOD",
                        "clicks": 120,
                        "impressions": 8500,
                        "cost": 35000,
                        "conversions": 4,
                        "conversions_value": 480000
                    }
                ]
            }
        ],
        "display": [...],
        "shopping": [...],
        "video": [...],
        "other": [...]
    }
}
```

**서버 파이프라인**:
```
perf_service.get_campaigns_with_performance(company, account_id, period)
  → _resolve_period(period)
  → get_customer_id_for_company(company) → customer_id
  → ThreadPoolExecutor(max_workers=3) 병렬 실행:
    ├── BigQuery: google_ads_campaign_summary → 캠페인별 성과 (perf_map)
    ├── Google Ads API: get_campaigns_status_and_budget(customer_id) → 상태/예산
    └── BigQuery: google_ads_adgroup_summary → 광고그룹별 성과 (ag_perf_map)
  → 병합:
    - 각 캠페인: perf_map에서 성과 + _calc_derived_metrics
    - PMax → get_asset_groups_for_campaign → asset_groups
    - 기타 → get_ad_groups_for_campaign → ad_groups + ag_perf_map 병합
  → _TYPE_MAP으로 그룹핑
  → 각 그룹 내 지출 높은 순 정렬: sort(key=(-spend, name))
```

---

### API #3: 광고 목록

```
POST /api/google-ads/adcanvas/performance/ads

Request Body:
{
    "company": "업체명",
    "account_id": "xxx",
    "ad_group_id": "789",
    "period": "today"
}

Response (성공):
{
    "success": true,
    "data": [
        {
            "id": "ad_001",
            "name": "광고명",
            "status": "ENABLED",
            "type": "RESPONSIVE_SEARCH_AD",
            "headlines": ["헤드라인1", "헤드라인2", ...],
            "descriptions": ["설명문1", "설명문2", ...],
            "final_url": "https://example.com/product",
            "headline_pins": [null, 1, null, ...]
        }
    ]
}

에러: "company, ad_group_id 파라미터가 필요합니다" (400)
```

**서버**: `api_get_ads(customer_id, ad_group_id)` (Google Ads API 직접 호출)

---

### API #4: 상태 토글

```
POST /api/google-ads/adcanvas/performance/toggle-status

Request Body:
{
    "company": "업체명",
    "account_id": "xxx",
    "entity_type": "campaign",     // "campaign" | "ad_group" | "ad"
    "entity_id": "123",
    "status": "ENABLED",           // "ENABLED" | "PAUSED"
    "ad_group_id": "789"           // entity_type="ad" 일 때만 필요
}

Response (성공):
{ "success": true, "message": "캠페인이 활성화되었습니다" }

Response (실패):
{ "success": false, "error": "메시지" }

검증 에러:
- "company, entity_type, entity_id, status가 필요합니다" (400)
- "entity_type은 campaign, ad_group, ad 중 하나여야 합니다" (400)
- "status는 ENABLED 또는 PAUSED여야 합니다" (400)
```

**서버**: entity_type에 따라 분기
```python
"campaign" → toggle_campaign_status(customer_id, entity_id, status)
"ad_group" → toggle_ad_group_status(customer_id, entity_id, status)
"ad"       → toggle_ad_status(customer_id, ad_group_id, entity_id, status)
```

---

### API #5: 예산 변경

```
POST /api/google-ads/adcanvas/performance/update-budget

Request Body:
{
    "company": "업체명",
    "account_id": "xxx",
    "campaign_id": "123",
    "daily_budget": 50000          // 원화, 정수
}

Response (성공):
{ "success": true, "message": "예산이 ₩50,000으로 변경되었습니다" }

검증 에러:
- "company, campaign_id, daily_budget가 필요합니다" (400)
- "daily_budget은 숫자여야 합니다" (400)
- 서비스 레이어: "최소 예산은 ₩1,000입니다." (daily_budget < 1000)
```

**서버**: `int(daily_budget)` 변환 → `update_campaign_daily_budget(customer_id, campaign_id, daily_budget)`

---

### API #6: 키워드

```
POST /api/google-ads/adcanvas/performance/keywords

Request Body:
{
    "company": "업체명",
    "ad_group_id": "789"
}

Response (성공):
{
    "success": true,
    "data": [
        {
            "text": "봄 자켓",
            "match_type": "BROAD",        // "BROAD" | "PHRASE" | "EXACT"
            "status": "ENABLED",
            "clicks": 245,
            "impressions": 7800,
            "ctr": 3.14,
            "cpc": 320,
            "cost": 78400,
            "conversions": 5,
            "roas": 892
        }
    ]
}

에러: "company, ad_group_id 파라미터가 필요합니다" (400)
```

**서버**: `get_ad_group_keywords_with_metrics(customer_id, ad_group_id)` (Google Ads API, 최근 7일 고정)

---

### API #7: 검색어

```
POST /api/google-ads/adcanvas/performance/search-terms

Request Body:
{
    "company": "업체명",
    "ad_group_id": "789"
}

Response (성공):
{
    "success": true,
    "data": [
        {
            "search_term": "봄 자켓 추천",
            "clicks": 87,
            "impressions": 2400,
            "ctr": 3.63,
            "cost": 28710,
            "conversions": 2,
            "conversions_value": 180000
        }
    ]
}
```

**서버**: `get_search_terms_for_ad_group(customer_id, ad_group_id)` (Google Ads API, 최근 7일 고정)

---

### API #8: 제외 키워드 조회

```
POST /api/google-ads/adcanvas/performance/negative-keywords

Request Body:
{
    "company": "업체명",
    "campaign_id": "123"
}

Response (성공):
{
    "success": true,
    "data": [
        { "text": "중고", "match_type": "PHRASE" },
        { "text": "무료나눔", "match_type": "EXACT" }
    ]
}

에러: "company, campaign_id 파라미터가 필요합니다" (400)
```

**서버**: `get_campaign_negative_keywords(customer_id, campaign_id)` (Google Ads API)

---

### API #9: 제외 키워드 추가

```
POST /api/google-ads/adcanvas/performance/add-negative-keywords

Request Body:
{
    "company": "업체명",
    "campaign_id": "123",
    "keywords": ["중고", "무료"],
    "match_type": "PHRASE"         // "EXACT" | "PHRASE" | "BROAD" (기본: PHRASE)
}

Response (성공):
{ "success": true, "message": "제외 키워드 2개 추가 완료" }

검증 에러:
- "company, campaign_id, keywords 파라미터가 필요합니다" (400)
- "match_type은 EXACT, PHRASE, BROAD 중 하나여야 합니다" (400)
```

**서버**: `add_negative_keywords(customer_id, campaign_id, keywords, match_type)` (Google Ads API)

---

### API #10: PMax 에셋 상세

```
POST /api/google-ads/adcanvas/performance/asset-group-detail

Request Body:
{
    "company": "업체명",
    "asset_group_id": "ag_001"
}

Response (성공):
{
    "success": true,
    "data": [
        {
            "field_type": "HEADLINE",
            "text": "봄 자켓 추천 아이템",
            "performance_label": "BEST",
            "image_url": null,
            "youtube_id": null,
            "img_width": null,
            "img_height": null
        },
        {
            "field_type": "MARKETING_IMAGE",
            "text": null,
            "performance_label": "GOOD",
            "image_url": "https://...",
            "img_width": 1200,
            "img_height": 628
        },
        {
            "field_type": "YOUTUBE_VIDEO",
            "text": null,
            "performance_label": "LEARNING",
            "youtube_id": "dQw4w9WgXcQ"
        }
    ]
}

에러: "company, asset_group_id 파라미터가 필요합니다" (400)
```

**서버**: `get_asset_group_assets(customer_id, asset_group_id)` (Google Ads API)

---

### API #11: PMax 채널 성과

```
POST /api/google-ads/adcanvas/performance/pmax-channels

Request Body:
{
    "company": "업체명",
    "campaign_id": "456789",
    "period": "today"
}

Response (성공):
{
    "success": true,
    "data": [
        {
            "network": "SEARCH",
            "impressions": 4200,
            "clicks": 128,
            "cost": 45000,
            "conversions": 3.0,
            "conversions_value": 456000,
            "ctr": 3.05,
            "cpc": 352,
            "roas": 1013
        }
    ]
}

에러: "company, campaign_id 파라미터가 필요합니다" (400)
```

**서버 BQ 쿼리**:
```sql
SELECT network, SUM(impressions), SUM(clicks), SUM(cost), SUM(conversions),
       SUM(conversions_value),
       SAFE_DIVIDE(SUM(clicks), SUM(impressions)) * 100 as ctr,
       SAFE_DIVIDE(SUM(cost), SUM(clicks)) as cpc,
       SAFE_DIVIDE(SUM(conversions_value), SUM(cost)) * 100 as roas
FROM google_ads_network_performance
WHERE customer_id=@cid AND campaign_id=@cid AND date BETWEEN @s AND @e
GROUP BY network ORDER BY cost DESC
```

---

### API #12: PMax 게재위치

```
POST /api/google-ads/adcanvas/performance/pmax-placements

Request Body:
{
    "company": "업체명",
    "campaign_id": "456789"
}

Response (성공):
{
    "success": true,
    "data": [
        {
            "display_name": "fashion-blog.co.kr",
            "placement_type": "WEBSITE",
            "target_url": "https://fashion-blog.co.kr",
            "impressions": 4800
        }
    ]
}

에러: "company, campaign_id 파라미터가 필요합니다" (400)
```

**서버**: `get_pmax_placements(customer_id, campaign_id)` (Google Ads API)

---

## 21. 서버 사이드 데이터 파이프라인

### 캠페인 타입 매핑 (서비스 레이어)

```python
_TYPE_MAP = {
    "SEARCH": "search",
    "PERFORMANCE_MAX": "performance_max",
    "DISPLAY": "display",
    "SHOPPING": "shopping",
    "VIDEO": "video",
}
# 매칭되지 않는 타입 → "other"
```

### 파생 지표 계산 (캠페인/계정 레벨)

```python
def _calc_derived_metrics(row):
    row["cpc"] = round(spend / clicks) if clicks > 0 else 0
    row["ctr"] = round(clicks / impressions * 100, 2) if impressions > 0 else 0
    row["roas"] = round(purchase_value / spend * 100) if spend > 0 else 0
    row["cvr"] = round(purchases / clicks * 100, 2) if clicks > 0 else 0
    row["aov"] = round(purchase_value / purchases) if purchases > 0 else 0
    return row
```

### 파생 지표 계산 (광고그룹 레벨)

```python
def _calc_adgroup_derived(row):
    row["cpc"] = round(spend / clicks) if clicks > 0 else 0
    row["ctr"] = round(clicks / impressions * 100, 2) if impressions > 0 else 0
    row["roas"] = round(conversions_value / spend * 100) if spend > 0 else 0
    row["cvr"] = round(conversions / clicks * 100, 2) if clicks > 0 else 0
    return row
```

### BigQuery 테이블 사용 현황

| 테이블 | 용도 | API |
|--------|------|-----|
| `google_ads_account_summary` | 계정 KPI 요약 | #1 summary |
| `google_ads_campaign_summary` | 캠페인별 성과 | #2 campaigns |
| `google_ads_adgroup_summary` | 광고그룹별 성과 | #2 campaigns (하위) |
| `google_ads_network_performance` | PMax 채널 성과 | #11 pmax-channels |

### Google Ads API 함수 사용 현황

| 함수 | 용도 | API |
|------|------|-----|
| `get_campaigns_status_and_budget` | 상태/예산 실시간 | #2 |
| `get_ad_groups_for_campaign` | 광고그룹 목록 | #2 |
| `get_asset_groups_for_campaign` | PMax 에셋그룹 목록 | #2 |
| `api_get_ads` | 광고 + RSA 상세 | #3 |
| `get_ad_group_keywords_with_metrics` | 키워드 + 성과 | #6 |
| `get_search_terms_for_ad_group` | 검색어 + 성과 | #7 |
| `get_campaign_negative_keywords` | 제외 키워드 조회 | #8 |
| `add_negative_keywords` | 제외 키워드 추가 | #9 |
| `get_asset_group_assets` | PMax 에셋 상세 | #10 |
| `get_pmax_placements` | 게재위치 | #12 |
| `toggle_campaign_status` | 캠페인 상태 변경 | #4 |
| `toggle_ad_group_status` | 광고그룹 상태 변경 | #4 |
| `toggle_ad_status` | 광고 상태 변경 | #4 |
| `update_campaign_daily_budget` | 예산 수정 | #5 |

### 정렬

- 캠페인: 각 타입 내 `sort(key=lambda c: (-c["spend"], c["name"]))` (지출 높은 순)
- BigQuery 기본: `HAVING SUM(cost) > 0 OR SUM(conversions) > 0` (비활성 제외)
- 채널: `ORDER BY cost DESC`

---

## 22. 캠페인 타입별 조건부 표시 매트릭스

| 기능 | search | performance_max | display/shopping/video |
|------|--------|-----------------|----------------------|
| 키워드 버튼 | O | X | X |
| 검색어 버튼 | O | X | X |
| 제외 키워드 모달 버튼 | O | X | X |
| 에셋 상세 (텍스트/미디어 탭) | X | O | X |
| 채널별 성과 버튼 | X | O | X |
| 게재위치 분석 버튼 | X | O | X |
| 소재그룹 추가 링크 | X | O | X |
| PMax 가이드 박스 | X | O | X |
| 광고 버튼 | O | X* | O |
| 상태 토글 (캠페인) | O | O | O |
| 상태 토글 (광고그룹) | O | X** | O |
| 예산 편집 | O | O | O |

*PMax는 광고그룹 대신 에셋그룹을 가지며, 에셋그룹에는 광고 버튼이 없음
**PMax 에셋그룹에는 상태 뱃지(ENABLED/PAUSED)만 표시하며 토글 없음

### 코드 분기 포인트

```javascript
// renderCampaignCard()
const isPmax = type === 'performance_max';
const isSearch = type === 'search';

// 펼치기 분기
if (isPmax && c.asset_groups.length) → renderAssetGroupItem + 채널/게재위치 버튼
else if (!isPmax && c.ad_groups.length) → renderAdGroupItem

// renderAdGroupItem()
if (isSearch) → 키워드 + 검색어 + 제외 키워드 버튼
// 광고 버튼은 항상 표시
```

---

## 23. 에러/검증 메시지 (한국어)

### 핸들러 레벨 (400)

| 메시지 | 트리거 |
|--------|--------|
| "company 파라미터가 필요합니다" | summary, campaigns에서 company 없을 때 |
| "접근 권한이 없습니다" | verify_company_access 실패 |
| "company, ad_group_id 파라미터가 필요합니다" | ads, keywords, search-terms |
| "company, campaign_id 파라미터가 필요합니다" | negative-keywords, pmax-channels, pmax-placements |
| "company, asset_group_id 파라미터가 필요합니다" | asset-group-detail |
| "company, entity_type, entity_id, status가 필요합니다" | toggle-status |
| "entity_type은 campaign, ad_group, ad 중 하나여야 합니다" | toggle-status |
| "status는 ENABLED 또는 PAUSED여야 합니다" | toggle-status |
| "company, campaign_id, daily_budget가 필요합니다" | update-budget |
| "daily_budget은 숫자여야 합니다" | update-budget (parseInt 실패) |
| "company, campaign_id, keywords 파라미터가 필요합니다" | add-negative-keywords |
| "match_type은 EXACT, PHRASE, BROAD 중 하나여야 합니다" | add-negative-keywords |

### 클라이언트 레벨

| 메시지 | 트리거 |
|--------|--------|
| "최소 예산은 ₩1,000입니다" | saveBudget() 클라이언트 검증 |
| "키워드를 입력해주세요" | addNegativeKeywords() 빈 입력 |
| "데이터 로드 실패" | loadData() catch |

### 서비스 레벨

| 메시지 | 트리거 |
|--------|--------|
| "최소 예산은 ₩1,000입니다." | perf_service.update_budget (daily_budget < 1000) |
| "광고 상태 변경에는 ad_group_id가 필요합니다." | toggle_entity_status (ad without ad_group_id) |
| "지원하지 않는 entity_type: {type}" | toggle_entity_status |

### 성공 메시지

| 메시지 | 트리거 |
|--------|--------|
| "예산이 변경되었습니다" | update-budget 성공 (서버) |
| "상태가 변경되었습니다." | toggle-status 성공 (서버) |
| "제외 키워드 N개 추가 완료" | add-negative-keywords 성공 (서버) |
| `${N}개 제외 키워드 추가됨` | addNegativeKeywords 성공 (클라이언트 토스트) |
| `"${term}" 제외 추가됨` | addNegativeFromSearchTerm 성공 (클라이언트 토스트) |

---

## 24. 로딩 상태 패턴

| 위치 | 트리거 | 방식 | 복원 |
|------|--------|------|------|
| 새로고침 버튼 | `loadData()` | `.refresh-btn.spinning` → SVG 360도 회전 1s | finally에서 제거 |
| 하위 패널 | `toggleKeywords/SearchTerms/Ads/AssetDetail/Channels/Placements` | "로딩 중..." 텍스트 (font-size:11px, color:muted) | 성공 시 렌더링 결과로 교체 |
| 토글 | `toggleCampaign/AdGroup/Ad` | `.loading` 클래스 → opacity 0.5, pointer-events disabled | API 응답 후 제거 |
| 예산 저장 | `saveBudget()` | btn.disabled=true, textContent='변경 중...' | API 응답 후 btn.disabled=false, textContent='예산 변경' |
| 제외 키워드 (빠른) | `addNegativeFromSearchTerm` | btn.disabled=true, textContent='...' | 성공: '완료'+초록, 실패: '실패' |
| 페이지 초기 | DOM 기본 | `#campaignsContainer` 내 `.loading-wrap` + spinner + "데이터를 불러오는 중..." | loadData() 완료 시 교체 |

---

## 25. 데모 모드

### 판별

```javascript
const IS_DEMO = {{ 'true' if session.get('is_demo') else 'false' }};
```

### 데모 배너

```
Jinja2 {% if session.get('is_demo') %} 블록에서 즉시실행함수로 삽입:
"데모 모드 — 예산/상태를 자유롭게 변경해보세요. 실제 광고에 반영되지 않습니다."
```

### 소재그룹 추가 링크 차단

```javascript
// PMax 소재그룹 추가 링크
onclick="if(IS_DEMO){event.preventDefault();showToast('데모 계정에서는 소재그룹 추가가 지원되지 않습니다','error');return false;}"
```

### 데모 데이터 소스

핸들러에서 각 API별 데모 데이터 반환:
```python
if is_demo():
    demo_delay()  # 인위적 지연 (일부 API)
    return jsonify(demo_gads_data.XXXX)
```

| API | 데모 데이터 | demo_delay |
|-----|------------|------------|
| summary | `get_gads_performance_summary(period)` — 기간별 배수 적용 | X |
| campaigns | `get_gads_performance_campaigns(period)` | X |
| ads | `PERFORMANCE_ADS["ads"]` | X |
| toggle-status | `TOGGLE_SUCCESS` | O |
| update-budget | `BUDGET_SUCCESS` | O |
| keywords | `KEYWORD_PERFORMANCE` | X |
| search-terms | `SEARCH_TERMS` | X |
| negative-keywords | `NEGATIVE_KEYWORDS` | O |
| add-negative-keywords | 고정 성공 응답 | O |
| asset-group-detail | `PMAX_ASSET_GROUP_DETAIL` | X |
| pmax-channels | `PMAX_CHANNEL_PERFORMANCE` | X |
| pmax-placements | `PMAX_PLACEMENT_REPORT` | O |

---

## 26. CSS 변수 및 디자인 토큰

### 색상 변수

```css
:root {
    --bg-primary: #09090B;
    --bg-secondary: #121215;
    --bg-card: #18181B;
    --bg-card-hover: #1f1f23;
    --bg-input: #0d0d0f;
    --border-default: #27272A;
    --border-subtle: rgba(255, 255, 255, 0.06);
    --border-hover: rgba(255, 255, 255, 0.12);
    --text-primary: #ffffff;
    --text-secondary: #d4d4d8;
    --text-muted: #a1a1aa;
    --accent-blue: #3b82f6;
    --accent-emerald: #10b981;
    --accent-gold: #f59e0b;
    --accent-red: #ef4444;
}
```

### 폰트

```css
font-family: 'Pretendard', 'Inter Tight', -apple-system, sans-serif;
.font-inter { font-family: 'Inter Tight', sans-serif; }  /* 숫자 전용 */
```

- **Pretendard**: 한글 UI 텍스트
- **Inter Tight**: 숫자, 지표값 (`.font-inter`, `.campaign-metric .val`, `.perf-summary-value`, `.budget-input`)

### 레이아웃

- **헤더 높이**: 56px, fixed, z-index:1000
- **메인 컨테이너**: max-width:100%, padding:80px 40px 40px 40px
- **KPI 그리드**: 7칸 → 반응형 4칸 (768px 이하)
- **캠페인 지표**: 6칸 → 반응형 3칸
- **에셋 이미지 그리드**: auto-fill, minmax(200px, 1fr)

### 토스트

```
.toast-container: fixed, top:50%, left:50%, transform:translate(-50%,-50%), z-index:10000
.toast: 2500ms 표시 후 자동 숨김
.toast.success: 에메랄드 테두리 + 그라데이션 배경
.toast.error: 빨강 테두리 + 그라데이션 배경
```

### 모달

```
.modal-overlay: fixed inset 0, background:rgba(0,0,0,0.7), z-index:1000
.modal-content: max-width:500px, max-height:80vh, border-radius:16px
  - 열기 애니메이션: translateY(20px) + opacity 0 → 0 + 1 (0.3s)
  - 외부 클릭 닫기: addEventListener('click', e.target === this → close)
```

### 반응형 브레이크포인트

```css
@media (max-width: 768px) {
    .perf-container { padding: 70px 16px 16px; }
    .perf-summary-grid { grid-template-columns: repeat(4, 1fr); }
    .campaign-header { flex-wrap: wrap; gap: 12px; }
    .campaign-info { min-width: 100%; }
    .campaign-metrics { grid-template-columns: repeat(3, 1fr); }
}
```

---

## 부록: 광고그룹 아이템 렌더링 (renderAdGroupItem)

```
.ag-item (.paused 가능)
  ├── .ag-top
  │   ├── .ag-name (광고그룹명)
  │   └── .perf-toggle-sm → toggleAdGroup()
  ├── .metrics-4 (6칸 그리드)
  │   ├── 지출 | 클릭 | 노출 | CPC | 전환 | ROAS(에메랄드)
  ├── .ag-actions
  │   ├── [검색만] action-btn.kw → toggleKeywords()
  │   ├── [검색만] action-btn.st → toggleSearchTerms()
  │   ├── [항상] action-btn.ads → toggleAds()
  │   └── [검색만] action-btn.neg → openNegKwModal()
  ├── #kw-{agId} sub-panel (키워드)
  ├── #st-{agId} sub-panel (검색어)
  └── #ads-{agId} sub-panel (광고)
```

## 부록: 에셋그룹 아이템 렌더링 (renderAssetGroupItem)

```
.asset-group-item
  ├── .asset-group-top
  │   ├── SVG 다이아몬드 아이콘 (파랑)
  │   ├── .asset-group-name
  │   ├── .ag-strength 뱃지 (EXCELLENT/GOOD/AVERAGE/POOR)
  │   └── .ag-status-badge (ENABLED=ON/PAUSED=OFF)
  ├── .metrics-4 (6칸 그리드)
  │   ├── 지출 | 클릭 | 노출 | 전환 | CPC | ROAS(에메랄드)
  │   └── (ROAS: ag.cost > 0 ? Math.round(conversions_value / cost * 100) : 0)
  ├── .ag-actions
  │   └── pmax-action-btn.assets → toggleAssetDetail()
  └── #assets-{agId} sub-panel (에셋 상세)
```

## 부록: PMax 섹션 하단 공통 버튼

PMax 캠페인의 에셋그룹 펼침 영역 하단에는 3개 액션 버튼:

```html
1. [채널별 성과] (pmax-action-btn.channels) → toggleChannels(campId, btn)
2. [게재위치] (pmax-action-btn.placements) → togglePlacements(campId, btn)
3. [소재그룹 추가] (pmax-action-btn, link)
   → href="/adcanvas_gads/pmax/add-asset-group?company={COMPANY}&campaign_id={campId}"
   → 데모 모드: event.preventDefault() + 토스트 에러
```

해당 버튼 아래에 sub-panel:
```html
<div class="sub-panel" id="channels-{campId}"></div>
<div class="sub-panel" id="placements-{campId}"></div>
```

## 부록: SVG 아이콘 상수 (18개)

템플릿 상단 JS에 정의된 SVG 문자열 상수:

| 상수 | 용도 |
|------|------|
| `SVG_DOWN` | 펼치기 chevron (14px) |
| `SVG_CHEVRON` | 액션 버튼 chevron (12px, .chevron-icon 회전용) |
| `SVG_KEY` | 키워드 버튼 아이콘 |
| `SVG_SEARCH_ICON` | 검색어 버튼 아이콘 |
| `SVG_FILE` | 광고 버튼 아이콘 |
| `SVG_SIGNAL` | 채널 성과 버튼 아이콘 |
| `SVG_MAP_PIN` | 게재위치 버튼 아이콘 |
| `SVG_PALETTE` | 에셋 상세 버튼 아이콘 |
| `SVG_CHART` | PMax 가이드 아이콘 |
| `SVG_DIAMOND` | 에셋그룹 아이콘 |
| `SVG_EDIT` | 텍스트 탭 아이콘 |
| `SVG_IMAGE` | 미디어 탭 아이콘 |
| `SVG_PLAY` | YouTube 재생/게재위치 아이콘 |
| `SVG_GLOBE` | 웹사이트 게재위치 아이콘 |
| `SVG_PHONE` | 앱 게재위치 아이콘 |
| `SVG_SHIELD_X` | 제외 키워드 버튼 아이콘 |
| `SVG_GOOGLE` | Google 게재위치 아이콘 |
| `SVG_STAR` | (사용처 없음 - 예비) |
