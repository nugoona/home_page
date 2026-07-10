# 챗봇 파이프라인 (Stage 10 · 2026-04-22) — ⚠️ DEPRECATED

> **🚫 이 문서는 더 이상 정본이 아닙니다 (2026-06-28 전환).**
> 현재 정본 = **`docs/ctx/chatbot/` 폴더** (특히 `00-blueprint.md`).
> 이 문서는 v4·v5·Qwen·guardrails 진화 이전의 "신설 예정" 계획서라 코드와 어긋납니다.
> "4코스 파이프라인" 개념(DATA/KNOWLEDGE/ACTION/EXTERNAL)은 유효하나, 파일·스테이지 표기는 옛것.
> **충돌 시 `docs/ctx/chatbot/` 가 항상 우선.** (참조용으로만 보존)

---

> (이하 원문 보존 · 2026-04-22 기준)
>
> ~~이 문서는 챗봇의 유일한 정본 spec 입니다.~~
> ~~산발된 v3 유물 · 과거 plan · feedback 의 챗봇 규칙이 충돌하면 이 문서가 우선.~~

---

## 0. 배경

2026-04-22 CEO 결정:
- Stage 9.7 (reasons 섹션) 까지 완료 후 챗봇 설계 방향 확정
- 산발 자산 60+ 을 **4 코스 파이프라인** 기준으로 정돈
- 새 세션이 `MEMORY.md §정본` → 이 문서만 읽어도 전 맥락 파악 가능한 구조

## 1. 파이프라인 (단일 · 2 Phase)

```
[유저 발화]
   │
   ▼
Phase 1 · Meaning Translator
   = 자연어 → 호출형 맥락 JSON
   = 여기서 실패하면 전체 무너짐 (CEO 박제)
   │
   ▼
Phase 2 · Course Router
   │
   ├── Course 1 · DATA       (BQ 직호출 · LLM 0 · ≤ 3개월)
   ├── Course 2 · KNOWLEDGE  (MD 검색 · LLM 허용 · 우리 자산 한정)
   ├── Course 3 · ACTION     (AdCanvas · 안전 계층 · Phase B 자산 재활용)
   └── Course 4 · EXTERNAL   (외부 안내 · AI 호출 0 · Claude Max 비용 보호)
```

### 1.1 Meaning Translator 반환 스키마

```json
{
  "course": "DATA | KNOWLEDGE | ACTION | EXTERNAL",
  "reason": "fast_path:... | llm:..." ,
  "payload": {
    // course 별 상이 (아래 각 Course 절 참조)
  },
  "context_carry": {
    "metric": "...", "period": "...", "platform": "..."
  }
}
```

### 1.2 번역 예시 (CEO 박제 사례)

| 유저 발화 | course | payload 요지 |
|----------|--------|-------------|
| 3월 19일 성과 어때? | DATA | `{scope:"all_metrics", date:"2026-03-19"}` |
| 요즘 잘나가는 옷은? | DATA | `{scope:"trend_rank", sources:["29cm_top10","ably_top10"], category:"상의"}` |
| 오늘 매출 | DATA | `{metric:"sales", period_alias:"today"}` |
| 왜 그래? | DATA | `{...carry, diagnosis_needed:true}` |
| 트렌드 페이지 왜 만들었어 | KNOWLEDGE | `{topic:"trend_page_rationale"}` |
| MER 이 뭐야 | KNOWLEDGE | `{topic:"metric_definition", key:"mer"}` |
| Meta 예산 만원 늘려 | ACTION | `{platform:"meta", delta_budget:10000}` |
| 요즘 잘나가는 매체가 뭐야 | EXTERNAL | `{reason:"일반 마케팅 상식 · 챗GPT 안내"}` |
| 경쟁사 매출 얼마야 | EXTERNAL | `{reason:"비공개 데이터 · 접근 불가 안내"}` |

## 2. Course 1 · DATA

### 2.1 범위
- 대시보드 내에서 확인 가능한 모든 성과 · 트렌드 수치
- BQ 직호출 · LLM 0
- **기간 제한 · 최대 3개월 (쿼리 비용)**

### 2.2 payload 스키마
```json
{
  "metric": "sales|roas|spend|visitors|orders|ctr|cpc|mer|purchases|...",
  "platform": "meta|google|null",
  "date": "YYYY-MM-DD | null",
  "date_range": ["YYYY-MM-DD","YYYY-MM-DD"] | null,
  "period_alias": "today|yesterday|...",
  "scope": "single_metric|all_metrics|trend_rank",
  "sources": ["29cm_top10","ably_top10","cafe24_sales",...],
  "category": "상의|하의|아우터|...",
  "diagnosis_needed": true|false
}
```

