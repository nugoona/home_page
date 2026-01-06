#!/bin/bash

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
  --set-env-vars=STATIC_CDN_URL=https://storage.googleapis.com/ngn-homepage-static/static,SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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

echo "✅ 배포 완료!"
echo "슬랙 설정 확인: https://nugoona.co.kr/api/test-slack"

