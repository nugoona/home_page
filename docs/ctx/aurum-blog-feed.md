# Aurum 홈페이지 — 최신 네이버 블로그 글 3개 노출

> sns-auto-poster 프로젝트에서 발행한 네이버 블로그 글 중 **최신 3개**를 aurum 홈페이지에 카드 형태로 노출.
> 작성일: 2026-05-16 | 출처 프로젝트: `D:/github/sns-auto-poster`

---

## 1. 요구사항 (확정)

- 최신 게시물 **3개** 노출.
- 각 카드에 **썸네일 이미지 필수**.
- 카드 클릭 → **네이버 블로그 해당 게시물 URL로 이동**(새 탭 권장).
- 카드 메타: 제목 / 카테고리 / 발행일.

---

## 2. 데이터 소스 (sns-auto-poster 측)

### 2-1. 발행 상태 JSON
- 경로: `D:/github/sns-auto-poster/posting-state.json`
- 핵심 필드: `completed[]` 배열의 각 원소
  ```json
  {
    "id": "post_53",
    "date": "2026-05-11",                  // 블로그 발행일 (publish date)
    "eventDate": "2020-05",                // 실제 행사 진행 시점 (YYYY-MM, 일자 없으면 월까지)
    "title": "임직원 복지 마사지 | 태건 BF 복지시설 피지컬 케어",
    "url": "https://blog.naver.com/PostView.naver?blogId=aurumwellness&Redirect=View&logNo=224281385555&categoryNo=1&...",
    "category": "기업 복지 케어",
    "images": 8
  }
  ```
- **정렬**: `date`(발행일) 내림차순. URL이 있는 것만(있는 = 발행 완료).
- **`eventDate` 사양**:
  - 형식: `"YYYY-MM"` (대부분) 또는 `"YYYY-MM-DD"` (일자 정보 있는 경우, 현재 데이터엔 0건).
  - `null` 가능 — 행사일자가 데이터에 없는 콘텐츠(교육 시리즈, 연도만 기록된 구 폴더 등). 52개 중 2개가 null.
  - 카드 표시 시 null 처리 필요(예: 날짜 영역 숨김 또는 발행일 `date`로 대체).
  - **OCR 금지** — 썸네일 이미지에서 텍스트 인식하지 말고 이 필드를 사용.
- **블로그 ID**: `aurumwellness` → 정식 글 URL은 `https://blog.naver.com/aurumwellness/{logNo}`로 단축 가능
  (현재 저장된 `url`이 PostView 형태이므로 logNo만 추출해서 짧은 형태로 쓰는 게 깔끔).

### 2-2. 썸네일 PNG
- 경로 패턴: `D:/github/sns-auto-poster/post-images/post{N}/thumbnail.png`
  (예: `post-images/post53/thumbnail.png` ← `post_53`에 해당)
- 모든 발행 완료 글에 thumbnail.png가 존재함(확인됨, 2026-05-16).
- 크기: 블로그 썸네일용으로 생성된 PNG(별도 리사이즈 권장 — Next/Image 또는 sharp).

### 2-3. 카테고리 매핑 (3종)
| 카테고리 | 색상(브랜드) | categoryNo |
|---------|-------------|-----------|
| 기업 복지 케어 | `#D4B896` (베이지) | 1 |
| 행사 케어 | `#7AAFCF` (블루) | 3 |
| 웰니스·힐링 프로그램 | `#8EBE7E` (그린) | 4 |

---

## 3. 동기화 방식: **JSON+이미지 푸시 (확정)**

RSS는 썸네일 URL을 제공하지 않으므로 **불가**. 아래 방식으로 진행.

### 흐름
```
sns-auto-poster: auto-publish.js 발행 성공
  → export-to-homepage.js 실행
    → posting-state.json에서 최신 3개 추출
    → post-images/post{N}/thumbnail.png → ngn_homepage/aurum/public/blog-thumbs/{slug}.jpg (resize/optimize)
    → ngn_homepage/aurum/src/data/blogPosts.ts 갱신
  → ngn_homepage에서 git commit & push
  → Cloudflare 자동 재빌드 → 사이트 반영
```

> **참고**: aurum 사이트는 Cloudflare 자동 배포 (Vercel 아님). `git push`만 하면 됨.

### Export 스크립트 (sns-auto-poster 측에서 실행)
- 이 스크립트는 **sns-auto-poster 프로젝트의 책임**.
- 홈페이지 Claude는 이 파일을 만들 필요 없음 — 받아쓰기만 함.
- 스크립트가 생성/갱신하는 파일:
  - `ngn_homepage/aurum/public/blog-thumbs/post-{N}.jpg` (3개)
  - `ngn_homepage/aurum/src/data/blogPosts.ts` (아래 스키마)

---

## 4. 홈페이지 측 작업 (이게 본 작업)

### 4-1. 데이터 파일 스키마 (sns-auto-poster가 생성/갱신)
**경로**: `F:/github/ngn_homepage/aurum/src/data/blogPosts.ts`

