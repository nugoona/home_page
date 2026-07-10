# AdCanvas Google Ads - 기술/기능 명세서

> **문서 버전:** v1.0
> **최종 수정:** 2026-02-08
> **대상:** Google Ads 검색/디스플레이/PMax 광고 운영 관리자

---

## 1. 제품 개요

AdCanvas Google Ads는 **Google 검색광고(RSA), Performance Max(PMax) 캠페인, Easy Mode 간편 광고**를 웹 UI에서 생성하고 성과를 분석하는 통합 도구입니다. AI 기반 문구 추천, 실시간 Ad Strength 측정, 키워드 연동 등 Google Ads 최적화 기능을 제공합니다.

### 핵심 가치

| 가치 | 설명 |
|------|------|
| **AI 문구 추천** | Gemini AI가 랜딩 페이지를 분석하여 헤드라인/설명문 자동 생성 |
| **실시간 Ad Strength** | Google 가이드라인 기반 광고 효력 4단계 실시간 측정 (Poor→Excellent) |
| **키워드 연동** | 광고그룹 키워드 자동 조회 + 헤드라인 포함 여부 체크 |
| **PMax 풀 에셋** | 텍스트 + 이미지 + 동영상 + 사이트링크 + 검색 테마 올인원 |
| **정책 사전 검증** | Google Ads 광고 정책 위반 사항을 게시 전에 자동 검출 |
| **성과 대시보드** | 캠페인/광고그룹/키워드 3레벨 성과 분석 + 예산 관리 |

---

## 2. 페이지 구조

```
/adcanvas/select-platform                    ← 플랫폼 선택 (Meta / Google)
    │
    ▼
/adcanvas/select-account-gads               ← 업체 선택
    │
    ▼
/adcanvas_gads?company=XXX                  ← Google Ads 메인 페이지
    │
    ├──→ RSA 만들기: /adcanvas_gads/create
    │
    ├──→ Easy Mode: /adcanvas_gads/easy
    │
    ├──→ PMax 캠페인: /adcanvas_gads/pmax
    │       └──→ 에셋그룹 추가: /adcanvas_gads/pmax/add-asset-group
    │
    └──→ 성과 분석: /adcanvas_gads/performance
```

---

## 3. Google Ads 메인 페이지

**URL**: `/adcanvas_gads?company=XXX`
**템플릿**: `adcanvas_gads_page.html`

### 3.1 헤더

- Google Ads 로고 (흰색 배경 + 4색 Google Ads 아이콘)
- 업체명 표시
- 햄버거 메뉴

### 3.2 기능 카드 그리드

| 카드 | 설명 | 서브 버튼 |
|------|------|----------|
| **검색광고 만들기** | RSA(반응형 검색광고) 생성 | RSA 만들기 / Easy 모드 |
| **PMax 캠페인** | Performance Max 캠페인 생성 | 새 캠페인 / 에셋그룹 추가 |
| **성과 분석** | 캠페인/광고그룹/키워드 성과 | 단일 링크 |

---

## 4. RSA 생성 (반응형 검색광고)

**URL**: `/adcanvas_gads/create?company=XXX`
**템플릿**: `adcanvas_gads_create.html`
**JS**: `static/js/adcanvas_gads_create.js` (RSACreator 클래스)

### 4.1 개요

Google Ads 반응형 검색광고(RSA)를 생성하는 풀 기능 에디터입니다. 헤드라인 최대 15개, 설명문 최대 4개를 입력하고, AI 추천 + 키워드 연동 + 실시간 Ad Strength 측정을 지원합니다.

### 4.2 캠페인/광고그룹 선택

| 기능 | 설명 |
|------|------|
| **캠페인 드롭다운** | 활성 캠페인 목록 자동 조회 |
| **광고그룹 드롭다운** | 선택한 캠페인의 광고그룹 표시 |
| **기존 광고 불러오기** | 같은 광고그룹의 RSA 복사 |
| **최종 URL** | 랜딩 페이지 URL 입력 |

