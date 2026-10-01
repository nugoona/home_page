# 누구나컴퍼니 홈페이지 — 배포 문서 (헤매지 않기 위한 단일 소스)

> 목적: 다음에 배포할 때 **처음부터 헤매지 않도록** 방법을 미리 문서화. **지금은 배포하지 않는다**(사용자 지시).
> 확정된 것과 "실제 배포해봐야 알 수 있는 것"을 구분해서 적는다.
> 최종 갱신: 2026-07-07 (현행 코드·설정 조사 기반).
> **2026-08-28 사장님 확정:** 현재 외부에 배포된 구 누구나 홈페이지는 다시 사용하지 않고 폐기할 예정이다. 다음 배포 대상과 유일한 작업 기준은 `nugoona/`의 현재 로컬 작업본이다. 구 라이브 사이트를 되살리거나 기준으로 역수입하지 않는다.

---

## 1. 확정된 사실 (코드에서 확인)
- **SSR 서버 배포 필요** — 정적 export 불가. 근거:
  - `next.config.mjs`에 `output: 'standalone'` (Cloud Run/Docker 최적화 모드).
  - API 라우트 존재: `app/api/submit-survey/route.ts`(문의 폼 처리), `app/api/health/route.ts`(헬스체크, GET-only 무의존).
  - `next start` 스크립트(Node 서버 구동). Next.js **^16.1.6** (package-lock 실제 설치본 **16.2.1** — 배포 시 lock 기준).
  - ⚠ **standalone에서는 `next start` 사용 금지** — 최신 Next는 standalone 빌드에 `next start`를 에러로 거부하고 `node .next/standalone/server.js` 실행을 요구. (경로 C 함정, §3 참조)
- **필요 환경변수**: `SLACK_WEBHOOK_URL` **단 하나**(submit-survey가 문의를 Slack으로 전송; 미설정/실패 시 500). ⚠ 메모리상 Slack→Telegram 이전 예정이므로 배포 전 채널 확인 필요.
  - 참고: GA/GTM/Meta Pixel ID는 `components/layout/Analytics.tsx`에 **하드코딩**(NEXT_PUBLIC env 아님) → 값 변경 시 코드 수정 필요.
- **도메인**: `www.nugoona.co.kr`. 근거는 `images.remotePatterns` + `layout.tsx`의 `metadataBase`(redirects에는 **도메인 없음, 경로만**). 레거시 URL(`/services.html` 등) → 새 라우트 **영구 리다이렉트** 설정됨(레거시 대체 의도).
- **이미지 최적화**: 원격 `picsum.photos`, `www.nugoona.co.kr` 허용. `sharp`는 next의 optional dep(lock 0.34.5)로만 존재 → `npm ci --omit=optional`이나 일부 베이스 이미지에서 빠지면 **프로덕션 이미지 최적화가 죽음**(명시적 설치 권장).
- **폰트**: Pretendard가 `layout.tsx`에서 **jsdelivr CDN `<link>`** 의존(자체 호스팅 아님). CDN 장애 = 한글 폰트 폴백 → 배포 전 self-host 검토.

## 2. 아직 없는 것 (배포 인프라 미구축)
- `Dockerfile` ❌ / `cloudbuild.yaml` ❌ / `.github/workflows` ❌ / `vercel.json` ❌ / `wrangler.toml` ❌
- 즉 **배포 파이프라인이 하나도 없다.** 이 nugoona(3세대) 홈페이지는 아직 한 번도 이 방식으로 배포된 적 없는 것으로 보임.
- 참고: 형제 사이트 Aurum = **Cloudflare Pages(정적 export)**. 누구나는 SSR이라 **Pages 불가** → 같은 방식 못 씀.

## 3. 권장 배포 경로 (택1 — 실제 결정은 GCP 상태 확인 후)

### 경로 A — Cloud Run + Docker (조직 표준, `standalone`에 최적) ★권장
1. `Dockerfile` 작성(멀티스테이지, `.next/standalone` 복사):
   - `node:20-slim` 기반 → `npm ci && npm run build` → runner 스테이지에 `.next/standalone`, `.next/static`, `public` 복사 → **`node server.js`**(next start 아님), `ENV HOSTNAME="0.0.0.0"`, `ENV PORT=8080`, `EXPOSE 8080`.
   - `.dockerignore`에 `node_modules`, `.next` 제외. `sharp` 설치 보장(§1).
