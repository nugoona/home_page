# SPEC: Meta AdCanvas OneClick (/adcanvas_meta/oneclick)

> **버전**: 1.0
> **작성일**: 2026-02-28
> **대상**: 프론트엔드 개발자, QA 엔지니어
> **Flask 원본**: `ngn_wep/dashboard/templates/admake_oneclick.html` (1296줄)
> **Flask 핸들러**: `ngn_wep/dashboard/handlers/data_handler.py`
> **JS**: HTML 템플릿 내 인라인 `<script>` 블록 (IIFE 패턴)

---

## 페이지 개요

- **URL**: `/adcanvas_meta/oneclick?account_id=XXX`
- **페이지 타이틀**: `AdCanvas -- 원클릭 광고`
- **목적**: 상품 URL 입력 -> 이미지 추출 -> 1장 선택 -> 크롭 -> 광고 문구 설정 -> Meta 게시. 단일 페이지 4-Step 위자드.
- **특징**: Create 플로우(5개 페이지, 다중 미디어, sessionStorage/IndexedDB 간 데이터 전달)와 달리, 단일 HTML 내에서 `display:none/block` 패널 전환으로 모든 스텝 처리. 서버 측 pending_ads 시스템 불필요.

---

## 데이터 플로우 전체 개요

```
[STEP 1: URL 입력]
   |- URL 입력 -> 검증 (BLOCKED/PRODUCT 패턴)
   |- 가져오기 클릭 -> Promise.all([이미지 추출 API, 계정 정보 API])
   |   |- POST image-extractor-api/extract -> extractedImages[]
   |   +- POST /dashboard/oneclick/account-info -> companyName, brandNames, adset 정보
   |- cleanProductName(raw, brands) -> cleanedName
   +- 자동으로 STEP 2 진입

[STEP 2: 이미지 선택]
   |- extractedImages[] -> 4열 그리드 렌더링
   |- 이미지 클릭 -> selectedImageIndex, selectedImageSrc 설정
   |- "직접 업로드" -> FileReader -> extractedImages.unshift() -> 자동 선택
   +- 다음 버튼 -> STEP 3 진입

[STEP 3: 크롭]
   |- selectedImageSrc -> Image 로드 -> Canvas 렌더링
   |- 비율 선택 (4:5 / 1:1 / 9:16) -> 컨테이너 리사이즈 + 줌 재계산
   |- 줌/드래그 -> cropX, cropY, cropZoom 업데이트 -> drawCrop()
   +- 다음 버튼 -> generateCroppedBlob() -> croppedBlob, croppedDataUrl -> STEP 4 진입

[STEP 4: 게시]
   |- initPublishView():
   |   |- Instagram 미리보기 카드 구성 (Feed / Reels 분기)
   |   |- 광고명 자동 생성 -> [YYYYMMDD][단일][상품명]
   |   |- Headline/Description 칩 초기화
   |   +- POST /dashboard/oneclick/generate-text -> AI 주요 문구 + 가격
   |
   |- 게시하기 클릭 -> publishAd():
   |   |- POST /dashboard/get_meta_token -> accessToken
   |   |- POST graph.facebook.com/act_{id}/adimages -> image_hash
   |   +- POST /dashboard/oneclick/publish -> 광고 생성
   +- 성공 -> 성공 오버레이 ("새 광고 만들기" / "홈으로")
```

---

## 공통 레이아웃

### 헤더 (`.header`)