### 4.3 헤드라인 에디터 (최대 15개)

| 기능 | 설명 |
|------|------|
| **동적 추가** | "+" 버튼으로 필드 추가 |
| **바이트 카운터** | 실시간 바이트 수 표시 (한글 2byte, 영문 1byte) |
| **30바이트 제한** | 초과 시 빨간색 경고 |
| **핀 고정** | 위치 1/2/3 고정 (ServedAssetFieldTypeEnum) |
| **정책 검증** | 구두점 종결, 이모지, 전화번호, URL, 특수문자 자동 검출 |
| **중복 검사** | 동일 헤드라인 경고 |
| **드래그 정렬** | 헤드라인 순서 변경 |

### 4.4 설명문 에디터 (최대 4개)

| 기능 | 설명 |
|------|------|
| **90바이트 제한** | 설명문 바이트 제한 |
| **정책 검증** | 연속 특수문자, 이모지 등 자동 검출 |
| **실시간 바이트** | 입력 즉시 바이트 카운트 갱신 |

### 4.5 Ad Strength (광고 효력)

4가지 평가 기준으로 실시간 Ad Strength를 측정합니다:

| 기준 | 최대 점수 | 설명 |
|------|----------|------|
| **헤드라인 수** | 25점 | 3개=10점, 5개=15점, 8개=18점, 10개=20점, 15개=25점 |
| **설명문 수** | 25점 | 2개=15점, 3개=20점, 4개=25점 |
| **다양성** | 25점 | 중복 없음=25점, 약간 중복=15점, 많은 중복=5점 |
| **키워드 포함** | 25점 | 30%+=25점, 15%+=18점, 일부=10점 |

| 등급 | 점수 범위 | 색상 |
|------|----------|------|
| **EXCELLENT** | 90~100 | 녹색 |
| **GOOD** | 70~89 | 파란색 |
| **AVERAGE** | 50~69 | 노란색 |
| **POOR** | 0~49 | 빨간색 |

### 4.6 키워드 연동

| 기능 | 설명 |
|------|------|
| **키워드 조회** | 선택한 광고그룹의 키워드 자동 로드 |
| **포함 여부 체크** | 각 키워드가 헤드라인에 포함되었는지 체크마크 표시 |
| **AI 키워드 보충** | 미포함 키워드를 AI가 헤드라인으로 자동 생성 |
| **제외 키워드** | 캠페인 레벨 제외 키워드 조회/추가 |

**API**: `GET /api/google-ads/adcanvas/keywords/{ad_group_id}`

### 4.7 AI 문구 추천 (Gemini)

| 기능 | 설명 |
|------|------|
| **웹사이트 크롤링** | 최종 URL의 타이틀, 메타설명, 헤딩, 텍스트 자동 수집 |
| **헤드라인 10개** | 30바이트 이내 한국어 헤드라인 |
| **설명문 4개** | 90바이트 이내 설명문 |
| **체크박스 선택** | 원하는 문구만 선택 후 적용 |
| **캐시** | 같은 URL 재호출 시 결과 캐시 사용 |
| **바이트 검증** | AI 생성 후 바이트 초과 문구 자동 필터링 |

**API**: `POST /api/google-ads/adcanvas/ai-suggestions`
**AI 엔진**: Google Gemini 2.0 Flash

### 4.8 미리보기 (데스크톱/모바일)

| 기능 | 설명 |
|------|------|
| **데스크톱 미리보기** | Google 검색결과 형태로 표시 |
| **모바일 미리보기** | 모바일 검색결과 형태로 표시 |
| **탭 전환** | Desktop / Mobile 탭으로 전환 |
| **Shuffle 버튼** | 헤드라인/설명문 랜덤 조합 표시 |
| **핀 반영** | 핀 고정된 위치에 해당 헤드라인 고정 |

