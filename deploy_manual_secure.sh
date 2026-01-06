#!/bin/bash

# 보안을 위해 환경 변수로 슬랙 웹훅 URL을 설정하는 버전
# 사용법: SLACK_WEBHOOK_URL="your-webhook-url" ./deploy_manual_secure.sh
# 또는: export SLACK_WEBHOOK_URL="your-webhook-url" && ./deploy_manual_secure.sh

# 슬랙 웹훅 URL 확인
if [ -z "$SLACK_WEBHOOK_URL" ]; then
    echo "❌ 오류: SLACK_WEBHOOK_URL 환경 변수가 설정되지 않았습니다."
    echo "사용법: SLACK_WEBHOOK_URL=\"https://hooks.slack.com/services/...\" ./deploy_manual_secure.sh"
    exit 1
fi

# 홈 디렉토리로 이동 후 최신 코드 가져오기
cd ~/ngn_homepage
git pull origin main

# GCS 버킷에 최신 static 파일 업로드 (캐시 갱신)
gsutil -m cp -r static/* gs://ngn-homepage-static/static/

# Cloud Run 서비스 재배포
gcloud builds submit --tag gcr.io/winged-precept-443218-v8/home-page

gcloud run deploy home-page \
  --image gcr.io/winged-precept-443218-v8/home-page \
  --region=asia-northeast1 \
  --allow-unauthenticated \
  --cpu=1 \
  --memory=512Mi \
  --concurrency=80 \
  --min-instances=0 \
  --max-instances=5 \
  --set-env-vars=STATIC_CDN_URL=https://storage.googleapis.com/ngn-homepage-static/static,SLACK_WEBHOOK_URL="$SLACK_WEBHOOK_URL"

echo "✅ 배포 완료!"
echo "슬랙 설정 확인: https://nugoona.co.kr/api/test-slack"