### 2.3 현재 상태
- `chat_data_responder.py` · Stage 9.7 완성
- scope="all_metrics" · Stage 10 Phase 2 Course 1 에서 완료 (2026-04-22 · e08372fe)
- scope="trend_rank" · Stage 10.5 에서 완료 (2026-04-22)
- 3개월 제한 가드는 Stage 10 에서 추가

### 2.4 제한 · 경고
- 1년 이상 기간 요청 시 "최대 3개월까지 조회 가능합니다" 안내 후 3개월로 자동 축약
- scope="all_metrics" 시 ROAS·매출·광고비·주문·방문자·전환율·객단가 한 카드에 노출

### 2.5 scope="trend_rank" — 주간 트렌드 (Stage 10.5 · 2026-04-22)

- **BQ 소스**: `platform_29cm_best` (best_page_name 14 탭) · `platform_ably_best` (category_medium N 탭)
- **period**: `MAX(run_id) WHERE period_type='WEEKLY' AND NOT STARTS_WITH(run_id,'demo_')` — 항상 최신 주
- **trend_type**:
  - `best` · Top 5 (신규 쿼리 · latest run 의 rank ASC)
  - `rising` · `trend_*_service.get_rising_star()` (기존 자산 재활용)
  - `new` · `get_new_entry()`
  - `falling` · `get_rank_drop()`
- **카드 포맷**: `type="data_card"` + `subtype="trend_rank"`. 각 플랫폼별 `breakdown` 섹션 (title · rows 5개).
  row 구조: `{label: "N위 · 브랜드", value: "가격", sub: "상품명 [· ▲변동]"}`
- **카테고리 매핑**: `_CATEGORY_ALIAS` 로 사용자 표현 → 29CM 탭 + Ably category_medium 동시 매핑
  (예: "니트" → 29CM "니트웨어" + Ably "상의"). 매핑 없는 어휘는 대표 탭 폴백
- **fast_path 진입**: `_TREND_ANCHOR_PATTERNS` (잘나가·인기·베스트·뜨는·급상승·신규 진입·하락·랭킹) + `_TREND_CATEGORY_RE` (옷·상의·아우터·원피스·...) **둘 다** 매칭 시. 플랫폼 hint `29cm`/`ably` 감지 시 단일 플랫폼으로 좁힘
- **검증 결과** (2026-04-22): fast_path 13/13 PASS + 회귀 sanity 7/7 + HTTP 5/5 · warm 응답 27ms~870ms
- **제한**: "지난 주" 같은 과거 주 조회는 미지원 — 항상 현재 주 Top. 확장 시 run_id 역추정 필요

### 2.6 compare_to · "지난주 대비 이번주" 비교 (Stage 10.6 · 2026-04-22)

- **BQ 소스**: `chatbot_metric_snapshot` (신규 테이블 · 2026-04-22 생성)
  - 스키마: `company_name · period_type (day|week|month|year) · period_key · period_start · period_end · metric · value · updated_at`
  - 파티션: `DATE_TRUNC(period_end, MONTH)` · 클러스터: `company_name, period_type`
  - 직접 저장 10 지표: net_sales · orders · visitors · new_users · meta_spend · meta_purchases · meta_purchase_value · google_spend · google_conversions · google_conversions_value
  - 파생 4 지표 (응답 시 계산): roas · mer · aov · conversion_rate
  - 집계 Job: `flask/tools/chatbot_metric_snapshot_job.py` · day/week/month/year 4축 MERGE UPSERT · 현재 진행 중 주/월/올해는 today 까지 부분값
- **compare_to 값**: `last_week · last_2_week · last_month · last_2_month · last_year`
- **fast_path 진입**: `_COMPARE_RULES` (지난주/지난달/지지난주/지지난달/작년 + "대비|비교|보다" anchor). compare 표현은 제거된 stripped 에서 period 재추출 → "지지난주 대비 이번주" 같은 중첩 표현 정확 파싱
- **카드 포맷**: `type="data_card" subtype="compare"` + `period_label="2026W17 (지난 주 대비)"`. primary 섹션 (ROAS/매출/광고비/주문 · delta + sign) + breakdown (Meta·Google · summary 일 때만)
- **graceful fallback**: snapshot 에 current 또는 compare 키 없으면 `_respond_compare` None 반환 → 기존 `_query_totals` 2회 경로로 진행 (정확도 유지, 속도 손해만)
- **검증** (2026-04-22): fast_path 11/11 PASS · HTTP 5/5 PASS (cold 2.2s · warm 430~530ms · 기존 BQ 2회 경로 3~6s 대비)
- **배포 준비 완료 (Stage 10.7 · 2026-04-22)**:
  - `flask/docker/Dockerfile-chatbot-metric-snapshot` · Python 3.11-slim + env 기반 config
  - `flask/tools/deploy_chatbot_metric_snapshot.sh` · Cloud Run Job + Cloud Scheduler (매일 03:00 KST) 배포
  - 실배포는 CEO 확인 후 (feedback_deploy_workflow)