### 4.9 제외 키워드 관리

| 기능 | 설명 |
|------|------|
| **캠페인 레벨** | 캠페인 단위 제외 키워드 조회 |
| **추가** | 새 제외 키워드 입력 + 일괄 추가 |
| **매치 타입** | EXACT, PHRASE, BROAD |

**API**: `GET/POST /api/google-ads/adcanvas/negative-keywords/{campaign_id}`

### 4.10 정책 검증 패턴

RSA 생성 시 다음 패턴을 자동 검출합니다:

| 패턴 | 규칙 |
|------|------|
| **구두점 종결** | 헤드라인이 `.`, `!`, `?`로 끝나면 안 됨 |
| **연속 특수문자** | `!!`, `??`, `..` 등 연속 사용 금지 |
| **이모지** | 모든 이모지 사용 금지 |
| **전화번호** | 전화번호 패턴 포함 금지 |
| **URL** | http://, www. 등 URL 포함 금지 |
| **금지 특수문자** | @, #, $, %, ^, &, *, ~, |, \\, <, >, {, }, [, ] |
| **과도한 대문자** | 6자 이상 연속 대문자 경고 |
| **상표 기호** | ™, ®, © 사용 경고 |
| **과도한 공백** | 3개 이상 연속 공백 경고 |

---

## 5. Easy Mode (간편 검색광고)

**URL**: `/adcanvas_gads/easy?company=XXX`
**템플릿**: `adcanvas_gads_easy.html`

### 5.1 개요

RSA 생성의 간소화 버전입니다. **최종 URL만 입력하면 AI가 모든 문구를 자동 생성**하고, 사용자는 수정/확인 후 바로 게시합니다.

### 5.2 플로우

1. 캠페인/광고그룹 선택
2. 최종 URL 입력
3. "AI 문구 생성" 버튼 클릭
4. Gemini가 헤드라인 + 설명문 자동 생성
5. 사용자 검토/수정
6. 게시

### 5.3 RSA와의 차이점

| 항목 | RSA | Easy Mode |
|------|-----|-----------|
| **입력** | 수동 + AI 보조 | AI 메인 + 수동 수정 |
| **헤드라인** | 최대 15개 직접 입력 | AI 자동 생성 후 수정 |
| **Ad Strength** | 실시간 표시 | 간소화 표시 |
| **키워드 연동** | 상세 연동 | 자동 포함 |
| **대상** | 전문 운영자 | 초보 운영자 |

---

## 6. PMax 캠페인 생성

**URL**: `/adcanvas_gads/pmax?company=XXX`
**템플릿**: `adcanvas_gads_pmax.html`

### 6.1 개요

Performance Max 캠페인을 생성합니다. 텍스트 에셋, 이미지 에셋, 동영상, 사이트링크, 검색 테마까지 모든 PMax 에셋을 한 화면에서 관리합니다.

### 6.2 캠페인 설정

| 설정 | 설명 |
|------|------|
| **캠페인명** | 자동 생성 또는 수동 입력 |
| **일일 예산** | KRW 단위 입력 |
| **입찰 전략** | 전환수 최대화 / 전환가치 최대화 |
| **목표 CPA/ROAS** | 선택적 목표 설정 |
| **랜딩 URL** | 최종 URL 입력 |

### 6.3 텍스트 에셋

| 에셋 | 수량 제한 | 바이트 제한 | 특이사항 |
|------|----------|------------|----------|
| **헤드라인** | 3~15개 | 30바이트 | 구두점 종결 금지 |
| **긴 헤드라인** | 1~5개 | 90바이트 | YouTube/Display/Discover용 |
| **설명문** | 2~5개 | 90바이트 | 마침표 사용 가능 |
| **비즈니스 이름** | 1개 | 25자 | 필수 |

### 6.4 이미지 에셋