```ts
export interface BlogPost {
  id: string;                  // "post_53"
  title: string;               // "임직원 복지 마사지 | 태건 BF 복지시설 피지컬 케어"
  url: string;                 // "https://blog.naver.com/aurumwellness/224281385555"
  category: '기업 복지 케어' | '행사 케어' | '웰니스·힐링 프로그램';
  date: string;                // 블로그 발행일, "2026-05-11"
  eventDate: string | null;    // 실제 행사일 "YYYY-MM" or "YYYY-MM-DD", 없으면 null
  thumbnail: string;           // "/blog-thumbs/post-53.jpg" (public/ 기준)
}

export const LATEST_BLOG_POSTS: BlogPost[] = [
  // sns-auto-poster가 빌드/발행 후 갱신. 수동 편집 금지.
];

export const CATEGORY_COLORS: Record<BlogPost['category'], string> = {
  '기업 복지 케어': '#D4B896',
  '행사 케어': '#7AAFCF',
  '웰니스·힐링 프로그램': '#8EBE7E',
};
```

### 4-2. 노출 위치 (확정 필요)
사용자에게 한 번 더 확인할 만한 항목:
- 메인 페이지(`aurum/src/app/page.tsx`)의 어느 섹션에 들어갈지
- 또는 b2b 페이지(`aurum/src/app/b2b/page.tsx`)
- 또는 푸터 위 공통 섹션
- 후보 컴포넌트 위치: `aurum/src/components/sections/BlogLatest.tsx` (신규)

### 4-3. 컴포넌트 요구사항
- **디자인 톤**: Aurum 브랜드 (`docs/ctx/aurum.md` 참조 — 럭셔리 골드 `#c8a549`, 세리프, 넉넉한 여백).
- **기술**: CSS Modules + GSAP. **Tailwind 사용 금지** (이 프로젝트 룰).
- **카드 구조**:
  ```
  ┌─────────────────────┐
  │   [썸네일 16:9 또는 4:3]
  │                     │
  │  ▎카테고리 라벨      │ ← CATEGORY_COLORS[category]로 좌측 바 색상
  │   제목 (2줄 max)     │
  │   2026-05-11        │
  └─────────────────────┘
  ```
- **링크**: `<a href={post.url} target="_blank" rel="noopener noreferrer">`
- **이미지**: `next/image` 사용. `public/blog-thumbs/` 하위 → `src="/blog-thumbs/post-53.jpg"`
- **빈 상태(0개)**: 섹션 자체를 렌더링하지 않음.
- **반응형**: 데스크탑 3열 그리드 / 모바일 세로 스택 또는 가로 스와이프.

### 4-4. 카드 위에 표시할 섹션 헤더 (제안)
- 작은 라벨: `JOURNAL` 또는 `BLOG`
- 큰 타이틀: `최근 현장 이야기` 또는 `최근 케어 기록`
- 우측 상단 링크: `블로그 전체 보기 →` (https://blog.naver.com/aurumwellness)

---

## 5. 빌드/검증 체크리스트 (홈페이지 작업자용)

- [ ] `aurum/src/data/blogPosts.ts` 파일 생성 (스키마 정의 + 빈 배열) — sns-auto-poster가 채울 자리
- [ ] `aurum/public/blog-thumbs/.gitkeep` 추가 (이미지 들어올 폴더)
- [ ] `aurum/src/components/sections/BlogLatest.tsx` 컴포넌트 작성 (CSS Module + GSAP scroll reveal)
- [ ] `aurum/src/app/page.tsx` (또는 협의된 위치)에 섹션 마운트
- [ ] `LATEST_BLOG_POSTS.length === 0` 시 null 반환 확인
- [ ] `next.config.ts`의 `images` 설정 — 로컬 `/blog-thumbs/` 이미지는 추가 설정 불필요 (외부 도메인 fetch 안 함)
- [ ] 빌드 후 `out/` 정적 export에 포함되는지 확인 (Cloudflare 배포는 정적 사이트)

---

## 6. 운영 메모

- **갱신 주기**: 블로그 발행은 매일 09:00 (auto-publish.js, Windows Task Scheduler). 발행 성공 시 export 스크립트가 자동 실행되도록 sns-auto-poster 측에서 연결 예정.
- **수동 트리거**가 필요할 때: sns-auto-poster 디렉토리에서 `node export-to-homepage.js` (스크립트명은 협의).
- **충돌 방지**: `blogPosts.ts`는 자동 생성이므로 홈페이지 코드 리뷰 시 수동 수정 금지. 상단에 `// AUTO-GENERATED by sns-auto-poster — do not edit` 주석 박을 예정.

---

## 7. 참고

- 현재 발행 완료 게시물: **52개** (2026-05-16 기준).
- 네이버 블로그: https://blog.naver.com/aurumwellness
- 글 URL 단축 패턴: `PostView.naver?...logNo=224281385555&...` → `https://blog.naver.com/aurumwellness/224281385555`
- 카테고리는 위 3종이 전부 — 다른 값 들어오면 sns-auto-poster 버그.
- 본문/요약은 데이터에 없음 (필요하면 별도 작업). 현재 카드는 **제목만**.