- **last_year 동기 비교 정정 (Stage 10.7)**: compare_to="last_year" 은 month 단위 12개월 전으로 매핑 (year 단위 full-year 비교 제거). "작년 동월 대비 올해 매출" = 2026-04 vs 2025-04. fast_path 에서 period_alias 강제 this_month · snapshot months 기본 14개월로 확장

### 2.7 프론트 전용 카드 렌더러 (Stage 10.7 · 2026-04-22)

- **`next/src/components/mobile/ChatV4Card.tsx`** · subtype 분기 렌더
- `subtype="trend_rank"` · TrendRankCard — 썸네일 64x64 + 순위 배지 + 브랜드/상품/가격 + item_url 링크. rank_change ▲/▼ 뱃지
- `subtype="compare"` · CompareCard — "2026W17 + 지난 주 대비" 헤더 · 2열 그리드 (ROAS/매출/광고비/주문) · delta 색상 (up green / down red)
- 기본 · MetricCard — single_metric/all_metrics/summary. label/value/delta 3열
- 에러 상태 (card.error) 별도 렌더
- **backend 호환**: `_format_trend_row` 에 썸네일/item_url/rank/brand/product/price/rank_change raw 필드 추가. breakdown kind 의 label/value/sub 도 유지 (구버전 클라이언트 호환)

## 3. Course 2 · KNOWLEDGE

### 3.1 범위
- 대시보드 기능 · 위젯 원리 · 용어 정의
- 마케팅 일반 지식 중 **우리가 노하우로 정리한 것**
- 철학 질문 (왜 만들었어 · 언제 쓰는 거야)

### 3.2 금지 노출
- 백엔드 소스 구조 · GCP 구성
- 경쟁사 매출 · 경쟁사 내부 데이터
- 크롤링 방식 상세

### 3.3 payload 스키마
```json
{
  "topic": "trend_page_rationale|metric_definition|budget_guide|...",
  "key": "mer|roas|ctr|...",
  "depth": "short|full"
}
```

### 3.4 지식 DB (정본 경로)

**A. 페이지·위젯 철학 (이미 존재 · 50 토픽)**
- `flask/prompts/topic_map.json` · 5 카테고리 (dashboard · ads · trend · report · account) × 50 토픽
- 각 토픽: `label` · `category` · `subcategory` · `summary` (기능 설명 + 용도)
- Flask `/dashboard/guide-data` API → Next `/guide` 페이지에서 **이미 유저 공개 중**
- 챗봇 KNOWLEDGE 응답 시 이 DB 를 직접 조회

**B. 마케팅 노하우 (CEO 음성 인터뷰 기반 · 578 줄)**
- `docs/ai-chat/marketing-knowledge-01-business.md` · 업체 이해 (Q1~Q10)
- `docs/ai-chat/marketing-knowledge-02-budget-kpi.md` · 예산 · KPI (Q11~Q20)
- `docs/ai-chat/marketing-knowledge-03-creative-platform.md` · 크리에이티브 · 플랫폼 (Q21~Q30 + Q56)
- `docs/ai-chat/marketing-knowledge-04-scenarios.md` · 실전 시나리오 (Q31~Q40)
- `docs/ai-chat/marketing-knowledge-05-operations.md` · 운영 · 고객 관리 (Q41~Q50)
- `docs/ai-chat/marketing-knowledge-06-supplement.md` · 보충 (Q51~Q55)
- `docs/ai-chat/phase2-requirements.md` · Phase 2 설계 사항

**C. 가이드 단문 모음 (UI 답변용)**
- `flask/prompts/dashboard_guide.json` · 키워드 → page/section 매핑 + instruction 단문

### 3.5 "성과 어때?" 기본 세트 (knowledge DB 확정)

CEO 박제 (knowledge MD 교차 검증):
- `knowledge-01 Q8` · **1순위 월 매출** (전년 동월 대비 성장) · ROAS 는 간접 지표
- `knowledge-02 Q13/Q20` · **1순위 체크 CTR** · CTR → 랜딩 → 타겟 순
- `knowledge-05 Q41` · 리포트 선호 · "그래서 어쩌라고 안 되는 개선책 + 경쟁사 비교"
- `phase2-requirements 1번` · **업체별 최근 28일 평균 대비 상대 평가** (절대값 신뢰도 낮음)