| 유형 | 수량 | 최소 해상도 | 비율 |
|------|------|------------|------|
| **가로 이미지** | 1~20개 | 600x314 | 약 1.91:1 |
| **정방 이미지** | 1~20개 | 300x300 | 1:1 |
| **세로 이미지** | 0~20개 | 480x600 | 4:5 |
| **로고** | 1~5개 | 128x128 | 1:1 |
| **가로 로고** | 0~5개 | - | 약 4:1 |

### 6.5 동영상 에셋

| 기능 | 설명 |
|------|------|
| **YouTube URL** | YouTube 동영상 URL 입력 |
| **3비율 지원** | 가로(16:9), 정방(1:1), 세로(9:16) |
| **비율 자동 분류** | URL 기반 자동 비율 감지 |

### 6.6 사이트링크

| 필드 | 제한 |
|------|------|
| **링크 텍스트** | 25자 이내 |
| **최종 URL** | 유효한 URL |
| **설명 1** | 35자 이내 |
| **설명 2** | 35자 이내 |

최대 4개 사이트링크를 추가합니다. AI가 카테고리 URL을 자동 발견하여 제안합니다.

### 6.7 검색 테마

최대 25개의 검색 테마(키워드)를 입력합니다. Google의 AI가 이를 기반으로 최적 노출 대상을 탐색합니다.

### 6.8 CTA (행동 유도 버튼)

| 옵션 | 라벨 |
|------|------|
| AUTOMATED | 자동 |
| SHOP_NOW | 지금 쇼핑하기 |
| LEARN_MORE | 자세히 알아보기 |
| SIGN_UP | 가입하기 |
| GET_QUOTE | 견적 받기 |
| SUBSCRIBE | 구독하기 |
| CONTACT_US | 문의하기 |
| BOOK_NOW | 지금 예약하기 |
| APPLY_NOW | 지금 신청하기 |

### 6.9 PMax Ad Strength (광고 효력)

PMax는 RSA와 다른 에셋 기반 평가 시스템을 사용합니다:

| 항목 | 최대 점수 | 권장 |
|------|----------|------|
| 헤드라인 | 18점 | 8개+ |
| 긴 헤드라인 | 7점 | 3개+ |
| 설명문 | 10점 | 4개+ |
| 가로 이미지 | 10점 | 3개+ |
| 정방 이미지 | 10점 | 3개+ |
| 로고 | 8점 | 1개+ |
| 비즈니스 이름 | 8점 | 필수 |
| 세로 이미지 | 8점 | 1개+ |
| 가로 로고 | 5점 | 1개+ |
| 동영상 | 7점 | 3비율 |
| 사이트링크 | 6점 | 4개 |
| 검색 테마 | 10점 | 5개+ |

| 등급 | 점수 범위 |
|------|----------|
| **EXCELLENT** | 85+ |
| **GOOD** | 60~84 |
| **AVERAGE** | 35~59 |
| **POOR** | 0~34 |

### 6.10 AI 전체 에셋 추천

URL 입력 시 AI가 **모든 PMax 에셋을 한번에 생성**합니다:

| 생성 항목 | 수량 |
|-----------|------|
| 헤드라인 | 최대 15개 |
| 긴 헤드라인 | 최대 5개 |
| 설명문 | 최대 5개 |
| 사이트링크 | 4개 |
| 비즈니스 이름 | 1개 |
| CTA 추천 | 1개 |
| 추천 키워드 | 5~10개 |

AI는 크롤링한 카테고리 URL만 사이트링크에 사용하며, 존재하지 않는 URL을 추측하지 않습니다.

---

## 7. PMax 에셋그룹 추가

**URL**: `/adcanvas_gads/pmax/add-asset-group?company=XXX&campaign_id=XXX`
**템플릿**: `adcanvas_gads_pmax_add_ag.html`

기존 PMax 캠페인에 새로운 에셋그룹을 추가합니다. 캠페인 설정(예산, 입찰)은 유지하고 에셋만 추가합니다.

