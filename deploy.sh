#!/bin/bash

# 설정 변수들
PROJECT_ID="your-gcp-project-id"  # 실제 GCP 프로젝트 ID로 변경
SERVICE_NAME="home-page"
REGION="asia-northeast3"  # 서울 리전

# 색상 출력을 위한 함수
print_status() {
    echo -e "\033[1;32m[INFO]\033[0m $1"
}

print_error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

# GCP 프로젝트 설정
print_status "GCP 프로젝트 설정: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Container Registry API 활성화
print_status "필요한 API 활성화 중..."
gcloud services enable containerregistry.googleapis.com
gcloud services enable run.googleapis.com

# Docker 이미지 빌드
print_status "Docker 이미지 빌드 중..."
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME .

# 이미지 푸시
print_status "이미지를 Container Registry에 푸시 중..."
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME

# Cloud Run에 배포
print_status "Cloud Run에 배포 중..."
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --port 8080

print_status "배포 완료!"
print_warning "배포된 URL을 확인하려면 다음 명령어를 실행하세요:"
echo "gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'"
