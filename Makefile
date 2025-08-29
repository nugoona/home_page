# Cloud Shell 개발용 Makefile

.PHONY: setup dev check build deploy clean help

# 개발 환경 설정
setup:
	@echo "🚀 개발 환경 설정 중..."
	chmod +x setup_cloudshell.sh
	./setup_cloudshell.sh

# 개발 서버 실행
dev:
	@echo "🖥️  Flask 개발 서버 시작..."
	source venv/bin/activate && python app/app.py

# 코드 검증
check:
	@echo "🔍 코드 검증 실행..."
	@echo "📄 HTML 파일 검증..."
	-htmlhint *.html
	@echo "🎨 CSS 파일 검증..."
	-csslint css/*.css
	@echo "🐍 Python 파일 검증..."
	source venv/bin/activate && flake8 app/ --max-line-length=88
	@echo "📋 Pre-commit hooks 실행..."
	source venv/bin/activate && pre-commit run --all-files

# Docker 이미지 빌드
build:
	@echo "🐳 Docker 이미지 빌드..."
	docker build -t gcr.io/$(PROJECT_ID)/home-page .

# Cloud Run 배포
deploy:
	@echo "☁️  Cloud Run에 배포..."
	./deploy.sh

# 정리
clean:
	@echo "🧹 임시 파일 정리..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	docker system prune -f

# 도움말
help:
	@echo "📖 사용 가능한 명령어들:"
	@echo "  make setup  - 개발 환경 설정"
	@echo "  make dev    - 개발 서버 실행"
	@echo "  make check  - 코드 검증"
	@echo "  make build  - Docker 이미지 빌드"
	@echo "  make deploy - Cloud Run 배포"
	@echo "  make clean  - 임시 파일 정리"