| 차이점 | 새 캠페인 | 에셋그룹 추가 |
|--------|----------|-------------|
| 캠페인 설정 | 신규 생성 | 기존 유지 |
| 로고 | 필수 | 선택 (캠페인에 이미 존재) |
| 비즈니스 이름 | 필수 | 선택 |
| 예산/입찰 | 설정 | 건너뛰기 |

---

## 8. Google Ads 성과 분석

**URL**: `/adcanvas_gads/performance?company=XXX`
**템플릿**: `adcanvas_gads_performance.html`

### 8.1 3레벨 계층 분석

```
캠페인 레벨
    │
    ├── 광고그룹 레벨
    │       │
    │       ├── 키워드 레벨
    │       └── 광고 레벨
    │
    └── 예산 관리
```

### 8.2 KPI 지표

| 지표 | 설명 |
|------|------|
| **비용 (Cost)** | 총 광고 지출 |
| **전환 (Conversions)** | 전환 건수 |
| **전환값 (Conv. Value)** | 전환 금액 |
| **ROAS** | 전환값 / 비용 |
| **CPC** | 클릭당 비용 |
| **클릭 (Clicks)** | 총 클릭수 |
| **노출 (Impressions)** | 총 노출수 |
| **CTR** | 클릭률 |

### 8.3 캠페인 관리 기능

| 기능 | 설명 |
|------|------|
| **ON/OFF** | 캠페인 활성/비활성 전환 |
| **예산 수정** | 일일 예산 인라인 편집 |
| **기간 필터** | 날짜 범위 선택 |
| **정렬** | 컬럼 클릭으로 오름/내림차순 |
| **전체 보기** | 중지된 캠페인 포함/제외 |

### 8.4 광고그룹 관리

| 기능 | 설명 |
|------|------|
| **키워드 목록** | 광고그룹별 키워드 + 매치타입 표시 |
| **광고 목록** | 광고그룹별 RSA/PMax 광고 표시 |
| **성과 지표** | 광고그룹 단위 성과 집계 |

---

## 9. 백엔드 API 엔드포인트

### 9.1 RSA API

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/google-ads/adcanvas/campaigns` | GET | 캠페인/광고그룹 목록 |
| `/api/google-ads/adcanvas/create-rsa` | POST | RSA 생성 |
| `/api/google-ads/adcanvas/keywords/{ag_id}` | GET | 광고그룹 키워드 |
| `/api/google-ads/adcanvas/existing-ads/{ag_id}` | GET | 기존 RSA 조회 |
| `/api/google-ads/adcanvas/negative-keywords/{c_id}` | GET/POST | 제외 키워드 |
| `/api/google-ads/adcanvas/ai-suggestions` | POST | AI 문구 추천 |
| `/api/google-ads/adcanvas/ai-keyword-headlines` | POST | AI 키워드 보충 헤드라인 |

### 9.2 PMax API

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/google-ads/adcanvas/pmax/create` | POST | PMax 캠페인 생성 |
| `/api/google-ads/adcanvas/pmax/add-asset-group` | POST | 에셋그룹 추가 |
| `/api/google-ads/adcanvas/pmax/ai-suggestions` | POST | PMax AI 에셋 추천 |
| `/api/google-ads/adcanvas/pmax/validate` | POST | 에셋 검증 |
| `/api/google-ads/adcanvas/pmax/upload-image` | POST | 이미지 업로드 |
| `/api/google-ads/adcanvas/pmax/campaigns` | GET | PMax 캠페인 목록 |