2. env 주입: `SLACK_WEBHOOK_URL`(Secret Manager 권장).
3. 배포: Docker 빌드 후 `--image` **권장**(standalone 이점). `--source .`(Buildpacks)는 경로 C 함정 주의(아래).
4. 헬스체크: Cloud Run 기본은 **TCP** — `/api/health`(HTTP)를 쓰려면 startup/liveness **probe를 명시 설정**해야 함(안 하면 TCP로만 검사).
5. 커스텀 도메인: Cloud Run 도메인 매핑으로 `www.nugoona.co.kr` 연결(+ apex→www 리다이렉트).

### 경로 B — Vercel (Next 네이티브, 가장 단순)
- standalone/Docker 불필요, env는 Vercel 대시보드. 단 **조직이 GCP(Cloud Run)를 쓰는 흐름**이라 이탈 여부는 사용자 결정 필요. Aurum은 Cloudflare, 대시보드/기타는 Cloud Run 혼재.

### 경로 C — `gcloud run deploy --source .` (Dockerfile 없이) ⚠ 그대로는 실패 위험
- Buildpacks는 `npm start`(=`next start`)를 실행하는데, **`output:'standalone'`이면 `next start`가 거부됨** → 배포가 여기서 막힌다.
- 쓰려면 **선행 조건**: `package.json`의 `start`를 `node .next/standalone/server.js`로 교체하고 static/public 배치를 맞추거나, standalone을 제거. 이 정리 없이는 경로 C를 택하지 말 것.

## 4. ⚠ 실제 배포해봐야 알 수 있는 것 (지금 문서로 확정 불가)
- ~~**GCP 프로젝트 ID / 리전 / 서비스명** — 알 수 없음~~ → ✅ **실측 확정(2026-10-02)**. 아래 §4.1 참조.
- ~~**현재 `www.nugoona.co.kr`가 어디로 향하는지**~~ → ✅ **구 홈페이지(`home-page` 서비스)**로 확인. 아래 §4.1.
  교체(cutover) 방식·무중단 여부는 여전히 올려 보며 정해진다.
- **빌드가 프로덕션에서 실제로 통과하는지** — 로컬 타입/린트 통과 ≠ 프로덕션 빌드·런타임 성공. standalone 서버 구동, 이미지 최적화, API 라우트 동작은 **실제 배포/실행해봐야 확정**.
- **env 실제값·채널**(`SLACK_WEBHOOK_URL` 또는 Telegram 이전 후 값) — 운영 시크릿 필요.
- **도메인 SSL·리다이렉트(apex→www) 실동작** — 도메인 매핑 후 검증 필요.

> 위 항목들은 "배포를 해봐야 알 수 있다". 지금은 방법만 문서화하고 **배포는 보류**한다.

### 4-1. ⚠⚠ 영구 리다이렉트(308) 캐시 함정 — 실제로 밟은 사고 (2026-07-11 발견)
- **사고**: 옛 커밋(`18a0ac7`)의 `next.config.mjs`에 `{ source:'/ads', destination:'/features', permanent:true }`가 있었고, `3f59b4c`에서 /ads 페이지를 만들며 제거했다. 그러나 **`permanent:true` = HTTP 308은 브라우저가 영구 캐시**한다 — 그 사이에 /ads를 열었던 브라우저는 서버에 묻지도 않고 지금도 /features로 튄다(로컬에서 실측 재현: `localhost:3131/ads` → `/features` 착지). **새 /ads가 멀쩡히 있어도 그 브라우저에선 영원히 안 보인다.**
- **로컬 해제법**: 강력 새로고침으론 안 풀릴 수 있음 → 시크릿 창 또는 `chrome://net-internals/#dns`+캐시 삭제, 임시 우회는 쿼리(`/ads?x=1`).
- **재발 방지 규칙**: ①**살릴 가능성이 있는 경로에 `permanent:true`를 걸지 않는다**(기본값 = `permanent:false`(307). 308은 "그 경로를 영원히 버린다"가 확정일 때만) ②경로를 부활시킬 땐 과거 redirects 이력을 `git log -S`로 확인 ③배포 전 체크리스트에 "redirects 변경분과 과거 308 충돌 검토" 포함.

### 4.1 ★ 실측 확정 — 지금 어디에 무엇이 떠 있나 (2026-10-02 조회, 읽기 전용)

**⚠ 홈페이지는 전용 프로젝트가 아니라 대시보드와 같은 GCP 프로젝트에 섞여 있다.**

| 무엇 | 서비스 이름 | 지역 | 이미지가 쌓이는 곳 |
|---|---|---|---|
| **구 홈페이지**(지금 `www.nugoona.co.kr`이 보는 것) | `home-page` | `asia-northeast1`(도쿄) | `gcr.io/winged-precept-443218-v8/home-page` |
| **임시 열람본**(2026-07-17 갤러리 확인용) | `nugoona-lab` | `asia-northeast3`(서울) | `asia-northeast3-docker.pkg.dev/winged-precept-443218-v8/cloud-run-source-deploy/nugoona-lab` |

