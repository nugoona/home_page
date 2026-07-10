# 누구나컴퍼니 홈페이지 — 배포 문서 (헤매지 않기 위한 단일 소스)

> 목적: 다음에 배포할 때 **처음부터 헤매지 않도록** 방법을 미리 문서화. **지금은 배포하지 않는다**(사용자 지시).
> 확정된 것과 "실제 배포해봐야 알 수 있는 것"을 구분해서 적는다.
> 최종 갱신: 2026-07-07 (현행 코드·설정 조사 기반).

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
- **GCP 프로젝트 ID / 리전 / 서비스명** — 로컬에 gcloud 설정·인프라 파일이 없어 알 수 없음. `gcloud config list`, 콘솔 확인 필요.
- **현재 `www.nugoona.co.kr`가 어디로 향하는지**(기존 운영 배포의 실체) — DNS·기존 서비스 확인 전엔 불명. 교체(cutover) 방식(무중단 여부)도 배포하며 정해짐.
- **빌드가 프로덕션에서 실제로 통과하는지** — 로컬 타입/린트 통과 ≠ 프로덕션 빌드·런타임 성공. standalone 서버 구동, 이미지 최적화, API 라우트 동작은 **실제 배포/실행해봐야 확정**.
- **env 실제값·채널**(`SLACK_WEBHOOK_URL` 또는 Telegram 이전 후 값) — 운영 시크릿 필요.
- **도메인 SSL·리다이렉트(apex→www) 실동작** — 도메인 매핑 후 검증 필요.

> 위 항목들은 "배포를 해봐야 알 수 있다". 지금은 방법만 문서화하고 **배포는 보류**한다.

### 4-1. ⚠⚠ 영구 리다이렉트(308) 캐시 함정 — 실제로 밟은 사고 (2026-07-11 발견)
- **사고**: 옛 커밋(`18a0ac7`)의 `next.config.mjs`에 `{ source:'/ads', destination:'/features', permanent:true }`가 있었고, `3f59b4c`에서 /ads 페이지를 만들며 제거했다. 그러나 **`permanent:true` = HTTP 308은 브라우저가 영구 캐시**한다 — 그 사이에 /ads를 열었던 브라우저는 서버에 묻지도 않고 지금도 /features로 튄다(로컬에서 실측 재현: `localhost:3131/ads` → `/features` 착지). **새 /ads가 멀쩡히 있어도 그 브라우저에선 영원히 안 보인다.**
- **로컬 해제법**: 강력 새로고침으론 안 풀릴 수 있음 → 시크릿 창 또는 `chrome://net-internals/#dns`+캐시 삭제, 임시 우회는 쿼리(`/ads?x=1`).
- **재발 방지 규칙**: ①**살릴 가능성이 있는 경로에 `permanent:true`를 걸지 않는다**(기본값 = `permanent:false`(307). 308은 "그 경로를 영원히 버린다"가 확정일 때만) ②경로를 부활시킬 땐 과거 redirects 이력을 `git log -S`로 확인 ③배포 전 체크리스트에 "redirects 변경분과 과거 308 충돌 검토" 포함.

## 5. 배포 체크리스트 (실제 배포 착수 시)
- [ ] 경로 A/B/C 중 결정 (GCP 상태 `gcloud config list`로 먼저 확인)
- [ ] `SLACK_WEBHOOK_URL`(또는 Telegram 이전값) 시크릿 준비
- [ ] Dockerfile + .dockerignore 작성(경로 A)
- [ ] submit-survey 스팸 방어(rate limit·honeypot·간이 captcha) — 현재 전무, 공개 cutover 전 필수(없으면 Slack 채널 스팸)
- [ ] 스테이징 배포 → `/api/health` 200 확인 → 폼 제출 E2E(문의 알림 수신) 확인
- [ ] 도메인 매핑 + SSL + apex→www 리다이렉트 검증
- [ ] 레거시 리다이렉트(next.config) 실동작 확인 후 cutover