### 9.3 성과 API

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/google-ads/adcanvas/performance` | GET | 캠페인 성과 데이터 |
| `/api/google-ads/adcanvas/campaign/toggle` | POST | 캠페인 ON/OFF |
| `/api/google-ads/adcanvas/campaign/budget` | POST | 예산 수정 |

---

## 10. 핵심 백엔드 서비스

### 10.1 `google_ads_adcanvas_service.py`

| 함수 | 설명 |
|------|------|
| `get_campaigns_and_adgroups()` | 캠페인/광고그룹 계층 조회 |
| `get_keywords_for_adgroup()` | 광고그룹 키워드 조회 |
| `get_existing_rsa_ads()` | 기존 RSA 광고 조회 |
| `get_negative_keywords()` | 제외 키워드 조회 |
| `add_negative_keywords()` | 제외 키워드 추가 |

### 10.2 `google_ads_ai_service.py`

| 함수 | 설명 |
|------|------|
| `generate_rsa_suggestions()` | RSA용 AI 문구 생성 |
| `generate_pmax_suggestions()` | PMax용 AI 풀 에셋 생성 |
| `generate_keyword_headlines()` | 키워드 보충 헤드라인 생성 |
| `fetch_website_content()` | 웹사이트 크롤링 (타이틀, 메타, 헤딩, 텍스트) |
| `get_google_keyword_themes()` | Google Keyword Planner 테마 조회 |

### 10.3 `google_ads_rsa_creator.py`

| 함수 | 설명 |
|------|------|
| `create_rsa()` | Google Ads API로 RSA 생성 |
| `build_ad_text_asset()` | 텍스트 에셋 빌드 |
| `set_pin_position()` | 핀 고정 위치 설정 |

### 10.4 `google_ads_pmax_creator.py`

| 함수 | 설명 |
|------|------|
| `create_pmax_campaign()` | PMax 캠페인 + 에셋그룹 생성 |
| `create_asset_group()` | 에셋그룹 추가 |
| `upload_image_asset()` | 이미지 에셋 업로드 |

### 10.5 `google_ads_pmax_service.py`

| 함수 | 설명 |
|------|------|
| `validate_pmax_text()` | 텍스트 정책 검증 |
| `validate_pmax_assets()` | 전체 에셋 수량 검증 |
| `calculate_asset_strength()` | Ad Strength 점수 계산 |

---

## 11. Google Ads API 연동

### 11.1 인증 정보

| 항목 | 설명 |
|------|------|
| **Developer Token** | Google Ads API 개발자 토큰 |
| **Client ID/Secret** | OAuth2 클라이언트 인증 |
| **Refresh Token** | 오프라인 액세스 토큰 |
| **Login Customer ID** | MCC(관리자 계정) ID |

### 11.2 API 호출 구조

```python
# Google Ads API 호출 패턴
GoogleAdsClient → GoogleAdsService → SearchGoogleAdsStream
    │
    ├── query: GAQL (Google Ads Query Language)
    │   "SELECT campaign.id, campaign.name, metrics.cost_micros
    │    FROM campaign WHERE ..."
    │
    └── mutate: CampaignOperation, AdGroupAdOperation 등
```

### 11.3 예산 단위 처리

Google Ads API는 마이크로 단위(1/1,000,000)를 사용합니다:
- **표시**: `micros / 1,000,000` (예: 10,000,000 micros = ₩10,000)
- **저장**: `amount * 1,000,000`

---

## 12. 정책 검증 시스템

### 12.1 프론트엔드 (실시간)

RSACreator 클래스에서 입력 시 즉시 검증합니다:
- 바이트 초과
- 정책 패턴 매칭
- 중복 텍스트
- 빈 필드

### 12.2 백엔드 (`google_ads_pmax_service.py`)

서버 사이드에서 게시 전 최종 검증합니다:
- 최소/최대 에셋 수량
- 바이트 길이 제한
- 이미지 해상도 제한
- 정책 패턴 (POLICY_PATTERNS 정규식)

### 12.3 AI 후처리

AI 생성 텍스트에 대해 자동 후처리합니다:
- 헤드라인 구두점 자동 제거
- 과도한 대문자 자동 수정 (`fix_uppercase_issues()`)
- 바이트 초과 문구 자동 필터링
- 중복 제거