- **GCP 프로젝트 = `winged-precept-443218-v8`** (대시보드와 공용. 이름만 보면 대시보드 것 같지만 홈페이지도 여기 있다)
- 별도로 `ngn-homepage` 프로젝트가 **존재는 하나** 조회 권한이 없어 내용 미확인 — 현재 운영본은 위 프로젝트에 있다.
- 조회 계정 = `winged-precept-443218-v8@appspot.gserviceaccount.com`(기본 활성).
  **올릴 때는 `oscar@nugoona.co.kr` 계정이 필요한데 토큰이 만료돼 있다** → `gcloud auth login` 재인증은 사장님만 가능.
- ⚠ **`www.nugoona.co.kr` → `home-page` 연결은 정황 근거다**(응답 제목·메뉴·헤더 일치).
  도메인 연결 목록을 직접 여는 명령(`gcloud beta run domain-mappings list`)은 `beta` 구성요소 설치가 필요하고
  그 설치에 관리자 권한이 걸려 **직접 확인하지 못했다.** 도메인을 건드리기 전에 콘솔에서 한 번 볼 것.

**옛 리비전이 쌓이는 이유 = 이 저장소에 올리기 스크립트가 없다.** `Dockerfile` 하나뿐이고 자동 빌드 설정이 없어,
손으로 명령을 쳐서 올린다 → "옛것 치우기" 단계가 애초에 없다.
→ **올릴 때마다 아래 한 줄을 같이 실행한다**(최근 5개만 남김):

```bash
gcloud run revisions list --service=home-page --region=asia-northeast1 \
  --format="value(metadata.name)" --sort-by="~metadata.creationTimestamp" \
  | tail -n +6 | xargs -r -n1 gcloud run revisions delete --region=asia-northeast1 --quiet
```

🛑 순서는 **리비전 먼저 → 이미지 나중**이다. 이미지만 지우면 "목록엔 있는데 되돌리면 실패하는" 리비전이 남는다.

**2026-10-02 정리 이력** (사장님 지시 — "구축 중인 홈페이지와 아우름만 보호하면 된다")

| 대상 | 전 | 후 | 누가 |
|---|---|---|---|
| `home-page` 리비전 | 56 | **5** | 옆 세션(대시보드·업로드 일괄 정리)이 먼저 처리 |
| `home-page` 이미지 | 43 | **4** | 이 세션 — 남은 리비전 5개가 쓰는 것만 남김 |
| `nugoona-lab` 서비스 | 있음 | **없음** | 이 세션 — 서비스째 삭제 |
| `nugoona-lab` 이미지 | 11 | **0** | 이 세션 |

- 남긴 이미지 4개 = 남은 리비전 5개가 실제로 참조하는 것(00056·00055가 같은 이미지라 5→4).
  `latest` 태그도 트래픽 리비전과 같은 이미지라 함께 보존됐다.
- **되돌리기 가능 확인**: 남은 리비전 5개 전부 자기 이미지가 살아 있음을 하나씩 대조했다.
- 검증 = 삭제 전후 `www.nugoona.co.kr` 응답과 제목 동일(200 · "누구나컴퍼니 - AI-Powered Marketing Agency"),
  서비스 상태 정상, 트래픽 리비전 `home-page-00056-lrc` 그대로.
- 아우름(`www.aurumwellness.co.kr`)은 Cloudflare Pages라 GCP와 무관 — 조회만 하고 건드리지 않았다(200 유지).
- ⚠ `gcr.io`에서 이미지를 지워도 **Cloud Run 리비전이 이미 가져간 것은 계속 뜬다**(import 완료 상태).
  그래도 순서는 리비전 먼저가 맞다 — 되돌릴 때 원본 이미지를 다시 받아야 하는 경우가 있다.

## 5. 배포 체크리스트 (실제 배포 착수 시)
- [ ] 경로 A/B/C 중 결정 (GCP 상태 `gcloud config list`로 먼저 확인)
- [ ] `SLACK_WEBHOOK_URL`(또는 Telegram 이전값) 시크릿 준비
- [ ] Dockerfile + .dockerignore 작성(경로 A)
- [ ] submit-survey 스팸 방어(rate limit·honeypot·간이 captcha) — 현재 전무, 공개 cutover 전 필수(없으면 Slack 채널 스팸)
- [ ] 스테이징 배포 → `/api/health` 200 확인 → 폼 제출 E2E(문의 알림 수신) 확인
- [ ] 도메인 매핑 + SSL + apex→www 리다이렉트 검증
- [ ] 레거시 리다이렉트(next.config) 실동작 확인 후 cutover
