# 누구나컴퍼니 홈페이지

AI-Powered Marketing Agency 누구나컴퍼니의 공식 홈페이지입니다.

## 🚀 기술 스택

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Deployment**: Google Cloud Run
- **CI/CD**: GitHub Actions

## 📁 프로젝트 구조

```
home_page/
├── app/
│   ├── app.py              # Flask 애플리케이션
│   └── static/             # 정적 파일들
├── css/                    # CSS 스타일시트
├── images/                 # 이미지 파일들
├── videos/                 # 비디오 파일들
├── js/                     # JavaScript 파일들
├── *.html                  # HTML 페이지들
├── Dockerfile              # Docker 설정
├── requirements.txt        # Python 의존성
├── deploy.sh              # 배포 스크립트
└── .github/workflows/     # GitHub Actions
```

## 🛠️ 로컬 개발 환경 설정

### 1. 저장소 클론
```bash
git clone <repository-url>
cd home_page
```

### 2. 가상환경 생성 및 활성화
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 또는
venv\Scripts\activate     # Windows
```

### 3. 의존성 설치
```bash
pip install -r requirements.txt
```

### 4. 애플리케이션 실행
```bash
python app/app.py
```

애플리케이션이 `http://localhost:5000`에서 실행됩니다.

## 🚀 배포

### 수동 배포 (deploy.sh 사용)

1. `deploy.sh` 파일에서 `PROJECT_ID`를 실제 GCP 프로젝트 ID로 변경
2. 스크립트 실행:
```bash
chmod +x deploy.sh
./deploy.sh
```

### 자동 배포 (GitHub Actions)

1. GitHub 저장소 Secrets 설정:
   - `GCP_PROJECT_ID`: GCP 프로젝트 ID
   - `GCP_SA_KEY`: 서비스 계정 키 (JSON)

2. `main` 브랜치에 푸시하면 자동으로 배포됩니다.

## 📄 페이지 구성

- **홈페이지** (`/`): 메인 랜딩 페이지
- **SNS광고** (`/services`): 서비스 소개
- **대시보드** (`/technology`): 기술 소개
- **콘텐츠** (`/portfolio`): 포트폴리오
- **소개** (`/about`): 회사 소개
- **요금 및 서비스** (`/proposal`): 서비스 요금안내
- **설문조사** (`/survey`): 고객 설문

## 🔧 주요 기능

- 반응형 웹 디자인
- 인터랙티브 FAQ 섹션
- PDF 다운로드 기능
- 설문조사 폼
- 동영상 컨텐츠 지원

## 📱 반응형 지원

모든 페이지는 데스크톱, 태블릿, 모바일 디바이스에서 최적화되어 표시됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is licensed under the MIT License.

## 📞 연락처

- **회사**: 누구나컴퍼니
- **이메일**: oscar@nugoona.co.kr
- **전화**: 010-2781-4543
