# Google Cloud Shell로 홈페이지 파일 이전 가이드

## 🎯 목표
로컬 개발 환경에서 Google Cloud Shell로 모든 파일을 이전하여 클라우드 기반 개발 환경 구축

## 📋 이전할 파일 목록

### 핵심 HTML 파일들
- `index.html` - 메인 페이지
- `about.html` - 소개 페이지  
- `services.html` - SNS광고 페이지
- `technology.html` - 대시보드 페이지
- `portfolio.html` - 콘텐츠 페이지
- `proposal.html` - 요금 및 서비스 페이지
- `survey.html` - 설문조사 페이지

### CSS 파일들
- `css/index.css`
- `css/about.css`
- `css/services.css`
- `css/technology.css`
- `css/portfolio.css`
- `css/proposal.css`
- `css/survey.css`
- `css/common.css`
- `css/mobile-overrides.css`

### JavaScript 파일들
- `js/main.js`
- `js/survey.js`

### 이미지 파일들
- `images/` 폴더 전체 (52개 PNG, 2개 ICO, 1개 MP4 파일)

### 비디오 파일들
- `videos/` 폴더 전체
- `app/static/video/` 폴더 (누구나타이틀.gif, main._ngn.mp4)

### Flask 애플리케이션
- `app/app.py` - Flask 서버
- `requirements.txt` - Python 의존성

### 배포 설정 파일들 (새로 생성됨)
- `Dockerfile`
- `.dockerignore`
- `.gitignore`
- `deploy.sh`
- `.github/workflows/deploy.yml`
- `README.md`

## 🚀 Cloud Shell에서 작업 시작하기

### 1단계: Cloud Shell 접속
```bash
# Google Cloud Console에서 Cloud Shell 활성화
# 또는 직접 접속: https://shell.cloud.google.com/
```

### 2단계: 프로젝트 디렉토리 생성
```bash
mkdir home_page
cd home_page
```

### 3단계: Git 초기화 (GitHub 사용시)
```bash
git init
git remote add origin <your-github-repo-url>
```

## 📁 파일 업로드 방법들

### 방법 A: Cloud Shell Editor 사용 (추천)
1. Cloud Shell에서 `cloudshell edit .` 실행
2. 좌측 파일 탐색기에서 우클릭
3. "Upload Files" 또는 "Upload Folder" 선택
4. 로컬 파일들을 드래그&드롭 또는 선택

### 방법 B: 압축 파일 업로드
1. 로컬에서 필요한 파일들을 ZIP으로 압축
2. Cloud Shell에서 업로드
3. `unzip filename.zip` 으로 압축 해제

### 방법 C: GitHub를 통한 동기화
1. 로컬에서 GitHub 저장소에 푸시
2. Cloud Shell에서 `git clone` 으로 복사

## 🔧 Cloud Shell에서 개발 환경 설정

### Python 가상환경 설정
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Flask 애플리케이션 실행
```bash
python app/app.py
```

### 웹 미리보기
```bash
# Cloud Shell의 웹 미리보기 기능 사용
# 포트 5000으로 실행 후 "웹 미리보기" 버튼 클릭
```

## 🌐 Cloud Shell 개발의 장점

1. **언제 어디서나 접근**: 브라우저만 있으면 개발 가능
2. **GCP 통합**: Cloud Run, Container Registry 등 직접 연결
3. **무료**: 매주 50시간 무료 사용
4. **강력한 스펙**: 충분한 CPU, 메모리, 디스크
5. **사전 설치**: Docker, Git, gcloud CLI 등 기본 제공

## 📝 다음 단계

파일 업로드 완료 후:

1. **개발 환경 테스트**
   ```bash
   python app/app.py
   ```

2. **Docker 빌드 테스트**
   ```bash
   docker build -t home-page .
   ```

3. **Cloud Run 배포**
   ```bash
   ./deploy.sh
   ```

## 💡 팁

- Cloud Shell은 120분 비활성 후 세션 종료
- `/home/username` 디렉토리는 영구 보존 (5GB)
- `tmux` 사용으로 세션 유지 가능
- VS Code 스타일의 에디터 제공