→ DATA Course 에서 "성과 어때?" 카드 = **월 매출 (전년 동월 대비) · CTR · ROAS · 28일 평균 대비 상대 평가 · 경쟁사 비교** · 6~7 행

현재 합계 · topic_map 50 토픽 + knowledge MD 578 줄. LLM 컨텍스트 한 번에 주입 가능. 늘어나면 topic 헤더 기반 서브셋 매칭.

### 3.5 현재 상태
- `chat_knowledge_responder.py` · 기존 Q31 evaluation 전용 · **재설계 필요**
- `prompts/topic_map.json` (5,494 줄) · `prompts/dashboard_guide.json` (1,825 줄) · `marketing_knowledge_inventory.json` (66 줄) 통합 대상
- Stage 10 에서 knowledge_responder v2 신설 · 위 7 MD + topic_map · dashboard_guide 를 통합 로드

## 4. Course 3 · ACTION

### 4.1 범위
- 광고 만들기 (원클릭 · RSA · PMax · 카탈로그)
- 광고 운영 (예산 · ON/OFF · 키워드 추가 · 저성과 제외)
- 자산이 각 매체에 실제로 쏘이는 경로

### 4.2 현재 상태
- Phase B Stage 0~6 에서 `chat_action_responder.py` · `chat_action_safety.py` · `chat_action_adapter_google/meta.py` 이미 구현됨
- **Stage 10 범위에서 제외** · 4 코스 라우팅만 신설 · 내부 로직 재활용
- `feedback_ad_safety.md` 규칙 준수 (nugoona 만 실행 · OFF 필수)

### 4.3 payload 스키마
```json
{
  "action_kind": "budget_change|toggle|add_keyword|exclude_low_perf|create_ad|...",
  "platform": "meta|google",
  "target_ref": "campaign_id|ad_group_id|...",
  "delta": { "budget": 10000, "status": "paused", ... }
}
```

## 5. Course 4 · EXTERNAL

### 5.1 범위 (외부 안내로만 종결)
- 일반 마케팅 지식 (우리 MD 에 없는 것)
- 시사 · 업계 트렌드 · 경쟁 매체 평가
- 개인 잡담 · 날씨 · 주식
- 비공개 데이터 요청 (경쟁사 매출 · 백엔드 소스)

### 5.2 철학 (CEO 박제)
- **Claude Max 비용 보호** · 리서치 하지 않음 · LLM 호출 없음
- "챗GPT 에서 물어보세요 · 검색하세요 · 이건 저희 자산으로 답할 수 없어요" 고정 문구
- 유저에게 서비스 질 저하로 느껴지지 않게 부드러운 카피

### 5.3 payload 스키마
```json
{
  "reason": "general_knowledge|competitor_data|backend_info|chit_chat",
  "suggested_alternative": "chatgpt|google_search|our_support"
}
```

### 5.4 현재 상태
- `chat_external_responder.py` **신설 필요**
- 기존 `chat_oos_responder.py` 흡수

## 6. Meaning Translator 구현 전략

### 6.1 현 fast_path 유지 + 확장

`chat_v4_handler._fast_path()` 는 Course 1 DATA 매칭을 이미 99% 커버. Stage 10 에서 확장:
- Course 2 KNOWLEDGE anchor 추가 · "뭐야" · "왜 · "언제" · "어떻게" 시작 + metric/page 언급 (단순 수치 질문 제외)
- Course 3 ACTION anchor · 명령형 동사 + 대상 · "늘려 · 꺼줘 · 추가해"
- Course 4 EXTERNAL anchor · metric 0 + page 0 + 외부 고유명사 (주식 · 날씨 · 경쟁사명)
- 기존 clarify · emotion_or_filler 규칙은 유지

### 6.2 LLM fallback

fast_path miss 시 Claude Max daemon 호출 · Course 판정 포함한 intent JSON 반환. 현 translator 프롬프트 확장.

### 6.3 재활용 캐시 (Stage 10+)

- Layer A · 번역 결과 캐시 (`chat_intent_cache` BQ 테이블)
- Layer B · 유사도 매칭 (데이터 누적 후)
- Layer C · 자동 fast_path 승격 (장기)
- 성과(BQ 숫자) 는 캐시 안 함 · 번역 결과만

## 7. 자산 정돈 로드맵 (Stage 10 착수 순)

