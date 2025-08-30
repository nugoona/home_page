#!/bin/bash

# Cloud Shell 개발 환경 설정 스크립트

echo "🚀 Cloud Shell 개발 환경 설정 시작..."

# 1. Python 가상환경 생성
echo "📦 Python 가상환경 생성..."
python3 -m venv venv
source venv/bin/activate

# 2. Python 의존성 설치
echo "📋 Python 의존성 설치..."
pip install -r requirements.txt

# 3. 개발 도구 설치
echo "🔧 개발 도구 설치..."
pip install pre-commit black flake8 pylint

# 4. pre-commit hooks 설정
echo "🔗 Pre-commit hooks 설정..."
pre-commit install

# 5. HTML/CSS 검증 도구 설치
echo "🌐 HTML/CSS 검증 도구 설치..."
npm install -g htmlhint csslint

# 6. Docker 설치 확인
echo "🐳 Docker 상태 확인..."
docker --version

# 7. gcloud CLI 확인
echo "☁️ gcloud CLI 확인..."
gcloud --version

# 8. Git 설정 확인
echo "📝 Git 설정 확인..."
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

echo "✅ Cloud Shell 개발 환경 설정 완료!"
echo ""
echo "🔍 코드 검증 명령어들:"
echo "  HTML 검증: htmlhint *.html"
echo "  CSS 검증: csslint css/*.css"
echo "  Python 검증: flake8 app/"
echo "  전체 검증: pre-commit run --all-files"
echo ""
echo "🚀 Flask 앱 실행:"
echo "  python app/app.py"
echo ""
echo "🐳 Docker 빌드 테스트:"
echo "  docker build -t home-page ."
