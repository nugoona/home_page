# nugoona 홈페이지 — Cloud Run 배포용 (DEPLOY.md 경로 A: standalone 멀티스테이지)
# 빌드: gcloud run deploy --source nugoona/ (Dockerfile 감지 시 Docker 빌드 사용, Buildpacks 아님 → 경로 C 함정 무관)
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
# sharp는 next optional dep — 기본 npm ci는 optional 포함(--omit=optional 금지, DEPLOY.md §1)
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# standalone 출력 = server.js + 최소 node_modules. static/public은 별도 복사 필요
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
ENV HOSTNAME="0.0.0.0"
ENV PORT=8080
EXPOSE 8080
# ⚠ standalone은 next start 금지 — node server.js 필수 (DEPLOY.md §1)
CMD ["node", "server.js"]