| 요소 | 클래스/ID | 용도 |
|------|-----------|------|
| 전체 컨테이너 | `.header` | sticky, z-index:100, bg:var(--bg-secondary) |
| 플랫폼 로고 | `.platform-logo` | Meta 그라데이션 (135deg, #0668e1 -> #833ab4), 36x36px |
| 타이틀 | `.header-title-text` | "AdCanvas" (18px, 700) |
| 서브타이틀 | `.header-subtitle` | "Meta Ads - 원클릭" (11px) |
| 계정 배지 | `.account-badge` | account_name 또는 account_id 표시 |
| 햄버거 아이콘 | `#hamburgerIcon` | 3줄 아이콘, 클릭 시 드롭다운 토글 |
| 드롭다운 | `#hamburgerDropdown` | 네비게이션 메뉴 |

### 햄버거 메뉴 항목

| 텍스트 | 링크 | 비고 |
|--------|------|------|
| AdCanvas 홈 | `/adcanvas_meta?account_id={id}` | `data-exit-link="true"` |
| 애드캔버스 홈 | `/adcanvas/select-platform` | `data-exit-link="true"` |
| 사이트 성과 | `/` | `data-exit-link="true"` |
| 메타 광고 성과 | `{{ url_for('ads_page') }}` | `data-exit-link="true"` |
| 로그아웃 | `{{ url_for('auth.logout') }}` | `data-exit-link="true"`, 빨간 텍스트 |

### 스텝 바 (`.steps-bar`)

| ID | 스텝 | 라벨 | 상태 클래스 |
|----|------|------|-------------|
| `#si1` | 1 | URL | `.active` / `.done` |
| `#c12` | - | 커넥터 | `.done` |
| `#si2` | 2 | 이미지 | `.active` / `.done` |
| `#c23` | - | 커넥터 | `.done` |
| `#si3` | 3 | 크롭 | `.active` / `.done` |
| `#c34` | - | 커넥터 | `.done` |
| `#si4` | 4 | 게시 | `.active` / `.done` |

**스텝 상태 스타일**:

| 상태 | `.step-num` 배경 | `.step-num` 색상 | `.step-item` 색상 |
|------|------------------|------------------|-------------------|
| pending | `rgba(255,255,255,0.06)` | `var(--text-muted)` | `var(--text-muted)` |
| active | `var(--accent-blue)` | `#fff` | `var(--accent-blue)` |
| done | `var(--accent-emerald)` | `#fff` | `var(--accent-emerald)` |

### 스텝 전환 함수

```javascript
function goToStep(n) {
  // n: 1~4
  // 1. 모든 .step-panel에서 .active 제거, #step{n}에 .active 추가
  // 2. 스텝 아이템 상태 갱신: i < n -> done, i === n -> active, i > n -> 기본
  // 3. 커넥터 상태 갱신: i < n -> .done
  // 4. currentStep = n
  // 5. n === 3 -> initCrop()
  // 6. n === 4 -> initPublishView()
}
```

---

## STEP 1: URL 입력 (`#step1`)

### HTML 요소

| ID/클래스 | 타입 | 용도 | 기본값 |
|-----------|------|------|--------|
| `#step1` | div (`.step-panel`) | 스텝 1 패널 | `.active` |
| `.url-section` | div | 중앙 정렬 컨테이너 (padding: 30px 0 20px) | - |
| `#productUrl` | input[text] | 상품 URL 입력 (`.url-input`) | `""` |
| `#btnFetch` | button | "가져오기" 버튼 (`.btn-fetch`) | - |
| `#fetchStatus` | div | 상태 메시지 (`.fetch-status`) | `""` |

### JS 상태 변수

```javascript
let currentStep = 1;            // number: 현재 스텝 (1~4)
let productUrl = '';             // string: 입력된 상품 URL
let extractedImages = [];        // Array<{data_url: string, width: number, height: number, isUploaded: boolean, demo_name?: string}>
let productName = '';            // string: 서버 응답 product_name
let companyName = '';            // string: 회사명
let brandNames = [];             // string[]: 브랜드명 변형 배열 (한글/영문)
let cleanedName = '';            // string: 브랜드 접두어 제거된 상품명
```

### URL 검증 패턴

#### 차단 패턴 (BLOCKED_URL_PATTERNS)

상품 상세페이지가 아닌 URL을 차단한다. 단, 상품 패턴 검사를 먼저 수행하여 Cafe24 등의 `/product/.../category/...` 구조를 정상 통과시킨다.

```javascript
const BLOCKED_URL_PATTERNS = [
  /\/category\//i, /\/categories\//i,
  /\/collection\//i, /\/collections\//i,
  /\/event\//i, /\/events\//i,
  /\/promotion\//i, /\/promotions\//i,
  /\/main/i, /\/index/i, /\/home/i,
  /\/best/i, /\/new/i, /\/sale\/?$/i,
  /\?cate_no=/i,
  /\/board\//i, /\/notice\//i,
  /\/shop\/\?.*page=/i
];
```

#### 상품 패턴 (PRODUCT_URL_PATTERNS)

차단 패턴보다 우선 검사한다. 아래 패턴 중 하나라도 매칭되면 상품 상세페이지로 판단.

```javascript
const PRODUCT_URL_PATTERNS = [
  // Cafe24
  /product_no=/i, /product\/detail/i, /\/product\//i, /\/products\//i,
  // MakeShop
  /shopdetail\.html/i, /branduid=/i,
  // GodoMall (고도몰)
  /goods_view/i, /goods_detail/i, /goodsNo=/i, /goods_no=/i, /\/goods\//i,
  // Imweb (아임웹)
  /\/prod\/detail/i, /\/prod\/[^\/]+$/i, /idx=/i,
  // 공통
  /\/item\//i, /item_no=/i, /\/p\//i,
  /product_id=/i, /\/shop\/[a-z0-9\-]+$/i
];
```

#### 검증 함수

```javascript
function isProductDetailUrl(url) {
  // 1. PRODUCT_URL_PATTERNS 중 하나라도 매칭 -> true (상세페이지)
  for (const p of PRODUCT_URL_PATTERNS) { if (p.test(url)) return true; }
  // 2. BLOCKED_URL_PATTERNS 중 하나라도 매칭 -> false (차단)
  for (const p of BLOCKED_URL_PATTERNS) { if (p.test(url)) return false; }
  // 3. 둘 다 아님 -> true (허용)
  return true;
}
```

### 브랜드명 제거 함수

```javascript
function cleanProductName(raw, brands) {
  // 입력: raw = 원본 상품명, brands = 브랜드명 배열
  // allBrands = brands 또는 [companyName] (fallback)
  // 각 브랜드에 대해:
  //   구분자('_',' ','-','/',':') 포함 접두어 검사 -> 제거
  //   구분자 없이 바로 붙은 경우도 검사 -> 제거
  // 마지막: 언더스코어를 공백으로 치환 + trim
  // 출력: 정제된 상품명
}
```

### 데이터 플로우 체인

#### 1-1. URL 입력 및 이미지 가져오기

```
[#btnFetch 클릭] 또는 [#productUrl Enter 키]
  |
  |- 빈 URL -> showStatus('URL을 입력하세요', true) -> 종료
  |
  |- URL 검증 (데모 모드에서는 스킵):
  |   +- isProductDetailUrl(url) === false
  |       -> showAlert('상세페이지 URL만 입력 가능',
  |           '카테고리, 메인, 이벤트, 베스트 페이지는 사용할 수 없습니다.\n
  |            상품 상세페이지 URL을 입력해주세요.', 해당아이콘)
  |       -> 종료
  |
  |- productUrl = url
  |- btnFetch.disabled = true
  |- showLoading('이미지를 가져오는 중...')
  |
  |- [일반 모드] Promise.all 병렬 호출:
  |   |- POST IMAGE_EXTRACTOR_API/extract
  |   |   Body: { url, account_id: ACCOUNT_ID }
  |   |   -> imgData = { images, product_name, brand_names?, price? }
  |   |
  |   +- POST /dashboard/oneclick/account-info
  |       Body: { account_id: ACCOUNT_ID }
  |       -> acctData = { status, company_name, brand_names, has_conv_adset, has_traffic_adset }
  |
  |- [데모 모드] demoDelay(3000ms) 후:
  |   |- imgData = 데모 상품 이미지 + 이름 (DEMO_IMAGES 배열 사용)
  |   +- acctData = 데모 계정 정보 (누구나컴퍼니, conv+traffic 모두 true)
  |
  |- acctData 처리:
  |   |- companyName = acctData.company_name
  |   |- brandNames = acctData.brand_names
  |   |- hasConvAdset = acctData.has_conv_adset
  |   +- hasTrafficAdset = acctData.has_traffic_adset
  |
  |- imgData.images 없음 또는 빈 배열:
  |   -> showAlert('이미지를 찾을 수 없습니다', ...) -> hideLoading() -> btnFetch.disabled = false -> 종료
  |
  |- extractedImages = imgData.images.map(img => ({ ...img, isUploaded: false }))
  |- productName = imgData.product_name
  |- cleanedName = cleanProductName(productName, brandNames)
  |
  |- hideLoading()
  |- btnFetch.disabled = false
  |- renderImageGrid()
  +- goToStep(2)  // 자동 진입
```

#### 1-2. Enter 키 지원

```
[#productUrl keypress] -> e.key === 'Enter' -> btnFetch.click()
```

### 데모 모드 (Step 1)

| 항목 | 일반 모드 | 데모 모드 |
|------|----------|----------|
| URL 입력 | 사용자 직접 입력 | `readonly`, `opacity:0.5`, `cursor:not-allowed` |
| URL 기본값 | `""` | `https://demo-shop.com/product/detail.html?product_no=12345` |
| 버튼 텍스트 | "가져오기" | "다음 ->" |
| 제목 텍스트 | "반드시 상품 상세페이지 URL을 입력해주세요" | "데모 모드" (accent-blue) |
| 설명 텍스트 | "카테고리/메인/이벤트 페이지는 사용할 수 없습니다" | "데모 모드에서는 URL을 직접 입력할 수 없습니다." |
| URL 클릭 시 | 포커스 | showAlert('데모 모드 안내', 'URL을 변경할 수 없습니다...') |
| 페이지 로드 시 | - | 300ms 후 안내 팝업: showAlert('데모 모드', '...체험해보세요...') |

**데모 상품명 배열** (Step 2에서 이미지 선택 시 사용):

```javascript
const DEMO_PRODUCT_NAMES = [
  '라이트 워싱 데님 자켓',
  '크림 블라우스 x 블랙 미디스커트 세트',
  '브라운 슬리브리스 랩 원피스',
  '오버핏 그레이 트렌치코트',
  '블랙 크롭 자켓 x 글렌체크 와이드팬츠',
  '올리브 오버핏 블레이저 셋업',
  '그레이 테일러드 블레이저 셋업',
  '컬러블록 오버사이즈 재킷',
];
```

---

## STEP 2: 이미지 선택 (`#step2`)

### HTML 요소

| ID/클래스 | 타입 | 용도 | 기본값 |
|-----------|------|------|--------|
| `#step2` | div (`.step-panel`) | 스텝 2 패널 | - |
| `.step2-header` | div | 제목 + 업로드 버튼 (flex, space-between) | - |
| `.step-title` | div | "이미지를 선택하세요" | - |
| `.step-desc` | div | "1개만 선택 / 마음에 드는 이미지가 없다면 직접 업로드" | - |
| `#btnUploadStep2` | button | "직접 업로드" (`.btn-upload-step2`, dashed border) | - |
| `#fileInput` | input[file] | 숨김 파일 입력 (accept="image/*") | `display:none` |
| `#imageGrid` | div (`.image-grid`) | 4열 그리드 (grid-template-columns: repeat(4, 1fr)) | - |
| `#btnBack2` | button | "이전" (`.btn-prev`) | - |
| `#btnNext2` | button | "다음" (`.btn-next`) | `disabled` |

### JS 상태 변수

```javascript
let extractedImages = [];        // Array<{data_url, width, height, isUploaded, demo_name?}>
let selectedImageIndex = -1;     // number: 선택된 이미지 인덱스 (-1 = 미선택)
let selectedImageSrc = '';       // string: 선택된 이미지의 data_url
```

### CSS 클래스

| 클래스 | 대상 | 설명 |
|--------|------|------|
| `.image-grid` | 그리드 컨테이너 | 4열, gap:10px, padding:12px 0 |
| `.image-grid-item` | 개별 이미지 | border-radius:8px, aspect-ratio:3/4, border:2px solid transparent |
| `.image-grid-item.selected` | 선택된 이미지 | `border-color: var(--accent-blue)` |
| `.image-grid-item:hover` | 호버 | `border-color: rgba(255,255,255,0.15)` |
| `.check-mark` | 체크 아이콘 | 절대 위치 top:6px right:6px, 22x22px, 파란 원, `display:none` (기본) |
| `.selected .check-mark` | 선택 시 체크 | `display:flex` |
| `.uploaded-badge` | 업로드 배지 | 하단 전체 폭, 파란 배경 (rgba(59,130,246,0.85)), "업로드" 텍스트 |

### 데이터 플로우 체인

#### 2-1. 이미지 그리드 렌더링

```
renderImageGrid():
  |- #imageGrid 내용 초기화
  |- extractedImages.forEach((img, idx):
  |   |- div.image-grid-item 생성
  |   |- idx === selectedImageIndex -> .selected 클래스 추가
  |   |- img 태그: src = img.data_url
  |   |- .check-mark SVG (체크 아이콘)
  |   |- img.isUploaded === true -> .uploaded-badge ("업로드") 추가
  |   +- div.addEventListener('click', () => selectImage(idx))
  +- grid에 appendChild
```

#### 2-2. 이미지 선택

```
selectImage(idx):
  |- 모든 .image-grid-item의 .selected 토글 (i === idx만 활성)
  |- selectedImageIndex = idx
  |- selectedImageSrc = extractedImages[idx].data_url
  |- [데모 모드] extractedImages[idx].demo_name 존재 시:
  |   |- productName = extractedImages[idx].demo_name
  |   +- cleanedName = productName
  +- #btnNext2.disabled = false
```

#### 2-3. 직접 업로드

```
[#btnUploadStep2 클릭]:
  |- [데모 모드] -> showAlert('데모 모드 안내', '...이용할 수 없습니다...') -> 종료
  +- [일반 모드] -> #fileInput.click()

[#fileInput change]:
  |- file = e.target.files[0]
  |- FileReader.readAsDataURL(file)
  |- reader.onload:
  |   |- extractedImages.unshift({ data_url: result, width: 0, height: 0, isUploaded: true })
  |   |- renderImageGrid()
  |   +- selectImage(0)  // 업로드된 이미지 자동 선택 (맨 앞)
  +- e.target.value = '' (동일 파일 재업로드 허용)
```

#### 2-4. 네비게이션

```
[#btnNext2 클릭] -> goToStep(3)
[#btnBack2 클릭] -> goToStep(1)
```

### 검증

- **다음 버튼**: `selectedImageIndex >= 0`일 때만 활성화
- **이미지 선택**: 단일 선택만 허용 (1개)
- **업로드 파일**: `accept="image/*"` (이미지만)

---

## STEP 3: 크롭 (`#step3`)

### HTML 요소

| ID/클래스 | 타입 | 용도 | 기본값 |
|-----------|------|------|--------|
| `#step3` | div (`.step-panel`) | 스텝 3 패널 | - |
| `.crop-container` | div | 중앙 정렬, flex-column | - |
| `#cropWrap` | div (`.crop-canvas-wrap`) | 캔버스 컨테이너 (max-width:460px) | - |
| `#cropCanvas` | canvas | 크롭 캔버스 | width=460, height=460 |
| `.crop-ratio-bar` | div | 비율 버튼 그룹 (flex, gap:8px) | - |
| `.ratio-btn` (3개) | button | 4:5, 1:1, 9:16 비율 선택 | 4:5 -> `.active` |
| `#zoomSlider` | input[range] | 줌 슬라이더 (`.zoom-slider`) | min:0.01, max:3, step:0.01 |
| `#zoomValue` | span | 줌 퍼센트 표시 (`.zoom-value`) | "100%" |
| `#btnBack3` | button | "이전" | - |
| `#btnNext3` | button | "다음" | - |

### JS 상태 변수

```javascript
let cropImage = null;            // Image: 로드된 이미지 객체
let cropCanvas;                  // HTMLCanvasElement: #cropCanvas 참조
let cropCtx;                     // CanvasRenderingContext2D: 캔버스 컨텍스트
let currentAspectRatio = 4/5;    // number: 현재 비율 (0.8)
let cropZoom = 1;                // number: 현재 줌 레벨
let cropMinZoom = 0.01;          // number: 최소 줌 (이미지가 캔버스를 채우는 값)
let cropX = 0;                   // number: 이미지 X 오프셋 (패닝)
let cropY = 0;                   // number: 이미지 Y 오프셋 (패닝)
let isDragging = false;          // boolean: 드래그 중 여부
let dragStartX = 0;              // number: 드래그 시작 X
let dragStartY = 0;              // number: 드래그 시작 Y
let croppedBlob = null;          // Blob: 크롭 결과 Blob
let croppedDataUrl = '';         // string: 크롭 결과 ObjectURL
let containerWidth = 0;          // number: 캔버스 컨테이너 폭
let containerHeight = 0;         // number: 캔버스 컨테이너 높이
```

### 비율 상수

| 버튼 라벨 | `data-ratio` | 값 | 용도 |
|----------|-------------|-----|------|
| 4:5 | `"0.8"` | `4/5 = 0.8` | Feed (기본) |
| 1:1 | `"1"` | `1.0` | Square |
| 9:16 | `"0.5625"` | `9/16 = 0.5625` | Reels/Story |

### 데이터 플로우 체인

#### 3-1. 크롭 초기화

```
initCrop() (goToStep(3) 호출 시 실행):
  |- cropCanvas = #cropCanvas
  |- cropCtx = cropCanvas.getContext('2d')
  |- wrap = #cropWrap
  |
  |- Image 생성 (crossOrigin = 'anonymous')
  |- img.src = selectedImageSrc
  |
  |- img.onload:
  |   |- cropImage = img
  |   |- containerWidth = wrap.clientWidth
  |   |- maxH = window.innerHeight - 420
  |   |- containerHeight = min(round(containerWidth / currentAspectRatio), maxH)
  |   |- containerWidth = round(containerHeight * currentAspectRatio)
  |   |- cropCanvas.width = containerWidth
  |   |- cropCanvas.height = containerHeight
  |   |- wrap.style.height/width 설정
  |   |
  |   |- cropMinZoom 계산:
  |   |   sx = containerWidth / img.naturalWidth
  |   |   sy = containerHeight / img.naturalHeight
  |   |   cropMinZoom = max(sx, sy)  // 이미지가 캔버스를 완전히 채우는 최소 줌
  |   |
  |   |- cropZoom = cropMinZoom (fit to fill)
  |   |- iw = img.naturalWidth * cropZoom
  |   |- ih = img.naturalHeight * cropZoom
  |   |- cropX = (containerWidth - iw) / 2  // 중앙 정렬
  |   |- cropY = (containerHeight - ih) / 2
  |   |
  |   |- 줌 슬라이더 설정:
  |   |   slider.min = cropMinZoom
  |   |   slider.max = max(cropMinZoom * 5, 3)
  |   |   slider.value = cropZoom
  |   |   #zoomValue.textContent = round(cropZoom * 100) + '%'
  |   |
  |   +- drawCrop()
  |
  |- 비율 버튼 이벤트 등록
  |- 줌 슬라이더 이벤트 등록
  |- 마우스 이벤트 등록 (mousedown, mousemove, mouseup)
  |- 터치 이벤트 등록 (touchstart, touchmove, touchend)
  +- 휠 이벤트 등록 (wheel)
```

#### 3-2. 비율 변경

```
[.ratio-btn 클릭]:
  |- 모든 .ratio-btn에서 .active 제거 -> 클릭된 버튼에 .active 추가
  |- currentAspectRatio = parseFloat(btn.dataset.ratio)
  |
  |- 컨테이너 크기 재계산:
  |   |- maxHR = window.innerHeight - 420
  |   |- containerWidth = min(wrap.parentElement.clientWidth, 460)
  |   |- containerHeight = min(round(containerWidth / currentAspectRatio), maxHR)
  |   |- containerWidth = round(containerHeight * currentAspectRatio)
  |   +- cropCanvas.width/height + wrap.style 업데이트
  |
  |- cropImage 존재 시:
  |   |- cropMinZoom = max(containerWidth / img.naturalWidth, containerHeight / img.naturalHeight)
  |   |- cropZoom < cropMinZoom -> cropZoom = cropMinZoom
  |   |- cropX/cropY 중앙 재배치
  |   |- 줌 슬라이더 min/value 업데이트
  |   +- drawCrop()
```

#### 3-3. 줌 조작

```
[#zoomSlider input]:
  |- nz = parseFloat(e.target.value)
  |- nz < cropMinZoom -> nz = cropMinZoom, e.target.value = cropMinZoom
  |
  |- 중심점 기준 줌:
  |   cx = containerWidth / 2, cy = containerHeight / 2
  |   px = (cx - cropX) / cropZoom  // 이미지 좌표계에서의 중심점
  |   py = (cy - cropY) / cropZoom
  |   cropX = cx - px * nz  // 새 줌에서 중심점 유지
  |   cropY = cy - py * nz
  |
  |- cropZoom = nz
  |- #zoomValue.textContent = round(nz * 100) + '%'
  |- clampPos()
  +- drawCrop()

[#cropCanvas wheel]:
  |- e.preventDefault()
  |- d = deltaY > 0 ? -0.03 : +0.03
  |- nz = clamp(cropZoom + d, cropMinZoom, slider.max)
  |- 마우스 커서 기준 줌:
  |   mx = e.clientX - rect.left, my = e.clientY - rect.top
  |   px = (mx - cropX) / cropZoom
  |   py = (my - cropY) / cropZoom
  |   cropX = mx - px * nz, cropY = my - py * nz
  |- cropZoom = nz
  |- 슬라이더/퍼센트 업데이트
  |- clampPos()
  +- drawCrop()
```

#### 3-4. 패닝 (드래그)

```
[#cropCanvas mousedown]:
  |- isDragging = true
  |- dragStartX = e.clientX - cropX
  +- dragStartY = e.clientY - cropY

[window mousemove] (isDragging === true):
  |- cropX = e.clientX - dragStartX
  |- cropY = e.clientY - dragStartY
  |- clampPos()
  +- drawCrop()

[window mouseup]:
  +- isDragging = false

터치 이벤트: 동일 로직 (touches[0].clientX/Y 사용, passive:false)
```

#### 3-5. 경계 제한 함수

```javascript
function clampPos() {
  if (!cropImage) return;
  const iw = cropImage.naturalWidth * cropZoom;
  const ih = cropImage.naturalHeight * cropZoom;
  // 이미지가 캔버스 영역 밖으로 나가지 않도록 제한
  if (cropX > 0) cropX = 0;
  if (cropY > 0) cropY = 0;
  if (cropX + iw < containerWidth) cropX = containerWidth - iw;
  if (cropY + ih < containerHeight) cropY = containerHeight - ih;
}
```

#### 3-6. 캔버스 렌더링

```javascript
function drawCrop() {
  if (!cropImage || !cropCtx) return;
  // 1. 캔버스 클리어
  cropCtx.clearRect(0, 0, containerWidth, containerHeight);
  // 2. 이미지 그리기
  cropCtx.drawImage(cropImage, cropX, cropY,
    cropImage.naturalWidth * cropZoom,
    cropImage.naturalHeight * cropZoom);
  // 3. 3분할 가이드라인 (흰색 15% 투명도)
  cropCtx.strokeStyle = 'rgba(255,255,255,0.15)';
  cropCtx.lineWidth = 1;
  for (let i = 1; i <= 2; i++) {
    const x = (containerWidth / 3) * i;
    const y = (containerHeight / 3) * i;
    // 세로선
    cropCtx.beginPath();
    cropCtx.moveTo(x, 0);
    cropCtx.lineTo(x, containerHeight);
    cropCtx.stroke();
    // 가로선
    cropCtx.beginPath();
    cropCtx.moveTo(0, y);
    cropCtx.lineTo(containerWidth, y);
    cropCtx.stroke();
  }
}
```

#### 3-7. 크롭 결과 생성

```
generateCroppedBlob() -> Promise<Blob>:
  |- cropImage 없음 -> reject('이미지 없음')
  |
  |- 소스 영역 계산 (원본 이미지 좌표계):
  |   sx = max(0, -cropX / cropZoom)
  |   sy = max(0, -cropY / cropZoom)
  |   sw = min(cropImage.naturalWidth - sx, containerWidth / cropZoom)
  |   sh = min(cropImage.naturalHeight - sy, containerHeight / cropZoom)
  |
  |- 임시 Canvas 생성:
  |   c.width = round(sw)
  |   c.height = round(sh)
  |
  |- ctx.imageSmoothingEnabled = true
  |- ctx.imageSmoothingQuality = 'high'
  |- ctx.drawImage(cropImage, sx, sy, sw, sh, 0, 0, c.width, c.height)
  |
  |- c.toBlob(callback, 'image/jpeg', 0.92)
  |   |- blob === null -> reject('Blob 생성 실패')
  |   |- croppedBlob = blob
  |   |- croppedDataUrl = URL.createObjectURL(blob)
  |   +- resolve(blob)
```

#### 3-8. 네비게이션

```
[#btnNext3 클릭]:
  |- showLoading('이미지를 처리하는 중...')
  |- await generateCroppedBlob()
  |- hideLoading()
  +- goToStep(4)

[#btnBack3 클릭] -> goToStep(2)
```

### 커서 스타일

- `.crop-canvas-wrap canvas` -> `cursor: grab`
- `.crop-canvas-wrap canvas:active` -> `cursor: grabbing`

---

## STEP 4: 게시 (`#step4`)

### 레이아웃 구조

```
.publish-layout (display: grid)
  |- grid-template-columns: 1fr 1fr (데스크톱)
  |- grid-template-columns: 1fr (모바일, max-width 740px)
  |- gap: 24px
  |
  |- [Left Column] -- Instagram 미리보기
  |   |- .insta-card
  |   +- #btnBack4 (이전 버튼)
  |
  +- [Right Column] -- 설정 패널
      |- .ad-name-row (광고이름)
      |- .field-box#fbPrimary (주요 문구)
      |- .field-box#fbHeadline (제목)
      |- .field-box#fbDesc (설명)
      |- .adset-row (광고세트)
      |- .url-row (랜딩 URL)
      +- #btnPublish (게시하기)
```

### HTML 요소 -- 좌측: Instagram 미리보기

| ID/클래스 | 타입 | 용도 |
|-----------|------|------|
| `.insta-card` | div | Instagram 미리보기 카드 |
| `.insta-card.reels-mode` | div | Reels 모드 (9:16 비율 시) |
| `.insta-header` | div | 프로필 사진 + 계정명 + "광고" 라벨 |
| `.insta-profile img` | img | 프로필 이미지 (28x28px) |
| `.insta-account-name` | div | 계정명 (12px, 600) |
| `.insta-ad-label` | div | "광고" (10px) |
| `#previewImage` | img | 크롭된 이미지 미리보기 |
| `.insta-cta-bar` | div | "더 알아보기" CTA 바 |
| `.insta-icons-row` | div | 좋아요, 댓글, 공유, 저장 SVG 아이콘 |
| `#previewCaption` | div | 주요 문구 미리보기 (`.insta-caption-area`) |
| `#btnBack4` | button | "이전" (`.btn-prev`) |

### Instagram 미리보기 모드 분기

| 모드 | 조건 | 레이아웃 |
|------|------|----------|
| Feed | `currentAspectRatio > 0.5625` | 일반 Instagram 포스트 (헤더->이미지->CTA->아이콘->캡션) |
| Reels | `currentAspectRatio <= 0.5625` | `.insta-card.reels-mode`: 전체 높이, 오버레이 헤더/아이콘/캡션/CTA |

**Reels 모드 CSS 특징**:

| 요소 | 위치 | 스타일 |
|------|------|--------|
| `.insta-header` | 상단 오버레이 | `background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)` |
| `.insta-image-wrap` | `position: absolute; inset: 0` | 전체 채움, `object-fit: cover` |
| `.insta-cta-bar` | 하단 12px | `background: rgba(255,255,255,0.95)`, 라운드 |
| `.insta-icons-row` | 우측 세로 배치 | `flex-direction: column`, `gap: 18px`, 흰색 + 드롭 쉐도우 |
| `.insta-caption-area` | 하단 56px | 1줄 제한 (`-webkit-line-clamp:1`), 흰색 텍스트, 텍스트 쉐도우 |

### HTML 요소 -- 우측: 설정 패널

#### 광고이름 (`.ad-name-row`)

| ID/클래스 | 타입 | 용도 |
|-----------|------|------|
| `.ad-name-row` | div | flex 행 (padding:10px 14px) |
| `.field-label` | span | "광고이름" 라벨 |
| `#adNameText` | span | 자동 생성 이름 (`.ad-name-val .font-inter`) |

**광고명 생성 규칙**:

```javascript
const now = new Date();
const ds = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
const tn = (cleanedName || productName || 'untitled').substring(0, 30);
// 결과: [YYYYMMDD][단일][상품명 최대30자]
```

#### 주요 문구 (`.field-box#fbPrimary`)

| ID/클래스 | 타입 | 용도 |
|-----------|------|------|
| `#fbPrimary` | div (`.field-box`) | 주요 문구 필드 컨테이너 |
| `.field-header` | div | 라벨 + 액션 버튼 영역 |
| `.field-label` | span | "주요 문구" |
| `#btnEditPrimary` | button | "수정"/"저장" 토글 (`.btn-edit`) |
| `#emojiBtnWrap` | div | 이모지 버튼 래퍼 (`display:none` 기본) |
| `#emojiBtn` | button | 이모지 트리거 (`.emoji-btn`) |
| `#emojiPicker` | div | 이모지 선택 팝업 (`.emoji-picker`) |
| `#primaryDisplay` | div | 문구 표시 (`.field-value`) |
| `#inputPrimary` | textarea | 문구 편집 (`.field-textarea`, 5 rows, `display:none`) |

**주요 문구 편집 토글** (`toggleEditPrimary()`):

```
[비편집 -> 편집]:
  |- textarea.value = generatedPrimaryText || display.textContent
  |- display.style.display = 'none'
  |- textarea.style.display = 'block' + focus()
  |- btn.textContent = '저장'
  |- btn 스타일: 파란 배경 (#3b82f6 15%), 파란 텍스트, 파란 테두리
  |- emojiBtnWrap.style.display = '' (보이기)
  +- isPrimaryEditing = true

[편집 -> 비편집]:
  |- generatedPrimaryText = textarea.value
  |- display.textContent = val || '--'
  |- display.style.display = '' (보이기)
  |- textarea.style.display = 'none'
  |- btn.textContent = '수정'
  |- btn 스타일 초기화
  |- emojiBtnWrap.style.display = 'none'
  |- isPrimaryEditing = false
  +- syncPreview()
```

**이모지 피커**:

```javascript
const EMOJIS = ['*','fire','sparkles','star','flower','hearts','point','gift',
  'package','100','tag','check','new','muscle','herb','sun','moon','snow',
  'leaf','bouquet','dress','shoe','lipstick','lotion','gem','cart','phone',
  'party','yellow_heart','white_heart','black_heart'];
// 실제 유니코드 이모지 32종
```

- 이모지 클릭 -> textarea 커서 위치에 삽입 -> syncPreview()
- `#emojiBtn` 클릭 -> `.emoji-picker.show` 토글
- `document` 클릭 -> `.emoji-picker.show` 제거

#### 제목 -- Headline (`.field-box#fbHeadline`)

| ID/클래스 | 타입 | 용도 |
|-----------|------|------|
| `#fbHeadline` | div (`.field-box`) | 제목 필드 컨테이너 |
| `#headlineChips` | div (`.field-chips`) | 칩 버튼 그룹 |
| `.field-chip[data-hl="name"]` | button | "상품명" 칩 (기본 active) |
| `.field-chip[data-hl="price"]` | button | "가격" 칩 |
| `.field-chip[data-hl="custom"]` | button | "직접입력" 칩 |
| `#headlineDisplay` | div | 제목 표시 (`.field-value`) |
| `#headlineCustomWrap` | div | 직접입력 래퍼 (`.field-chip-custom-wrap`) |
| `#inputHeadlineCustom` | input[text] | 직접입력 필드 (`.field-input`) |

**JS 상태**:

```javascript
let hlOrder = ['name'];          // string[]: 칩 선택 순서 배열 ('name' | 'price' | 'custom')
let productPrice = '';           // string: AI 응답에서 받은 가격 문자열
```

**Headline 칩 로직 (순서 기반)**:

```
[칩 클릭 (data-hl = t)]:
  |- t === 'custom':
  |   +- hlOrder = ['custom']  // 배타적 -- 다른 칩 모두 해제
  |
  |- t === 'name' 또는 'price':
  |   |- hlOrder에서 'custom' 제거
  |   |- 이미 활성(hlOrder에 포함):
  |   |   +- hlOrder.length > 1 -> 제거 (최소 1개 유지)
  |   +- 비활성:
  |       +- hlOrder.push(t) (맨 뒤에 추가)
  |
  |- updateHlChipsUI()
  +- composeHeadline()

updateHlChipsUI():
  |- 각 칩의 .active 토글 (hlOrder에 포함 여부)
  |- 순서 배지 표시 (activeCount >= 2일 때, custom 제외):
  |   |- span.chip-order (14x14px, 파란 원, 9px 흰색 번호)
  |   +- hlOrder.indexOf(t) + 1 번째
  |- hlOrder에 'custom' 포함 -> #headlineCustomWrap.show
  +- hlOrder에 'custom' 포함 -> #headlineDisplay.style.display = 'none'

composeHeadline() -> string:
  |- hlOrder에 'custom' 포함:
  |   +- return #inputHeadlineCustom.value
  |- parts = []
  |   |- 'name' -> cleanedName || productName
  |   +- 'price' -> productPrice (있을 때만)
  |- composed = parts.join(' ').trim()
  +- #headlineDisplay.textContent = composed || '--'
```

**Headline 조합 예시**:

| hlOrder | cleanedName | productPrice | 결과 |
|---------|-------------|--------------|------|
| `['name']` | "슬림핏 데님 팬츠" | "39,000원" | "슬림핏 데님 팬츠" |
| `['name','price']` | "슬림핏 데님 팬츠" | "39,000원" | "슬림핏 데님 팬츠 39,000원" |
| `['price','name']` | "슬림핏 데님 팬츠" | "39,000원" | "39,000원 슬림핏 데님 팬츠" |
| `['custom']` | - | - | (사용자 입력값) |

#### 설명 -- Description (`.field-box#fbDesc`)

| ID/클래스 | 타입 | 용도 |
|-----------|------|------|
| `#fbDesc` | div (`.field-box`) | 설명 필드 컨테이너 |
| `#descChips` | div (`.field-chips`) | 칩 버튼 그룹 |
| `.field-chip[data-dc="brand"]` | button | "브랜드" 칩 (기본 active) |
| `.field-chip[data-dc="custom"]` | button | "직접입력" 칩 |
| `#descDisplay` | div | 설명 표시 (`.field-value`) |
| `#descCustomWrap` | div | 직접입력 래퍼 (`.field-chip-custom-wrap`) |
| `#inputDescCustom` | input[text] | 직접입력 필드 (`.field-input`) |

**JS 상태**:

```javascript
let dcMode = 'brand';            // 'brand' | 'custom'
```

**Description 칩 로직 (배타적 선택)**:

```
[칩 클릭 (data-dc = t)]:
  |- dcMode = t
  |- updateDcChipsUI()
  +- composeDesc()

updateDcChipsUI():
  |- 각 칩: .active = (data-dc === dcMode)
  |- dcMode === 'custom' -> #descCustomWrap.show
  +- dcMode === 'custom' -> #descDisplay.style.display = 'none'

composeDesc() -> string:
  |- dcMode === 'custom' -> return #inputDescCustom.value
  +- dcMode === 'brand' -> return companyName || '--'
```

#### 광고세트 (`.adset-row`)

| ID/클래스 | 타입 | 용도 |
|-----------|------|------|
| `.adset-row` | div | flex 행 (wrap) |
| `#chipConv` | button | "전환" (`.adset-chip`, data-mode="conv_only") |
| `#chipTraffic` | button | "유입" (`.adset-chip`, data-mode="traffic_only") |
| `#chipBoth` | button | "전환+유입" (`.adset-chip`, data-mode="conv_traffic") |

**JS 상태**:

```javascript
let adsetMode = 'conv_only';     // 'conv_only' | 'traffic_only' | 'conv_traffic'
let hasConvAdset = false;        // boolean: 전환 광고세트 존재 여부
let hasTrafficAdset = false;     // boolean: 유입 광고세트 존재 여부
```

**광고세트 로직**:

```
updateAdsetUI():
  |- #chipConv.classList.toggle('disabled', !hasConvAdset)
  |- #chipTraffic.classList.toggle('disabled', !hasTrafficAdset)
  |- #chipBoth.classList.toggle('disabled', !hasConvAdset || !hasTrafficAdset)
  |- hasConvAdset -> setAdsetMode('conv_only') (기본)
  +- !hasConvAdset && hasTrafficAdset -> setAdsetMode('traffic_only')

setAdsetMode(mode):
  |- adsetMode = mode
  +- 모든 .adset-chip의 .active 토글 (data-mode === mode)

[.adset-chip 클릭]:
  |- .disabled 상태 -> 무시 (return)
  +- setAdsetMode(c.dataset.mode)
```

**비활성 칩 스타일**: `.adset-chip.disabled` -> `opacity: 0.3; cursor: not-allowed`

#### 랜딩 URL (`.url-row`)

| ID/클래스 | 타입 | 용도 |
|-----------|------|------|
| `.url-row` | div | 읽기 전용 URL 표시 |
| `#landingUrlText` | div | 상품 URL 텍스트 (`.url-val`, 말줄임) |

#### 게시 버튼

| ID | 클래스 | 스타일 |
|----|--------|--------|
| `#btnPublish` | `.btn-publish` | 전체 폭, emerald 배경, 14px/700 |

### 데이터 플로우 체인 -- 게시 초기화

#### 4-1. initPublishView()

```
initPublishView() (goToStep(4) 호출 시 실행):
  |
  |- Instagram 미리보기 모드 설정:
  |   |- currentAspectRatio <= 0.5625 -> .insta-card.classList.add('reels-mode')
  |   +- otherwise -> .insta-card.classList.remove('reels-mode')
  |
  |- #previewImage.src = croppedDataUrl
  |
  |- 광고명 자동 생성:
  |   |- ds = YYYYMMDD
  |   |- tn = (cleanedName || productName || 'untitled').substring(0, 30)
  |   +- #adNameText.textContent = `[${ds}][단일][${tn}]`
  |
  |- Headline/Description 칩 초기화:
  |   |- hlOrder = ['name']
  |   |- dcMode = 'brand'
  |   |- updateHlChipsUI() + composeHeadline()
  |   |- updateDcChipsUI() + composeDesc()
  |   +- #landingUrlText.textContent = productUrl || '--'
  |
  |- 주요 문구 편집 상태 리셋:
  |   |- isPrimaryEditing = false
  |   |- #primaryDisplay.style.display = ''
  |   |- #inputPrimary.style.display = 'none'
  |   |- #btnEditPrimary: textContent='수정', 스타일 초기화
  |   +- #emojiBtnWrap.style.display = 'none'
  |
  |- AI 주요 문구 생성 (로딩 스피너 표시):
  |   |- #primaryDisplay에 스피너 + "AI가 문구와 가격을 수집하는 중..." 표시
  |   |- #inputPrimary.value = ''
  |   |- syncPreview()
  |   |
  |   |- [데모 모드] demoDelay(3000ms)
  |   |- POST /dashboard/oneclick/generate-text
  |   |   Body: { product_name, product_url, company_name, image_index? }
  |   |   Response: { primary_text, price? }
  |   |
  |   |- 성공:
  |   |   |- generatedPrimaryText = data.primary_text
  |   |   |- data.price 존재 -> productPrice = data.price -> updateHlChipsUI() + composeHeadline()
  |   |   +- #inputPrimary.value = generatedPrimaryText
  |   |
  |   +- 실패:
  |       +- generatedPrimaryText = cleanedName 기반 대체 텍스트
  |
  |- #primaryDisplay.textContent = generatedPrimaryText || '--'
  |- syncPreview()
  +- updateAdsetUI()
```

#### 4-2. syncPreview()

```javascript
function syncPreview() {
  const primary = document.getElementById('inputPrimary').value;
  document.getElementById('previewCaption').textContent = primary || '';
}
// textarea input 이벤트에도 연결: #inputPrimary input -> syncPreview()
```

### 데이터 플로우 체인 -- 게시

#### 4-3. 게시 실행

```
[#btnPublish 클릭]:
  |
  |- 검증:
  |   |- primaryText 없음 -> showAlert('주요 문구 필요', '주요 문구를 입력하세요.') -> 종료
  |   |- headline 없음 -> showAlert('제목 필요', '제목을 입력하세요.') -> 종료
  |   +- productUrl 없음 -> showAlert('URL 필요', '상품 URL이 필요합니다.') -> 종료
  |
  |- btn.disabled = true
  |- showLoading('광고를 게시하는 중...')
  |
  |- [데모 모드]:
  |   |- updateLoadingText('이미지를 업로드하는 중...')
  |   |- demoDelay(1500ms)
  |   |- updateLoadingText('광고를 생성하는 중...')
  |   |- demoDelay(2000ms)
  |   +- POST /dashboard/oneclick/publish
  |       Body: {
  |         account_id, image_hash: 'demo_hash',
  |         product_name: cleanedName || productName,
  |         primary_text, headline, description,
  |         link: productUrl, adset_mode,
  |         access_token: 'demo_token'
  |       }
  |
  |- [일반 모드]:
  |   |
  |   |- 1단계: Meta 토큰 획득
  |   |   POST /dashboard/get_meta_token (method: POST)
  |   |   Response: { status: "success", access_token: string }
  |   |   -> accessToken = tokenData.access_token
  |   |   |- status !== 'success' -> throw Error('액세스 토큰을 가져올 수 없습니다')
  |   |
  |   |- 2단계: 이미지 업로드
  |   |   |- adAccountId = 'act_' + ACCOUNT_ID.replace('act_', '')
  |   |   |- FormData: file = croppedBlob (filename: 'oneclick_ad.jpg')
  |   |   |- updateLoadingText('이미지를 업로드하는 중...')
  |   |   |- POST https://graph.facebook.com/{API_VERSION}/{adAccountId}/adimages?access_token={token}
  |   |   |   Body: FormData
  |   |   |   Response: { images: { "oneclick_ad.jpg": { hash: "abc123..." } } }
  |   |   |- upData.error -> throw Error(message)
  |   |   +- imageHash = upData.images[첫번째키].hash
  |   |       +- hash 없음 -> throw Error('이미지 해시를 받을 수 없습니다')
  |   |
  |   +- 3단계: 광고 게시
  |       |- updateLoadingText('광고를 생성하는 중...')
  |       +- POST /dashboard/oneclick/publish
  |           Body: {
  |             account_id: ACCOUNT_ID,
  |             image_hash: imageHash,
  |             product_name: cleanedName || productName,
  |             primary_text: primaryText,
  |             headline: headline,
  |             description: desc,
  |             link: productUrl,
  |             adset_mode: adsetMode,
  |             access_token: accessToken
  |           }
  |
  |- hideLoading()
  |
  |- pubData.status === 'success':
  |   |- msg = '광고명: {ad_name}\n{success_count}개 광고세트에 게시 완료'
  |   |- pubData.fail_count > 0 -> msg += '\n({fail_count}건 실패)'
  |   |- #successMsg.textContent = msg
  |   +- #successOverlay.classList.add('show')
  |
  +- 에러:
      |- hideLoading()
      |- showAlert('게시 실패', err.message)
      +- btn.disabled = false
```

---

## 오버레이 / 모달

### 로딩 오버레이 (`#loadingOverlay`)

| ID/클래스 | 타입 | 용도 |
|-----------|------|------|
| `#loadingOverlay` | div (`.loading-overlay`) | 전체 화면 반투명 (rgba(0,0,0,0.7)), z-index:1000 |
| `.loading-spinner` | div | 36x36px, border 회전 애니메이션 (0.8s) |
| `#loadingText` | div | 로딩 텍스트 ("처리 중...") |

```javascript
function showLoading(t) {
  document.getElementById('loadingText').textContent = t || '처리 중...';
  document.getElementById('loadingOverlay').classList.add('show');
}
function updateLoadingText(t) {
  document.getElementById('loadingText').textContent = t;
}
function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('show');
}
```

### 성공 오버레이 (`#successOverlay`)

| ID/클래스 | 타입 | 용도 |
|-----------|------|------|
| `#successOverlay` | div (`.success-overlay`) | 전체 화면 (rgba(0,0,0,0.8)), z-index:1000 |
| `.success-card` | div | max-width:380px, 라운드 카드 |
| `.success-icon` | div | 초록 원 + 체크 SVG |
| `h3` | - | "광고가 게시되었습니다!" |
| `#successMsg` | p | 게시 결과 메시지 |
| `.btn-new-ad` | button | "새 광고 만들기" -> `location.reload()` |
| `.btn-go-home` | a | "홈으로" -> `/adcanvas_meta?account_id={id}` |

### 알림 모달 (`#alertModal`)

| ID/클래스 | 타입 | 용도 |
|-----------|------|------|
| `#alertModal` | div (`.alert-modal`) | 전체 화면 (rgba(0,0,0,0.7)), z-index:1100 |
| `.alert-box` | div | max-width:340px, 라운드 카드 |
| `#alertIcon` | div | 이모지 아이콘 (기본: 경고) |
| `#alertTitle` | h4 | 알림 제목 |
| `#alertMsg` | p | 알림 메시지 |
| 확인 버튼 | button | `.alert-modal.classList.remove('show')` |

```javascript
function showAlert(title, msg, icon) {
  document.getElementById('alertTitle').textContent = title;
  document.getElementById('alertMsg').textContent = msg;
  document.getElementById('alertIcon').textContent = icon || '(warning)';
  document.getElementById('alertModal').classList.add('show');
}
```

### 이탈 경고 모달 (`#exitModalOverlay`)

| ID/클래스 | 타입 | 용도 |
|-----------|------|------|
| `#exitModalOverlay` | div (`.exit-modal-overlay`) | 전체 화면, backdrop-filter:blur(4px), z-index:10001 |
| `.exit-modal` | div | max-width:380px, 스케일 애니메이션 (0.95->1) |
| `.exit-modal-icon` | div | 빨간 경고 SVG (56x56px) |
| `.exit-modal-title` | div | "페이지를 나가시겠습니까?" |
| `.exit-modal-desc` | div | "현재 진행 중인 광고 제작 내용이 **모두 삭제**됩니다." |
| `#exitCancelBtn` | button | "계속 작업하기" (`.btn-cancel`) |
| `#exitConfirmBtn` | button | "나가기" (`.btn-confirm`, 빨간 배경) |

**JS 상태**:

```javascript
let pendingExitUrl = null;       // string | null: 이탈 시 이동할 URL
let isWorkStarted = false;       // boolean (미사용, checkWorkStarted() 함수로 대체)
```

**이탈 경고 로직**:

```
checkWorkStarted():
  +- return currentStep > 1  // Step 2 이상이면 작업 시작으로 간주

[data-exit-link="true" 링크 클릭]:
  |- checkWorkStarted() === false -> 기본 동작 (즉시 이동)
  +- checkWorkStarted() === true:
      |- e.preventDefault()
      |- 햄버거 드롭다운 닫기
      +- showExitModal(link.href)

[#exitCancelBtn 클릭] -> hideExitModal()

[#exitConfirmBtn 클릭]:
  |- pendingExitUrl === '__reload__' -> location.reload()
  +- pendingExitUrl -> window.location.href = pendingExitUrl

[#exitModalOverlay 자체 클릭] -> hideExitModal() (배경 클릭으로 닫기)

[키보드 단축키] (currentStep > 1일 때):
  |- F5 -> e.preventDefault() + showExitModal('__reload__')
  +- Ctrl+R / Cmd+R -> e.preventDefault() + showExitModal('__reload__')

[뒤로가기 (popstate)]:
  |- checkWorkStarted() === true:
  |   |- history.pushState(null, '', location.href) (뒤로가기 방지)
  |   +- showExitModal(document.referrer || '/adcanvas_meta?account_id=' + ACCOUNT_ID)
```

---

## API 엔드포인트 전체 목록

### 외부 API (클라이언트 -> 외부 서버)

| 메서드 | URL | 용도 | 호출 위치 |
|--------|-----|------|----------|
| POST | `https://image-extractor-api-439320386143.asia-northeast3.run.app/extract` | URL에서 이미지 추출 | Step 1 |
| POST | `https://graph.facebook.com/{API_VERSION}/act_{id}/adimages` | 이미지 업로드 (FormData) | Step 4 게시 |

### 내부 API (클라이언트 -> Flask 서버)

| 메서드 | URL | 용도 | 호출 위치 |
|--------|-----|------|----------|
| POST | `/dashboard/oneclick/account-info` | 계정 정보 (회사명, 브랜드명, 광고세트 유무) | Step 1 |
| POST | `/dashboard/oneclick/generate-text` | AI 주요 문구 + 가격 생성 | Step 4 |
| POST | `/dashboard/get_meta_token` | Meta API 액세스 토큰 조회 | Step 4 게시 |
| POST | `/dashboard/oneclick/publish` | 원클릭 광고 게시 | Step 4 게시 |

### API 상세

#### 이미지 추출 API

```
POST https://image-extractor-api-439320386143.asia-northeast3.run.app/extract
Content-Type: application/json

Request:
{
  "url": "https://shop.com/product/detail.html?product_no=12345",
  "account_id": "123456789"
}

Response (성공):
{
  "images": [
    {
      "data_url": "data:image/jpeg;base64,...",
      "width": 800,
      "height": 1000
    }
  ],
  "product_name": "브랜드명 슬림핏 데님 팬츠",
  "brand_names": ["브랜드명", "BRAND_NAME"],
  "price": "39,000원"
}

Response (실패):
{
  "images": [],
  "error": "..."
}
```

#### 계정 정보 API

```
POST /dashboard/oneclick/account-info
Content-Type: application/json

Request:
{
  "account_id": "123456789"
}

Response:
{
  "status": "success",
  "company_name": "회사명",
  "brand_names": ["브랜드A", "Brand A", "브랜드B"],
  "has_conv_adset": true,
  "has_traffic_adset": true
}
```

#### AI 주요 문구 생성 API

```
POST /dashboard/oneclick/generate-text
Content-Type: application/json

Request:
{
  "product_name": "슬림핏 데님 팬츠",
  "product_url": "https://shop.com/product/...",
  "company_name": "회사명",
  "image_index": 0
}

Response (성공):
{
  "primary_text": "슬림핏 데님 팬츠\n\n데일리로 착용하기 좋은 슬림핏 데님 팬츠를 만나보세요.\n지금 바로 확인해보세요!",
  "price": "39,000원"
}

Response (실패):
{
  "primary_text": "",
  "error": "..."
}
```

#### Meta 토큰 API

```
POST /dashboard/get_meta_token

Response (성공):
{
  "status": "success",
  "access_token": "EAABs..."
}

Response (실패):
{
  "status": "error",
  "message": "..."
}
```

#### 원클릭 게시 API

```
POST /dashboard/oneclick/publish
Content-Type: application/json

Request:
{
  "account_id": "123456789",
  "image_hash": "abc123def456...",
  "product_name": "슬림핏 데님 팬츠",
  "primary_text": "슬림핏 데님 팬츠\n지금 바로 확인해보세요!",
  "headline": "슬림핏 데님 팬츠 39,000원",
  "description": "회사명",
  "link": "https://shop.com/product/...",
  "adset_mode": "conv_only",
  "access_token": "EAABs..."
}

Response (성공):
{
  "status": "success",
  "ad_name": "[20260228][단일][슬림핏 데님 팬츠]",
  "success_count": 1,
  "fail_count": 0
}

Response (실패):
{
  "status": "error",
  "message": "게시 실패 상세 메시지"
}
```

#### Meta Graph API -- 이미지 업로드

```
POST https://graph.facebook.com/v24.0/act_{ACCOUNT_ID}/adimages?access_token={TOKEN}
Content-Type: multipart/form-data

Request:
  FormData: file = Blob (filename: 'oneclick_ad.jpg')

Response (성공):
{
  "images": {
    "oneclick_ad.jpg": {
      "hash": "abc123def456ghi789...",
      "url": "https://..."
    }
  }
}

Response (실패):
{
  "error": {
    "message": "에러 메시지",
    "type": "OAuthException",
    "code": 100
  }
}
```

---

## 주요 상수

```javascript
// 서버 주입 상수
const ACCOUNT_ID = '{{ account_id }}';               // string: Meta 광고 계정 ID
const ACCOUNT_NAME = '{{ account_name or "" }}';      // string: 계정 표시명
const IS_DEMO = {{ 'true' if session.get('is_demo') else 'false' }};  // boolean
const DEMO_IMAGES = {{ demo_image_urls | tojson }};   // string[]: 데모 이미지 URL 배열

// 외부 API
const IMAGE_EXTRACTOR_API = 'https://image-extractor-api-439320386143.asia-northeast3.run.app';

// Meta Graph API
const API_VERSION = 'v24.0';

// 크롭 관련
const CROP_QUALITY = 0.92;            // canvas.toBlob JPEG 품질
const DEFAULT_ASPECT_RATIO = 4/5;     // 0.8 (기본 비율)
const ASPECT_RATIO_FEED = 0.8;        // 4:5
const ASPECT_RATIO_SQUARE = 1.0;      // 1:1
const ASPECT_RATIO_REELS = 0.5625;    // 9:16

// 데모 모드 딜레이
const DEMO_DELAY_FETCH = 3000;        // 이미지 가져오기 딜레이 (ms)
const DEMO_DELAY_AI_TEXT = 3000;      // AI 문구 생성 딜레이 (ms)
const DEMO_DELAY_UPLOAD = 1500;       // 이미지 업로드 딜레이 (ms)
const DEMO_DELAY_PUBLISH = 2000;      // 광고 생성 딜레이 (ms)

// 광고명 최대 길이
const AD_NAME_MAX_LENGTH = 30;        // 상품명 부분 최대 글자수
```

---

## CSS 변수

```css
:root {
  /* 배경 */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-card: #161616;
  --bg-card-hover: #1a1a1a;

  /* 테두리 */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);

  /* 텍스트 */
  --text-primary: #ffffff;
  --text-secondary: #a1a1a1;
  --text-muted: #525252;

  /* 액센트 */
  --accent-blue: #3b82f6;
  --accent-emerald: #10b981;
  --accent-violet: #8b5cf6;
  --accent-red: #ef4444;
}
```

---

## 폰트

- **기본 폰트**: `'Pretendard', 'Inter Tight', -apple-system, sans-serif`
- **Pretendard**: CDN `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css`
- **Inter Tight**: Google Fonts (wght: 300~900)
- **이모지 폰트 (caption/textarea)**: `'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'Pretendard', -apple-system, sans-serif`
- **`.font-inter`**: Inter Tight 전용 (광고명 등 숫자/영문)

---

## 외부 라이브러리

| 라이브러리 | 버전 | CDN | 용도 |
|-----------|------|-----|------|
| jQuery | 3.6.0 | `https://code.jquery.com/jquery-3.6.0.min.js` | DOM 조작 (script 내에서는 vanilla JS 사용) |

---

## 저장소 전체 맵

### Create 플로우와의 차이

| 항목 | Create 플로우 | OneClick 플로우 |
|------|-------------|----------------|
| sessionStorage | 5개 키 (step1~step4, uploaded_results) | 사용하지 않음 |
| IndexedDB | admake_files (File 객체 저장) | 사용하지 않음 |
| Flask session | pending_ads 배열 | 사용하지 않음 |
| 데이터 유지 | 페이지 간 이동 시 sessionStorage/IDB로 전달 | JS 변수 (인메모리), 새로고침 시 유실 |
| 미디어 업로드 | Step 2에서 Meta에 업로드 (hash 획득) | Step 4 게시 시 Meta에 직접 업로드 |

### JS 인메모리 상태 (전체)

```javascript
// 공통
let currentStep = 1;

// Step 1
let productUrl = '';
let extractedImages = [];
let productName = '';
let companyName = '';
let brandNames = [];
let cleanedName = '';

// Step 2
let selectedImageIndex = -1;
let selectedImageSrc = '';

// Step 3 (크롭)
let cropImage = null;
let cropCanvas, cropCtx;
let currentAspectRatio = 4/5;
let cropZoom = 1, cropMinZoom = 0.01;
let cropX = 0, cropY = 0;
let isDragging = false, dragStartX = 0, dragStartY = 0;
let croppedBlob = null, croppedDataUrl = '';
let containerWidth = 0, containerHeight = 0;

// Step 4
let hasConvAdset = false, hasTrafficAdset = false;
let adsetMode = 'conv_only';
let accessToken = '';
let generatedPrimaryText = '';
let productPrice = '';
let hlOrder = ['name'];
let dcMode = 'brand';
let isPrimaryEditing = false;

// 이탈 경고
let pendingExitUrl = null;
let isWorkStarted = false;
```

---

## 에러/경고 메시지 (한국어)

### Step 1: URL 입력

| 조건 | 제목 | 메시지 | 유형 |
|------|------|--------|------|
| URL 빈칸 | - | "URL을 입력하세요" (fetchStatus) | error |
| 차단 패턴 매칭 | "상세페이지 URL만 입력 가능" | "카테고리, 메인, 이벤트, 베스트 페이지는 사용할 수 없습니다.\n상품 상세페이지 URL을 입력해주세요." | alert |
| 이미지 0개 | "이미지를 찾을 수 없습니다" | "상품 상세페이지 URL이 맞는지 확인해주세요.\n카테고리나 메인 페이지는 지원하지 않습니다." | alert |
| API 에러 | - | "이미지를 가져올 수 없습니다: {err.message}" (fetchStatus) | error |

### Step 4: 게시

| 조건 | 제목 | 메시지 | 유형 |
|------|------|--------|------|
| 주요 문구 빈칸 | "주요 문구 필요" | "주요 문구를 입력하세요." | alert |
| 제목 빈칸 | "제목 필요" | "제목을 입력하세요." | alert |
| URL 없음 | "URL 필요" | "상품 URL이 필요합니다." | alert |
| 토큰 획득 실패 | "게시 실패" | "액세스 토큰을 가져올 수 없습니다" | alert |
| 이미지 업로드 에러 | "게시 실패" | "{Meta API error.message}" | alert |
| 이미지 해시 없음 | "게시 실패" | "이미지 해시를 받을 수 없습니다" | alert |
| 게시 API 실패 | "게시 실패" | "{pubData.message || '게시 실패'}" | alert |

### 크롭

| 조건 | 메시지 |
|------|--------|
| 크롭 실패 | `alert('크롭 실패: ' + err.message)` |

### 데모 모드 전용

| 조건 | 제목 | 메시지 | 유형 |
|------|------|--------|------|
| 페이지 로드 300ms 후 | "데모 모드" | "미리 준비된 데모 상품으로 원클릭 광고 생성을\n체험해보세요.\n\n[다음] 버튼을 눌러 시작합니다." | alert |
| URL 입력란 클릭 | "데모 모드 안내" | "데모 페이지에서는 URL을 변경할 수 없습니다.\n[다음] 버튼을 눌러 진행해주세요." | alert |
| "직접 업로드" 클릭 | "데모 모드 안내" | "데모 페이지에서는 이 기능을 이용할 수 없습니다.\n미리 준비된 데모 상품으로 체험해보세요." | alert |

### 이탈 경고

| 요소 | 텍스트 |
|------|--------|
| 제목 | "페이지를 나가시겠습니까?" |
| 설명 | "현재 진행 중인 광고 제작 내용이 **모두 삭제**됩니다." |
| 취소 버튼 | "계속 작업하기" |
| 확인 버튼 | "나가기" |

### 성공 메시지

| 요소 | 텍스트 |
|------|--------|
| 제목 | "광고가 게시되었습니다!" |
| 메시지 | `광고명: {ad_name}\n{success_count}개 광고세트에 게시 완료` |
| 실패 포함 시 | `\n({fail_count}건 실패)` 추가 |

---

## 데모 모드 전체 명세

### 서버 주입 값

```javascript
const IS_DEMO = true;                      // Flask session['is_demo']
const DEMO_IMAGES = ['url1', 'url2', ...]; // Flask template 변수 demo_image_urls
```

### 스텝별 데모 동작

| 스텝 | 동작 |
|------|------|
| Step 1 | URL 입력 readonly, "데모 모드" 제목, "다음 ->" 버튼, URL 검증 스킵, 3초 딜레이 후 데모 데이터 로드 |
| Step 2 | "직접 업로드" 차단 (showAlert), 이미지 선택 시 demo_name 적용 |
| Step 3 | 동일 (차이 없음) |
| Step 4 | 프로필: "/demo/logo.webp" + "누구나컴퍼니", AI 문구 3초 딜레이, 게시 시 가짜 로딩(1.5s+2s) 후 서버 API 호출 |

### 데모 계정 정보

```javascript
{
  company_name: '누구나컴퍼니',
  brand_names: ['누구나컴퍼니', 'NUGU COMPANY'],
  has_conv_adset: true,
  has_traffic_adset: true
}
```

### 데모 게시 페이로드

```javascript
{
  account_id: ACCOUNT_ID,
  image_hash: 'demo_hash',         // 더미 해시
  product_name: cleanedName || productName,
  primary_text: primaryText,
  headline: headline,
  description: desc,
  link: productUrl,
  adset_mode: adsetMode,
  access_token: 'demo_token'       // 더미 토큰
}
```

---

## Create 플로우와의 구조 비교

| 항목 | Create (/adcanvas_meta/create) | OneClick (/adcanvas_meta/oneclick) |
|------|-------------------------------|-------------------------------------|
| 스텝 수 | 5 (업로드->크롭->광고생성->관리->게시) | 4 (URL->이미지선택->크롭->게시) |
| HTML 구조 | 5개 별도 HTML 파일 | 1개 HTML, 패널 토글 |
| 미디어 수 | 최대 10개 (다중 선택) | 1개 (단일 선택) |
| 미디어 소스 | 파일 업로드 + URL 추출 | URL 추출 + 파일 업로드 |
| 크롭 | 전체 미디어 개별 크롭 + confirm | 1장만 크롭 |
| Meta 업로드 시점 | Step 2 (크롭 직후) | Step 4 (게시 시) |
| 광고 타입 | Single Image / Video / Slide | Single Image 전용 |
| 광고 편집 | 마스터 에디터 + 카드별 개별 편집 | 칩 기반 간편 편집 |
| pending_ads | Flask session 기반 | 없음 (즉시 게시) |
| 노출 모드 | new_only / with_existing 선택 | 없음 (기존 광고 영향 없음) |
| 예산 관리 | Step 4에서 설정 | 없음 |
| 제품 표시 | Product Tags 지원 | 없음 |
| 데이터 저장 | sessionStorage + IndexedDB | JS 인메모리 (IIFE 스코프) |

---

## 반응형 디자인

### 브레이크포인트

| 조건 | 적용 |
|------|------|
| `max-width: 740px` | `.publish-layout` -> `grid-template-columns: 1fr` (1열 레이아웃) |

### 주요 최대 폭

| 요소 | max-width |
|------|----------|
| `.main-container` | 900px |
| `.url-input-wrap` | 560px |
| `.crop-canvas-wrap` | 460px |
| `.field-textarea` | 270px |
| `.success-card` | 380px (width: 90%) |
| `.alert-box` | 340px (width: 90%) |
| `.exit-modal` | 380px (width: 90%) |

---

## 키보드/입력 이벤트 요약

| 이벤트 | 대상 | 동작 |
|--------|------|------|
| `keypress` Enter | `#productUrl` | `btnFetch.click()` |
| `input` | `#zoomSlider` | 줌 업데이트 + drawCrop() |
| `input` | `#inputPrimary` | syncPreview() |
| `input` | `#inputHeadlineCustom` | composeHeadline() |
| `input` | `#inputDescCustom` | composeDesc() |
| `mousedown` | `#cropCanvas` | 드래그 시작 |
| `mousemove` | `window` | 패닝 |
| `mouseup` | `window` | 드래그 종료 |
| `touchstart` | `#cropCanvas` | 터치 드래그 시작 |
| `touchmove` | `window` | 터치 패닝 |
| `touchend` | `window` | 터치 드래그 종료 |
| `wheel` | `#cropCanvas` | 마우스 휠 줌 |
| `keydown` F5/Ctrl+R | `window` | 이탈 경고 모달 (Step 2+) |
| `popstate` | `window` | 뒤로가기 이탈 경고 (Step 2+) |
| `click` | `document` | 이모지 피커 닫기, 햄버거 메뉴 닫기 |

---

## z-index 레이어

| z-index | 요소 | 용도 |
|---------|------|------|
| 100 | `.header` | sticky 헤더 |
| 99 | `.steps-bar` | sticky 스텝 바 |
| 50 | `.emoji-picker` | 이모지 선택 팝업 |
| 1000 | `.loading-overlay`, `.success-overlay` | 전체 화면 오버레이 |
| 1100 | `.alert-modal` | 알림 모달 (오버레이 위) |
| 10000 | `.hamburger-menu-wrapper` | 햄버거 메뉴 |
| 10001 | `.hamburger-dropdown`, `.exit-modal-overlay` | 드롭다운, 이탈 경고 |