### 7.1 삭제 (v3 유물)
- `flask/ngn_wep/dashboard/services/chat_classifier.py`
- `chat_param_extractor.py` · `chat_multi_splitter.py`
- `chat_howto_responder.py` · `chat_broad_responder.py` · `chat_specific_responder.py` · `chat_dashboard_guide.py`
- `chat_oos_responder.py` (기능 external_responder 로 이전)
- `chat_v2_handler.py` · `chat_v3_handler.py` (app.py blueprint 등록 해제 후)
- `flask/tools/chatbot_simulator/` 전체 (과거 3,372 PASS 원천)
- `/chat/v2/*` · `/chat/v3/*` 엔드포인트 · blueprint 등록 해제
- 테스트: `tests/phase1_conversation_loops.py` · `tests/test_guide_v2.py` · `tests/eval_dashboard_guide.py`

### 7.1.1 유지 (v3 유물 아님 · 오표기 정정 2026-04-22)
- `chat_ai_bridge.py` — **유지**. `diagnosis_runner` (Phase B ACTION) 가 `fetch_data_points` · `call_claude_worker` · `_deterministic_fallback` · `LOADING_NARRATIVE_WHY` 를 사용하므로 Course 3 ACTION 파이프라인의 실동작 자산.

### 7.2 신설
- `chat_meaning_translator.py` (기존 `chat_intent_translator.py` 리네임 + Course 판정 추가)
- `chat_knowledge_responder_v2.py` · MD 7 + topic_map · dashboard_guide 통합
- `chat_external_responder.py`
- `chat_data_responder.py` · `scope="trend_rank"` · `scope="all_metrics"` · 3개월 가드 추가

### 7.3 통합
- `prompts/topic_map.json` + `prompts/dashboard_guide.json` + `marketing_knowledge_inventory.json` → knowledge_responder_v2 입력으로 재편

### 7.4 메모리 압축
- `§2.C` 챗봇 10 파일 → 정본 spec (이 문서) 참조로 전환
- 중복 규칙 · 완료 프로젝트 archive 이동
- MEMORY.md 최상단에 **§정본 포인터** 3 줄 고정

## 8. 테스트 전략

### 8.1 코스별 골든 10 (총 40)
각 코스 10 케이스 · CEO 가 거른 후 실기기 PASS gate.
- Course 1 DATA 10
- Course 2 KNOWLEDGE 10
- Course 3 ACTION 10 (Stage 10 범위 외 · 참고)
- Course 4 EXTERNAL 10

구체 리스트는 CEO 검토 완료 후 `docs/ctx/chatbot-golden-40.md` 로 분리.

### 8.2 스크리닝 하네스

- `tools/chat_test_harness.py` · `/chat/v4/message` HTTP 실호출
- **완료 판정 도구 아님** · 실기기 이전 필터
- 커밋 메시지에 하네스 숫자 단독 기재 금지 · 실기기 PASS 수와 함께만

### 8.3 PASS 기준
`feedback_pass_criteria_v2.md` 준수:
- HTTP 200 + JSON 파싱
- text 실체 5자 이상
- 시스템톤 금지어 0 (daemon · timeout · MCP · "잠시 문제" · "다시 시도" 등)
- 응답시간 fast_path ≤ 5s · LLM ≤ 65s
- 맥락 carry 동작

## 9. 핵심 규칙 박제 (어길 시 스테이지 실패)

1. **호출형 맥락 번역이 전부** · Phase 1 품질 집중
2. **BQ 직호출 3개월 이내** · 비용 가드
3. **EXTERNAL 은 리서치 0** · Claude Max 비용 보호
4. **KNOWLEDGE 는 우리 자산 한정** · 백엔드·경쟁사 노출 금지
5. **실기기 PASS 가 유일한 완료 gate** · 하네스·시뮬 수치로 완료 선언 금지
6. **팀장 전권** · 자산 정돈 · 삭제 · 리네임 전부 단독 판단 (`feedback_team_lead_partner_mindset.md`)

## 10. 다음 액션 (Stage 10 착수 순서)

1. 이 문서 커밋 → MEMORY.md 최상단 정본 포인터 추가
2. `docs/ctx/chatbot-golden-40.md` 초안 (CEO 검토)
3. `chat_meaning_translator.py` 신설 (Course 판정 추가)
4. `chat_knowledge_responder_v2.py` 신설 (MD 로더 + 라우팅)
5. `chat_external_responder.py` 신설
6. v3 엔드포인트 · 유물 모듈 삭제
7. 메모리 §2.C 압축
8. 하네스 스크리닝 + 실기기 골든 40 검증
